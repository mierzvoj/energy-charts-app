import { TelemetryDataset } from './TelemetryDataset';
import {PresentationError} from "./PresentationError";

export interface TelemetryContextType {
    datasets: TelemetryDataset[];
    isLoading: boolean;
    error: PresentationError | null;
    clearError: () => void;
}
