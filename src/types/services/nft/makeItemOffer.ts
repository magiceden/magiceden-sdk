import { z } from "zod";
import { SplAmount } from "../../solana";

/**
 * Parameters for making an offer on an NFT
 */
export const MakeItemOfferParams = {
  identifier: z.string(),
  price: z.number(),
};

export const EvmMakeItemOfferParams = z.object({
  ...MakeItemOfferParams,
  
  // EVM-specific parameters
  expirationTime: z.number(),
});

export const SolanaMakeItemOfferParams = z.object({
  ...MakeItemOfferParams,
  
  // Solana-specific parameters
  auctionHouseAddress: z.string(),
  splPrice: z.custom<SplAmount>().optional(),
  expiry: z.number(),
  prioFeeMicroLamports: z.number().optional(),
});

export type EvmMakeItemOfferParams = z.infer<typeof EvmMakeItemOfferParams>;
export type SolanaMakeItemOfferParams = z.infer<typeof SolanaMakeItemOfferParams>;