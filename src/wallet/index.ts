import { SolanaWalletProvider } from './solana';
import { EvmWalletProvider } from './evm';

export * from './solana';
export * from './evm';
export * from './provider';

export type SupportedWalletProvider = SolanaWalletProvider | EvmWalletProvider;
