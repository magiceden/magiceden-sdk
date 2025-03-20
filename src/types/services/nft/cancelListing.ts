import { z } from "zod";

/**
 * Parameters for canceling an NFT listing
 */
export const CancelListingParams = {
  // Generic parameters that can be shared between chains
  tokenAddress: z.string().describe("The NFT token address/mint"),
  price: z.string().describe("The listing price to cancel"),
};

export const EvmCancelListingParams = z.object({
  ...CancelListingParams,
  // EVM-specific parameters
});

export const SolanaCancelListingParams = z.object({
  ...CancelListingParams,
  // Solana-specific parameters
  // tokenAddress in CancelListingParams maps to tokenMint in V2CancelListingRequest
  // price in CancelListingParams maps to price in V2CancelListingRequest
  // seller in CancelListingParams maps to seller in V2CancelListingRequest
  auctionHouseAddress: z.string().describe("Auction house address"),
  tokenAccount: z.string().describe("Token account address"),
  sellerReferral: z.string().optional().describe("Seller referral address"),
  expiry: z.number().describe("Listing expiry timestamp"),
  prioFeeMicroLamports: z.number().optional().describe("Priority fee in micro lamports"),
  maxPrioFeeLamports: z.number().optional().describe("Maximum priority fee in lamports"),
  exactPrioFeeLamports: z.number().optional().describe("Exact priority fee in lamports"),
});

export type EvmCancelListingParams = z.infer<typeof EvmCancelListingParams>;
export type SolanaCancelListingParams = z.infer<typeof SolanaCancelListingParams>;