import { BaseNftService } from './base';
import {
  CreateLaunchpadParams,
  UpdateLaunchpadParams,
  MintParams,
  ListParams,
  CancelListingParams,
  MakeItemOfferParams,
  CancelItemOfferParams,
  TakeItemOfferParams,
  TransferParams,
  TransactionResponse,
} from '../../types';
import { ClientConfig } from '../../types';
import { ChainTransactionType } from '../../wallet';

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
  protected async getCreateLaunchpadInstructions<T extends CreateLaunchpadParams>(
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.createLaunchpad(params);
  }

  /**
   * Get update launchpad transaction instructions from API
   * @param launchpadId The launchpad ID
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadInstructions<T extends UpdateLaunchpadParams>(
    launchpadId: string,
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.updateLaunchpad(launchpadId, params);
  }

  /**
   * Get mint transaction instructions from API
   * @param launchpadId The launchpad ID
   * @param params Mint parameters
   */
  protected async getMintInstructions<T extends MintParams>(
    launchpadId: string,
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.mint(launchpadId, params);
  }

  /**
   * Get list transaction instructions from API
   * @param params Listing parameters
   */
  protected async getListInstructions<T extends ListParams>(
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    return this.v2ApiClient.list(params);
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingInstructions<T extends CancelListingParams>(
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    return this.v2ApiClient.cancelListing(params);
  }

  /**
   * Get make item offer transaction instructions from API
   * @param params Make item offer parameters
   */
  protected async getMakeItemOfferInstructions<T extends MakeItemOfferParams>(
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    return this.v2ApiClient.makeItemOffer(params);
  }

  /**
   * Get cancel item offer transaction instructions from API
   * @param params Cancel item offer parameters
   */
  protected async getCancelItemOfferInstructions<T extends CancelItemOfferParams>(
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    return this.v2ApiClient.cancelItemOffer(params);
  }

  /**
   * Get take item offer transaction instructions from API
   * @param params Take item offer parameters
   */
  protected async getTakeItemOfferInstructions<T extends TakeItemOfferParams>(
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    return this.v2ApiClient.takeItemOffer(params);
  }

  /**
   * Get transfer transaction instructions from API
   * @param params Transfer parameters
   */
  protected async getTransferInstructions<T extends TransferParams>(
    params: T,
  ): Promise<ChainTransactionType['solana']> {
    return this.v2ApiClient.transfer(params);
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