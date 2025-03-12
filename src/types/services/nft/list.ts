import { SplAmount } from "../../solana";
import { z } from 'zod';

/**
 * Parameters for listing an NFT
 */
export const ListParams = {
  seller: z.string(),
  tokenAddress: z.string(),
};

export const EvmListParams = z.object({
  ...ListParams,
});

export const SolanaListParams = z.object({
  ...ListParams,

  auctionHouseAddress: z.string(),
  tokenAccount: z.string(),
  price: z.number(),
  // Mint address of the SPL token to list for.
  // If not specified, SOL is assumed.
  splPrice: z.custom<SplAmount>(),
  sellerReferral: z.string().optional(),
  expiry: z.number(),
  prioFeeMicroLamports: z.number().optional(),
  maxPrioFeeLamports: z.number().optional(),
  exactPrioFeeLamports: z.number().optional(),

  // Transaction fee payer
  txFeePayer: z.string().optional(),
});

export type EvmListParams = z.infer<typeof EvmListParams>;
export type SolanaListParams = z.infer<typeof SolanaListParams>;
