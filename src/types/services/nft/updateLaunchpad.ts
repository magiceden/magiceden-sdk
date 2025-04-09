import { z } from 'zod';
import { Blockchain, ZodEvmBlockchain } from '../../chains';
import { EvmProtocolType, SolProtocolType, TokenProtocolType } from '../../protocol';
import { SolanaSymbol, zSolanaAddress } from '../../solana/primitives';
import {
  MAX_NAME_LENGTH,
  MAX_ROYALTY_BPS,
  MIN_ROYALTY_BPS,
  SOL_MAX_NAME_LENGTH,
} from '../../../constants/nft';
import { EVMAddressToLowerCaseSchema, zEVMAddress } from '../../evm';
import { MintStages } from './shared';
import { zSolNonFungibleCreator } from '../../solana';

/**
 * Parameters for updating a launchpad
 */
export const BaseUpdateLaunchpadParamsSchema = z.object({
  /**
   * The collection address/ID to update.
   */
  collectionId: z.string().describe('Collection address/ID'),
  
  /**
   * The owner wallet address.
   */
  owner: EVMAddressToLowerCaseSchema.describe('Owner wallet address'),
  
  /**
   * The blockchain where the collection is deployed.
   */
  chain: z.nativeEnum(Blockchain).describe('Blockchain'),
  
  /**
   * The protocol used for the token.
   */
  protocol: TokenProtocolType.describe('Token protocol type'),
  
  /**
   * The social media links.
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
  name: z.string().min(1).max(MAX_NAME_LENGTH).optional().describe('Collection name'),
  
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
    .optional()
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
    .refine(
      (creators) => {
        return creators.reduce((acc, creator) => acc + creator.share, 0) === 100;
      },
      {
        message: "Creator's shares must sum to 100",
      },
    )
    .optional()
    .describe('Royalty recipients and their shares'),
  
  /**
   * The payout recipient address of mint proceeds.
   */
  payoutRecipient: z
    .string()
    .min(1)
    .optional()
    .describe('Payout recipient address of mint proceeds'),
  
  /**
   * For non-open editions: Required URL pointing to a directory containing metadata JSON files for each NFT (0.json, 1.json, etc.).
   * Each JSON file should include its own image URL for that specific NFT.
   * 
   * For open editions: Optional URL for additional metadata.
   */
  nftMetadataUrl: z.string().min(1).optional().describe('JSON file that contains all the metadata'),
  
  /**
   * The mint stages.
   */
  mintStages: MintStages.optional().describe('Mint stages configuration'),
  
  /**
   * For open editions only: URL pointing to the image used for all NFTs in the open edition.
   * If not provided for open editions, imageUrl will be used instead.
   * Not used for non-open editions, as individual NFT images are defined in the metadata files at nftMetadataUrl.
   * 
   * This will be ignored for non-open editions.
   */
  tokenImageUrl: z.string().min(1).optional().describe('URL for image for the token'),
  
  /**
   * Token ID for ERC1155.
   */
  tokenId: z.number().int().min(0).optional().describe('Token ID for ERC1155'),
});

export const EvmUpdateLaunchpadParamsSchema = BaseUpdateLaunchpadParamsSchema.extend({
  /**
   * The collection address/ID to update.
   */
  collectionId: EVMAddressToLowerCaseSchema.describe('Collection address/ID'),
  
  /**
   * The blockchain where the collection is deployed.
   */
  chain: ZodEvmBlockchain,
  
  /**
   * The protocol used for the token.
   */
  protocol: z.enum([EvmProtocolType.ERC721, EvmProtocolType.ERC1155]),
  
  /**
   * Message to sign for authentication.
   */
  message: z.string().describe('Message to sign'),
  
  /**
   * Signature of the message for authentication.
   */
  signature: z.string().describe('Signature of the message'),
});

export const SolanaUpdateLaunchpadParamsSchema = BaseUpdateLaunchpadParamsSchema.extend({
  /**
   * The collection address/ID to update.
   */
  collectionId: zSolanaAddress.describe('Collection address/ID'),
  
  /**
   * The blockchain where the collection is deployed.
   */
  chain: z.literal(Blockchain.SOLANA),
  
  /**
   * The protocol used for the token.
   */
  protocol: z.literal(SolProtocolType.METAPLEX_CORE),
  
  /**
   * The payout recipient address of mint proceeds.
   */
  payoutRecipient: zSolanaAddress.describe('Payout recipient address of mint proceeds'),
  
  /**
   * The payer address for transaction fees.
   */
  payer: zSolanaAddress.describe('Payer address'),
  
  /**
   * The collection name.
   */
  name: z.string().max(SOL_MAX_NAME_LENGTH).describe('Collection name'),
  
  /**
   * The current collection symbol.
   */
  symbol: SolanaSymbol.describe('Collection symbol'),
  
  /**
   * The new collection symbol to update to.
   */
  newSymbol: SolanaSymbol.optional().describe('New collection symbol'),
  
  /**
   * The candy machine ID associated with the collection.
   */
  candyMachineId: zSolanaAddress.describe('Candy machine ID'),
  
  /**
   * The owner address of the collection.
   */
  owner: zSolanaAddress.describe('Owner address'),
  
  /**
   * External link for the collection.
   */
  externalLink: z.string().optional().describe('External link'),
  
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
});

export type EvmUpdateLaunchpadParams = z.infer<typeof EvmUpdateLaunchpadParamsSchema>;
export type SolanaUpdateLaunchpadParams = z.infer<typeof SolanaUpdateLaunchpadParamsSchema>;

export const UpdateLaunchpadParams = z.union([
  EvmUpdateLaunchpadParamsSchema,
  SolanaUpdateLaunchpadParamsSchema,
]);
export type UpdateLaunchpadParams = z.infer<typeof UpdateLaunchpadParams>;
