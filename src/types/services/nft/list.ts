import { SplAmount } from "../../solana";
import { z } from 'zod';

/**
 * Parameters for listing an NFT
 */
export const ListParams = {
  // Generic parameters that can be shared between chains
  tokenAddress: z.string().describe("The NFT token address/mint"),
  price: z.number().describe("The listing price"),
  seller: z.string().describe("The seller's wallet address"),
};

export const EvmListParams = z.object({
  ...ListParams,
  // EVM-specific parameters
});

export const SolanaListParams = z.object({
  ...ListParams,
  // Solana-specific parameters
  auctionHouseAddress: z.string().describe("Auction house address"),
  tokenAccount: z.string().describe("Token account address"),
  // tokenAddress in ListParams maps to tokenMint in V2ListRequest
  // price in ListParams maps to price in V2ListRequest
  // seller in ListParams maps to seller in V2ListRequest
  splPrice: z.custom<SplAmount>().optional().describe("SPL token price details"),
  sellerReferral: z.string().optional().describe("Seller referral address"),
  expiry: z.number().describe("Listing expiry timestamp"),
  prioFeeMicroLamports: z.number().optional().describe("Priority fee in micro lamports"),
  maxPrioFeeLamports: z.number().optional().describe("Maximum priority fee in lamports"),
  exactPrioFeeLamports: z.number().optional().describe("Exact priority fee in lamports"),
  txFeePayer: z.string().optional().describe("Transaction fee payer address"),
});

export type EvmListParams = z.infer<typeof EvmListParams>;
export type SolanaListParams = z.infer<typeof SolanaListParams>;
