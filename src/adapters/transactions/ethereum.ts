import { V4TransactionResponse } from '../../types/api';
import { EvmBlockchain, EvmSignatureRequest, ZodEvmBlockchain } from '../../types';
import { EvmTransactionParams } from '../../types/services/nft/shared/steps';
import { TransactionRequest } from 'viem';
import { isHexPrefixedString } from '../../validation';
import { ChainOperation, TransactionOperation } from '../../types/operations';
import { Execute } from '@reservoir0x/reservoir-sdk';
import { getEvmChainIdFromBlockchain } from '../../helpers';

/**
 * Ethereum Transaction Adapters
 * Converts between API responses and Ethereum transaction objects
 */
export const EvmTransactionAdapters = {
  fromV3TransactionResponse: (chain: EvmBlockchain, response: Execute): ChainOperation<'evm'>[] => {
    if (response.errors && response.errors.length > 0) {
      throw new Error(`Magic Eden API errors: ${JSON.stringify(response.errors)}`);
    }

    const operations: ChainOperation<'evm'>[] = [];

    // Process each step in the API response.
    for (const step of response.steps) {
      if (!step.items || step.items.length === 0) continue;

      // Process each item in the step.
      for (const [index, item] of step.items.entries()) {
        if (item.status !== 'incomplete') {
          continue;
        }
        if (step.kind === 'transaction') {
          const transaction: TransactionRequest = {
            to: item.data.to,
            from: item.data.from,
            data: item.data.data,
            ...(item.data.value ? { value: BigInt(item.data.value) } : {}),
          };
          operations.push({
            type: 'transaction',
            transactionData: transaction,
          });
        } else if (step.kind === 'signature') {
          const signData = item.data?.sign;
          if (!signData) {
            continue;
          }

          const signatureOperation: EvmSignatureRequest = {
            api: 'v3',
            chainId: getEvmChainIdFromBlockchain(chain),
            domain: signData.domain,
            types: signData.types,
            message: signData.value,
            primaryType: signData.primaryType,
            post: item.data.post
          };
          operations.push({
            type: 'signature',
            signatureData: signatureOperation,
          });
        } else {
          throw new Error(`Unsupported step kind "${step.kind}" for step "${step.action}"`);
        }
      }
    }

    return operations;
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
