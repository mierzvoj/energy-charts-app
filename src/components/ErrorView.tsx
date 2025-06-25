import React from 'react';
import {ErrorDisplayProps} from "../interfaces/ErrorDisplayProps";

/**
 * Technical informative error view with details on error origins like http: 404, 500, 400
 * @param error
 * @param onDismiss
 * @param showTechnicalDetails
 * @constructor
 */
export const ErrorView: React.FC<ErrorDisplayProps> = ({
                                                              error,
                                                              onDismiss,
                                                              showTechnicalDetails = false
                                                          }) => {

    return (
        <div style={{
            padding: '20px',
            margin: '20px 0',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            border: '1px solid #f5c6cb',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                <span style={{fontSize: '24px', flexShrink: 0}}>
                    X
                </span>

                <div style={{flex: 1}}>
                    <h4 style={{
                        margin: '0 0 8px 0',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        Error
                    </h4>

                    <p style={{
                        margin: '0 0 12px 0',
                        fontSize: '14px',
                        lineHeight: '1.4'
                    }}>
                        {error.userMessage}
                    </p>

                    {/* Technical details */}
                    {showTechnicalDetails && (
                        <details style={{marginBottom: '12px'}}>
                            <summary style={{
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                marginBottom: '4px'
                            }}>
                                Technical Details
                            </summary>
                            <div style={{
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                padding: '8px',
                                borderRadius: '4px',
                                marginTop: '4px'
                            }}>
                                <div><strong>Type:</strong> {error.type}</div>
                                <div><strong>Message:</strong> {error.message}</div>
                                {error.status && (
                                    <div><strong>Status:</strong> {error.status}</div>
                                )}
                            </div>
                        </details>
                    )}

                    {/* Action buttons */}
                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    color: '#721c24',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #721c24',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ✕ Dismiss
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
