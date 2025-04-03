import { ChainType } from '../../types';
import { ApiManager, ApiOptions } from '../utils/apiManager';

/**
 * Common interface for all API clients
 */
export interface ApiClient {
  /**
   * Get the API client for the given chain
   */
  getBaseUrl(): string;
}

export interface ApiClientOptions extends ApiOptions {
  chain: ChainType;
}

/**
 * Base class for API clients with common implementation
 * T is the type of operations enum used by the specific API client
 */
export abstract class BaseApiClient implements ApiClient {
  public readonly api: ApiManager;
  public readonly chain: ChainType;

  constructor(options: ApiClientOptions) {
    this.chain = options.chain;
    // Initialize API manager with appropriate endpoint
    this.api = new ApiManager(this.getBaseUrl(), options);
  }

  /**
   * Get the base URL for the API client
   */
  abstract getBaseUrl(): string;
}
