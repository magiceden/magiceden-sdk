import { SupportedChain } from './chains';
import { WalletProvider, ChainTransaction } from '../wallet';
import { ChainType } from './chains';
import { TransactionStrategy } from './transactions';

/**
 * Environment options
 */
export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  /**
   * Transaction strategy
   */
  strategy?: TransactionStrategy;
}

/**
 * Client configuration options
 */
export interface ClientConfig<C extends SupportedChain = SupportedChain> {
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
  wallet: WalletProvider<ChainTransaction<C>>;

  /**
   * Transaction options
   *
   * Default options for transactions:
   * - strategy: Sign and send transactions immediately
   */
  transactionOptions?: TransactionOptions;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Additional headers to include with requests
   */
  headers?: Record<string, string>;
}
