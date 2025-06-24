import {useState, useCallback} from 'react';
import {PresentationError} from "../interfaces/PresentationError";
import {transformError} from "./utils/TransformError";

export function ErrorHandler() {
    const [error, setError] = useState<PresentationError | null>(null);

    const handleError = useCallback((error: unknown) => {

        const presentationError = transformError(error);
        setError(presentationError);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        handleError,
        clearError,
        hasError: error !== null
    };
}
