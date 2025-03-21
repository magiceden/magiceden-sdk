import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chains';
import { zSolAuthorization } from '../../solana';
import { SolanaSymbol } from '../../solana';
import { zSolanaAddress } from '../../solana/primitives';

/**
 * Parameters for publishing a launchpad
 */
export const PublishLaunchpadParams = z.object({
  chain: z.nativeEnum(Blockchain),
});

/**
 * Evm-specific parameters for publishing a launchpad
 */
export const EvmPublishLaunchpadParams = PublishLaunchpadParams.extend({
  chain: ZodEvmBlockchain,
});

/**
 * Solana-specific parameters for publishing a launchpad
 */
export const SolanaPublishLaunchpadParams = PublishLaunchpadParams.extend({
  chain: z.literal(Blockchain.SOLANA),
  candyMachineId: zSolanaAddress,
  symbol: SolanaSymbol,
  authorization: zSolAuthorization,
});

export type EvmPublishLaunchpadParams = z.infer<typeof EvmPublishLaunchpadParams>;
export type SolanaPublishLaunchpadParams = z.infer<typeof SolanaPublishLaunchpadParams>;
