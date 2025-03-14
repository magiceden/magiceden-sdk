import { z } from 'zod';
import {
  MAX_ALLOWLIST_SIZE,
  MAX_SUPPLY,
  MAX_WALLET_LIMIT,
  MIN_ALLOWLIST_SIZE,
  MIN_SUPPLY,
  MIN_WALLET_LIMIT,
} from '../../../../constants/nft';

/**
 * Enum for different types of mint stages
 */
export enum MintStageKind {
  Public = 'public',
  Allowlist = 'allowlist',
}

/**
 * Base mint stage schema with common properties
 */
const BaseMintStage = {
  kind: z.nativeEnum(MintStageKind).describe('Type of mint stage'),
  price: z
    .object({
      currency: z.string().describe('Currency asset identifier'),
      raw: z.string().describe('Raw price amount as string'),
    })
    .describe('Price configuration for the mint'),
  startTime: z.string().datetime().describe('Start time of the mint stage'),
  endTime: z.string().datetime().describe('End time of the mint stage'),
  walletLimit: z
    .number()
    .min(MIN_WALLET_LIMIT, `Wallet limit must be at least ${MIN_WALLET_LIMIT}`)
    .max(MAX_WALLET_LIMIT, `Wallet limit must be at most ${MAX_WALLET_LIMIT}`)
    .optional()
    .describe('Maximum number of mints per wallet'),
  maxSupply: z
    .number()
    .min(MIN_SUPPLY, `Max supply must be at least ${MIN_SUPPLY}`)
    .max(MAX_SUPPLY, `Max supply must be at most ${MAX_SUPPLY}`)
    .optional()
    .nullable()
    .describe('Maximum supply available for this stage'),
};

/**
 * Public mint stage schema
 */
export const PublicMintStage = z.object({
  ...BaseMintStage,
  kind: z.literal(MintStageKind.Public),
});

/**
 * Allowlist mint stage schema
 */
export const AllowlistMintStage = z.object({
  ...BaseMintStage,
  kind: z.literal(MintStageKind.Allowlist),
  allowlist: z
    .array(z.string())
    .min(MIN_ALLOWLIST_SIZE)
    .max(MAX_ALLOWLIST_SIZE)
    .optional()
    .describe('List of wallet addresses allowed to mint'),
});

/**
 * Union type for all mint stage types
 */
export const MintStage = z.discriminatedUnion('kind', [PublicMintStage, AllowlistMintStage]);

/**
 * Schema for mint stages configuration
 */
export const MintStages = z.object({
  stages: z.array(MintStage).min(1).optional().describe('Array of mint stages'),
  tokenId: z.number().int().min(0).optional().describe('Token ID for ERC1155'),
  // SOL:
  //   if no stages are passed in and walletLimit is defined,
  //   then this will be the walletLimit for all in the default public mint stage
  //   otherwise ignored
  walletLimit: z
    .number()
    .min(MIN_WALLET_LIMIT, `Wallet limit must be at least ${MIN_WALLET_LIMIT}`)
    .max(MAX_WALLET_LIMIT, `Wallet limit must be at most ${MAX_WALLET_LIMIT}`)
    .optional()
    .describe('Default wallet limit if no stages are defined'),
  maxSupply: z
    .number()
    .min(MIN_SUPPLY, `Max supply must be at least ${MIN_SUPPLY}`)
    .max(MAX_SUPPLY, `Max supply must be at most ${MAX_SUPPLY}`)
    .optional()
    .nullable()
    .describe('Total items available for minting'),
});

// Helper function to get allowlist mint stage from an array of mint stages
export const getAllowlistMintStage = (
  mintStages: z.infer<typeof MintStage>[],
): z.infer<typeof AllowlistMintStage> | undefined => {
  return mintStages.find(
    (stage): stage is z.infer<typeof AllowlistMintStage> => stage.kind === MintStageKind.Allowlist,
  );
};

// Type exports
export type PublicMintStage = z.infer<typeof PublicMintStage>;
export type AllowlistMintStage = z.infer<typeof AllowlistMintStage>;
export type MintStage = z.infer<typeof MintStage>;
export type MintStages = z.infer<typeof MintStages>;
