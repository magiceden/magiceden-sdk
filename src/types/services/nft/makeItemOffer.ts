import { z } from "zod";
import { SplAmount } from "../../solana";

/**
 * Parameters for making an offer on an NFT
 */
export const MakeItemOfferParams = z.object({
  // Generic parameters that can be shared between chains
  tokenAddress: z.string().describe("The NFT token address/mint"),
  price: z.number().describe("The offer price"),
  expiry: z.number().optional().describe("Offer expiry timestamp"),
});

export const EvmMakeItemOfferParams = MakeItemOfferParams.extend({
  // EVM-specific parameters
  expirationTime: z.number().describe("Offer expiration time"),
});

export const SolanaMakeItemOfferParams = MakeItemOfferParams.extend({
  // Solana-specific parameters
  // tokenAddress in MakeItemOfferParams maps to tokenMint in V2MakeItemOfferRequest
  // price in MakeItemOfferParams maps to price in V2MakeItemOfferRequest
  // buyer in MakeItemOfferParams maps to buyer in V2MakeItemOfferRequest
  // expiry in MakeItemOfferParams maps to expiry in V2MakeItemOfferRequest
  auctionHouseAddress: z.string().describe("Auction house address"),
  buyerReferral: z.string().optional().describe("Buyer referral address"),
  useBuyV2: z.boolean().optional().describe("Whether to use buy v2"),
  buyerCreatorRoyaltyPercent: z.number().optional().describe("Buyer creator royalty percentage"),
  prioFeeMicroLamports: z.number().optional().describe("Priority fee in micro lamports"),
  maxPrioFeeLamports: z.number().optional().describe("Maximum priority fee in lamports"),
  exactPrioFeeLamports: z.number().optional().describe("Exact priority fee in lamports"),
});

export type EvmMakeItemOfferParams = z.infer<typeof EvmMakeItemOfferParams>;
export type SolanaMakeItemOfferParams = z.infer<typeof SolanaMakeItemOfferParams>;