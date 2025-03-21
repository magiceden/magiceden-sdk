import { z } from "zod";
import { SplAmount } from "../../solana";
import { ZodEvmBlockchain } from "../../chains";

/**
 * Parameters for buying an NFT
 */
export const BaseBuyParamsSchema = z.object({
  // Generic parameters that can be shared between chains
  token: z.string().describe("The NFT token in the format of <contract address>:<token id> for EVM and <mint address> for Solana"),
});

export const EvmBuyParamsSchema = BaseBuyParamsSchema.extend({
  collection: z.string().optional().describe('Collection to buy.'),
  quantity: z.number().optional().describe('Quantity of tokens to buy.'),
  orderId: z.string().optional().describe('Optional order id to fill.'),
});

export const EvmMultipleBuyParamsSchema = z.object({
  chain: ZodEvmBlockchain.describe('The chain to buy on'),
  currency: z.string().optional().describe('The currency to use for the purchase'),
  currencyChainId: z.number().optional().describe('The chain id of the currency'),
  items: z.array(EvmBuyParamsSchema).describe('The buy parameters'),
});

export const SolanaBuyParamsSchema = BaseBuyParamsSchema.extend({
  // Solana-specific parameters
  // token in BuyParams maps to tokenMint in V2BuyRequest
  seller: z.string().describe("The seller's wallet address"),
  price: z.string().describe("The purchase price"),
  auctionHouseAddress: z.string().describe("Auction house address"),
  tokenATA: z.string().describe("Token associated token account"),
  buyerReferral: z.string().optional().describe("Buyer referral address"),
  sellerReferral: z.string().optional().describe("Seller referral address"),
  buyerExpiry: z.number().optional().describe("Buyer expiry timestamp"),
  sellerExpiry: z.number().describe("Seller expiry timestamp"),
  buyerCreatorRoyaltyPercent: z.number().optional().describe("Buyer creator royalty percentage"),
  splPrice: z.custom<SplAmount>().optional().describe("SPL token price details"),
});

export type EvmBuyParams = z.infer<typeof EvmMultipleBuyParamsSchema>;
export type SolanaBuyParams = z.infer<typeof SolanaBuyParamsSchema>;

export const BuyParams = z.union([EvmMultipleBuyParamsSchema, SolanaBuyParamsSchema]);
export type BuyParams = z.infer<typeof BuyParams>;
