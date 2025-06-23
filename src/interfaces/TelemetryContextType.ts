import { TelemetryDataset } from './TelemetryDataset';

export interface TelemetryContextType {
    datasets: TelemetryDataset[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}
