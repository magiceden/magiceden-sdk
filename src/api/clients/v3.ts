import { createClient, ReservoirChain, ReservoirClient } from '@reservoir0x/reservoir-sdk';
import { ChainType, EvmChainId } from '../../types';
import { supportedOn } from '../utils/decorators';
import { BaseApiClient, ApiClientOptions } from './base';
import { getEvmChainFromId } from '../../helpers/evm/chain';
import { getReservoirConfigForChain } from '../../helpers/evm/reservoir';
import { getPaymentTokensForEvmChain } from '../../helpers/evm/payment';

/**
 * V3 API client implementation (primarily for EVM chains)
 */
export class V3ApiClient extends BaseApiClient {
  private readonly reservoirClient: ReservoirClient;

  constructor(options: ApiClientOptions) {
    super(options);

    this.reservoirClient = this.createReservoirClient(options);
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

  private createReservoirClient(options: ApiClientOptions): ReservoirClient {
    const baseUrl = this.getBaseUrl();

    // Get all EVM chain IDs
    const evmChainIds = Object.values(EvmChainId).filter(
      (value) => typeof value === 'number',
    ) as EvmChainId[];

    // Create chain configurations for Reservoir
    const chains = evmChainIds.map((chainId) => {
      const chain = getEvmChainFromId(chainId);

      const reservoirConfig = getReservoirConfigForChain(chain);
      const paymentTokens = getPaymentTokensForEvmChain(chain);

      return {
        id: chainId,
        name: chain,
        baseApiUrl: `${baseUrl}/v3/rtp/${reservoirConfig.routePrefix}`,
        active: true,
        paymentTokens: paymentTokens,
      };
    });

    return createClient({
      apiKey: options.apiKey,
      chains: chains,
    });
  }
}
