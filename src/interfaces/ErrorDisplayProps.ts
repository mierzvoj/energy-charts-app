import {PresentationError} from "./PresentationError";

export interface ErrorDisplayProps {
    error: PresentationError;
    onDismiss?: () => void;
    showTechnicalDetails?: boolean;
}
