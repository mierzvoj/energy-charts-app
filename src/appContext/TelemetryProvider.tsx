// appContext/TelemetryProvider.tsx
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { TelemetryDataset } from "../interfaces/TelemetryDataset";
import { telemetryService } from "../services/TelemetryService";
import {TelemetryContextType} from "../interfaces/TelemetryContextType";
import {ErrorHandler} from "../hooks/ErrorHandler";


const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export default function TelemetryProvider({ children }: { children: ReactNode }) {
    const [datasets, setDatasets] = useState<TelemetryDataset[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Error handling in presentation layer
    const { error, handleError, clearError } = ErrorHandler();

    const fetchTelemetry = useCallback(async () => {

        setIsLoading(true);
        clearError();

        try {
            const data = await telemetryService.getTimeSeries();
            setDatasets(data);

        } catch (error: unknown) {
            handleError(error); // Transform and handle error in presentation layer

        } finally {
            setIsLoading(false);
        }
    }, [handleError, clearError]);

    // Auto-fetch on mount
    useEffect(() => {
        fetchTelemetry();
    }, [fetchTelemetry]);

    const contextValue: TelemetryContextType = {
        datasets,
        isLoading,
        error,
        clearError
    };

    return (
        <TelemetryContext.Provider value={contextValue}>
            {children}
        </TelemetryContext.Provider>
    );
}

export function useTelemetryData(): TelemetryContextType {
    const context = useContext(TelemetryContext);
    if (!context) {
        throw new Error('useTelemetryData must be used within TelemetryProvider');
    }
    return context;
}

// Simplified hook for telemetry data access
export function useTelemetryErrorHandler() {
    const { error, clearError } = useTelemetryData();

    return {
        error,
        clearError
    };
}
