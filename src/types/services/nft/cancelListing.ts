import { z } from "zod";
import { ZodEvmBlockchain } from "../../chains";

/**
 * Parameters for canceling an NFT listing
 */
export const CancelListingParams = z.object({
  // Generic parameters that can be shared between chains
});

export const EvmCancelListingParams = CancelListingParams.extend({
  // EVM-specific parameters
});

export const EvmCancelListingParamsWithExtras = z.object({
  chain: ZodEvmBlockchain.describe('The chain to cancel the item offer on'),
  orderIds: z.array(z.string()).describe('The order IDs to cancel'),
});

export const SolanaCancelListingParams = CancelListingParams.extend({
  // Solana-specific parameters
  token: z.string().describe("The NFT token address/mint"),
  price: z.string().describe("The listing price to cancel"),
  auctionHouseAddress: z.string().describe("Auction house address"),
  tokenAccount: z.string().describe("Token account address"),
  sellerReferral: z.string().optional().describe("Seller referral address"),
  expiry: z.number().describe("Listing expiry timestamp"),
  prioFeeMicroLamports: z.number().optional().describe("Priority fee in micro lamports"),
  maxPrioFeeLamports: z.number().optional().describe("Maximum priority fee in lamports"),
  exactPrioFeeLamports: z.number().optional().describe("Exact priority fee in lamports"),
});

export type EvmCancelListingParams = z.infer<typeof EvmCancelListingParamsWithExtras>;
export type SolanaCancelListingParams = z.infer<typeof SolanaCancelListingParams>;