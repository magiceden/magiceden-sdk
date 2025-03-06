import { TransactionResponse } from '../types';

/**
 * Abstract wallet provider interface
 */
export interface WalletProvider {
  /**
   * Get the wallet's public address
   */
  getAddress(): Promise<string>;

  /**
   * Sign and send a transaction
   * @param transaction The transaction to sign and send
   */
  signAndSendTransaction(transaction: any): Promise<TransactionResponse>;

  /**
   * Sign a message
   * @param message The message to sign
   */
  signMessage(message: string): Promise<string>;

  /**
   * Check if the wallet is connected
   */
  isConnected(): boolean;

  /**
   * Get the chain ID (for EVM wallets)
   */
  getChainId?(): Promise<number>;
}
