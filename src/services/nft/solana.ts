import { BaseNftService } from './base';
import { TransactionResponse, ChainMethodParams } from '../../types';
import { ClientConfig } from '../../types';
import { ChainTransaction } from '../../wallet';
import { SolanaNftApiMappers } from '../../mappers/nft';

/**
 * Solana-specific NFT service implementation
 */
export class SolanaNftService extends BaseNftService<'solana'> {
  constructor(config: ClientConfig<'solana'>) {
    super(config);
  }

  /**
   * Get create launchpad transaction instructions from API
   * @param params Launchpad creation parameters
   */
  protected async getCreateLaunchpadInstructions(
    params: ChainMethodParams<'solana', 'createLaunchpad'>,
  ): Promise<ChainTransaction<'solana'>> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.createLaunchpad(params);
  }

  /**
   * Get update launchpad transaction instructions from API
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadInstructions(
    params: ChainMethodParams<'solana', 'updateLaunchpad'>,
  ): Promise<ChainTransaction<'solana'>> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.updateLaunchpad(launchpadId, params);
  }

  /**
   * Get mint transaction instructions from API
   * @param params Mint parameters
   */
  protected async getMintInstructions(
    params: ChainMethodParams<'solana', 'mint'>,
  ): Promise<ChainTransaction<'solana'>> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.mint(launchpadId, params);
  }

  /**
   * Get list transaction instructions from API
   * @param params Listing parameters
   */
  protected async getListInstructions(
    params: ChainMethodParams<'solana', 'list'>,
  ): Promise<ChainTransaction<'solana'>> {
    return this.v2ApiClient.list(SolanaNftApiMappers.listRequest(params));
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingInstructions(
    params: ChainMethodParams<'solana', 'cancelListing'>,
  ): Promise<ChainTransaction<'solana'>> {
    return this.v2ApiClient.cancelListing(SolanaNftApiMappers.cancelListingRequest(params));
  }

  /**
   * Get make item offer transaction instructions from API
   * @param params Make item offer parameters
   */
  protected async getMakeItemOfferInstructions(
    params: ChainMethodParams<'solana', 'makeItemOffer'>,
  ): Promise<ChainTransaction<'solana'>> {
    return this.v2ApiClient.makeItemOffer(SolanaNftApiMappers.makeItemOfferRequest(params));
  }

  /**
   * Get take item offer transaction instructions from API
   * @param params Take item offer parameters
   */
  protected async getTakeItemOfferInstructions(
    params: ChainMethodParams<'solana', 'takeItemOffer'>,
  ): Promise<ChainTransaction<'solana'>> {
    return this.v2ApiClient.takeItemOffer(SolanaNftApiMappers.takeItemOfferRequest(params));
  }

  /**
   * Get cancel item offer transaction instructions from API
   * @param params Cancel item offer parameters
   */
  protected async getCancelItemOfferInstructions(
    params: ChainMethodParams<'solana', 'cancelItemOffer'>,
  ): Promise<ChainTransaction<'solana'>> {
    return this.v2ApiClient.cancelItemOffer(SolanaNftApiMappers.cancelItemOfferRequest(params));
  }

  /**
   * Get buy transaction instructions from API
   * @param params Buy parameters
   */
  protected async getBuyInstructions(
    params: ChainMethodParams<'solana', 'buy'>,
  ): Promise<ChainTransaction<'solana'>> {
    return this.v2ApiClient.buy(SolanaNftApiMappers.buyRequest(params));
  }

  /**
   * Get transfer transaction instructions from API
   * @param params Transfer parameters
   */
  protected async getTransferInstructions(
    params: ChainMethodParams<'solana', 'transfer'>,
  ): Promise<ChainTransaction<'solana'>> {
    return this.v2ApiClient.transfer(SolanaNftApiMappers.transferRequest(params));
  }

  /**
   * Convert a transaction hash to a transaction response
   */
  protected async txHashToTransactionResponse(txHash: string): Promise<TransactionResponse> {
    return {
      txId: txHash,
      status: 'pending',
    };
  }
}
