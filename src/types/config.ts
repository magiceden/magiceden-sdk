import { SupportedChain } from './chains';
import { WalletProvider } from '../wallet';
import { ChainType } from './chains';
import { ChainTransaction, TransactionStrategy } from './transactions';
import { ApiOptions } from '../api/utils';

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
   * API key for the Magic Eden API
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
   * API options
   * 
   * Additional options for API configuration
   */
  apiOptions?: Omit<ApiOptions, 'apiKey'>;

  /**
   * Transaction options
   *
   * Default options for transactions:
   * - strategy: Sign and send transactions immediately
   */
  transactionOptions?: TransactionOptions;
}
