import { z } from "zod";

/**
 * Parameters for canceling an NFT listing
 */
export const CancelListingParams = {
  identifier: z.string(),
  listingId: z.string(),
};

export const EvmCancelListingParams = z.object({
  ...CancelListingParams,
});

export const SolanaCancelListingParams = z.object({
  ...CancelListingParams,
});

export type EvmCancelListingParams = z.infer<typeof EvmCancelListingParams>;
export type SolanaCancelListingParams = z.infer<typeof SolanaCancelListingParams>;