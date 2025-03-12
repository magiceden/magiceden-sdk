import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { NetworkError, AuthenticationError, RateLimitError, ApiError } from '../../errors';

/**
 * API configuration options
 */
export interface ApiOptions {
  apiKey: string;
  headers?: Record<string, string>;
  timeout?: number;
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
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
        ...options.headers,
      },
      timeout: options.timeout || 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleRequestError(error)
    );
  }

  /**
   * Makes a GET request
   */
  async get<T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, { ...config, params });
    return response.data;
  }

  /**
   * Makes a POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Makes a PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Makes a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Handles request errors
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
        throw new AuthenticationError(errorMessage || 'Authentication failed');
      }

      if (status === 429) {
        const retryAfter = error.response.headers['retry-after'] 
          ? parseInt(error.response.headers['retry-after'], 10) 
          : undefined;
        throw new RateLimitError(errorMessage || 'Rate limit exceeded', retryAfter);
      }

      throw new NetworkError(status, statusText, errorData);
    } else if (error.request) {
      // The request was made but no response was received
      throw new NetworkError(0, 'No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new ApiError(error.message || 'Request failed');
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
