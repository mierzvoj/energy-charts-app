// services/TelemetryService.ts
import { TelemetryDataset } from '../interfaces/TelemetryDataset';

/**
 * Clean service layer - focuses only on HTTP communication
 * Error handling is delegated to the presentation layer
 */
class TelemetryService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = process.env.REACT_APP_API_BASE_URL || '';
        console.log('TelemetryService initialized with API URL:', this.apiUrl);
    }

    /**
     * Fetch time series data
     * @throws {Response} HTTP error responses for 4xx/5xx status codes
     * @throws {Error} Network errors, timeouts, or parsing errors
     */
    async getTimeSeries(): Promise<TelemetryDataset[]> {
        const fullUrl = `${this.apiUrl}/api/random`;
        console.log('Fetching from URL:', fullUrl);

        const response = await fetch(fullUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status, response.statusText);

        // Let the presentation layer handle HTTP errors
        if (!response.ok) {
            // Attach response body for detailed error handling
            const errorText = await response.text();
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
            (error as any).response = response;
            (error as any).responseBody = errorText;
            (error as any).status = response.status;
            throw error;
        }

        const data = await response.json();
        console.log('Successfully fetched data:', data);

        // Validate and clean the response data
        return data;
    }
}

export const telemetryService = new TelemetryService();
