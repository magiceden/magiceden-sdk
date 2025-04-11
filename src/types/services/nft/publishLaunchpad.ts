import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chains';
import { SolanaSymbol } from '../../solana';
import { zSolanaAddress } from '../../solana/primitives';

/**
 * Parameters for publishing a launchpad
 */
export const BasePublishLaunchpadParamsSchema = z.object({
  /**
   * The chain to publish the launchpad on
   */
  chain: z.nativeEnum(Blockchain),
});

/**
 * Evm-specific parameters for publishing a launchpad
 */
export const EvmPublishLaunchpadParamsSchema = BasePublishLaunchpadParamsSchema.extend({
  /**
   * The EVM chain to publish the launchpad on
   */
  chain: ZodEvmBlockchain,
});

/**
 * Solana-specific parameters for publishing a launchpad
 */
export const SolanaPublishLaunchpadParamsSchema = BasePublishLaunchpadParamsSchema.extend({

  /**
   * The chain to publish the launchpad on
   * 
   * Only used for Solana, so this should always be `Blockchain.SOLANA`.
   * 
   * @default Blockchain.SOLANA
   */
  chain: z.literal(Blockchain.SOLANA),

  /**
   * The candy machine ID
   */
  candyMachineId: zSolanaAddress,

  /**
   * The symbol of the launchpad/collection
   */
  symbol: SolanaSymbol,
});

export type EvmPublishLaunchpadParams = z.infer<typeof EvmPublishLaunchpadParamsSchema>;
export type SolanaPublishLaunchpadParams = z.infer<typeof SolanaPublishLaunchpadParamsSchema>;

export const PublishLaunchpadParams = z.union([
  EvmPublishLaunchpadParamsSchema,
  SolanaPublishLaunchpadParamsSchema,
]);
export type PublishLaunchpadParams = z.infer<typeof PublishLaunchpadParams>;
