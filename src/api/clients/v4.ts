import { BaseApiClient, ApiClientOptions } from './base';
import { ChainType } from '../../types';
import { supportedOn } from '../utils/decorators';
import {
  V4CreateLaunchpadRequest,
  V4UpdateLaunchpadRequest,
  V4PublishLaunchpadRequest,
  V4MintRequest,
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
  async createLaunchpad<T extends V4CreateLaunchpadRequest>(params: T): Promise<any> {
    return this.api.post('/self_serve/nft/create_token', {
      ...params,
    });
  }

  /**
   * Gets instructions to update a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async updateLaunchpad<T extends V4UpdateLaunchpadRequest>(params: T): Promise<any> {
    return this.api.post(`/self_serve/nft/update_token`, {
      ...params,
    });
  }

  @supportedOn([ChainType.SOLANA])
  async publishLaunchpad<T extends V4PublishLaunchpadRequest>(params: T): Promise<any> {
    return this.api.post(`/self_serve/nft/publish`, {
      ...params,
    });
  }

  /**
   * Gets instructions to mint from a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async mint<T extends V4MintRequest>(params: T): Promise<any> {
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
