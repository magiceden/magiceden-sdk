import { BaseApiClient } from './base';
import { ChainType, ClientConfig } from '../../types';
import { supportedOn } from '../utils/decorators';
import { SolanaInstructionsResponse } from '../../types/api';

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
  async list(params: any): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell', {
      ...params,
    });
  }

  /**
   * Gets instructions to cancel a listing
   */
  @supportedOn([ChainType.SOLANA])
  async cancelListing(params: any): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell_cancel', {
      ...params,
    });
  }

  @supportedOn([ChainType.SOLANA])
  async createCollectionOffer(params: any): Promise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/create-pool', {
    //   ...params,
    // });
  }
  
  @supportedOn([ChainType.SOLANA])
  async cancelCollectionOffer(params: any): Promise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-withdraw-buy', {
    //   ...params,
    // });
  }
  
  @supportedOn([ChainType.SOLANA])
  async takeCollectionOffer(params: any): Promise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-fulfill-buy', {
    //   ...params,
    // });
  }

  /**
   * Gets instructions to accept an offer
   */
  @supportedOn([ChainType.SOLANA])
  async takeItemOffer(params: any): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell_now', {
      ...params,
    });
  }

  /**
   * Gets instructions to make an offer on an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async makeItemOffer(params: any): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy', {
      ...params,
    });
  }
  
  /**
   * Gets instructions to cancel an offer
   */
  @supportedOn([ChainType.SOLANA])
  async cancelItemOffer(params: any): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy_cancel', {
      ...params,
    });
  }

  /**
   * Gets instructions to buy an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async buy(params: any): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy_now', {
      ...params,
    });
  }

  /**
   * Gets instructions to transfer an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async transfer(params: any): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/ocp/transfer', {
      ...params,
    });
  }

  // Helper methods for API URLs
  getBaseUrl(): string {
    // Same url for dev and prod
    return 'https://api-mainnet.magiceden.dev/v2';
  }
}
