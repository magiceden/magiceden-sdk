import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { NetworkError, AuthenticationError, RateLimitError, ApiError } from '../../errors';
import { RetryablePromise } from '../../helpers';
import https from 'https';
import { USER_AGENT } from '../../constants/sdk';

/**
 * API configuration options
 */
export interface ApiOptions {
  /**
   * API key
   */
  apiKey: string;

  /**
   * Headers to send with requests
   * 
   * @default {
   *   'Content-Type': 'application/json',
   *   'Authorization': `Bearer ${apiKey}`,
   * }
   */
  headers?: Record<string, string>;

  /**
   * Timeout for requests
   * 
   * @default 30000
   */
  timeout?: number;

  /**
   * Whether the API should reject unauthorized requests
   * 
   * @default true
   */
  rejectUnauthorized?: boolean;
}

/**
 * Error response structure
 */
interface ErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  [key: string]: any;
}

/**
 * Manages API interactions with the Magic Eden API
 */
export class ApiManager {
  private readonly client: AxiosInstance;

  constructor(baseURL: string, options: ApiOptions) {
    // Create custom https agent that can disable certificate validation
    const httpsAgent = new https.Agent({
      rejectUnauthorized: options.rejectUnauthorized ?? true,
    });

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-SDK-Name': USER_AGENT,
        ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
        ...options.headers,
      },
      timeout: options.timeout || 30000,
      httpsAgent,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleRequestError(error),
    );
  }

  /**
   * Makes a GET request
   */
  get<T>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): RetryablePromise<T> {
    return RetryablePromise.from(() =>
      this.client.get<T>(url, { ...config, params }).then((response) => response.data),
    );
  }

  /**
   * Makes a POST request
   */
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): RetryablePromise<T> {
    return RetryablePromise.from(() =>
      this.client.post<T>(url, data, config).then((response) => response.data),
    );
  }

  /**
   * Makes a PUT request
   */
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): RetryablePromise<T> {
    return RetryablePromise.from(() =>
      this.client.put<T>(url, data, config).then((response) => response.data),
    );
  }

  /**
   * Makes a DELETE request
   */
  delete<T>(url: string, config?: AxiosRequestConfig): RetryablePromise<T> {
    return RetryablePromise.from(() =>
      this.client.delete<T>(url, config).then((response) => response.data),
    );
  }

  /**
   * Handles request errors and converts them to appropriate error types
   */
  private handleRequestError(error: AxiosError): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, statusText } = error.response;
      const errorData = error.response.data as ErrorResponse;

      // Extract error message using a safer approach
      const errorMessage = this.getErrorMessage(errorData);

      if (status === 401 || status === 403) {
        throw new AuthenticationError(errorMessage || 'Authentication failed', status);
      }

      if (status === 429) {
        const retryAfter = error.response.headers['retry-after']
          ? parseInt(error.response.headers['retry-after'], 10)
          : undefined;
        throw new RateLimitError(errorMessage || 'Rate limit exceeded', retryAfter);
      }

      // Server errors (5xx) - generally retryable
      if (status >= 500 && status < 600) {
        throw new ApiError(errorMessage || `Server error: ${status} ${statusText}`, status);
      }

      // Client errors (4xx) - generally not retryable (except those handled above)
      if (status >= 400 && status < 500) {
        throw new ApiError(errorMessage || `Client error: ${status} ${statusText}`, status);
      }

      throw new ApiError(errorMessage || `Unexpected status: ${status} ${statusText}`, status);
    } else if (error.request) {
      // The request was made but no response was received
      throw new NetworkError(0, 'No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new ApiError(error.message || 'Request failed', 0);
    }
  }

  /**
   * Safely extracts error message from response data
   */
  private getErrorMessage(data: ErrorResponse): string | undefined {
    // Try different common error message fields
    if (typeof data?.message === 'string') {
      return data.message;
    }

    if (typeof data?.error === 'string') {
      return data.error;
    }

    // For nested error objects
    if (data?.error && typeof data.error === 'object' && data.error !== null) {
      const errorObj = data.error as Record<string, any>;
      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }
    }

    return undefined;
  }
}
