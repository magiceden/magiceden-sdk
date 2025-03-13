export interface WalletTxReceipt {
  txId: string;
  status: 'confirmed' | 'pending' | 'failed';
  metadata?: Record<string, unknown>;
}

/**
 * WalletProvider is the abstract base class for all wallet providers.
 *
 * @abstract
 * @template TxType - The transaction type
 * @template SignedTxType - The signed transaction type
 * @template TxHashType - The transaction hash/signature type
 * @template TxReceiptType - The transaction receipt/confirmation type
 */
export abstract class WalletProvider<
  TxType = unknown,
  SignedTxType = unknown,
  TxHashType extends string = string,
  TxReceiptType extends WalletTxReceipt = WalletTxReceipt
> {
  /**
   * Get the public address of the wallet provider.
   *
   * @returns The address of the wallet provider.
   */
  abstract getAddress(): string;

  /**
   * Get the balance of the native asset of the network.
   *
   * @returns The balance of the native asset of the network.
   */
  abstract getBalance(): Promise<bigint>;

  /**
   * Sign a message.
   *
   * @param message - The message to sign.
   * @returns The signed message.
   */
  abstract signMessage(message: string | Uint8Array): Promise<string>;

  /**
   * Sign a transaction.
   *
   * @param transaction - The transaction to sign.
   * @returns The signed transaction.
   */
  abstract signTransaction(transaction: TxType): Promise<SignedTxType>;

  /**
   * Send a transaction.
   *
   * @param transaction - The transaction to send.
   * @returns The transaction hash or signature.
   */
  abstract sendTransaction(transaction: TxType): Promise<TxHashType>;

  /**
   * Sign and send a transaction.
   *
   * @param transaction The transaction to sign and send.
   * @returns The signature of the transaction.
   */
  abstract signAndSendTransaction(transaction: TxType): Promise<TxHashType>;

  /**
   * Wait for transaction confirmation.
   *
   * @param txIdentifier - The transaction identifier (hash or signature).
   * @returns The confirmation result.
   */
  abstract waitForTransactionConfirmation(txIdentifier: TxHashType): Promise<TxReceiptType>;
}
