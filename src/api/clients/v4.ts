import { BaseApiClient, ApiClientOptions } from './base';
import { ChainType } from '../../types';
import { supportedOn } from '../utils/decorators';
import {
  V4CreateLaunchpadRequest,
  V4UpdateLaunchpadRequest,
  V4PublishLaunchpadRequest,
  V4MintRequest,
  V4CreateLaunchpadResponse,
  V4UpdateLaunchpadResponse,
  V4PublishLaunchpadResponse,
  V4MintResponse,
} from '../../types/api';
import { RetryablePromise } from '../../helpers';

/**
 * V4 API client implementation (for launchpad operations)
 */
export class V4ApiClient extends BaseApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  /**
   * Gets instructions to create a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  createLaunchpad(params: V4CreateLaunchpadRequest): RetryablePromise<V4CreateLaunchpadResponse> {
    return this.api.post('/self_serve/nft/create_token', {
      ...params,
    });
  }

  /**
   * Gets instructions to update a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  updateLaunchpad(params: V4UpdateLaunchpadRequest): RetryablePromise<V4UpdateLaunchpadResponse> {
    return this.api.post(`/self_serve/nft/update_token`, {
      ...params,
    });
  }

  @supportedOn([ChainType.SOLANA])
  publishLaunchpad(params: V4PublishLaunchpadRequest): RetryablePromise<V4PublishLaunchpadResponse> {
    return this.api.post(`/self_serve/nft/publish`, {
      ...params,
    });
  }

  /**
   * Gets instructions to mint from a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  mint(params: V4MintRequest): RetryablePromise<V4MintResponse> {
    return this.api.post(`/self_serve/nft/mint_token`, {
      ...params,
    });
  }

  // Helper methods for API URLs
  getBaseUrl(): string {
    // Same url for dev and prod
    return 'https://api-mainnet.magiceden.dev/v4';
  }
}
