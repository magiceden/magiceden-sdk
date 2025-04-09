import { z } from 'zod';
import { SplAmount } from '../../solana';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for buying an NFT
 */
export const BaseBuyParamsSchema = z.object({
  /**
   * The NFT token
   *
   * - For EVM, the token is in the format of contractAddress:tokenId
   * - For Solana, the token is the mint address
   */
  token: z
    .string()
    .describe(
      'The NFT token in the format of contractAddress:tokenId for EVM and <mint address> for Solana',
    ),
});

export const EvmBuyParamsSchema = BaseBuyParamsSchema.extend({
  /**
   * The collection to buy
   */
  collection: z.string().optional().describe('Collection to buy.'),

  /**
   * The number of NFTs to buy
   */
  quantity: z.number().optional().describe('The number of NFTs to buy.'),

  /**
   * The order id to fill
   */
  orderId: z.string().optional().describe('Optional order id to fill.'),
});

export const EvmMultipleBuyParamsSchema = z.object({
  /**
   * The EVM chain to buy on
   */
  chain: ZodEvmBlockchain.describe('The chain to buy on'),

  /**
   * The currency to use for the purchase
   */
  currency: z.string().optional().describe('The currency to use for the purchase'),

  /**
   * The chain id of the currency
   */
  currencyChainId: z.number().optional().describe('The chain id of the currency'),

  /**
   * The buy parameters
   */
  items: z.array(EvmBuyParamsSchema).describe('The buy parameters'),
});

export const SolanaBuyParamsSchema = BaseBuyParamsSchema.extend({
  /**
   * The seller's wallet address
   */
  seller: z.string().describe("The seller's wallet address"),

  /**
   * The purchase price
   */
  price: z.string().describe('The purchase price'),

  /**
   * The auction house address
   *
   * @default AUCTION_HOUSE_ADDRESS (found in constants/solana/marketplace.ts)
   */
  auctionHouseAddress: z.string().optional().describe('Auction house address'),

  /**
   * The buyer referral address
   */
  buyerReferral: z.string().optional().describe('Buyer referral address'),

  /**
   * The seller referral address
   */
  sellerReferral: z.string().optional().describe('Seller referral address'),

  /**
   * The buyer expiry timestamp
   */
  buyerExpiry: z.number().optional().describe('Buyer expiry timestamp'),

  /**
   * The seller expiry timestamp
   */
  sellerExpiry: z.number().optional().describe('Seller expiry timestamp'),

  /**
   * The buyer creator royalty percentage
   */
  buyerCreatorRoyaltyPercent: z.number().optional().describe('Buyer creator royalty percentage'),

  /**
   * The SPL token price details
   */
  splPrice: z.custom<SplAmount>().optional().describe('SPL token price details'),
});

export type EvmBuyParams = z.infer<typeof EvmMultipleBuyParamsSchema>;
export type SolanaBuyParams = z.infer<typeof SolanaBuyParamsSchema>;

export const BuyParams = z.union([EvmMultipleBuyParamsSchema, SolanaBuyParamsSchema]);
export type BuyParams = z.infer<typeof BuyParams>;
