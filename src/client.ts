import { ClientConfig, TransactionStrategy } from './types';
import { BaseNftService, NftServiceFactory } from './services/nft';
import { ApiError } from './errors';

/**
 * Magic Eden API client
 */
export class MagicEdenClient<NftService extends BaseNftService> {
  private readonly _config: ClientConfig;
  private readonly _nft: NftService;

  /**
   * Creates a new Magic Eden API client
   * @param config Client configuration
   */
  constructor(config: ClientConfig) {
    this._config = this.validateConfig(config);
    this._nft = NftServiceFactory.create(this._config) as NftService;
  }

  /**
   * Access wallet-related functionality
   */
  public get wallet() {
    return this._config.wallet;
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
      throw new Error('Chain type must be specified');
    }

    return {
      ...config,
      // Ensure apiOptions exists with apiKey
      apiOptions: {
        ...(config.apiOptions || {}),
        // Reject unauthorized requests by default
        rejectUnauthorized: config.apiOptions?.rejectUnauthorized ?? true,
      },
      transactionOptions: {
        ...(config.transactionOptions || {}),
        // Default to signing and sending transactions, then waiting for confirmation
        strategy: config.transactionOptions?.strategy || TransactionStrategy.SignSendAndConfirm,
      },
    };
  }
}
