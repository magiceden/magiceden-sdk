import { ChainType, EvmBlockchain } from '../../types';
import {
  V3BuyRequest,
  V3CancelOrderRequest,
  V3ListRequest,
  V3PlaceBidRequest,
  V3SellRequest,
  V3SubmitSignedOrderRequest,
  V3TransferRequest,
} from '../../types/api/v3/request';
import { supportedOn } from '../utils/decorators';
import { BaseApiClient, ApiClientOptions } from './base';
import { RetryablePromise } from '../../helpers';
import { V3ExecuteResponse, V3OrderResponse } from '../../types/api/v3/response';

/**
 * V3 API client implementation (primarily for EVM chains)
 */
export class V3ApiClient extends BaseApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  /**
   * Posts a place bid request to the v3 API.
   *
   * Used to place a bid on an NFT.
   */
  @supportedOn([ChainType.EVM])
  placeBid(request: V3PlaceBidRequest): RetryablePromise<V3ExecuteResponse> {
    return this.api.post<V3ExecuteResponse>(this.getRequestPath(request.chain, 'bid/v5'), {
      maker: request.maker,
      params: request.params,
      source: 'magiceden.io',
    });
  }

  /**
   * Posts a list order request to the v3 API.
   *
   * Used to list an NFT for sale.
   */
  @supportedOn([ChainType.EVM])
  list(request: V3ListRequest): RetryablePromise<V3ExecuteResponse> {
    return this.api.post<V3ExecuteResponse>(this.getRequestPath(request.chain, 'list/v5'), {
      maker: request.maker,
      params: request.params,
      source: 'magiceden.io',
    });
  }

  /**
   * Posts a buy order to the v3 API.
   *
   * Used to fill listings on an NFT.
   */
  @supportedOn([ChainType.EVM])
  buy(request: V3BuyRequest): RetryablePromise<V3ExecuteResponse> {
    return this.api.post<V3ExecuteResponse>(this.getRequestPath(request.chain, 'buy/v7'), {
      taker: request.taker,
      items: request.items,
      source: 'magiceden.io',
      ...request.options,
    });
  }

  /**
   * Posts a sell order to the v3 API.
   *
   * Used to accept bids on an NFT.
   */
  @supportedOn([ChainType.EVM])
  sell(request: V3SellRequest): RetryablePromise<V3ExecuteResponse> {
    return this.api.post<V3ExecuteResponse>(this.getRequestPath(request.chain, 'sell/v7'), {
      taker: request.taker,
      items: request.items,
      source: 'magiceden.io',
      ...request.options,
    });
  }

  /**
   * Posts a cancel order request to the v3 API.
   *
   * Used to cancel an order (whether a listing, a bid, etc).
   */
  @supportedOn([ChainType.EVM])
  cancelOrder(request: V3CancelOrderRequest): RetryablePromise<V3ExecuteResponse> {
    return this.api.post<V3ExecuteResponse>(this.getRequestPath(request.chain, 'cancel/v3'), {
      orderIds: request.orderIds,
      source: 'magiceden.io',
      ...request.options,
    });
  }

  /**
   * Posts a transfer request to the v3 API.
   *
   * Used to transfer one or more NFTs from one address to another.
   */
  @supportedOn([ChainType.EVM])
  transfer(request: V3TransferRequest): RetryablePromise<V3ExecuteResponse> {
    return this.api.post<V3ExecuteResponse>(this.getRequestPath(request.chain, 'transfer/v1'), {
      to: request.to,
      from: request.from,
      items: request.items,
      source: 'magiceden.io',
    });
  }

  /**
   * Posts an submit signed order request to the v3 API
   */
  @supportedOn([ChainType.EVM])
  order(request: V3SubmitSignedOrderRequest): RetryablePromise<V3OrderResponse> {
    return this.api.post<V3OrderResponse>(
      `/rtp/${request.chain}/order/v4?signature=${request.signature}`,
      {
        ...request.data,
      },
    );
  }

  private getRequestPath(chain: EvmBlockchain, path: string): string {
    return `/rtp/${chain}/execute/${path}`;
  }

  /**
   * Gets the base URL for the v3 API
   *
   * @returns Base URL
   */
  getBaseUrl(): string {
    // Same url for dev and prod
    return 'https://api-mainnet.magiceden.dev/v3';
  }
}
