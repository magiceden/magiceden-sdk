import { z } from "zod";

/**
 * Parameters for updating a launchpad
 */
export const UpdateLaunchpadParams = {
  name: z.string().optional(),
  description: z.string().optional(),
};

export const EvmUpdateLaunchpadParams = z.object({
  ...UpdateLaunchpadParams,
  
  // EVM-specific parameters
  contractAddress: z.string(),
});

export const SolanaUpdateLaunchpadParams = z.object({
  ...UpdateLaunchpadParams,
  
  // Solana-specific parameters
  candyMachineId: z.string(),
  prioFeeMicroLamports: z.number().optional(),
});

export type EvmUpdateLaunchpadParams = z.infer<typeof EvmUpdateLaunchpadParams>;
export type SolanaUpdateLaunchpadParams = z.infer<typeof SolanaUpdateLaunchpadParams>;