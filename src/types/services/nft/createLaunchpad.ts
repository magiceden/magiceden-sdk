import { z } from "zod";

/**
 * Parameters for creating a launchpad
 */
export const CreateLaunchpadParams = {
  name: z.string(),
  symbol: z.string(),
  description: z.string(),
};

export const EvmCreateLaunchpadParams = z.object({
  ...CreateLaunchpadParams,
  
  // EVM-specific parameters
  contractAddress: z.string().optional(),
});

export const SolanaCreateLaunchpadParams = z.object({
  ...CreateLaunchpadParams,
  
  // Solana-specific parameters
  collectionMint: z.string().optional(),
  candyMachineId: z.string().optional(),
});

export type EvmCreateLaunchpadParams = z.infer<typeof EvmCreateLaunchpadParams>;
export type SolanaCreateLaunchpadParams = z.infer<typeof SolanaCreateLaunchpadParams>;