import { V4TransactionResponse } from '../../types/api';
import { ChainTransaction } from '../../wallet';

/**
 * Ethereum Transaction Adapters
 * Converts between API responses and Ethereum transaction objects
 */
export const EvmTransactionAdapters = {
  fromV3TransactionResponse: (response: any): ChainTransaction<'evm'>[] => {
    return [];
  },
  /**
   * Converts a V4 transaction response into an array of Ethereum transactions
   * @param response The API response containing transaction data
   * @returns An array of properly formatted Ethereum transactions
   */
  fromV4TransactionResponse: (response: V4TransactionResponse): ChainTransaction<'evm'>[] => {
    return [];
  },
};
