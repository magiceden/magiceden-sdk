
/**
 * Transaction strategy
 * 
 * SignAndSend: Sign and immediately send any transactions
 * 
 * SignSendAndConfirm: Sign and send transactions, then wait for confirmation
 * 
 * SignSendAndConfirm will be used by default if no strategy is provided.
 * If you want to sign and send transactions async, use SignAndSend.
 * This will allow you to continue executing some other code while the transactions are being sent, and you can check the status of the transactions later.
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
