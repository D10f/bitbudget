export default class APIService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    async get(url: string) {
        const res = await fetch(`${this.baseUrl}/${url.replace(/^\//, '')}`);
        return await this.transformResponse(res, 'a');
    }

    private async transformResponse(res: Response, responseType: string) {
        switch (responseType) {
            case 'text':
                return await res.text();
            case 'raw':
                return await res.arrayBuffer();
            default:
                return await res.json();
        }
    }
}
