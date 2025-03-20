import { BaseNftService } from './base';
import { ChainMethodParams, SignatureResponse } from '../../types';
import { ClientConfig } from '../../types';
import { EvmApiMappers } from '../../mappers/nft';
import { EvmTransactionAdapters } from '../../adapters/transactions';
import { ChainOperation, SignatureOperation } from '../../types/operations';

/**
 * EVM-specific NFT service implementation
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
    // TODO: We should move this into the createLaunchpadOperations
    // This way we will do the create + publish in one go, rather than two separate calls
    throw new Error('Not supported on EVM');
  }

  /**
   * Get create launchpad operations from API
   * @param params Launchpad creation parameters
   */
  protected async getCreateLaunchpadOperations(
    params: ChainMethodParams<'evm', 'createLaunchpad'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v4ApiClient.createLaunchpad(
      EvmApiMappers.v4.createLaunchpadRequest(params),
    );
    return EvmTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get update launchpad operations from API
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadOperations(
    params: ChainMethodParams<'evm', 'updateLaunchpad'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v4ApiClient.updateLaunchpad(
      EvmApiMappers.v4.updateLaunchpadRequest(params),
    );
    return EvmTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get mint operations from API
   * @param params Mint parameters
   */
  protected async getMintOperations(
    params: ChainMethodParams<'evm', 'mint'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v4ApiClient.mint(EvmApiMappers.v4.mintRequest(params));
    return EvmTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get list operations from API
   * @param params Listing parameters
   */
  protected async getListOperations(
    params: ChainMethodParams<'evm', 'list'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v3ApiClient.list(EvmApiMappers.v3.listRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get cancel listing operations from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingOperations(
    params: ChainMethodParams<'evm', 'cancelListing'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v3ApiClient.cancelOrder(
      EvmApiMappers.v3.cancelListingRequest(params),
    );
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get make item offer operations from API
   * @param params Make item offer parameters
   */
  protected async getMakeItemOfferOperations(
    params: ChainMethodParams<'evm', 'makeItemOffer'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v3ApiClient.placeBid(EvmApiMappers.v3.makeItemOfferRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get take item offer operations from API
   * @param params Take item offer parameters
   */
  protected async getTakeItemOfferOperations(
    params: ChainMethodParams<'evm', 'takeItemOffer'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v3ApiClient.sell(EvmApiMappers.v3.takeItemOfferRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get cancel item offer operations from API
   * @param params Cancel item offer parameters
   */
  protected async getCancelItemOfferOperations(
    params: ChainMethodParams<'evm', 'cancelItemOffer'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v3ApiClient.cancelOrder(
      EvmApiMappers.v3.cancelItemOfferRequest(params),
    );
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get buy operations from API
   * @param params Buy parameters
   */
  protected async getBuyOperations(
    params: ChainMethodParams<'evm', 'buy'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v3ApiClient.buy(EvmApiMappers.v3.buyRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Get transfer operations from API
   * @param params Transfer parameters
   */
  protected async getTransferOperations(
    params: ChainMethodParams<'evm', 'transfer'>,
  ): Promise<ChainOperation<'evm'>[]> {
    const response = await this.v3ApiClient.transfer(EvmApiMappers.v3.transferRequest(params));
    return EvmTransactionAdapters.fromV3TransactionResponse(response);
  }

  /**
   * Process a signature operation
   * @param operation Signature operation
   */
  protected async processSignatureOperation(
    operation: SignatureOperation<'evm'>,
  ): Promise<SignatureResponse> {
    throw new Error('Not implemented');
  }
}
