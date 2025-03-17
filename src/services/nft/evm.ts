import { BaseNftService } from './base';
import { ChainMethodParams } from '../../types';
import { ClientConfig } from '../../types';
import { ChainTransaction } from '../../wallet';
import { EvmApiMappers } from '../../mappers/nft';
import { EvmTransactionAdapters } from '../../adapters/transactions';

/**
 * Solana-specific NFT service implementation
 */
export class EvmNftService extends BaseNftService<'evm'> {
  constructor(config: ClientConfig<'evm'>) {
    super(config);
  }

  /**
   * Get publish launchpad response from API
   *
   * Not supported on EVM
   * @param params Publish launchpad parameters
   */
  protected async getPublishLaunchpadResponse(
    params: ChainMethodParams<'evm', 'publishLaunchpad'>,
  ): Promise<boolean> {
    throw new Error('Not supported on EVM');
  }

  /**
   * Get create launchpad transaction instructions from API
   * @param params Launchpad creation parameters
   */
  protected async getCreateLaunchpadTransactions(
    params: ChainMethodParams<'evm', 'createLaunchpad'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v4ApiClient.createLaunchpad(EvmApiMappers.v4.createLaunchpadRequest(params));
    return EvmTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get update launchpad transaction instructions from API
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadTransactions(
    params: ChainMethodParams<'evm', 'updateLaunchpad'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v4ApiClient.updateLaunchpad(EvmApiMappers.v4.updateLaunchpadRequest(params));
    return EvmTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get mint transaction instructions from API
   * @param params Mint parameters
   */
  protected async getMintTransactions(
    params: ChainMethodParams<'evm', 'mint'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v4ApiClient.mint(EvmApiMappers.v4.mintRequest(params));
    return EvmTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get list transaction instructions from API
   * @param params Listing parameters
   */
  protected async getListTransactions(
    params: ChainMethodParams<'evm', 'list'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v3ApiClient.list(EvmApiMappers.v3.listRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingTransactions(
    params: ChainMethodParams<'evm', 'cancelListing'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v3ApiClient.cancelListing(
      EvmApiMappers.v3.cancelListingRequest(params),
    );
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get make item offer transaction instructions from API
   * @param params Make item offer parameters
   */
  protected async getMakeItemOfferTransactions(
    params: ChainMethodParams<'evm', 'makeItemOffer'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v3ApiClient.makeItemOffer(
      EvmApiMappers.v3.makeItemOfferRequest(params),
    );
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get take item offer transaction instructions from API
   * @param params Take item offer parameters
   */
  protected async getTakeItemOfferTransactions(
    params: ChainMethodParams<'evm', 'takeItemOffer'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v3ApiClient.takeItemOffer(
      EvmApiMappers.v3.takeItemOfferRequest(params),
    );
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get cancel item offer transaction instructions from API
   * @param params Cancel item offer parameters
   */
  protected async getCancelItemOfferTransactions(
    params: ChainMethodParams<'evm', 'cancelItemOffer'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v3ApiClient.cancelItemOffer(
      EvmApiMappers.v3.cancelItemOfferRequest(params),
    );
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get buy transaction instructions from API
   * @param params Buy parameters
   */
  protected async getBuyTransactions(
    params: ChainMethodParams<'evm', 'buy'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v3ApiClient.buy(EvmApiMappers.v3.buyRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get transfer transaction instructions from API
   * @param params Transfer parameters
   */
  protected async getTransferTransactions(
    params: ChainMethodParams<'evm', 'transfer'>,
  ): Promise<ChainTransaction<'evm'>[]> {
    const response = await this.v3ApiClient.transfer(EvmApiMappers.v3.transferRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }
}
