class ApiWrapper {
    private baseUrl: string;

    private constructor() {
        this.baseUrl = 'api';
    }

    public static create(): ApiWrapper {
        return new ApiWrapper();
    }

    private async fetchWrapper(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        body?: Record<string, unknown>,
        signal?: AbortSignal // Optional AbortSignal parameter
    ): Promise<Record<string, unknown>> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        const requestOptions: RequestInit = {
            method,
            headers,
            signal, // Include the signal in the requestOptions
        };

        if (body) {
            requestOptions.body = JSON.stringify(body);
        }
        try {
            const newBase = this.baseUrl.replace(/\/$/, ''); // remove trailing slash from baseUrl
            const newEnd = endpoint.replace(/^\//, ''); // remove leading slash from endpoint
            const url = `/${newBase}/${newEnd}`; // concatenate baseUrl and endpoint with a slash in between

            const response = await fetch(url, requestOptions);


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                return {};
            }

            return response.json();
        } catch (error: any) {
            throw new Error(error.message);
        }

    }

    public async get(
        endpoint: string,
        signal?: AbortSignal
    ): Promise<Record<string, unknown>> {
        return await this.fetchWrapper('GET', endpoint, undefined, signal);
    }

    public async post(
        endpoint: string,
        body: Record<string, unknown>,
        signal?: AbortSignal
    ): Promise<Record<string, unknown>> {
        return await this.fetchWrapper('POST', endpoint, body, signal);
    }

    public async put(
        endpoint: string,
        body: Record<string, unknown>,
        signal?: AbortSignal
    ): Promise<Record<string, unknown>> {
        return await this.fetchWrapper('PUT', endpoint, body, signal);
    }

    public async delete(
        endpoint: string,
        signal?: AbortSignal
    ): Promise<Record<string, unknown>> {
        return await this.fetchWrapper('DELETE', endpoint, undefined, signal);
    }
}

export default ApiWrapper;
