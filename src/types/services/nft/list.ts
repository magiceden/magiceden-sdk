import { ZodEvmBlockchain } from '../../chains';
import { SplAmount } from '../../solana';
import { z } from 'zod';

/**
 * Parameters for listing an NFT
 */
export const ListParams = z.object({
  // Generic parameters that can be shared between chains
  token: z
    .string()
    .describe(
      'The NFT token in the format of <contract address>:<token id> for EVM and <mint address> for Solana',
    ),
  price: z.number().describe('The listing price'),
});

export const EvmListParams = ListParams.extend({
  chain: ZodEvmBlockchain,
  price: z.string().min(1, 'Listing price in wei is required').describe('Listing price in wei'),
  expirationTime: z.string().optional().describe('Optional listing expiration time (epoch)'),
});

export const SolanaListParams = ListParams.extend({
  // Solana-specific parameters
  auctionHouseAddress: z.string().describe('Auction house address'),
  // token in ListParams maps to tokenMint and tokenAccount in V2ListRequest
  // price in ListParams maps to price in V2ListRequest
  // seller in ListParams maps to seller in V2ListRequest
  splPrice: z.custom<SplAmount>().optional().describe('SPL token price details'),
  sellerReferral: z.string().optional().describe('Seller referral address'),
  expiry: z.number().describe('Listing expiry timestamp'),
  prioFeeMicroLamports: z.number().optional().describe('Priority fee in micro lamports'),
  maxPrioFeeLamports: z.number().optional().describe('Maximum priority fee in lamports'),
  exactPrioFeeLamports: z.number().optional().describe('Exact priority fee in lamports'),
  txFeePayer: z.string().optional().describe('Transaction fee payer address'),
});

export type EvmListParams = z.infer<typeof EvmListParams>;
export type SolanaListParams = z.infer<typeof SolanaListParams>;
