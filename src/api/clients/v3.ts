import { Execute } from '@reservoir0x/reservoir-sdk';
import { ChainType, EvmBlockchain } from '../../types';
import {
  V3BuyRequest,
  V3CancelOrderRequest,
  V3EVMRequest,
  V3ListRequest,
  V3PlaceBidRequest,
  V3SellRequest,
  V3SubmitSignedOrderRequest,
  V3TransferRequest,
} from '../../types/api/v3/request';
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
   * Posts a place bid request to the v3 API.
   *
   * Used to place a bid on an NFT.
   */
  @supportedOn([ChainType.EVM])
  async placeBid(request: V3PlaceBidRequest): Promise<Execute> {
    return this.api.post<Execute>(this.getRequestPath(request.chain, 'bid/v5'), {
      maker: request.maker,
      params: request.params,
      source: 'magiceden.dev',
    });
  }

  /**
   * Posts a list order request to the v3 API.
   *
   * Used to list an NFT for sale.
   */
  @supportedOn([ChainType.EVM])
  async list(request: V3ListRequest): Promise<Execute> {
    return this.api.post<Execute>(this.getRequestPath(request.chain, 'list/v5'), {
      maker: request.maker,
      params: request.params,
      source: 'magiceden.dev',
    });
  }

  /**
   * Posts a buy order to the v3 API.
   *
   * Used to fill listings on an NFT.
   */
  @supportedOn([ChainType.EVM])
  async buy(request: V3BuyRequest): Promise<Execute> {
    return this.api.post<Execute>(this.getRequestPath(request.chain, 'buy/v7'), {
      taker: request.taker,
      items: request.items,
      source: 'magiceden.dev',
      ...request.options,
    });
  }

  /**
   * Posts a sell order to the v3 API.
   *
   * Used to accept bids on an NFT.
   */
  @supportedOn([ChainType.EVM])
  async sell(request: V3SellRequest): Promise<Execute> {
    return this.api.post<Execute>(this.getRequestPath(request.chain, 'sell/v7'), {
      taker: request.taker,
      items: request.items,
      source: 'magiceden.dev',
      ...request.options,
    });
  }

  /**
   * Posts a cancel order request to the v3 API.
   *
   * Used to cancel an order (whether a listing, a bid, etc).
   */
  @supportedOn([ChainType.EVM])
  async cancelOrder(request: V3CancelOrderRequest): Promise<Execute> {
    return this.api.post<Execute>(this.getRequestPath(request.chain, 'cancel/v3'), {
      orderIds: request.orderIds,
      source: 'magiceden.dev',
      ...request.options,
    });
  }

  /**
   * Posts an submit signed order request to the v3 API
   */
  @supportedOn([ChainType.EVM])
  async order(request: V3SubmitSignedOrderRequest): Promise<any> {
    return this.api.post<any>(
      `/rtp/${request.chain}/orders/v4?signature=${request.signature}`,
      {
        ...request.data,
      },
    );
  }

  /**
   * Posts a transfer request to the v3 API.
   *
   * Used to transfer one or more NFTs from one address to another.
   */
  @supportedOn([ChainType.EVM])
  async transfer(request: V3TransferRequest): Promise<Execute> {
    return this.api.post<Execute>(this.getRequestPath(request.chain, 'transfer/v1'), {
      to: request.to,
      from: request.from,
      items: request.items,
      source: 'magiceden.dev',
    });
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
