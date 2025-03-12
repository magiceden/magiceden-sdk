import { z } from 'zod';

/**
 * Parameters for updating a launchpad
 */
export const UpdateLaunchpadParams = {};

export const EvmUpdateLaunchpadParams = z.object({
  ...UpdateLaunchpadParams,
});

export const SolanaUpdateLaunchpadParams = z.object({
  ...UpdateLaunchpadParams,
});

export type EvmUpdateLaunchpadParams = z.infer<typeof EvmUpdateLaunchpadParams>;
export type SolanaUpdateLaunchpadParams = z.infer<typeof SolanaUpdateLaunchpadParams>;
