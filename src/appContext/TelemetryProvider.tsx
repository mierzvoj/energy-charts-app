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
        console.log('🔥 fetchTelemetry called!'); // Add this debug log
        setIsLoading(true);
        setError(null);

        try {
            console.log('📞 About to call telemetryService.getTimeSeries()'); // Add this
            const data = await telemetryService.getTimeSeries();
            console.log('✅ Got data from service:', data); // Add this
            setDataset(data);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch telemetry data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('🚀 TelemetryProvider mounted, starting fetch...'); // Add this
        fetchTelemetry();
    }, []); //
    return (
        <TelemetryContext.Provider value={{
            datasets,
            isLoading,
            error,
            refetch: fetchTelemetry,
            // refetchWithParams: fetchTelemetryWithParams
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
