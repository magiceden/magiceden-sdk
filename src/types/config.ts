import { ChainTransactionType, WalletProvider } from '../wallet';
import { ChainType } from './chain';

/**
 * Environment options
 */
export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

/**
 * Client configuration options
 */
export interface ClientConfig<C extends keyof ChainTransactionType = keyof ChainTransactionType> {
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
  wallet: WalletProvider<ChainTransactionType[C]>;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Additional headers to include with requests
   */
  headers?: Record<string, string>;
}
