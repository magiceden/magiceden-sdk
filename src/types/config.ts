import { SupportedWalletProvider } from '../wallet';

/**
 * Environment options
 */
export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development'
}

/**
 * Chain type
 */
export enum ChainType {
  SOLANA = 'solana',
  EVM = 'evm',
}

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
  wallet: SupportedWalletProvider;

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
