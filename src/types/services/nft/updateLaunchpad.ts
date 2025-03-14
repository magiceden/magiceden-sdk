import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chain';
import { EvmProtocolType, SolProtocolType, TokenProtocolType } from '../../protocol';
import { SolanaSymbol, zSolanaAddress } from '../../solana/primitives';
import { MAX_NAME_LENGTH, MAX_ROYALTY_BPS, MIN_ROYALTY_BPS, SOL_MAX_NAME_LENGTH } from '../../../constants/nft';
import { EVMAddressToLowerCaseSchema } from '../../evm';
import { MintStages } from './shared';
import { zSolAuthorization } from '../../solana';

/**
 * Parameters for updating a launchpad
 */
export const UpdateLaunchpadParams = {
  collection: EVMAddressToLowerCaseSchema.describe('Collection address/ID'),
  owner: EVMAddressToLowerCaseSchema.describe('Owner wallet address'),
  chain: z.nativeEnum(Blockchain).describe('Blockchain'),
  protocol: TokenProtocolType.describe('Token protocol type'),
  social: z
    .object({
      discordUrl: z.string().optional(),
      externalUrl: z.string().optional(),
      telegramUrl: z.string().optional(),
      twitterUsername: z.string().optional(),
    })
    .optional()
    .describe('Social media links'),
  name: z.string().min(1).max(MAX_NAME_LENGTH).optional().describe('Collection name'),
  imageUrl: z.string().optional().describe('URL pointing to image for the collection'),
  description: z.string().optional().describe('Collection description'),
  royaltyBps: z
    .number()
    .int()
    .min(MIN_ROYALTY_BPS, `Royalty basis points must be at least ${MIN_ROYALTY_BPS}`)
    .max(MAX_ROYALTY_BPS, `Royalty basis points must be at most ${MAX_ROYALTY_BPS}`)
    .optional()
    .describe('Royalty basis points'),
  royaltyRecipients: z
    .array(
      z.object({
        address: z.string().min(1).describe('Royalty recipient address'),
        share: z.number().int().min(1).max(100).describe('Share percentage'),
      }),
    )
    .min(1)
    .refine(
      creators => {
        return creators.reduce((acc, creator) => acc + creator.share, 0) === 100;
      },
      {
        message: "Creator's shares must sum to 100",
      },
    )
    .optional()
    .describe('Royalty recipients and their shares'),
  payoutRecipient: z.string().min(1).optional().describe('Payout recipient address of mint proceeds'),
  nftMetadataUrl: z.string().min(1).optional().describe('JSON file that contains all the metadata'),
  mintStages: MintStages.optional().describe('Mint stages configuration'),
  tokenImageUrl: z.string().min(1).optional().describe('URL for image for the token'),
  tokenId: z.number().int().min(0).optional().describe('Token ID for ERC1155'),
};

export const EvmUpdateLaunchpadParams = z.object({
  ...UpdateLaunchpadParams,
  chain: ZodEvmBlockchain,
  protocol: z.enum([EvmProtocolType.ERC721, EvmProtocolType.ERC1155]),
  message: z.string().describe('Message to sign'),
  signature: z.string().describe('Signature of the message'),
});

export const SolanaUpdateLaunchpadParams = z.object({
  ...UpdateLaunchpadParams,
  chain: z.literal(Blockchain.SOLANA),
  protocol: z.literal(SolProtocolType.METAPLEX_CORE),
  payoutRecipient: zSolanaAddress.describe('Payout recipient address of mint proceeds'),
  payer: zSolanaAddress.describe('Payer address'),
  name: z.string().max(SOL_MAX_NAME_LENGTH).describe('Collection name'),
  symbol: SolanaSymbol.describe('Collection symbol'),
  newSymbol: SolanaSymbol.optional().describe('New collection symbol'),
  candyMachineId: zSolanaAddress.describe('Candy machine ID'),
  owner: zSolanaAddress.describe('Owner address'),
  externalLink: z.string().optional().describe('External link'),
  authorization: zSolAuthorization.describe('Authorization data'),
});

export type EvmUpdateLaunchpadParams = z.infer<typeof EvmUpdateLaunchpadParams>;
export type SolanaUpdateLaunchpadParams = z.infer<typeof SolanaUpdateLaunchpadParams>;
