import { z } from 'zod';

/**
 * Parameters for minting NFTs
 */
export const MintParams = {};

export const EvmMintParams = z.object({
  ...MintParams,
});

export const SolanaMintParams = z.object({
  ...MintParams,
});

export type EvmMintParams = z.infer<typeof EvmMintParams>;
export type SolanaMintParams = z.infer<typeof SolanaMintParams>;
