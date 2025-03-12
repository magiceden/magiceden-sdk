import { z } from 'zod';

/**
 * Parameters for creating a launchpad
 */
export const CreateLaunchpadParams = {};

export const EvmCreateLaunchpadParams = z.object({
  ...CreateLaunchpadParams,
});

export const SolanaCreateLaunchpadParams = z.object({
  ...CreateLaunchpadParams,
});

export type EvmCreateLaunchpadParams = z.infer<typeof EvmCreateLaunchpadParams>;
export type SolanaCreateLaunchpadParams = z.infer<typeof SolanaCreateLaunchpadParams>;
