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
  async createLaunchpad(params: V4CreateLaunchpadRequest): Promise<V4CreateLaunchpadResponse> {
    return this.api.post('/self_serve/nft/create_token', {
      ...params,
    });
  }

  /**
   * Gets instructions to update a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async updateLaunchpad(params: V4UpdateLaunchpadRequest): Promise<V4UpdateLaunchpadResponse> {
    return this.api.post(`/self_serve/nft/update_token`, {
      ...params,
    });
  }

  @supportedOn([ChainType.SOLANA])
  async publishLaunchpad(params: V4PublishLaunchpadRequest): Promise<V4PublishLaunchpadResponse> {
    return this.api.post(`/self_serve/nft/publish`, {
      ...params,
    });
  }

  /**
   * Gets instructions to mint from a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async mint(params: V4MintRequest): Promise<V4MintResponse> {
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
