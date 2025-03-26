import { BaseNftService } from './base';
import { ChainMethodParams, SignatureResponse } from '../../types';
import { ClientConfig } from '../../types';
import { SolanaApiMappers } from '../../mappers/nft';
import { SolanaTransactionAdapters } from '../../adapters/transactions';
import { ChainOperation, SignatureOperation } from '../../types/operations';

/**
 * Solana-specific NFT service implementation
 */
export class SolanaNftService extends BaseNftService<'solana'> {
  constructor(config: ClientConfig<'solana'>) {
    super(config);
  }

  /**
   * Get publish launchpad response from API
   * @param params Publish launchpad parameters
   */
  protected async getPublishLaunchpadResponse(
    params: ChainMethodParams<'solana', 'publishLaunchpad'>,
  ): Promise<boolean> {
    const response = await this.v4ApiClient.publishLaunchpad(
      SolanaApiMappers.v4.publishLaunchpadRequest(params),
    );
    return response.success;
  }

  /**
   * Get create launchpad operations from API
   * @param params Launchpad creation parameters
   */
  protected async getCreateLaunchpadOperations(
    params: ChainMethodParams<'solana', 'createLaunchpad'>,
  ): Promise<ChainOperation<'solana'>[]> {
    // TODO: Later on, properly implement extra signers for the launchpad routes
    // Refer to comments in src/adapters/transactions/solana.ts and src/types/services/nft/createLaunchpad.ts for more details
    const response = await this.v4ApiClient.createLaunchpad(
      SolanaApiMappers.v4.createLaunchpadRequest(params),
    );
    return SolanaTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get update launchpad operations from API
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadOperations(
    params: ChainMethodParams<'solana', 'updateLaunchpad'>,
  ): Promise<ChainOperation<'solana'>[]> {
    // TODO: Later on, properly implement extra signers for the launchpad routes
    // Refer to comments in src/adapters/transactions/solana.ts and src/types/services/nft/createLaunchpad.ts for more details
    const response = await this.v4ApiClient.updateLaunchpad(
      SolanaApiMappers.v4.updateLaunchpadRequest(params),
    );
    return SolanaTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get mint operations from API
   * @param params Mint parameters
   */
  protected async getMintOperations(
    params: ChainMethodParams<'solana', 'mint'>,
  ): Promise<ChainOperation<'solana'>[]> {
    // TODO: Later on, properly implement extra signers for the mint routes
    // Refer to comments in src/adapters/transactions/solana.ts and src/types/services/nft/createLaunchpad.ts for more details
    const response = await this.v4ApiClient.mint(SolanaApiMappers.v4.mintRequest(params));
    return SolanaTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get list operations from API
   * @param params Listing parameters
   */
  protected async getListOperations(
    params: ChainMethodParams<'solana', 'list'>,
  ): Promise<ChainOperation<'solana'>[]> {
    const response = await this.v2ApiClient.list(
      await SolanaApiMappers.v2.listRequest(this.config.wallet.getAddress(), params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get cancel listing operations from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingOperations(
    params: ChainMethodParams<'solana', 'cancelListing'>,
  ): Promise<ChainOperation<'solana'>[]> {
    const response = await this.v2ApiClient.cancelListing(
      await SolanaApiMappers.v2.cancelListingRequest(this.config.wallet.getAddress(), params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get make item offer operations from API
   * @param params Make item offer parameters
   */
  protected async getMakeItemOfferOperations(
    params: ChainMethodParams<'solana', 'makeItemOffer'>,
  ): Promise<ChainOperation<'solana'>[]> {
    const response = await this.v2ApiClient.makeItemOffer(
      SolanaApiMappers.v2.makeItemOfferRequest(this.config.wallet.getAddress(), params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get take item offer operations from API
   * @param params Take item offer parameters
   */
  protected async getTakeItemOfferOperations(
    params: ChainMethodParams<'solana', 'takeItemOffer'>,
  ): Promise<ChainOperation<'solana'>[]> {
    const response = await this.v2ApiClient.takeItemOffer(
      SolanaApiMappers.v2.takeItemOfferRequest(this.config.wallet.getAddress(), params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get cancel item offer operations from API
   * @param params Cancel item offer parameters
   */
  protected async getCancelItemOfferOperations(
    params: ChainMethodParams<'solana', 'cancelItemOffer'>,
  ): Promise<ChainOperation<'solana'>[]> {
    const response = await this.v2ApiClient.cancelItemOffer(
      SolanaApiMappers.v2.cancelItemOfferRequest(this.config.wallet.getAddress(), params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get buy operations from API
   * @param params Buy parameters
   */
  protected async getBuyOperations(
    params: ChainMethodParams<'solana', 'buy'>,
  ): Promise<ChainOperation<'solana'>[]> {
    const response = await this.v2ApiClient.buy(
      SolanaApiMappers.v2.buyRequest(this.config.wallet.getAddress(), params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get transfer operations from API
   * @param params Transfer parameters
   */
  protected async getTransferOperations(
    params: ChainMethodParams<'solana', 'transfer'>,
  ): Promise<ChainOperation<'solana'>[]> {
    const response = await this.v2ApiClient.transfer(
      SolanaApiMappers.v2.transferRequest(this.config.wallet.getAddress(), params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Process a signature operation
   * @param operation Signature operation
   */
  protected async processSignatureOperation(
    operation: SignatureOperation<'solana'>,
  ): Promise<SignatureResponse> {
    throw new Error('Signature operations are not supported for Solana');
  }
}
