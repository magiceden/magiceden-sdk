import { z } from 'zod';
import { ZodEvmBlockchain } from '../../chains';

/**
 * Parameters for taking an NFT offer
 */
export const BaseTakeItemOfferParamsSchema = z.object({
  // Generic parameters that can be shared between chains
  token: z
    .string()
    .describe(
      'The NFT token in the format of <contract address>:<token id> for EVM and <mint address> for Solana',
    ),
});

export const EvmTakeItemOfferParamsSchema = BaseTakeItemOfferParamsSchema.extend({
  // EVM-specific parameters
  quantity: z.number().optional().describe('Quantity of tokens to sell.'),
  orderId: z.string().optional().describe('Optional order id to sell into.'),
});

export const EvmMultipleTakeItemOfferParamsSchema = z.object({
  chain: ZodEvmBlockchain.describe('The chain to take the item offer on'),
  items: z.array(EvmTakeItemOfferParamsSchema).describe('The take item offer parameters'),
});

export const SolanaTakeItemOfferParamsSchema = BaseTakeItemOfferParamsSchema.extend({
  // Solana-specific parameters
  // token in TakeItemOfferParams maps to tokenMint in V2TakeItemOfferRequest
  buyer: z.string().describe("The buyer's wallet address"),
  price: z.string().optional().describe('The original offer price'),
  newPrice: z.string().describe('The new price to accept'),
  auctionHouseAddress: z.string().describe('Auction house address'),
  tokenATA: z.string().describe('Token associated token account'),
  buyerReferral: z.string().optional().describe('Buyer referral address'),
  sellerReferral: z.string().optional().describe('Seller referral address'),
  buyerExpiry: z.number().optional().describe('Buyer expiry timestamp'),
  sellerExpiry: z.number().describe('Seller expiry timestamp'),
  prioFeeMicroLamports: z.number().optional().describe('Priority fee in micro lamports'),
  maxPrioFeeLamports: z.number().optional().describe('Maximum priority fee in lamports'),
  exactPrioFeeLamports: z.number().optional().describe('Exact priority fee in lamports'),
});

export type EvmTakeItemOfferParams = z.infer<typeof EvmMultipleTakeItemOfferParamsSchema>;
export type SolanaTakeItemOfferParams = z.infer<typeof SolanaTakeItemOfferParamsSchema>;

export const TakeItemOfferParams = z.union([
  EvmMultipleTakeItemOfferParamsSchema,
  SolanaTakeItemOfferParamsSchema,
]);
export type TakeItemOfferParams = z.infer<typeof TakeItemOfferParams>;
