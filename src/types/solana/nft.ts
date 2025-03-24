import { z } from 'zod';
import { zSolanaAddress } from './primitives';

export const zSolNonFungibleCreator = z.object({
  address: zSolanaAddress,
  // share is in PERCENTAGE
  share: z.number().int().min(0).max(100),
});

export const zSolAuthorization = z.object({
  signature: z.string(),
  signer: zSolanaAddress,
  timestamp: z.string(),
});
