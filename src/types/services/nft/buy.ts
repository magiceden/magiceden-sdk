import { z } from "zod";
import { SplAmount } from "../../solana";

/**
 * Parameters for buying an NFT
 */
export const BuyParams = z.object({
  // Generic parameters that can be shared between chains
  tokenAddress: z.string().describe("The NFT token address/mint"),
  seller: z.string().describe("The seller's wallet address"),
  price: z.number().describe("The purchase price"),
});

export const EvmBuyParams = BuyParams.extend({
  // EVM-specific parameters
});

export const SolanaBuyParams = BuyParams.extend({
  // Solana-specific parameters
  // tokenAddress in BuyParams maps to tokenMint in V2BuyRequest
  // buyer in BuyParams maps to buyer in V2BuyRequest
  // seller in BuyParams maps to seller in V2BuyRequest
  // price in BuyParams maps to price in V2BuyRequest
  auctionHouseAddress: z.string().describe("Auction house address"),
  tokenATA: z.string().describe("Token associated token account"),
  buyerReferral: z.string().optional().describe("Buyer referral address"),
  sellerReferral: z.string().optional().describe("Seller referral address"),
  buyerExpiry: z.number().optional().describe("Buyer expiry timestamp"),
  sellerExpiry: z.number().describe("Seller expiry timestamp"),
  buyerCreatorRoyaltyPercent: z.number().optional().describe("Buyer creator royalty percentage"),
  splPrice: z.custom<SplAmount>().optional().describe("SPL token price details"),
});

export type EvmBuyParams = z.infer<typeof EvmBuyParams>;
export type SolanaBuyParams = z.infer<typeof SolanaBuyParams>;