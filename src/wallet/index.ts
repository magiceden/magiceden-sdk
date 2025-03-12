import { SolanaWalletProvider } from './solana';
import { EvmWalletProvider } from './evm';
import { VersionedTransaction } from '@solana/web3.js';
import { TransactionRequest } from 'viem';

export * from './solana';
export * from './evm';
export * from './provider';

// Define a type that maps chain types to their transaction types
export type ChainTransactionType = {
  solana: VersionedTransaction;
  evm: TransactionRequest;
};

// Update SupportedWalletProvider to be a type that depends on the chain
export type SupportedWalletProvider<
  C extends keyof ChainTransactionType = keyof ChainTransactionType,
> = C extends 'solana' ? SolanaWalletProvider : EvmWalletProvider;
