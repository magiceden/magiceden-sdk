import { V4TransactionResponse } from '../../types/api';
import { ZodEvmBlockchain } from '../../types';
import { EvmTransactionParams } from '../../types/services/nft/shared/steps';
import { TransactionRequest } from 'viem';
import { isHexPrefixedString } from '../../validation';
import { TransactionOperation } from '../../types/operations';

/**
 * Ethereum Transaction Adapters
 * Converts between API responses and Ethereum transaction objects
 */
export const EvmTransactionAdapters = {
  fromV3TransactionResponse: (response: any): TransactionOperation<'evm'>[] => {
    return [];
  },

  /**
   * Converts a V4 transaction response into an array of Ethereum transactions
   * @param response The API response containing transaction data
   * @returns An array of properly formatted Ethereum transactions
   */
  fromV4TransactionResponse: (response: V4TransactionResponse): TransactionOperation<'evm'>[] => {
    if (!response.steps || response.steps.length === 0) {
      throw new Error('Invalid transaction response: missing steps');
    }

    // Filter for valid EVM steps with eth_sendTransaction method
    const validSteps = response.steps.filter((step) => {
      if (!step.chain || step.method !== 'eth_sendTransaction') {
        return false;
      }

      // Check if the chain is a valid EVM blockchain
      const evmChainResult = ZodEvmBlockchain.safeParse(step.chain);
      if (!evmChainResult.success) {
        return false;
      }

      const result = EvmTransactionParams.safeParse(step.params);
      return result.success;
    });

    if (validSteps.length === 0) {
      throw new Error('No valid EVM transaction steps found in response');
    }

    const transactions: TransactionRequest[] = [];

    for (const step of validSteps) {
      const result = EvmTransactionParams.safeParse(step.params);
      if (!result.success) {
        continue; // Skip invalid steps
      }

      if (!isHexPrefixedString(result.data.from) || !isHexPrefixedString(result.data.to)) {
        throw new Error('Invalid transaction response: invalid from or to address');
      }

      const evmParams = result.data;

      // Create a transaction request object
      const transaction: TransactionRequest = {
        from: evmParams.from as `0x${string}`,
        to: evmParams.to as `0x${string}`,
        ...(evmParams.value ? { value: BigInt(evmParams.value) } : {}),
        ...(evmParams.data && isHexPrefixedString(evmParams.data) ? { data: evmParams.data } : {}),
        ...(evmParams.chainId ? { chainId: evmParams.chainId } : {}),
        ...(evmParams.gas ? { gas: BigInt(evmParams.gas) } : {}),
      };

      transactions.push(transaction);
    }

    return transactions.map((tx) => ({
      type: 'transaction',
      transactionData: tx,
    }));
  },
};
