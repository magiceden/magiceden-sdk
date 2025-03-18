import { ChainType } from '../../types';
import { supportedOn } from '../utils/decorators';
import { BaseApiClient, ApiClientOptions } from './base';

/**
 * V3 API client implementation (primarily for EVM chains)
 */
export class V3ApiClient extends BaseApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  /**
   * Gets instructions to list an NFT
   */
  @supportedOn([ChainType.EVM])
  async list(request: any): Promise<any> {
    return this.api.get<any>('/instructions/sell', {
      ...request,
    });
  }

  /**
   * Gets instructions to cancel a listing
   */
  @supportedOn([ChainType.EVM])
  async cancelListing(request: any): Promise<any> {
    return this.api.get<any>('/instructions/sell_cancel', {
      ...request,
    });
  }

  @supportedOn([ChainType.EVM])
  async makeCollectionOffer(request: any): Promise<any> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/create-pool', {
    //   ...request,
    // });
  }

  @supportedOn([ChainType.EVM])
  async cancelCollectionOffer(request: any): Promise<any> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-withdraw-buy', {
    //   ...request,
    // });
  }

  @supportedOn([ChainType.EVM])
  async takeCollectionOffer(request: any): Promise<any> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-fulfill-buy', {
    //   ...request,
    // });
  }

  /**
   * Gets instructions to accept an offer
   */
  @supportedOn([ChainType.EVM])
  async takeItemOffer(request: any): Promise<any> {
    return this.api.get<any>('/instructions/sell_now', {
      ...request,
    });
  }

  /**
   * Gets instructions to make an offer on an NFT
   */
  @supportedOn([ChainType.EVM])
  async makeItemOffer(request: any): Promise<any> {
    return this.api.get<any>('/instructions/buy', {
      ...request,
    });
  }

  /**
   * Gets instructions to cancel an offer
   */
  @supportedOn([ChainType.EVM])
  async cancelItemOffer(request: any): Promise<any> {
    return this.api.get<any>('/instructions/buy_cancel', {
      ...request,
    });
  }

  /**
   * Gets instructions to buy an NFT
   */
  @supportedOn([ChainType.EVM])
  async buy(request: any): Promise<any> {
    return this.api.get<any>('/instructions/buy_now', {
      ...request,
    });
  }

  /**
   * Gets instructions to transfer an NFT
   */
  @supportedOn([ChainType.EVM])
  async transfer(request: any): Promise<any> {
    return this.api.get<any>('/instructions/ocp/transfer', {
      ...request,
    });
  }

  // Helper method for API URL
  getBaseUrl(): string {
    // Same url for dev and prod
    return 'https://api-mainnet.magiceden.dev/v3';
  }
}
