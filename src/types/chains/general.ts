/**
 * Chain type
 */
export enum ChainType {
  SOLANA = 'solana',
  EVM = 'evm',
}

/**
 * Type for supported chain keys
 */
export type SupportedChain = 'solana' | 'evm';

/**
 * Blockchain type
 */
export enum Blockchain {
  SOLANA = 'solana',
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BASE = 'base',
  SEI = 'sei',
  ARBITRUM = 'arbitrum',
  APECHAIN = 'apechain',
  BERACHAIN = 'berachain',
  MONAD = 'monad',
  MONAD_TESTNET = 'monad-testnet',
  AVALANCHE = 'avalanche',
  BSC = 'bsc',
  ABSTRACT = 'abstract',
  HYPERLIQUID = 'hyperliquid',
}
