import { retry, RetryConfig } from 'ts-retry-promise';
import { ApiError } from '../../errors';
import { RateLimitError } from '../../errors';
import { NetworkError } from '../../errors';

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Partial<RetryConfig> = {
  retries: 3,
  delay: 1000,
  timeout: 60000, // 1 minute total timeout
  maxBackOff: 30000, // 30 seconds max delay between retries
  backoff: (attempt: number, delay: number) => {
    // Exponential backoff with jitter to prevent thundering herd
    const calculatedDelay = delay * Math.pow(2, attempt);
    const jitter = calculatedDelay * 0.2 * Math.random(); // 20% jitter
    return Math.min(calculatedDelay + jitter, 30000); // Cap at 30 seconds
  },
  retryIf: (error: any) => isRetryableError(error),
};

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
        status === 400 || // Bad Request
        status === 408 || // Request Timeout
        status === 429
      ); // Too Many Requests (should be caught by RateLimitError but just in case)
    }

    // Retry 5xx server errors
    if (status >= 500 && status < 600) {
      return true;
    }

    // By default, don't retry unknown errors
    return false;
  }

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

  try {
    return await retry(operation, mergedOptions);
  } catch (error) {
    // Add retry information to the error message
    if (error instanceof Error) {
      const wasRetried = isRetryableError(error);
      const retries = wasRetried ? mergedOptions.retries || DEFAULT_RETRY_CONFIG.retries || 3 : 0;

      if (!error.message.includes('Failed after')) {
        error.message = `Failed after ${retries} ${retries === 1 ? 'retry' : 'retries'}: ${error.message}`;
      }
    }
    throw error;
  }
}
