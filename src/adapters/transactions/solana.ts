import { VersionedTransaction } from '@solana/web3.js';
import { SolanaInstructionsResponse, V4TransactionResponse } from '../../types/api';
import { Blockchain, SolanaTransactionParams } from '../../types';
import { ChainTransaction } from '../../types/transactions';
import { TransactionOperation } from '../../types/operations';

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
  ): TransactionOperation<'solana'>[] => {
    // Handle versioned transactions (v0)
    if (response.v0?.txSigned) {
      return [
        {
          type: 'transaction',
          transactionData: VersionedTransaction.deserialize(Buffer.from(response.v0.txSigned.data)),
        },
      ];
    } else if (response.v0?.tx) {
      return [
        {
          type: 'transaction',
          transactionData: VersionedTransaction.deserialize(Buffer.from(response.v0.tx.data)),
        },
      ];
    }

    throw new Error(
      'Invalid transaction response format, only versioned transactions are supported',
    );
  },

  /**
   * Process a V4 transaction response and extract Solana transactions
   * @param response The API response containing transaction data
   * @returns An array of properly formatted Solana transactions
   */
  fromV4TransactionResponse(response: V4TransactionResponse): TransactionOperation<'solana'>[] {
    if (!response.steps || response.steps.length === 0) {
      throw new Error(
        'Invalid transaction response format, only Solana transactions are supported',
      );
    }

    // Filter for valid Solana steps with signAllAndSendTransactions method
    const validSteps = response.steps.filter((step) => {
      if (step.chain !== Blockchain.SOLANA || step.method !== 'signAllAndSendTransactions') {
        return false;
      }

      const result = SolanaTransactionParams.safeParse(step.params);
      return result.success;
    });

    if (validSteps.length === 0) {
      throw new Error(
        'Invalid transaction response format, only Solana transactions are supported',
      );
    }

    const transactions: TransactionOperation<'solana'>[] = [];

    for (const step of validSteps) {
      const result = SolanaTransactionParams.safeParse(step.params);
      if (!result.success) {
        continue; // Skip non-Solana steps
      }

      const solanaParams = result.data;
      const stepTransactions: TransactionOperation<'solana'>[] = solanaParams.transactions.map(
        (tx) => {
          try {
            // TODO: Implement tx.signerPubkeys to make sure the transaction gets signed by the respective private keys for any of the extra signers
            // Currently we don't allow you to pass in any extra signers where this would be relevant, but we should still make sure to implement this
            // Refer to accounts in src/types/services/nft/createLaunchpad.ts for more details
            const txBuffer = Buffer.from(tx.transaction, 'base64');
            return {
              type: 'transaction',
              transactionData: VersionedTransaction.deserialize(txBuffer),
            };
          } catch (error) {
            throw error;
          }
        },
      );

      transactions.push(...stepTransactions);
    }

    return transactions;
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
