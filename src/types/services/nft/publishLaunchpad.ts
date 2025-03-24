import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chains';
import { zSolAuthorization } from '../../solana';
import { SolanaSymbol } from '../../solana';
import { zSolanaAddress } from '../../solana/primitives';

/**
 * Parameters for publishing a launchpad
 */
export const BasePublishLaunchpadParamsSchema = z.object({
  chain: z.nativeEnum(Blockchain),
});

/**
 * Evm-specific parameters for publishing a launchpad
 */
export const EvmPublishLaunchpadParamsSchema = BasePublishLaunchpadParamsSchema.extend({
  chain: ZodEvmBlockchain,
});

/**
 * Solana-specific parameters for publishing a launchpad
 */
export const SolanaPublishLaunchpadParamsSchema = BasePublishLaunchpadParamsSchema.extend({
  chain: z.literal(Blockchain.SOLANA),
  candyMachineId: zSolanaAddress,
  symbol: SolanaSymbol,
  authorization: zSolAuthorization,
});

export type EvmPublishLaunchpadParams = z.infer<typeof EvmPublishLaunchpadParamsSchema>;
export type SolanaPublishLaunchpadParams = z.infer<typeof SolanaPublishLaunchpadParamsSchema>;

export const PublishLaunchpadParams = z.union([
  EvmPublishLaunchpadParamsSchema,
  SolanaPublishLaunchpadParamsSchema,
]);
export type PublishLaunchpadParams = z.infer<typeof PublishLaunchpadParams>;
