import { BaseNftService } from './base';
import { ChainMethodParams } from '../../types';
import { ClientConfig } from '../../types';
import { ChainTransaction } from '../../wallet';
import { SolanaApiMappers } from '../../mappers/nft';
import { SolanaTransactionAdapters } from '../../adapters/transactions';

/**
 * Solana-specific NFT service implementation
 */
export class SolanaNftService extends BaseNftService<'solana'> {
  constructor(config: ClientConfig<'solana'>) {
    super(config);
  }

  protected async getPublishLaunchpadResponse(
    params: ChainMethodParams<'solana', 'publishLaunchpad'>,
  ): Promise<boolean> {
    const response = await this.v4ApiClient.publishLaunchpad(SolanaApiMappers.v4.publishLaunchpadRequest(params));
    return response.success;
  }

  /**
   * Get create launchpad transaction instructions from API
   * @param params Launchpad creation parameters
   */
  protected async getCreateLaunchpadTransactions(
    params: ChainMethodParams<'solana', 'createLaunchpad'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    // TODO: Later on, properly implement extra signers for the launchpad routes
    // This needs to be done in both the schema (keypair) as well as here
    const response = await this.v4ApiClient.createLaunchpad(SolanaApiMappers.v4.createLaunchpadRequest(params));
    return SolanaTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get update launchpad transaction instructions from API
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadTransactions(
    params: ChainMethodParams<'solana', 'updateLaunchpad'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    // TODO: Later on, properly implement extra signers for the launchpad routes
    // This needs to be done in both the schema (keypair) as well as here
    const response = await this.v4ApiClient.updateLaunchpad(SolanaApiMappers.v4.updateLaunchpadRequest(params));
    return SolanaTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get mint transaction instructions from API
   * @param params Mint parameters
   */
  protected async getMintTransactions(
    params: ChainMethodParams<'solana', 'mint'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    // TODO: Later on, properly implement extra signers for the mint routes
    // This needs to be done in both the schema (keypair) as well as here
    const response = await this.v4ApiClient.mint(SolanaApiMappers.v4.mintRequest(params));
    return SolanaTransactionAdapters.fromV4TransactionResponse(response);
  }

  /**
   * Get list transaction instructions from API
   * @param params Listing parameters
   */
  protected async getListTransactions(
    params: ChainMethodParams<'solana', 'list'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    const response = await this.v2ApiClient.list(SolanaApiMappers.v2.listRequest(params));
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingTransactions(
    params: ChainMethodParams<'solana', 'cancelListing'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    const response = await this.v2ApiClient.cancelListing(
      SolanaApiMappers.v2.cancelListingRequest(params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get make item offer transaction instructions from API
   * @param params Make item offer parameters
   */
  protected async getMakeItemOfferTransactions(
    params: ChainMethodParams<'solana', 'makeItemOffer'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    const response = await this.v2ApiClient.makeItemOffer(
      SolanaApiMappers.v2.makeItemOfferRequest(params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get take item offer transaction instructions from API
   * @param params Take item offer parameters
   */
  protected async getTakeItemOfferTransactions(
    params: ChainMethodParams<'solana', 'takeItemOffer'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    const response = await this.v2ApiClient.takeItemOffer(
      SolanaApiMappers.v2.takeItemOfferRequest(params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get cancel item offer transaction instructions from API
   * @param params Cancel item offer parameters
   */
  protected async getCancelItemOfferTransactions(
    params: ChainMethodParams<'solana', 'cancelItemOffer'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    const response = await this.v2ApiClient.cancelItemOffer(
      SolanaApiMappers.v2.cancelItemOfferRequest(params),
    );
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get buy transaction instructions from API
   * @param params Buy parameters
   */
  protected async getBuyTransactions(
    params: ChainMethodParams<'solana', 'buy'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    const response = await this.v2ApiClient.buy(SolanaApiMappers.v2.buyRequest(params));
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }

  /**
   * Get transfer transaction instructions from API
   * @param params Transfer parameters
   */
  protected async getTransferTransactions(
    params: ChainMethodParams<'solana', 'transfer'>,
  ): Promise<ChainTransaction<'solana'>[]> {
    const response = await this.v2ApiClient.transfer(SolanaApiMappers.v2.transferRequest(params));
    return SolanaTransactionAdapters.fromInstructionsResponse(response);
  }
}
