import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for taking an NFT offer
 */
export const BaseTakeItemOfferParamsSchema = z.object({
  /**
   * The NFT token
   *
   * - For EVM, the token is in the format of <contract address>:<token id>
   * - For Solana, the token is the mint address
   */
  token: z
    .string()
    .describe(
      'The NFT token in the format of <contract address>:<token id> for EVM and <mint address> for Solana',
    ),
});

export const EvmTakeItemOfferParamsSchema = BaseTakeItemOfferParamsSchema.extend({
  /**
   * The number of tokens to sell
   */
  quantity: z.number().optional().describe('The number of tokens to sell.'),

  /**
   * The order ID to sell into
   */
  orderId: z.string().optional().describe('Optional order id to sell into.'),
});

export const EvmMultipleTakeItemOfferParamsSchema = z.object({
  /**
   * The EVM chain to take the item offer on
   */
  chain: ZodEvmBlockchain.describe('The chain to take the item offer on'),

  /**
   * The take item offer parameters
   */
  items: z.array(EvmTakeItemOfferParamsSchema).describe('The take item offer parameters'),
});

export const SolanaTakeItemOfferParamsSchema = BaseTakeItemOfferParamsSchema.extend({
  /**
   * The buyer's wallet address
   */
  buyer: z.string().describe("The buyer's wallet address"),

  /**
   * The original offer price
   */
  price: z.string().describe('The original offer price'),

  /**
   * The new price to accept
   */
  newPrice: z.string().describe('The new price to accept'),

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
   * The priority fee in micro lamports
   */
  prioFeeMicroLamports: z.number().optional().describe('Priority fee in micro lamports'),

  /**
   * The maximum priority fee in lamports
   */
  maxPrioFeeLamports: z.number().optional().describe('Maximum priority fee in lamports'),

  /**
   * The exact priority fee in lamports
   */
  exactPrioFeeLamports: z.number().optional().describe('Exact priority fee in lamports'),
});

export type EvmTakeItemOfferParams = z.infer<typeof EvmMultipleTakeItemOfferParamsSchema>;
export type SolanaTakeItemOfferParams = z.infer<typeof SolanaTakeItemOfferParamsSchema>;

export const TakeItemOfferParams = z.union([
  EvmMultipleTakeItemOfferParamsSchema,
  SolanaTakeItemOfferParamsSchema,
]);
export type TakeItemOfferParams = z.infer<typeof TakeItemOfferParams>;
