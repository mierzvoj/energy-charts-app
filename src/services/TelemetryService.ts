import { TelemetryDataset } from '../interfaces/TelemetryDataset';
import {HttpError} from "../errors/HttpError";

/**
 * Fetch time series data, uses singleton pattern.
 * @throws {Response} HTTP error responses for 4xx/5xx status codes
 * @throws {Error} Network errors, timeouts, or parsing errors
 */
class TelemetryService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = process.env.REACT_APP_API_BASE_URL || '';
    }

    /**
     * API responds with following assertion" 25% proper http 200, 25% http 404, 25% http 400 and 25% 500 to demonstrate
     * error handling within the app
     */
    async getTimeSeries(): Promise<TelemetryDataset[]> {
        const fullUrl = `${this.apiUrl}/api/random`;

        const response = await fetch(fullUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            const httpError = new HttpError(errorText, response);
            httpError.response = response;
            httpError.responseBody = errorText;
            httpError.status = response.status;
            throw httpError;
        }

        return await response.json();
    }
}

export const telemetryService = new TelemetryService();
