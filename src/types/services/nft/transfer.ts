import { z } from "zod";

/**
 * Parameters for transferring an NFT
 */
export const TransferParams = {
  // Generic parameters that can be shared between chains
  tokenAddress: z.string().describe("The NFT token address/mint"),
  from: z.string().describe("The sender's wallet address"),
  to: z.string().describe("The recipient's wallet address"),
};

export const EvmTransferParams = z.object({
  ...TransferParams,
  // EVM-specific parameters
});

export const SolanaTransferParams = z.object({
  ...TransferParams,
  // Solana-specific parameters
  // tokenAddress in TransferParams maps to mint in V2TransferRequest
  // from in TransferParams maps to from in V2TransferRequest
  // to in TransferParams maps to to in V2TransferRequest
  isCompressed: z.boolean().optional().describe("Whether the NFT is compressed"),
});

export type EvmTransferParams = z.infer<typeof EvmTransferParams>;
export type SolanaTransferParams = z.infer<typeof SolanaTransferParams>;