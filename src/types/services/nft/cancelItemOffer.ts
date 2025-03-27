import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for canceling an offer
 */
export const BaseCancelItemOfferParamsSchema = z.object({
  // Generic parameters that can be shared between chains
});

export const EvmCancelItemOfferParamsSchema = BaseCancelItemOfferParamsSchema.extend({
  // EVM-specific parameters
});

export const EvmCancelMultipleItemOfferParamsSchema = z.object({
  /**
   * The EVM chain to cancel the item offer on
   */
  chain: ZodEvmBlockchain.describe('The chain to cancel the item offer on'),

  /**
   * The order IDs to cancel
   */
  orderIds: z.array(z.string()).describe('The order IDs to cancel'),
});

export const SolanaCancelItemOfferParamsSchema = BaseCancelItemOfferParamsSchema.extend({
  /**
   * The NFT token address/mint
   */
  token: z.string().describe('The NFT token address/mint'),

  /**
   * The offer price to cancel
   */
  price: z.string().describe('The offer price to cancel'),

  /**
   * The offer expiry timestamp
   */
  expiry: z.number().optional().describe('Offer expiry timestamp'),

  /**
   * The auction house address
   */
  auctionHouseAddress: z.string().optional().describe('Auction house address'),

  /**
   * The buyer referral address
   */
  buyerReferral: z.string().optional().describe('Buyer referral address'),

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

export type EvmCancelItemOfferParams = z.infer<typeof EvmCancelMultipleItemOfferParamsSchema>;
export type SolanaCancelItemOfferParams = z.infer<typeof SolanaCancelItemOfferParamsSchema>;

export const CancelItemOfferParams = z.union([
  EvmCancelMultipleItemOfferParamsSchema,
  SolanaCancelItemOfferParamsSchema,
]);
export type CancelItemOfferParams = z.infer<typeof CancelItemOfferParams>;
