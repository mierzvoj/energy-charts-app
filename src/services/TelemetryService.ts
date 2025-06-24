import { TelemetryDataset } from '../interfaces/TelemetryDataset';

class TelemetryService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = process.env.REACT_APP_API_BASE_URL || '';
        console.log('TelemetryService initialized with API URL:', this.apiUrl);
    }

    async getTimeSeries(): Promise<TelemetryDataset[]> {
        const fullUrl = `${this.apiUrl}/timeSeries`;
        console.log('Fetching from URL:', fullUrl);

        try {
            const response = await fetch(fullUrl);
            console.log('Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Successfully fetched data:', data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}

export const telemetryService = new TelemetryService();
