import {PresentationError} from "../../interfaces/PresentationError";
import {HttpError} from "../../errors/HttpError";
import {TransformHttpError} from "./ErrorMessageTransformer";

/**
 * TransformError takes care of introducing human-readable error messages to end user.
 * which includes network connection errors, typical set of http errors and generic errors
 * @param error
 * @constructor
 */
export function TransformError(error: unknown): PresentationError {
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
            message: 'Network connection failed',
            userMessage: 'Unable to connect to the service. Please check your internet connection and try again.',
            type: 'network'
        };
    }

    if (error instanceof HttpError) {
        const status = error.status;
        return TransformHttpError(status, error.message);
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
