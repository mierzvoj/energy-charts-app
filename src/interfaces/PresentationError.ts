export interface PresentationError {
    message: string;
    userMessage: string;
    type: 'network' | 'client' | 'server' | 'validation' | 'unknown';
    status?: number
}
