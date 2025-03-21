import { RetryConfig } from 'ts-retry-promise';
import { retryOperation } from './retry';

/**
 * A Promise wrapper that allows for optional retry behavior
 */
export class RetryablePromise<T> implements PromiseLike<T> {
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
  }

  private getPromise(): Promise<T> {
    if (this.retryEnabled) {
      return retryOperation(this.operation, this.retryOptions);
    } else {
      return this.operation();
    }
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
    return this;
  }

  /**
   * Implementation of PromiseLike interface
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.getPromise().then(onfulfilled, onrejected);
  }

  /**
   * Adds a catch handler to the promise
   */
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult> {
    return this.getPromise().catch(onrejected);
  }

  /**
   * Adds a finally handler to the promise
   */
  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.getPromise().finally(onfinally);
  }

  /**
   * Converts to a standard Promise
   */
  toPromise(): Promise<T> {
    return this.getPromise();
  }

  /**
   * Creates a RetryablePromise from an operation
   */
  static from<T>(operation: () => Promise<T>): RetryablePromise<T> {
    return new RetryablePromise<T>(operation);
  }
}
