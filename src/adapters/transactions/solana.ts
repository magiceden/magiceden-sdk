import { 
  VersionedTransaction, 
} from '@solana/web3.js';
import { SolanaInstructionsResponse } from '../../types/api';
import { ChainTransaction } from '../../wallet';

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
  fromInstructionsResponse: (response: SolanaInstructionsResponse): ChainTransaction<'solana'> => {
    // Handle versioned transactions (v0)
    if (response.v0?.txSigned) {
      return VersionedTransaction.deserialize(Buffer.from(response.v0.txSigned.data));
    } 
    else if (response.v0?.tx) {
      return VersionedTransaction.deserialize(Buffer.from(response.v0.tx.data));
    }
    
    throw new Error('Invalid transaction response format, only versioned transactions are supported');
  },
  
  /**
   * Converts raw transaction data into a transaction object
   * @param data Raw transaction data buffer
   * @returns A properly formatted Solana transaction
   */
  fromBuffer: (data: Buffer): ChainTransaction<'solana'> => {
    try {
      // Try to deserialize as a versioned transaction first
      return VersionedTransaction.deserialize(data);
    } catch (e) {
      throw new Error('Invalid transaction data, only versioned transactions are supported');
    }
  },
}; 