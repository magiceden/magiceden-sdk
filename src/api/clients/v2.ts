import { BaseApiClient } from './base';
import { ChainType, ClientConfig } from '../../types';
import { supportedOn } from '../utils/decorators';
import {
  SolanaInstructionsResponse,
  V2ListRequest,
  V2CancelListingRequest,
  V2CreateCollectionOfferRequest,
  V2CancelCollectionOfferRequest,
  V2TakeCollectionOfferRequest,
  V2TakeItemOfferRequest,
  V2MakeItemOfferRequest,
  V2CancelItemOfferRequest,
  V2BuyRequest,
  V2TransferRequest,
} from '../../types/api';

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
  async list(request: V2ListRequest): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell', {
      ...request,
    });
  }

  /**
   * Gets instructions to cancel a listing
   */
  @supportedOn([ChainType.SOLANA])
  async cancelListing(request: V2CancelListingRequest): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell_cancel', {
      ...request,
    });
  }

  @supportedOn([ChainType.SOLANA])
  async createCollectionOffer(
    request: V2CreateCollectionOfferRequest,
  ): Promise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/create-pool', {
    //   ...request,
    // });
  }

  @supportedOn([ChainType.SOLANA])
  async cancelCollectionOffer(
    request: V2CancelCollectionOfferRequest,
  ): Promise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-withdraw-buy', {
    //   ...request,
    // });
  }

  @supportedOn([ChainType.SOLANA])
  async takeCollectionOffer(
    request: V2TakeCollectionOfferRequest,
  ): Promise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-fulfill-buy', {
    //   ...request,
    // });
  }

  /**
   * Gets instructions to accept an offer
   */
  @supportedOn([ChainType.SOLANA])
  async takeItemOffer(request: V2TakeItemOfferRequest): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell_now', {
      ...request,
    });
  }

  /**
   * Gets instructions to make an offer on an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async makeItemOffer(request: V2MakeItemOfferRequest): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy', {
      ...request,
    });
  }

  /**
   * Gets instructions to cancel an offer
   */
  @supportedOn([ChainType.SOLANA])
  async cancelItemOffer(request: V2CancelItemOfferRequest): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy_cancel', {
      ...request,
    });
  }

  /**
   * Gets instructions to buy an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async buy(request: V2BuyRequest): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy_now', {
      ...request,
    });
  }

  /**
   * Gets instructions to transfer an NFT
   */
  @supportedOn([ChainType.SOLANA])
  async transfer(request: V2TransferRequest): Promise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/ocp/transfer', {
      ...request,
    });
  }

  // Helper methods for API URLs
  getBaseUrl(): string {
    // Same url for dev and prod
    return 'https://api-mainnet.magiceden.dev/v2';
  }
}
