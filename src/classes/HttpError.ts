export class HttpError extends Error {
    public response: Response;
    public responseBody: string;
    public status: number;

    constructor(message: string, response: Response, responseBody: string) {
        super(message);
        this.name = 'HttpError';
        this.response = response;
        this.responseBody = responseBody;
        this.status = response.status;
    }
}
