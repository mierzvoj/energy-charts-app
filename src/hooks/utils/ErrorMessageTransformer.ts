import {PresentationError} from "../../interfaces/PresentationError";

export function transformHttpError(status: number, message: string): PresentationError {
    const baseError = {
        message,
        status,
        type: getErrorType(status)
    } as const;

    switch (status) {
        case 400:
            return {
                ...baseError,
                userMessage: 'Invalid request. Please check your client and try again.'
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
