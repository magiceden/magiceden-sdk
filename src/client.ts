import { ClientConfig, ChainType, Environment } from './types';
import { BaseNftService, NftServiceFactory } from './services/nft';
import { ApiError } from './errors';

/**
 * Magic Eden API client
 */
export class MagicEdenClient {
  private readonly config: ClientConfig;
  private _nft: BaseNftService;

  /**
   * Creates a new Magic Eden API client
   * @param config Client configuration
   */
  constructor(config: ClientConfig) {
    if (!config.chain) {
      throw new ApiError('Chain type must be specified');
    }

    this.config = this.validateConfig(config);

    this._nft = NftServiceFactory.create(this.config);
  }

  /**
   * Access NFT-related functionality
   */
  get nft() {
    return this._nft;
  }

  /**
   * Validates the provided configuration
   */
  private validateConfig(config: ClientConfig): ClientConfig {
    // Just return the config as is for now
    return {
      environment: Environment.PRODUCTION,
      timeout: 30000,
      ...config,
    };
  }
}
