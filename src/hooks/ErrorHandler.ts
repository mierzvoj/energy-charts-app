// hooks/useErrorHandler.ts
import {useState, useCallback} from 'react';
import {PresentationError} from "../interfaces/PresentationError";

/**
 * Hook for handling errors in the presentation layer
 */
export function ErrorHandler() {
    const [error, setError] = useState<PresentationError | null>(null);

    const handleError = useCallback((error: unknown) => {
        console.error('Error caught by presentation layer:', error);

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

/**
 * Transform service layer errors into presentation-friendly errors
 */
function transformError(error: unknown): PresentationError {
    // Network/Fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
            message: 'Network connection failed',
            userMessage: 'Unable to connect to the service. Please check your internet connection and try again.',
            type: 'network'
        };
    }

    // HTTP errors from service layer
    if (error instanceof Error && (error as any).status) {
        const status = (error as any).status;
        const responseBody = (error as any).responseBody || '';

        return transformHttpError(status, error.message, responseBody);
    }

    // Generic errors
    if (error instanceof Error) {
        return {
            message: error.message,
            userMessage: 'An unexpected error occurred. Please try again.',
            type: 'unknown'
        };
    }

    // Unknown error types
    return {
        message: 'Unknown error occurred',
        userMessage: 'Something went wrong. Please refresh the page and try again.',
        type: 'unknown'
    };
}

/**
 * Transform HTTP errors into user-friendly messages
 */
function transformHttpError(status: number, message: string, responseBody: string): PresentationError {
    const baseError = {
        message,
        status,
        type: getErrorType(status)
    } as const;

    switch (status) {
        case 400:
            return {
                ...baseError,
                userMessage: 'Invalid request. Please check your filters and try again.'
            };

        case 404:
            return {
                ...baseError,
                userMessage: 'Data not found. The requested telemetry data is not available.'
            };

        case 500:
            return {
                ...baseError,
                userMessage: 'Server error. Please try again in a few minutes.'
            };

        default:
            if (status >= 500) {
                return {
                    ...baseError,
                    userMessage: 'Server error occurred. Please try again later.'
                };
            } else if (status >= 400) {
                return {
                    ...baseError,
                    userMessage: 'Request error. Please check your input and try again.'
                };
            } else {
                return {
                    ...baseError,
                    userMessage: 'An unexpected error occurred. Please try again.'
                };
            }
    }
}

function getErrorType(status: number): PresentationError['type'] {
    if (status >= 500) return 'server';
    if (status >= 400) return 'client';
    return 'unknown';
}

