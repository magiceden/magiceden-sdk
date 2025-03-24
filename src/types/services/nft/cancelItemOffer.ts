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
  chain: ZodEvmBlockchain.describe('The chain to cancel the item offer on'),
  orderIds: z.array(z.string()).describe('The order IDs to cancel'),
});

export const SolanaCancelItemOfferParamsSchema = BaseCancelItemOfferParamsSchema.extend({
  // Solana-specific parameters
  token: z.string().describe('The NFT token address/mint'),
  price: z.string().describe('The offer price to cancel'),
  expiry: z.number().optional().describe('Offer expiry timestamp'),
  auctionHouseAddress: z.string().describe('Auction house address'),
  buyerReferral: z.string().optional().describe('Buyer referral address'),
  prioFeeMicroLamports: z.number().optional().describe('Priority fee in micro lamports'),
  maxPrioFeeLamports: z.number().optional().describe('Maximum priority fee in lamports'),
  exactPrioFeeLamports: z.number().optional().describe('Exact priority fee in lamports'),
});

export type EvmCancelItemOfferParams = z.infer<typeof EvmCancelMultipleItemOfferParamsSchema>;
export type SolanaCancelItemOfferParams = z.infer<typeof SolanaCancelItemOfferParamsSchema>;

export const CancelItemOfferParams = z.union([
  EvmCancelMultipleItemOfferParamsSchema,
  SolanaCancelItemOfferParamsSchema,
]);
export type CancelItemOfferParams = z.infer<typeof CancelItemOfferParams>;
