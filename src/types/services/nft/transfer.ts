import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for transferring an NFT
 */
export const BaseTransferParamsSchema = z.object({
  // Generic parameters that can be shared between chains
  token: z
    .string()
    .describe(
      'The NFT token in the format of <contract address>:<token id> for EVM and <mint address> for Solana',
    ),
});

export const EvmTransferParamsSchema = BaseTransferParamsSchema.extend({
  // EVM-specific parameters
  quantity: z.number().optional().describe('The quantity of NFTs to transfer'),
});

export const EvmMultipleTransferParamsSchema = z.object({
  chain: ZodEvmBlockchain.describe('The chain to transfer the NFT on'),
  to: z.string().describe("The recipient's wallet address"),
  items: z.array(EvmTransferParamsSchema).describe('The transfer parameters'),
});

export const SolanaTransferParamsSchema = BaseTransferParamsSchema.extend({
  // Solana-specific parameters
  // token in TransferParams maps to mint in V2TransferRequest
  to: z.string().describe("The recipient's wallet address"),
  isCompressed: z.boolean().optional().describe('Whether the NFT is compressed'),
});

export type EvmTransferParams = z.infer<typeof EvmMultipleTransferParamsSchema>;
export type SolanaTransferParams = z.infer<typeof SolanaTransferParamsSchema>;

export const TransferParams = z.union([
  EvmMultipleTransferParamsSchema,
  SolanaTransferParamsSchema,
]);
export type TransferParams = z.infer<typeof TransferParams>;
