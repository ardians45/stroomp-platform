// utils/errorHandler.ts

// Define custom error types for the Stroomp platform
export class StroompError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'StroompError';
    this.code = code;
    this.details = details;
  }
}

export class WalletConnectionError extends StroompError {
  constructor(message: string, details?: any) {
    super(message, 'WALLET_CONNECTION_ERROR', details);
    this.name = 'WalletConnectionError';
  }
}

export class TransactionError extends StroompError {
  constructor(message: string, details?: any) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionError';
  }
}

export class StreamNotFoundError extends StroompError {
  constructor(message: string = 'Stream not found', details?: any) {
    super(message, 'STREAM_NOT_FOUND', details);
    this.name = 'StreamNotFoundError';
  }
}

export class DonationError extends StroompError {
  constructor(message: string, details?: any) {
    super(message, 'DONATION_ERROR', details);
    this.name = 'DonationError';
  }
}

export class SubscriptionError extends StroompError {
  constructor(message: string, details?: any) {
    super(message, 'SUBSCRIPTION_ERROR', details);
    this.name = 'SubscriptionError';
  }
}

// Error handler function to process errors consistently
export const handleApiError = (error: any): StroompError => {
  if (error instanceof StroompError) {
    return error;
  }

  // Handle network errors
  if (error.message?.includes('Failed to fetch')) {
    return new StroompError('Network error. Please check your connection.', 'NETWORK_ERROR');
  }

  // Handle Solana-specific errors
  if (error.message?.includes('Transaction')) {
    return new TransactionError(error.message);
  }

  // Handle generic errors
  return new StroompError(
    error.message || 'An unexpected error occurred',
    'GENERIC_ERROR',
    { originalError: error }
  );
};

// Error logging function
export const logError = (error: StroompError, context?: string): void => {
  console.error(`[${error.code}] ${context ? `${context}: ` : ''}${error.message}`, {
    details: error.details,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

// Error boundary component type
export type ErrorBoundaryState = {
  hasError: boolean;
  error: StroompError | null;
};

// Error boundary handler
export const getErrorBoundaryState = (error: any): ErrorBoundaryState => {
  const processedError = handleApiError(error);
  logError(processedError, 'ErrorBoundary');
  
  return {
    hasError: true,
    error: processedError
  };
};