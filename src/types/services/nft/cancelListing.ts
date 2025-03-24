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
  chain: ZodEvmBlockchain.describe('The chain to cancel the item offer on'),
  orderIds: z.array(z.string()).describe('The order IDs to cancel'),
});

export const SolanaCancelListingParamsSchema = BaseCancelListingParamsSchema.extend({
  // Solana-specific parameters
  token: z.string().describe('The NFT token address/mint'),
  price: z.string().describe('The listing price to cancel'),
  auctionHouseAddress: z.string().describe('Auction house address'),
  tokenAccount: z.string().describe('Token account address'),
  sellerReferral: z.string().optional().describe('Seller referral address'),
  expiry: z.number().describe('Listing expiry timestamp'),
  prioFeeMicroLamports: z.number().optional().describe('Priority fee in micro lamports'),
  maxPrioFeeLamports: z.number().optional().describe('Maximum priority fee in lamports'),
  exactPrioFeeLamports: z.number().optional().describe('Exact priority fee in lamports'),
});

export type EvmCancelListingParams = z.infer<typeof EvmCancelMultipleListingParamsSchema>;
export type SolanaCancelListingParams = z.infer<typeof SolanaCancelListingParamsSchema>;

export const CancelListingParams = z.union([
  EvmCancelMultipleListingParamsSchema,
  SolanaCancelListingParamsSchema,
]);
export type CancelListingParams = z.infer<typeof CancelListingParams>;
