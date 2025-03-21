import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for transferring an NFT
 */
export const TransferParams = z.object({
  // Generic parameters that can be shared between chains
  token: z
    .string()
    .describe(
      'The NFT token in the format of <contract address>:<token id> for EVM and <mint address> for Solana',
    ),
});

export const EvmTransferParams = TransferParams.extend({
  // EVM-specific parameters
  quantity: z.number().optional().describe('The quantity of NFTs to transfer'),
});

export const EvmTransferParamsWithExtras = z.object({
  chain: ZodEvmBlockchain.describe('The chain to transfer the NFT on'),
  to: z.string().describe("The recipient's wallet address"),
  items: z.array(EvmTransferParams).describe('The transfer parameters'),
});

export const SolanaTransferParams = TransferParams.extend({
  // Solana-specific parameters
  // token in TransferParams maps to mint in V2TransferRequest
  to: z.string().describe("The recipient's wallet address"),
  isCompressed: z.boolean().optional().describe('Whether the NFT is compressed'),
});

export type EvmTransferParams = z.infer<typeof EvmTransferParamsWithExtras>;
export type SolanaTransferParams = z.infer<typeof SolanaTransferParams>;
