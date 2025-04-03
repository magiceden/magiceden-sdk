import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chains';
import { EvmProtocolType } from '../../protocol';
import { SolanaSymbol, zSolanaAddress } from '../../solana/primitives';
import { MintStageKind } from './shared';

/**
 * Parameters for minting NFTs
 */
export const BaseMintParamsSchema = z.object({
  /**
   * The chain to mint on
   */
  chain: z.nativeEnum(Blockchain).describe('Chain to mint on'),

  /**
   * The collection ID to mint from
   */
  collectionId: z.string().describe('Collection ID to mint from'),

  /**
   * The number of NFTs to mint
   */
  nftAmount: z.number().int().min(1).describe('Number of NFTs to mint'),

  /**
   * The ID of the mint stage
   */
  stageId: z.string().optional().describe('ID of the mint stage'),

  /**
   * The kind of mint stage
   */
  kind: z.nativeEnum(MintStageKind).describe('Kind of mint stage'),
});

export const EvmMintParamsSchema = BaseMintParamsSchema.extend({
  /**
   * The EVM chain to mint on
   */
  chain: ZodEvmBlockchain.describe('Chain to mint on'),

  /**
   * The token protocol type
   */
  protocol: z.nativeEnum(EvmProtocolType).describe('Token protocol type'),

  /**
   * The token ID for ERC-1155
   */
  tokenId: z.number().int().optional().describe('Token ID for ERC-1155'),
});

export const SolanaMintParamsSchema = BaseMintParamsSchema.extend({
  /**
   * The Solana chain to mint on
   */
  chain: z.literal(Blockchain.SOLANA).describe('Chain to mint on'),

  /**
   * The candy machine ID
   */
  candyMachineId: zSolanaAddress.describe('Candy machine ID'),
  /**
   * The collection symbol
   */
  symbol: SolanaSymbol.describe('Collection symbol'),

  /**
   * The recipient address
   */
  recipient: zSolanaAddress
    .optional()
    .describe('Recipient address (if not specified, then recipient === payer)'),

  /**
   * The number of NFTs to mint
   */
  nftAmount: z.number().int().min(1).max(5).describe('Number of NFTs to mint (max 5 for Solana)'),
});

export type EvmMintParams = z.infer<typeof EvmMintParamsSchema>;
export type SolanaMintParams = z.infer<typeof SolanaMintParamsSchema>;

export const MintParams = z.union([EvmMintParamsSchema, SolanaMintParamsSchema]);
export type MintParams = z.infer<typeof MintParams>;
