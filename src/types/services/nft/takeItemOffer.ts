import { z } from "zod";

/**
 * Parameters for taking an NFT offer
 */
export const TakeItemOfferParams = {
  // Generic parameters that can be shared between chains
  tokenAddress: z.string().describe("The NFT token address/mint"),
  buyer: z.string().describe("The buyer's wallet address"),
  seller: z.string().describe("The seller's wallet address"),
  price: z.number().optional().describe("The original offer price"),
  newPrice: z.number().describe("The new price to accept"),
};

export const EvmTakeItemOfferParams = z.object({
  ...TakeItemOfferParams,
  // EVM-specific parameters
});

export const SolanaTakeItemOfferParams = z.object({
  ...TakeItemOfferParams,
  // Solana-specific parameters
  // tokenAddress in TakeItemOfferParams maps to tokenMint in V2TakeItemOfferRequest
  // buyer in TakeItemOfferParams maps to buyer in V2TakeItemOfferRequest
  // seller in TakeItemOfferParams maps to seller in V2TakeItemOfferRequest
  // price in TakeItemOfferParams maps to price in V2TakeItemOfferRequest
  // newPrice in TakeItemOfferParams maps to newPrice in V2TakeItemOfferRequest
  auctionHouseAddress: z.string().describe("Auction house address"),
  tokenATA: z.string().describe("Token associated token account"),
  buyerReferral: z.string().optional().describe("Buyer referral address"),
  sellerReferral: z.string().optional().describe("Seller referral address"),
  buyerExpiry: z.number().optional().describe("Buyer expiry timestamp"),
  sellerExpiry: z.number().describe("Seller expiry timestamp"),
  prioFeeMicroLamports: z.number().optional().describe("Priority fee in micro lamports"),
  maxPrioFeeLamports: z.number().optional().describe("Maximum priority fee in lamports"),
  exactPrioFeeLamports: z.number().optional().describe("Exact priority fee in lamports"),
});

export type EvmTakeItemOfferParams = z.infer<typeof EvmTakeItemOfferParams>;
export type SolanaTakeItemOfferParams = z.infer<typeof SolanaTakeItemOfferParams>;