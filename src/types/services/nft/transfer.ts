import { z } from "zod";

/**
 * Parameters for transferring an NFT
 */
export const TransferParams = {
  identifier: z.string(),
  recipient: z.string(),
};

export const EvmTransferParams = z.object({
  ...TransferParams,
});

export const SolanaTransferParams = z.object({
  ...TransferParams,
  
  // Solana-specific parameters
  tokenAccount: z.string().optional(),
  prioFeeMicroLamports: z.number().optional(),
});

export type EvmTransferParams = z.infer<typeof EvmTransferParams>;
export type SolanaTransferParams = z.infer<typeof SolanaTransferParams>;