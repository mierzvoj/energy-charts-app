// services/TelemetryService.ts
import { TelemetryDataset } from '../interfaces/TelemetryDataset';
import {HttpError} from "../classes/HttpError";

/**
 * Clean service layer - focuses only on HTTP communication
 * Error handling is delegated to the presentation layer
 */
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

        // Let the presentation layer handle HTTP errors
        if (!response.ok) {
            // Attach response body for detailed error handling
            const errorText = await response.text();
            const httpError = new HttpError(errorText, response, errorText);
            httpError.response = response;
            httpError.responseBody = errorText;
            httpError.status = response.status;
            throw httpError;
        }

        const data = await response.json();

        // Validate and clean the response data
        return data;
    }
}

export const telemetryService = new TelemetryService();
