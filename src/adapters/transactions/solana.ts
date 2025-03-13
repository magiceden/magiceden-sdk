import { VersionedTransaction } from '@solana/web3.js';
import { SolanaInstructionsResponse, V4TransactionResponse } from '../../types/api';
import { ChainTransaction } from '../../wallet';
import { SolanaTransactionParams, SolanaTransactionStep } from '../../types';

/**
 * Solana Transaction Adapters
 * Converts between API responses and Solana transaction objects
 */
export const SolanaTransactionAdapters = {
  /**
   * Converts a Solana instructions response into a transaction object
   * @param response The API response containing transaction data
   * @returns A properly formatted Solana transaction
   */
  fromInstructionsResponse: (
    response: SolanaInstructionsResponse,
  ): ChainTransaction<'solana'>[] => {
    // Handle versioned transactions (v0)
    if (response.v0?.txSigned) {
      return [VersionedTransaction.deserialize(Buffer.from(response.v0.txSigned.data))];
    } else if (response.v0?.tx) {
      return [VersionedTransaction.deserialize(Buffer.from(response.v0.tx.data))];
    }

    throw new Error(
      'Invalid transaction response format, only versioned transactions are supported',
    );
  },

  fromV4TransactionResponse: <T extends V4TransactionResponse>(
    response: T,
  ): ChainTransaction<'solana'>[] => {
    const steps = response.steps.map((step) => {
      const solanaTransactionStep = SolanaTransactionStep.safeParse(step);
      if (solanaTransactionStep.success && step.method === 'signAllAndSendTransactions') {
        const transactionParams = SolanaTransactionParams.safeParse(solanaTransactionStep.data);
        if (transactionParams.success) {
          // TODO: Later on, properly implement the feePayer so we are checking that the feePayer is the wallet address
          // Right now there is limited risk of this being incorrect since it's all handled by the MagicEdenClient
          // Still, checking this and handling this properly would be good to do
          // Same goes for tx.signerPubkeys (which are only used if you decide to use some custom keypairs for the launchpad routes)
          return transactionParams.data.transactions.map((tx) =>
            VersionedTransaction.deserialize(Buffer.from(tx.transaction, 'base64')),
          );
        }
      }
    });

    throw new Error('Invalid transaction response format, only Solana transactions are supported');
  },

  /**
   * Converts raw transaction data into a transaction object
   * @param data Raw transaction data buffer
   * @returns A properly formatted Solana transaction
   */
  fromBuffer: (data: Buffer): ChainTransaction<'solana'>[] => {
    try {
      // Try to deserialize as a versioned transaction first
      return [VersionedTransaction.deserialize(data)];
    } catch (e) {
      throw new Error('Invalid transaction data, only versioned transactions are supported');
    }
  },
};
