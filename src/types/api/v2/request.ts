import { SplAmount } from '../../solana';

export interface V2ListRequest {
  seller: string;
  auctionHouseAddress: string;
  tokenMint: string;
  tokenAccount: string;
  price: number;
  // Mint address of the SPL token to list for.
  // If not specified, SOL is assumed.
  splPrice?: SplAmount;
  sellerReferral?: string;
  expiry: number;
  prioFeeMicroLamports?: number;
  maxPrioFeeLamports?: number;
  exactPrioFeeLamports?: number;

  // Transaction fee payer
  txFeePayer?: string;
}

export interface V2CancelListingRequest {
  seller: string;
  auctionHouseAddress: string;
  tokenMint: string;
  tokenAccount: string;
  price: number;
  sellerReferral?: string;
  expiry: number;
  prioFeeMicroLamports?: number;
  maxPrioFeeLamports?: number;
  exactPrioFeeLamports?: number;
}

// TODO: Implement these
export interface V2MakeCollectionOfferRequest {}

export interface V2CancelCollectionOfferRequest {}

export interface V2TakeCollectionOfferRequest {}

export interface V2TakeItemOfferRequest {
  auctionHouseAddress: string;
  buyer: string;
  seller: string;
  tokenMint: string;
  tokenATA: string;
  price?: number;
  newPrice: number;
  buyerReferral?: string;
  sellerReferral?: string;
  buyerExpiry?: number;
  sellerExpiry: number;
  prioFeeMicroLamports?: number;
  maxPrioFeeLamports?: number;
  exactPrioFeeLamports?: number;
}

export interface V2MakeItemOfferRequest {
  buyer: string;
  auctionHouseAddress: string;
  tokenMint: string;
  price: number;
  buyerReferral?: string;
  expiry?: number;
  useBuyV2?: boolean;
  buyerCreatorRoyaltyPercent?: number;
  prioFeeMicroLamports?: number;
  maxPrioFeeLamports?: number;
  exactPrioFeeLamports?: number;
}

export interface V2CancelItemOfferRequest {
  buyer: string;
  auctionHouseAddress: string;
  tokenMint: string;
  price: number;
  buyerReferral?: string;
  expiry?: number;
  prioFeeMicroLamports?: number;
  maxPrioFeeLamports?: number;
  exactPrioFeeLamports?: number;
}

export interface V2BuyRequest {
  auctionHouseAddress: string;
  buyer: string;
  seller: string;
  tokenMint: string;
  tokenATA: string;
  price: number;
  buyerReferral?: string;
  sellerReferral?: string;
  buyerExpiry?: number;
  sellerExpiry: number;
  buyerCreatorRoyaltyPercent?: number;
  // Mint address of the SPL token to list for.
  // If not specified, SOL is assumed.
  splPrice?: SplAmount;
}

export interface V2TransferRequest {
  from: string;
  to: string;
  mint: string;
  isCompressed?: boolean;
}
