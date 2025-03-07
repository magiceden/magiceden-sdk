import { WalletProvider } from '../wallet/provider';

/**
 * Environment options
 */
export type Environment = 'production' | 'development';

/**
 * Chain type
 */
export type ChainType = 'solana' | 'evm' | 'bitcoin';

/**
 * Client configuration options
 */
export interface ClientConfig {
  /**
   * API key for authenticated requests (optional)
   */
  apiKey: string;

  /**
   * Blockchain network to use
   */
  chain: ChainType;

  /**
   * Wallet provider for signing transactions
   */
  wallet: WalletProvider;

  /**
   * API environment
   */
  environment?: Environment;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Additional headers to include with requests
   */
  headers?: Record<string, string>;
}
