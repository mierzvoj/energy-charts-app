import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { TelemetryDataset } from "../interfaces/TelemetryDataset";
import { telemetryService } from "../services/TelemetryService";
import {TelemetryContextType} from "../interfaces/TelemetryContextType";
import {ErrorHandler} from "../hooks/ErrorHandler";

/**
 * App context implements the React context pattern for sharing telemetry data across components without prop drilling.
 * Provides context value for child components
 * Each context re-render calls custom hook ErrorHandler to re-render
 */

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export default function TelemetryProvider({ children }: { children: ReactNode }) {
    const [datasets, setDatasets] = useState<TelemetryDataset[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { error, handleError, clearError } = ErrorHandler();

    const fetchTelemetry = useCallback(async () => {

        setIsLoading(true);
        clearError();

        try {
            const data = await telemetryService.getTimeSeries();
            setDatasets(data);

        } catch (error: unknown) {
            handleError(error);

        } finally {
            setIsLoading(false);
        }
    }, [handleError, clearError]);

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

/**
 * Error handler to set and clear error state
 */
export function useTelemetryErrorHandler() {
    const { error, clearError } = useTelemetryData();

    return {
        error,
        clearError
    };
}
