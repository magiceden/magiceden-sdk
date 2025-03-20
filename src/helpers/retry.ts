import { retry, RetryConfig } from 'ts-retry-promise';
import { NetworkError, RateLimitError, ApiError } from '../errors';

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Partial<RetryConfig> = {
  retries: 3,
  delay: 1000,
  backoff: (attempt: number, delay: number, error?: any) => {
    // Exponential backoff with jitter to prevent thundering herd
    const calculatedDelay = delay * Math.pow(2, attempt);
    const jitter = calculatedDelay * 0.2 * Math.random(); // 20% jitter
    return Math.min(calculatedDelay + jitter, 30000); // Cap at 30 seconds
  },
  timeout: 60000, // 1 minute total timeout
  maxBackOff: 30000, // 30 seconds max delay between retries
  retryIf: isRetryableError, // Add the retryIf property to the default config
};

/**
 * A Promise wrapper that allows for optional retry behavior
 */
export class RetryablePromise<T> implements PromiseLike<T> {
  private promise: Promise<T>;
  private operation: () => Promise<T>;
  private retryEnabled = false;
  private retryOptions?: Partial<RetryConfig>;

  /**
   * Creates a new RetryablePromise
   *
   * @param operation The async operation to potentially retry
   */
  constructor(operation: () => Promise<T>) {
    this.operation = operation;
    this.promise = operation();
  }

  /**
   * Enables retry behavior with optional configuration
   *
   * @param options Optional retry configuration
   * @returns This RetryablePromise instance for chaining
   */
  withRetries(options?: Partial<RetryConfig>): RetryablePromise<T> {
    this.retryEnabled = true;
    this.retryOptions = options;

    // Replace the promise with a retryable version
    this.promise = retryOperation(this.operation, this.retryOptions);

    return this;
  }

  /**
   * Implementation of PromiseLike interface
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  /**
   * Adds a catch handler to the promise
   */
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }

  /**
   * Adds a finally handler to the promise
   */
  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.promise.finally(onfinally);
  }

  /**
   * Converts to a standard Promise
   */
  toPromise(): Promise<T> {
    return this.promise;
  }

  /**
   * Creates a RetryablePromise from an operation
   */
  static from<T>(operation: () => Promise<T>): RetryablePromise<T> {
    return new RetryablePromise<T>(operation);
  }
}

/**
 * Determines if an error is retryable based on its type and properties
 */
export function isRetryableError(error: any): boolean {
  // Handle null/undefined errors
  if (!error) {
    return false;
  }

  // Always retry network errors (connection issues, timeouts)
  if (error instanceof NetworkError) {
    return true;
  }

  // Always retry rate limit errors (with backoff)
  if (error instanceof RateLimitError) {
    return true;
  }

  // Handle API errors based on status code
  if (error instanceof ApiError) {
    const status = error.status;

    // Don't retry 4xx client errors (except those handled above like rate limits)
    if (status >= 400 && status < 500) {
      // Some 4xx errors might be worth retrying
      return (
        status === 408 || // Request Timeout
        status === 429
      ); // Too Many Requests (should be caught by RateLimitError but just in case)
    }

    // Retry 5xx server errors
    if (status >= 500 && status < 600) {
      return true;
    }

    // For API errors without a status code, use message as fallback
    const message = error.message.toLowerCase();
    if (
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('econnrefused')
    ) {
      return true;
    }
  }

  // For non-API errors, check common error patterns
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network-related errors
    if (
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('econnrefused')
    ) {
      return true;
    }

    // Temporary failure errors
    if (
      message.includes('temporary') ||
      message.includes('timeout') ||
      message.includes('overloaded')
    ) {
      return true;
    }
  }

  // For axios errors or other library-specific errors
  if (typeof error === 'object') {
    // Check for axios error structure
    if (error.isAxiosError && error.code) {
      const code = error.code;
      return code === 'ECONNRESET' || code === 'ECONNABORTED' || code === 'ETIMEDOUT';
    }
  }

  // By default, don't retry unknown errors
  return false;
}

/**
 * Retries an operation with exponential backoff
 *
 * @param operation The async function to retry
 * @param options Optional configuration to override defaults
 * @returns The result of the operation
 * @throws The last error encountered if all retries fail
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options?: Partial<RetryConfig>,
): Promise<T> {
  const mergedOptions = {
    ...DEFAULT_RETRY_CONFIG,
    ...options,
  };

  // Allow custom retry logic to be provided, but fall back to our implementation
  if (!options?.retryIf) {
    mergedOptions.retryIf = isRetryableError;
  }

  try {
    return await retry(operation, mergedOptions);
  } catch (error) {
    // Enhance error with retry information
    if (error instanceof Error) {
      error.message = `Failed after ${mergedOptions.retries} retries: ${error.message}`;
    }
    throw error;
  }
}
