import { ClientConfig, ChainType } from './types';
import { ApiManager } from './utils/api';
import { BaseNftService, NftServiceFactory } from './services/nft';
import { WalletProvider } from './wallet/provider';
import { SolanaWalletProvider } from './wallet/solana';
import { ApiError } from './errors';

/**
 * Magic Eden API client
 */
export class MagicEdenClient {
  private readonly api: ApiManager;
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
    this.api = new ApiManager(this.getBaseUrl(config.chain), {
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
        ...config.headers,
      },
      timeout: config.timeout,
    });

    // Initialize services using factories
    this._nft = NftServiceFactory.create(this.api, this.config);
  }

  /**
   * Validates the provided configuration
   */
  private validateConfig(config: ClientConfig): ClientConfig {
    return {
      environment: 'production',
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Gets the base URL for API requests based on chain
   */
  private getBaseUrl(chain: ChainType): string {
    if (this.config.endpoint) {
      return this.config.endpoint;
    }
    
    const isDev = this.config.environment === 'development';
    
    switch (chain) {
      case 'solana':
        return isDev 
          ? 'https://api-devnet.magiceden.io/v2'
          : 'https://api.magiceden.io/v2';
      case 'ethereum':
        return isDev
          ? 'https://api-eth-dev.magiceden.io/v2'
          : 'https://api-eth.magiceden.io/v2';
      case 'arbitrum':
        return isDev
          ? 'https://api-arb-dev.magiceden.io/v2'
          : 'https://api-arb.magiceden.io/v2';
      case 'base':
        return isDev
          ? 'https://api-base-dev.magiceden.io/v2'
          : 'https://api-base.magiceden.io/v2';
      case 'polygon':
        return isDev
          ? 'https://api-poly-dev.magiceden.io/v2'
          : 'https://api-poly.magiceden.io/v2';
      case 'bitcoin':
        return isDev
          ? 'https://api-btc-dev.magiceden.io/v2'
          : 'https://api-btc.magiceden.io/v2';
      default:
        throw new ApiError(`Unsupported chain: ${chain}`);
    }
  }

  /**
   * Access NFT-related functionality
   */
  get nft() {
    return this._nft;
  }
  
  /**
   * Set or update the wallet provider
   */
  setWallet(wallet: any): void {
    // Create appropriate wallet provider based on chain
    let walletProvider: WalletProvider;
    
    switch (this.config.chain) {
      case 'solana':
        walletProvider = new SolanaWalletProvider(wallet);
        break;
      case 'ethereum':
      case 'arbitrum':
      case 'base':
      case 'polygon':
        throw new ApiError('EVM wallet support is not yet implemented');
      case 'bitcoin':
        throw new ApiError('Bitcoin wallet support is not yet implemented');
      default:
        throw new ApiError(`Unsupported chain for wallet: ${this.config.chain}`);
    }
    
    // Update config with new wallet provider
    this.config.wallet = walletProvider;

    // Recreate services with updated config
    this._nft = NftServiceFactory.create(this.api, this.config);
  }
}