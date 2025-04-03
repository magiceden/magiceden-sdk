import { ZodEvmBlockchain } from '../../chains';
import { SplAmount } from '../../solana';
import { z } from 'zod';

/**
 * Parameters for listing an NFT
 */
export const BaseListParamsSchema = z.object({
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

  /**
   * The listing price
   *
   * - For EVM, the price is in the smallest unit of the token (e.g. Wei for ETH)
   * - For Solana, the price is in lamports
   */
  price: z.string().describe('The listing price'),
  
  /**
   * The listing expiration time
   *
   * - For EVM, the expiration time is in seconds
   * - For Solana, the expiration time is in seconds
   */
  expiry: z.number().optional().describe('Listing expiration time (Unix timestamp in seconds)'),
});

export const EvmListParamsSchema = BaseListParamsSchema.extend({});

export const EvmMultipleListParamsSchema = z.object({
  /**
   * The EVM chain to list on
   */
  chain: ZodEvmBlockchain.describe('The chain to list on'),
  /**
   * The list parameters
   */
  params: z.array(EvmListParamsSchema).describe('The list parameters'),
});

export const SolanaListParamsSchema = BaseListParamsSchema.extend({
  /**
   * The auction house address
   *
   * @default AUCTION_HOUSE_ADDRESS (found in constants/solana/marketplace.ts)
   */
  auctionHouseAddress: z.string().optional().describe('Auction house address'),

  /**
   * The token account.
   * 
   * Required when using legacy NFTs. When using MPL Core, this can be left empty.
   */
  tokenAccount: z.string().optional().describe('The token account'),

  /**
   * The SPL token price details
   */
  splPrice: z.custom<SplAmount>().optional().describe('SPL token price details'),

  /**
   * The seller referral address
   */
  sellerReferral: z.string().optional().describe('Seller referral address'),

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

  /**
   * The transaction fee payer address
   */
  txFeePayer: z.string().optional().describe('Transaction fee payer address'),
});

export type EvmListParams = z.infer<typeof EvmMultipleListParamsSchema>;
export type SolanaListParams = z.infer<typeof SolanaListParamsSchema>;

export const ListParams = z.union([EvmMultipleListParamsSchema, SolanaListParamsSchema]);
export type ListParams = z.infer<typeof ListParams>;
