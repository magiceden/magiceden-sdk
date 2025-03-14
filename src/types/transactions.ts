
/**
 * Transaction strategy
 */
export enum TransactionStrategy {
  /**
   * Sign and immediately send any transactions
   */
  SignAndSend = 'signAndSend',

  /**
   * Sign and send transactions, then wait for confirmation
   */
  SignSendAndConfirm = 'signSendAndConfirm',
}

/**
 * Transaction response interface
 */
export interface TransactionResponse {
  /**
   * Transaction ID or signature.
   * 
   * For Solana, this is the signature.
   * For EVM, this is the transaction hash.
   */
  txId: string;

  /**
   * Transaction status
   */
  status?: 'pending' | 'confirmed' | 'failed';

  /**
   * Error message (if failed)
   */
  error?: string;

  /**
   * Metadata
   */
  metadata?: Record<string, unknown>;
}
