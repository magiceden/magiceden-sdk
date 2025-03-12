import { z } from "zod";

/**
 * Parameters for canceling an offer
 */
export const CancelItemOfferParams = {
  identifier: z.string(),
  offerId: z.string(),
};

export const EvmCancelItemOfferParams = z.object({
  ...CancelItemOfferParams,
});

export const SolanaCancelItemOfferParams = z.object({
  ...CancelItemOfferParams,
});

export type EvmCancelItemOfferParams = z.infer<typeof EvmCancelItemOfferParams>;
export type SolanaCancelItemOfferParams = z.infer<typeof SolanaCancelItemOfferParams>; 
