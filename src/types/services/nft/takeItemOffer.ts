import { z } from "zod";

/**
 * Parameters for taking an NFT offer
 */
export const TakeItemOfferParams = {
  identifier: z.string(),
  offerId: z.string(),
};

export const EvmTakeItemOfferParams = z.object({
  ...TakeItemOfferParams,
});

export const SolanaTakeItemOfferParams = z.object({
  ...TakeItemOfferParams,
  
  // Solana-specific parameters
  auctionHouseAddress: z.string(),
  tokenAccount: z.string(),
  prioFeeMicroLamports: z.number().optional(),
});

export type EvmTakeItemOfferParams = z.infer<typeof EvmTakeItemOfferParams>;
export type SolanaTakeItemOfferParams = z.infer<typeof SolanaTakeItemOfferParams>;