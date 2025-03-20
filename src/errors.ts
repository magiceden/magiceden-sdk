/**
 * Base API error class
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Network error class
 */
export class NetworkError extends ApiError {
  readonly statusText: string;
  readonly data: any;

  constructor(status: number, statusText: string, data?: any) {
    super(`Network error: ${status} ${statusText}`, status);

    this.name = 'NetworkError';
    this.statusText = statusText;
    this.data = data;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed', status: number = 401) {
    super(message, status);

    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Rate limit error class
 */
export class RateLimitError extends ApiError {
  readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429);

    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Wallet error class
 */
export class WalletError extends ApiError {
  constructor(message: string, status: number = 400) {
    super(message, status);

    this.name = 'WalletError';
    Object.setPrototypeOf(this, WalletError.prototype);
  }
}

/**
 * Transaction error class
 */
export class TransactionError extends ApiError {
  readonly txId?: string;
  readonly logs?: string[];

  constructor(message: string, txId?: string, logs?: string[], status: number = 400) {
    super(message, status);
    
    this.name = 'TransactionError';
    this.txId = txId;
    this.logs = logs;
    Object.setPrototypeOf(this, TransactionError.prototype);
  }
}