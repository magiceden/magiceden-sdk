import { VersionedTransaction } from '@solana/web3.js';
import { TransactionRequest } from 'viem';
import { SupportedChain } from '../types/chains';

export * from './solana';
export * from './evm';
export * from './provider';

// Define a type that maps chain types to their transaction types
export type ChainTransactionType = {
  solana: VersionedTransaction;
  evm: TransactionRequest;
};

/**
 * Helper type to get the transaction type for a specific chain
 */
export type ChainTransaction<C extends SupportedChain> = ChainTransactionType[C];
