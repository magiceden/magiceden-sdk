import { z } from "zod";

/**
 * Parameters for canceling an offer
 */
export const CancelItemOfferParams = z.object({
  // Generic parameters that can be shared between chains
  tokenAddress: z.string().describe("The NFT token address/mint"),
  price: z.string().describe("The offer price to cancel"),
  expiry: z.number().optional().describe("Offer expiry timestamp"),
});

export const EvmCancelItemOfferParams = CancelItemOfferParams.extend({
  // EVM-specific parameters
});

export const SolanaCancelItemOfferParams = CancelItemOfferParams.extend({
  // Solana-specific parameters
  // tokenAddress in CancelItemOfferParams maps to tokenMint in V2CancelItemOfferRequest
  // price in CancelItemOfferParams maps to price in V2CancelItemOfferRequest
  // buyer in CancelItemOfferParams maps to buyer in V2CancelItemOfferRequest
  // expiry in CancelItemOfferParams maps to expiry in V2CancelItemOfferRequest
  auctionHouseAddress: z.string().describe("Auction house address"),
  buyerReferral: z.string().optional().describe("Buyer referral address"),
  prioFeeMicroLamports: z.number().optional().describe("Priority fee in micro lamports"),
  maxPrioFeeLamports: z.number().optional().describe("Maximum priority fee in lamports"),
  exactPrioFeeLamports: z.number().optional().describe("Exact priority fee in lamports"),
});

export type EvmCancelItemOfferParams = z.infer<typeof EvmCancelItemOfferParams>;
export type SolanaCancelItemOfferParams = z.infer<typeof SolanaCancelItemOfferParams>; 
