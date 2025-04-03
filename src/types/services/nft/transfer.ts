import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for transferring an NFT
 */
export const BaseTransferParamsSchema = z.object({
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
});

export const EvmTransferParamsSchema = BaseTransferParamsSchema.extend({
  /**
   * The number of NFTs to transfer
   */
  quantity: z.number().optional().describe('The quantity of NFTs to transfer'),
});

export const EvmMultipleTransferParamsSchema = z.object({
  /**
   * The EVM chain to transfer the NFT on
   */
  chain: ZodEvmBlockchain.describe('The chain to transfer the NFT on'),

  /**
   * The recipient's wallet address
   */
  to: z.string().describe("The recipient's wallet address"),

  /**
   * The items (NFTs) to transfer
   */
  items: z.array(EvmTransferParamsSchema).describe('The transfer parameters'),
});

export const SolanaTransferParamsSchema = BaseTransferParamsSchema.extend({
  /**
   * The recipient's wallet address
   */
  to: z.string().describe("The recipient's wallet address"),

  /**
   * Whether the NFT is a compressed NFT
   */
  isCompressed: z.boolean().optional().describe('Whether the NFT is a compressed NFT'),

  /**
   * The priority fee in micro lamports
   */
  priorityFee: z.number().optional().describe('The priority fee in micro lamports'),
});

export type EvmTransferParams = z.infer<typeof EvmMultipleTransferParamsSchema>;
export type SolanaTransferParams = z.infer<typeof SolanaTransferParamsSchema>;

export const TransferParams = z.union([
  EvmMultipleTransferParamsSchema,
  SolanaTransferParamsSchema,
]);
export type TransferParams = z.infer<typeof TransferParams>;
