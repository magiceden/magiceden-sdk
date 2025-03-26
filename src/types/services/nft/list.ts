import { ZodEvmBlockchain } from '../../chains';
import { SplAmount } from '../../solana';
import { z } from 'zod';

/**
 * Parameters for listing an NFT
 */
export const BaseListParamsSchema = z.object({
  // Generic parameters that can be shared between chains
  token: z
    .string()
    .describe(
      'The NFT token in the format of <contract address>:<token id> for EVM and <mint address> for Solana',
    ),
  price: z.string().describe('The listing price'),
  expiry: z.number().optional().describe('Listing expiration time (Unix timestamp in seconds)'),
});

export const EvmListParamsSchema = BaseListParamsSchema.extend({});

export const EvmMultipleListParamsSchema = z.object({
  chain: ZodEvmBlockchain.describe('The chain to list on'),
  params: z.array(EvmListParamsSchema).describe('The list parameters'),
});

export const SolanaListParamsSchema = BaseListParamsSchema.extend({
  // Solana-specific parameters
  auctionHouseAddress: z.string().optional().describe('Auction house address'),
  // token in ListParams maps to tokenMint and tokenAccount in V2ListRequest
  // price in ListParams maps to price in V2ListRequest
  // seller in ListParams maps to seller in V2ListRequest
  splPrice: z.custom<SplAmount>().optional().describe('SPL token price details'),
  sellerReferral: z.string().optional().describe('Seller referral address'),
  prioFeeMicroLamports: z.number().optional().describe('Priority fee in micro lamports'),
  maxPrioFeeLamports: z.number().optional().describe('Maximum priority fee in lamports'),
  exactPrioFeeLamports: z.number().optional().describe('Exact priority fee in lamports'),
  txFeePayer: z.string().optional().describe('Transaction fee payer address'),
});

export type EvmListParams = z.infer<typeof EvmMultipleListParamsSchema>;
export type SolanaListParams = z.infer<typeof SolanaListParamsSchema>;

export const ListParams = z.union([EvmMultipleListParamsSchema, SolanaListParamsSchema]);
export type ListParams = z.infer<typeof ListParams>;
