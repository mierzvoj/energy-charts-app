import {PresentationError} from "../../interfaces/PresentationError";
import {HttpError} from "../../classes/HttpError";
import {transformHttpError} from "./errorMessageTransformer";

export function transformError(error: unknown): PresentationError {
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
            message: 'Network connection failed',
            userMessage: 'Unable to connect to the service. Please check your internet connection and try again.',
            type: 'network'
        };
    }

    if (error instanceof HttpError) {
        const status = error.status;
        return transformHttpError(status, error.message);
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            userMessage: 'An unexpected error occurred. Please try again.',
            type: 'unknown'
        };
    }

    return {
        message: 'Unknown error occurred',
        userMessage: 'Something went wrong. Please refresh the page and try again.',
        type: 'unknown'
    };
}
