import { BaseApiClient } from './base';
import { ChainType, ClientConfig } from '../../types';
import { supportedOn } from '../utils/decorators';

/**
 * V2 API client implementation (primarily for Solana marketplace operations)
 */
export class V2ApiClient extends BaseApiClient {
  constructor(config: ClientConfig) {
    super(config);
  }

  /**
   * Gets instructions to list an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async list(params: any): Promise<any> {
    return this.api.get('/instructions/sell', {
      ...params,
    });
  }

  /**
   * Gets instructions to cancel a listing
   */
  @supportedOn([ChainType.SOLANA])
  async cancelListing(params: any): Promise<any> {
    return this.api.get('/instructions/sell_cancel', {
      ...params,
    });
  }

  /**
   * Gets instructions to accept an offer
   */
  @supportedOn([ChainType.SOLANA])
  async takeOffer(params: any): Promise<any> {
    return this.api.get('/instructions/sell_now', {
      ...params,
    });
  }

  /**
   * Gets instructions to make an offer on an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async makeOffer(params: any): Promise<any> {
    return this.api.get('/instructions/buy', {
      ...params,
    });
  }

  /**
   * Gets instructions to cancel an offer
   */
  @supportedOn([ChainType.SOLANA])
  async cancelOffer(params: any): Promise<any> {
    return this.api.get('/instructions/buy_cancel', {
      ...params,
    });
  }

  /**
   * Gets instructions to buy an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async buy(params: any): Promise<any> {
    return this.api.get('/instructions/buy_now', {
      ...params,
    });
  }

  /**
   * Gets instructions to transfer an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async transfer(params: any): Promise<any> {
    return this.api.get('/instructions/ocp/transfer', {
      ...params,
    });
  }

  // Helper methods for API URLs
  getBaseUrl(): string {
    const isDev = this.config.environment === 'development';
    // Same url for dev and prod
    return isDev ? 'https://api-mainnet.magiceden.dev/v2' : 'https://api-mainnet.magiceden.dev/v2';
  }
}
