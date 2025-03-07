import { ChainType } from '../../types';
import { ClientConfig } from '../../types';
import { ApiManager } from '../utils/apimanager';

/**
 * Common interface for all API clients
 */
export interface ApiClient {
  /**
   * Get the API client for the given chain
   */
  getBaseUrl(): string;
}

/**
 * Base class for API clients with common implementation
 * T is the type of operations enum used by the specific API client
 */
export abstract class BaseApiClient implements ApiClient {
  public readonly config: ClientConfig;
  public readonly api: ApiManager;

  constructor(config: ClientConfig) {
    this.config = config;

    // Initialize API manager with appropriate endpoint
    this.api = new ApiManager(this.getBaseUrl(), {
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
        ...config.headers,
      },
      timeout: config.timeout,
    });
  }

  /**
   * Get the base URL for the API client
   */
  abstract getBaseUrl(): string;
}
