import { addAuthToken } from "./interceptors";

type requestDataType = 'json' | 'text' | 'raw' | undefined;

interface IConfig extends RequestInit {
  requestType?: requestDataType,
  responseType?: requestDataType,
}

class ApiService {
  constructor(
    private readonly baseUrl: string,
    private interceptors: ((req: Request) => Request)[] = [],
  ) {}

  async makeFetch(endpoint: string, customConfig: IConfig) {
    const url = this.baseUrl + endpoint;
    const type = customConfig.requestType || 'json';
    const config = {
      ...customConfig,
      headers: {
        "Content-Type": this.setRequestType(type),
        ...customConfig.headers,
      },
      body: this.setRequestContent(customConfig.body, type)
    };

    const request = this.runInterceptors(new Request(url, config));

    try {
      const response = await fetch(request);
      const data = await this.transformResponse(response, customConfig.responseType);

      // return axios-like response
      if (response.ok) {
        return {
          status: response.status,
          data,
          statusText: response.statusText,
          url: response.url,
        };
      }

      throw new Error(data.message);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  addInterceptor(fn: (req: Request) => Request) {
    this.interceptors = [...this.interceptors, fn];
  }

  runInterceptors(originalRequest: Request) {
    return this.interceptors.reduce(
      (req, interceptor) => interceptor(req),
      originalRequest
    );
  }
  
  async transformResponse(res: Response, responseType: requestDataType) {
    switch (responseType) {
      case 'text':
        return await res.text();
      case 'raw':
        return await res.arrayBuffer();
      default:
        return await res.json();
    }
  }

  setRequestType(type: requestDataType) {
    switch (type) {
      case 'text':
        return 'application/text';
      case 'raw':
        return 'application/octet-stream';
      default:
        return 'application/json';
    }
  }

  setRequestContent(body: any, type: requestDataType) {
    
    if (!Boolean(body)) {
      return null;
    }

    return type === 'json'
      ? JSON.stringify(body)
      : body;
  }

  get(endpoint: string, config: IConfig = {}) {
    return this.makeFetch(endpoint, { ...config, method: "GET" });
  }

  post(endpoint: string, body: any, config: IConfig = {}) {
    if (!body) {
      throw new Error("A body was not provided for this request.");
    }

    return this.makeFetch(endpoint, {
      ...config,
      body,
      method: "POST",
    });
  }

  patch(endpoint: string, body: any, config: IConfig = {}) {
    if (!body) {
      throw new Error("A body was not provided for this request.");
    }

    return this.makeFetch(endpoint, {
      ...config,
      body,
      method: "PATCH",
    });
  }

  delete(endpoint: string, config: IConfig = {}) {
    return this.makeFetch(endpoint, { ...config, method: "DELETE" });
  }
}

// TODO: accept environment variables
const api = new ApiService("http://localhost:3000");

api.addInterceptor(addAuthToken);

export default api;
