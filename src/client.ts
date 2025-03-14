import { ClientConfig, TransactionStrategy } from './types';
import { BaseNftService, NftServiceFactory } from './services/nft';
import { ApiError } from './errors';

/**
 * Magic Eden API client
 */
export class MagicEdenClient {
  private readonly _config: ClientConfig;
  private readonly _nft: BaseNftService;

  /**
   * Creates a new Magic Eden API client
   * @param config Client configuration
   */
  constructor(config: ClientConfig) {
    this._config = this.validateConfig(config);
    this._nft = NftServiceFactory.create(this._config);
  }

  /**
   * Access NFT-related functionality
   */
  public get nft() {
    return this._nft;
  }

  /**
   * Validates the provided configuration
   */
  private validateConfig(config: ClientConfig): ClientConfig {
    if (!config.chain) {
      throw new ApiError('Chain type must be specified');
    }

    return {
      ...config,
      transactionOptions: {
        ...(config.transactionOptions || {}),
        // Default to signing and sending transactions, then waiting for confirmation
        strategy: config.transactionOptions?.strategy || TransactionStrategy.SignSendAndConfirm,
      },
    };
  }
}
