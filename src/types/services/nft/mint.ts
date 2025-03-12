import { z } from "zod";

/**
 * Parameters for minting NFTs
 */
export const MintParams = {
  recipient: z.string(),
  quantity: z.number().default(1),
};

export const EvmMintParams = z.object({
  ...MintParams,
  
  // EVM-specific parameters
  contractAddress: z.string(),
});

export const SolanaMintParams = z.object({
  ...MintParams,
  
  // Solana-specific parameters
  candyMachineAddress: z.string(),
  prioFeeMicroLamports: z.number().optional(),
});

export type EvmMintParams = z.infer<typeof EvmMintParams>;
export type SolanaMintParams = z.infer<typeof SolanaMintParams>;