/* eslint-disable @typescript-eslint/no-explicit-any */

import { WalletProvider } from '../provider';
import {
  Connection,
  RpcResponseAndContext,
  SignatureStatus,
  SignatureStatusConfig,
  VersionedTransaction,
  SignatureResult,
} from '@solana/web3.js';

export abstract class SolanaWalletProvider extends WalletProvider<
  VersionedTransaction,
  VersionedTransaction,
  string,
  RpcResponseAndContext<SignatureResult>
> {
  /**
   * Get the connection to the Solana network.
   *
   * @returns The connection to the Solana network.
   */
  abstract getConnection(): Connection;

  /**
   * Get the signature status of a transaction.
   *
   * @param signature The signature of the transaction.
   * @returns The signature status of the transaction.
   */
  abstract getSignatureStatus(
    signature: string,
    options?: SignatureStatusConfig,
  ): Promise<RpcResponseAndContext<SignatureStatus | null>>;

  /**
   * Wait for the signature result of a transaction.
   *
   * @param signature The signature of the transaction.
   * @returns The signature result of the transaction.
   */
  abstract waitForSignatureResult(signature: string): Promise<RpcResponseAndContext<SignatureResult>>;
}
