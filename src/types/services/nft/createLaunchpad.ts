import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chains';
import { EvmProtocolType, SolProtocolType, TokenProtocolType } from '../../protocol';
import { SolanaSymbol, zSolanaAddress } from '../../solana/primitives';
import {
  MAX_NAME_LENGTH,
  MAX_ROYALTY_BPS,
  MAX_SYMBOL_LENGTH,
  MIN_ROYALTY_BPS,
  SOL_MAX_NAME_LENGTH,
} from '../../../constants/nft';
import { zSolNonFungibleCreator } from '../../solana/nft';
import { MintStages } from './shared';

/**
 * Parameters for creating a launchpad
 */
export const BaseCreateLaunchpadParamsSchema = z.object({
  /**
   * The blockchain to deploy on.
   */
  chain: z.nativeEnum(Blockchain).describe('Blockchain to deploy on'),

  /**
   * The protocol to use for the token.
   */
  protocol: TokenProtocolType.describe('Token protocol type'),

  /**
   * The creator wallet address.
   */
  creator: z.string().min(1).describe('Creator wallet address'),

  /**
   * The collection name.
   */
  name: z.string().min(1).max(MAX_NAME_LENGTH).describe('Collection name'),

  /**
   * The collection symbol.
   */
  symbol: z.string().min(1).max(MAX_SYMBOL_LENGTH).describe('Collection symbol'),
  
  /**
   * URL pointing to the collection image.
   * For all collections, this image represents the entire collection.
   * For open editions, this is also used as the default image for individual NFTs if tokenImageUrl is not provided.
   */
  imageUrl: z.string().optional().describe('URL pointing to image for the collection'),

  /**
   * The collection description.
   */
  description: z.string().optional().describe('Collection description'),

  /**
   * The royalty basis points.
   */
  royaltyBps: z
    .number()
    .int()
    .min(MIN_ROYALTY_BPS, `Royalty basis points must be at least ${MIN_ROYALTY_BPS}`)
    .max(MAX_ROYALTY_BPS, `Royalty basis points must be at most ${MAX_ROYALTY_BPS}`)
    .describe('Royalty basis points'),

  /**
   * The royalty recipients and their shares.
   */
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

  /**
   * The payout recipient address of mint proceeds.
   */
  payoutRecipient: z.string().min(1).describe('Payout recipient address of mint proceeds'),

  /**
   * For non-open editions: Required URL pointing to a directory containing metadata JSON files for each NFT (0.json, 1.json, etc.).
   * Each JSON file should include its own image URL for that specific NFT.
   * 
   * For open editions: Optional URL for additional metadata.
   */
  nftMetadataUrl: z.string().min(1).optional().describe('JSON file that contains all the metadata'),

  /**
   * For open editions only: URL pointing to the image used for all NFTs in the open edition.
   * If not provided for open editions, imageUrl will be used instead.
   * Not used for non-open editions, as individual NFT images are defined in the metadata files at nftMetadataUrl.
   * 
   * This will be ignored for non-open editions.
   */
  tokenImageUrl: z.string().min(1).optional().describe('URL for image for the token'),

  /**
   * The mint stages.
   */
  mintStages: MintStages.describe('Mint stages configuration'),
});

export const EvmCreateLaunchpadParamsSchema = BaseCreateLaunchpadParamsSchema.extend({
  /**
   * The blockchain to deploy on.
   */
  chain: ZodEvmBlockchain,

  /**
   * The protocol to use for the token.
   */
  protocol: z.enum([EvmProtocolType.ERC721, EvmProtocolType.ERC1155]),
});

export const SolanaCreateLaunchpadParamsSchema = BaseCreateLaunchpadParamsSchema.extend({
  /**
   * The blockchain to deploy on.
   */
  chain: z.literal(Blockchain.SOLANA).describe('Blockchain to deploy on'),

  /**
   * The protocol to use for the token.
   */
  protocol: z.literal(SolProtocolType.METAPLEX_CORE).describe('Token protocol type'),

  /**
   * The payout recipient address of mint proceeds.
   */
  payoutRecipient: zSolanaAddress.describe('Payout recipient address of mint proceeds'),

  /**
   * The creator wallet address.
   */
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

  /**
   * The social media links.
   * 
   * Currently only works on Solana. EVM is not yet supported.
   */
  social: z
    .object({
      discordUrl: z.string().optional(),
      externalUrl: z.string().optional(),
      telegramUrl: z.string().optional(),
      twitterUsername: z.string().optional(),
    })
    .optional()
    .describe('Social media links'),

  /**
   * The collection name.
   */
  name: z.string().max(SOL_MAX_NAME_LENGTH).describe('Collection name'),

  /**
   * The collection symbol.
   */
  symbol: SolanaSymbol.describe('Collection symbol'),

  /**
   * The royalty recipients and their shares.
   */
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

  /**
   * Whether the collection is an open edition.
   */
  isOpenEdition: z.boolean().describe('Whether the collection is an open edition'),
});

export type EvmCreateLaunchpadParams = z.infer<typeof EvmCreateLaunchpadParamsSchema>;
export type SolanaCreateLaunchpadParams = z.infer<typeof SolanaCreateLaunchpadParamsSchema>;

export const CreateLaunchpadParams = z.union([
  EvmCreateLaunchpadParamsSchema,
  SolanaCreateLaunchpadParamsSchema,
]);
export type CreateLaunchpadParams = z.infer<typeof CreateLaunchpadParams>;
