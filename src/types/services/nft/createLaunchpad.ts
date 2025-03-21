import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chains';
import { EvmProtocolType, SolProtocolType, TokenProtocolType } from '../../protocol';
import { SolanaSymbol, zSolanaAddress } from '../../solana/primitives';
import { MAX_NAME_LENGTH, MAX_ROYALTY_BPS, MAX_SYMBOL_LENGTH, MIN_ROYALTY_BPS, SOL_MAX_NAME_LENGTH } from '../../../constants/nft';
import { zSolNonFungibleCreator } from '../../solana/nft';
import { MintStages } from './shared';

/**
 * Parameters for creating a launchpad
 */
export const CreateLaunchpadParams = z.object({
  chain: z.nativeEnum(Blockchain).describe('Blockchain to deploy on'),
  protocol: TokenProtocolType.describe('Token protocol type'),
  creator: z.string().min(1).describe('Creator wallet address'),
  social: z
    .object({
      discordUrl: z.string().optional(),
      externalUrl: z.string().optional(),
      telegramUrl: z.string().optional(),
      twitterUsername: z.string().optional(),
    })
    .optional()
    .describe('Social media links'),
  name: z.string().min(1).max(MAX_NAME_LENGTH).describe('Collection name'),
  symbol: z.string().min(1).max(MAX_SYMBOL_LENGTH).describe('Collection symbol'),
  imageUrl: z.string().optional().describe('URL pointing to image for the collection'),
  description: z.string().optional().describe('Collection description'),
  royaltyBps: z
    .number()
    .int()
    .min(MIN_ROYALTY_BPS, `Royalty basis points must be at least ${MIN_ROYALTY_BPS}`)
    .max(MAX_ROYALTY_BPS, `Royalty basis points must be at most ${MAX_ROYALTY_BPS}`)
    .describe('Royalty basis points'),
  royaltyRecipients: z
    .array(
      z.object({
        address: z.string().min(1).describe('Royalty recipient address'),
        share: z.number().int().min(1).max(100).describe('Share percentage'),
      }),
    )
    .min(1)
    .refine((creators) => creators.reduce((acc, creator) => acc + creator.share, 0) === 100, {
      message: "Creator's shares must sum to 100",
    })
    .describe('Royalty recipients and their shares'),
  payoutRecipient: z.string().min(1).describe('Payout recipient address of mint proceeds'),
  nftMetadataUrl: z.string().min(1).optional().describe('JSON file that contains all the metadata'),
  tokenImageUrl: z.string().min(1).optional().describe('URL for image for the token'),
  mintStages: MintStages.describe('Mint stages configuration'),
});

export const EvmCreateLaunchpadParams = CreateLaunchpadParams.extend({
  chain: ZodEvmBlockchain,
  protocol: z.enum([EvmProtocolType.ERC721, EvmProtocolType.ERC1155]),
});

export const SolanaCreateLaunchpadParams = CreateLaunchpadParams.extend({
  chain: z.literal(Blockchain.SOLANA).describe('Blockchain to deploy on'),
  protocol: z.literal(SolProtocolType.METAPLEX_CORE).describe('Token protocol type'),
  payoutRecipient: zSolanaAddress.describe('Payout recipient address of mint proceeds'),
  creator: zSolanaAddress.describe('Creator wallet address'),
  // TODO: Uncomment the accounts once we properly implement a way for signerPubkeys to sign the VersionedTransaction
  // See the comments in src/adapters/transactions/solana.ts for more details
  // accounts: z
  //   .object({
  //     collectionAccount: zSolanaAddress,
  //     configAccount: zSolanaAddress,
  //     orderInfoAccount: zSolanaAddress,
  //   })
  //   .optional()
  //   .describe('Accounts for the launchpad'),
  name: z.string().max(SOL_MAX_NAME_LENGTH).describe('Collection name'),
  symbol: SolanaSymbol.describe('Collection symbol'),
  royaltyRecipients: z
    .array(zSolNonFungibleCreator)
    .min(1)
    .max(4)
    .refine(
      (creators) => {
        return creators.reduce((acc, creator) => acc + creator.share, 0) === 100;
      },
      {
        message: "Creator's shares must sum to 100",
      },
    )
    .describe('Royalty recipients and their shares'),
  isOpenEdition: z.boolean().describe('Whether the collection is an open edition'),
});

export type EvmCreateLaunchpadParams = z.infer<typeof EvmCreateLaunchpadParams>;
export type SolanaCreateLaunchpadParams = z.infer<typeof SolanaCreateLaunchpadParams>;
