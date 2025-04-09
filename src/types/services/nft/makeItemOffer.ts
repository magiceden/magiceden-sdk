import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for making an offer on an NFT
 */
export const BaseMakeItemOfferParamsSchema = z.object({
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

  /**
   * The listing price
   *
   * - For EVM, the price is in the smallest unit of the token (e.g. Wei for ETH)
   * - For Solana, the price is in lamports
   */
  price: z.string().describe('The offer price'),

  /**
   * The offer expiry timestamp
   */
  expiry: z.number().optional().describe('Offer expiry timestamp (Unix timestamp in seconds)'),
});

export const EvmMakeItemOfferParamsSchema = BaseMakeItemOfferParamsSchema.extend({
  /**
   * The number of NFTs to bid on
   */
  quantity: z.number().optional().describe('Number of NFTs to bid on'),

  /**
   * Whether to automatically set royalty amounts and recipients
   */
  automatedRoyalties: z
    .boolean()
    .optional()
    .describe('If true, royalty amounts and recipients will be set automatically'),

  /**
   * The maximum amount of royalties to pay in basis points (1 BPS = 0.01%)
   */
  royaltyBps: z
    .number()
    .optional()
    .describe('Maximum amount of royalties to pay in basis points (1 BPS = 0.01%)'),

  /**
   * The currency address for the offer
   */
  currency: z
    .string()
    .optional()
    .describe("Currency address for the offer (defaults to chain's native wrapped token)"),
});

export const EvmMultipleMakeItemOfferParamsSchema = z.object({
  /**
   * The EVM chain to make the offer on
   */
  chain: ZodEvmBlockchain.describe('The chain to make the offer on'),

  /**
   * The make item offer parameters
   */
  params: z.array(EvmMakeItemOfferParamsSchema).describe('The make item offer parameters'),
});

export const SolanaMakeItemOfferParamsSchema = BaseMakeItemOfferParamsSchema.extend({
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
   * Whether to use buy v2
   */
  useBuyV2: z.boolean().optional().describe('Whether to use buy v2'),

  /**
   * The buyer creator royalty percentage
   */
  buyerCreatorRoyaltyPercent: z.number().optional().describe('Buyer creator royalty percentage'),

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

export type EvmMakeItemOfferParams = z.infer<typeof EvmMultipleMakeItemOfferParamsSchema>;
export type SolanaMakeItemOfferParams = z.infer<typeof SolanaMakeItemOfferParamsSchema>;

export const MakeItemOfferParams = z.union([
  EvmMultipleMakeItemOfferParamsSchema,
  SolanaMakeItemOfferParamsSchema,
]);
export type MakeItemOfferParams = z.infer<typeof MakeItemOfferParams>;
