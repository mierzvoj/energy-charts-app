import { TelemetryDataset } from '../interfaces/TelemetryDataset';
import {HttpError} from "../classes/HttpError";

class TelemetryService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = process.env.REACT_APP_API_BASE_URL || '';
    }

    /**
     * Fetch time series data
     * @throws {Response} HTTP error responses for 4xx/5xx status codes
     * @throws {Error} Network errors, timeouts, or parsing errors
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
            const httpError = new HttpError(errorText, response, errorText);
            httpError.response = response;
            httpError.responseBody = errorText;
            httpError.status = response.status;
            throw httpError;
        }

        return await response.json();
    }
}

export const telemetryService = new TelemetryService();
