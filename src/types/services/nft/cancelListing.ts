import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for canceling an NFT listing
 */
export const BaseCancelListingParamsSchema = z.object({
  // Generic parameters that can be shared between chains
});

export const EvmCancelListingParamsSchema = BaseCancelListingParamsSchema.extend({
  // EVM-specific parameters
});

export const EvmCancelMultipleListingParamsSchema = z.object({
  /**
   * The EVM chain to cancel the listing on
   */
  chain: ZodEvmBlockchain.describe('The chain to cancel the item offer on'),

  /**
   * The order IDs to cancel
   */
  orderIds: z.array(z.string()).describe('The order IDs to cancel'),
});

export const SolanaCancelListingParamsSchema = BaseCancelListingParamsSchema.extend({
  /**
   * The NFT token address/mint
   */
  token: z.string().describe('The NFT token address/mint'),

  /**
   * The listing price to cancel
   */
  price: z.string().describe('The listing price to cancel'),

  /**
   * The auction house address
   *
   * @default AUCTION_HOUSE_ADDRESS (found in constants/solana/marketplace.ts)
   */
  auctionHouseAddress: z.string().optional().describe('Auction house address'),

  /**
   * The seller referral address
   */
  sellerReferral: z.string().optional().describe('Seller referral address'),

  /**
   * The listing expiry timestamp
   */
  expiry: z.number().optional().describe('Listing expiry timestamp'),

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

export type EvmCancelListingParams = z.infer<typeof EvmCancelMultipleListingParamsSchema>;
export type SolanaCancelListingParams = z.infer<typeof SolanaCancelListingParamsSchema>;

export const CancelListingParams = z.union([
  EvmCancelMultipleListingParamsSchema,
  SolanaCancelListingParamsSchema,
]);
export type CancelListingParams = z.infer<typeof CancelListingParams>;
