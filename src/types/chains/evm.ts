import { z } from 'zod';
import { Blockchain } from './general';

/**
 * EVM chain ID
 */
export enum EvmChainId {
  ETHEREUM = 1,
  POLYGON = 137,
  BASE = 8453,
  SEI = 1329,
  ARBITRUM = 42161,
  APECHAIN = 33139,
  BERACHAIN = 80094,
  MONAD = 0, // TODO: update when testnet launches
  MONAD_TESTNET = 10143,
  AVALANCHE = 43114,
  BSC = 56,
  ABSTRACT = 2741,
}

/**
 * Zod schema for EVM blockchains
 */
export const ZodEvmBlockchain = z.enum([
  Blockchain.ETHEREUM,
  Blockchain.BASE,
  Blockchain.POLYGON,
  Blockchain.SEI,
  Blockchain.ARBITRUM,
  Blockchain.APECHAIN,
  Blockchain.BERACHAIN,
  Blockchain.MONAD,
  Blockchain.MONAD_TESTNET,
  Blockchain.AVALANCHE,
  Blockchain.BSC,
  Blockchain.ABSTRACT,
]);
export type EvmBlockchain =
  | Blockchain.ETHEREUM
  | Blockchain.POLYGON
  | Blockchain.BASE
  | Blockchain.SEI
  | Blockchain.ARBITRUM
  | Blockchain.APECHAIN
  | Blockchain.BERACHAIN
  | Blockchain.MONAD
  | Blockchain.MONAD_TESTNET
  | Blockchain.AVALANCHE
  | Blockchain.BSC
  | Blockchain.ABSTRACT;
export const EvmBlockchains = ZodEvmBlockchain.options;
