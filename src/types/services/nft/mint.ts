import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chain';
import { EvmProtocolType } from '../../protocol';
import { SolanaSymbol, zSolanaAddress } from '../../solana/primitives';
import { MintStageKind } from './shared';

/**
 * Parameters for minting NFTs
 */
export const MintParams = {
  chain: z.nativeEnum(Blockchain).describe('Blockchain to mint on'),
  collectionId: z.string().describe('Collection ID to mint from'),
  wallet: z.string().describe('Wallet address to mint with'),
  nftAmount: z.number().int().min(1).describe('Number of NFTs to mint'),
  stageId: z.string().optional().describe('ID of the mint stage'),
  kind: z.nativeEnum(MintStageKind).describe('Kind of mint stage'),
};

export const EvmMintParams = z.object({
  ...MintParams,
  chain: ZodEvmBlockchain,
  protocol: z.nativeEnum(EvmProtocolType).describe('Token protocol type'),
  tokenId: z.number().int().optional().describe('Token ID for ERC-1155'),
});

export const SolanaMintParams = z.object({
  ...MintParams,
  chain: z.literal(Blockchain.SOLANA),
  candyMachineId: zSolanaAddress.describe('Candy machine ID'),
  symbol: SolanaSymbol.describe('Collection symbol'),
  payer: zSolanaAddress.describe('Payer address'),
  recipient: zSolanaAddress.optional().describe('Recipient address (if not specified, then recipient === payer)'),
  nftAmount: z.number().int().min(1).max(5).describe('Number of NFTs to mint (max 5 for Solana)'),
});

export type EvmMintParams = z.infer<typeof EvmMintParams>;
export type SolanaMintParams = z.infer<typeof SolanaMintParams>;
