// contexts/TelemetryContext.tsx
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import { TelemetryDataset } from "../interfaces/TelemetryDataset";
import { TelemetryContextType } from "../interfaces/TelemetryContextType";
import { telemetryService } from "../services/TelemetryService";

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export default function TelemetryProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasets, setDataset] = useState<TelemetryDataset[]>([]);

    const fetchTelemetry = async () => {
        console.log('FetchTelemetry called');
        setIsLoading(true);
        setError(null);

        try {
            console.log('Call telemetryService.getTimeSeries()');
            const data = await telemetryService.getTimeSeries();
            console.log('Got data from service:', data);
            setDataset(data);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch telemetry data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('TelemetryProvider mounted, starting fetch...');
        fetchTelemetry();
    }, []); //
    return (
        <TelemetryContext.Provider value={{
            datasets,
            isLoading,
            error,
            refetch: fetchTelemetry,
        }}>
            {children}
        </TelemetryContext.Provider>
    );
}

export function useTelemetryData() {
    const context = useContext(TelemetryContext);
    if (!context) {
        throw new Error('useTelemetryData must be used within TelemetryProvider');
    }
    return context;
}
