import { addAuthToken } from "./interceptors";

class ApiService {
  constructor(
    private readonly baseUrl: string,
    private interceptors: ((req: Request) => Request)[] = []
  ) {}

  async makeFetch(endpoint: string, customConfig: RequestInit) {
    const url = this.baseUrl + endpoint;
    const config = {
      ...customConfig,
      headers: { "Content-Type": "application/json" },
    };
    const request = this.runInterceptors(new Request(url, config));

    try {
      const response = await fetch(request);
      const data = await response.json();

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

  get(endpoint: string, config: RequestInit = {}) {
    return this.makeFetch(endpoint, { ...config, method: "GET" });
  }

  post(endpoint: string, body: Object, config: RequestInit = {}) {
    if (!body) {
      throw new Error("A body was not provided for this request.");
    }

    return this.makeFetch(endpoint, {
      ...config,
      body: JSON.stringify(body),
      method: "POST",
    });
  }

  patch(endpoint: string, body: Object, config: RequestInit = {}) {
    if (!body) {
      throw new Error("A body was not provided for this request.");
    }

    return this.makeFetch(endpoint, {
      ...config,
      body: JSON.stringify(body),
      method: "PATCH",
    });
  }

  delete(endpoint: string, config: RequestInit = {}) {
    return this.makeFetch(endpoint, { ...config, method: "DELETE" });
  }
}

const api = new ApiService('http://localhost:3000');

api.addInterceptor(addAuthToken);

export default api;