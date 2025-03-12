import { ChainType, ClientConfig, Environment } from './types';
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
   * Creates a new Magic Eden API client for Solana
   * @param config Client configuration
   * @returns A new Magic Eden API client for Solana
   */
  public static createSolanaClient(config: ClientConfig): MagicEdenClient {
    return new MagicEdenClient({
      ...config,
      chain: ChainType.SOLANA,
    });
  }

  /**
   * Creates a new Magic Eden API client for EVM
   * @param config Client configuration
   * @returns A new Magic Eden API client for EVM
   */
  public static createEvmClient(config: ClientConfig): MagicEdenClient {
    return new MagicEdenClient({
      ...config,
      chain: ChainType.EVM,
    });
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
    // Just return the config as is for now
    return {
      timeout: 30000,
      ...config,
    };
  }
}
