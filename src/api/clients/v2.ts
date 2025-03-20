import { BaseApiClient } from './base';
import { ChainType } from '../../types';
import { supportedOn } from '../utils/decorators';
import {
  SolanaInstructionsResponse,
  V2ListRequest,
  V2CancelListingRequest,
  V2MakeCollectionOfferRequest,
  V2CancelCollectionOfferRequest,
  V2TakeCollectionOfferRequest,
  V2TakeItemOfferRequest,
  V2MakeItemOfferRequest,
  V2CancelItemOfferRequest,
  V2BuyRequest,
  V2TransferRequest,
} from '../../types/api';
import { ApiClientOptions } from './base';
import { RetryablePromise } from '../../helpers';

/**
 * V2 API client implementation (primarily for Solana marketplace operations)
 */
export class V2ApiClient extends BaseApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  /**
   * Gets instructions to list an NFT
   */
  @supportedOn([ChainType.SOLANA])
  list(request: V2ListRequest): RetryablePromise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell', {
      ...request,
    });
  }

  /**
   * Gets instructions to cancel a listing
   */
  @supportedOn([ChainType.SOLANA])
  cancelListing(request: V2CancelListingRequest): RetryablePromise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell_cancel', {
      ...request,
    });
  }

  @supportedOn([ChainType.SOLANA])
  makeCollectionOffer(
    request: V2MakeCollectionOfferRequest,
  ): RetryablePromise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/create-pool', {
    //   ...request,
    // });
  }

  @supportedOn([ChainType.SOLANA])
  cancelCollectionOffer(
    request: V2CancelCollectionOfferRequest,
  ): RetryablePromise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-withdraw-buy', {
    //   ...request,
    // });
  }

  @supportedOn([ChainType.SOLANA])
  takeCollectionOffer(
    request: V2TakeCollectionOfferRequest,
  ): RetryablePromise<SolanaInstructionsResponse> {
    throw new Error('Not implemented');
    // return this.api.get<SolanaInstructionsResponse>('/instructions/mmm/sol-fulfill-buy', {
    //   ...request,
    // });
  }

  /**
   * Gets instructions to accept an offer
   */
  @supportedOn([ChainType.SOLANA])
  takeItemOffer(request: V2TakeItemOfferRequest): RetryablePromise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/sell_now', {
      ...request,
    });
  }

  /**
   * Gets instructions to make an offer on an NFT
   */
  @supportedOn([ChainType.SOLANA])
  makeItemOffer(request: V2MakeItemOfferRequest): RetryablePromise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy', {
      ...request,
    });
  }

  /**
   * Gets instructions to cancel an offer
   */
  @supportedOn([ChainType.SOLANA])
  cancelItemOffer(request: V2CancelItemOfferRequest): RetryablePromise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy_cancel', {
      ...request,
    });
  }

  /**
   * Gets instructions to buy an NFT
   */
  @supportedOn([ChainType.SOLANA])
  buy(request: V2BuyRequest): RetryablePromise<SolanaInstructionsResponse> {
    return this.api.get<SolanaInstructionsResponse>('/instructions/buy_now', {
      ...request,
    });
  }

  /**
   * Gets instructions to transfer an NFT
   */
  @supportedOn([ChainType.SOLANA])
  transfer(request: V2TransferRequest): RetryablePromise<SolanaInstructionsResponse> {
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
