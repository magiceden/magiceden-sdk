// src/mappers/nft/solana.ts
import {
  SolanaListParams,
  SolanaCancelListingParams,
  SolanaMakeItemOfferParams,
  SolanaCancelItemOfferParams,
  SolanaTakeItemOfferParams,
  SolanaBuyParams,
  SolanaTransferParams,
} from '../../types/services/nft';

import {
  V2ListRequest,
  V2CancelListingRequest,
  V2MakeItemOfferRequest,
  V2CancelItemOfferRequest,
  V2TakeItemOfferRequest,
  V2BuyRequest,
  V2TransferRequest,
} from '../../types/api';

/**
 * Solana NFT Service Mappers
 * Provides mapping functions from service parameters to API requests
 */
export const SolanaNftApiMappers = {
  v2: {
    /**
     * Maps generic list parameters to Solana-specific API request
     */
  listRequest: (params: SolanaListParams): V2ListRequest => ({
    seller: params.seller,
    tokenMint: params.tokenAddress,
    auctionHouseAddress: params.auctionHouseAddress,
    tokenAccount: params.tokenAccount,
    price: params.price,
    splPrice: params.splPrice,
    sellerReferral: params.sellerReferral,
    expiry: params.expiry,
    prioFeeMicroLamports: params.prioFeeMicroLamports,
    maxPrioFeeLamports: params.maxPrioFeeLamports,
    exactPrioFeeLamports: params.exactPrioFeeLamports,
    txFeePayer: params.txFeePayer,
  }),

  /**
   * Maps generic cancel listing parameters to Solana-specific API request
   */
  cancelListingRequest: (params: SolanaCancelListingParams): V2CancelListingRequest => ({
    seller: params.seller,
    tokenMint: params.tokenAddress,
    auctionHouseAddress: params.auctionHouseAddress,
    tokenAccount: params.tokenAccount,
    price: params.price,
    sellerReferral: params.sellerReferral,
    expiry: params.expiry,
    prioFeeMicroLamports: params.prioFeeMicroLamports,
    maxPrioFeeLamports: params.maxPrioFeeLamports,
    exactPrioFeeLamports: params.exactPrioFeeLamports,
  }),

  /**
   * Maps generic make item offer parameters to Solana-specific API request
   */
  makeItemOfferRequest: (params: SolanaMakeItemOfferParams): V2MakeItemOfferRequest => ({
    buyer: params.buyer,
    tokenMint: params.tokenAddress,
    auctionHouseAddress: params.auctionHouseAddress,
    price: params.price,
    buyerReferral: params.buyerReferral,
    expiry: params.expiry,
    useBuyV2: params.useBuyV2,
    buyerCreatorRoyaltyPercent: params.buyerCreatorRoyaltyPercent,
    prioFeeMicroLamports: params.prioFeeMicroLamports,
    maxPrioFeeLamports: params.maxPrioFeeLamports,
    exactPrioFeeLamports: params.exactPrioFeeLamports,
  }),

  /**
   * Maps generic cancel item offer parameters to Solana-specific API request
   */
  cancelItemOfferRequest: (params: SolanaCancelItemOfferParams): V2CancelItemOfferRequest => ({
    buyer: params.buyer,
    tokenMint: params.tokenAddress,
    auctionHouseAddress: params.auctionHouseAddress,
    price: params.price,
    buyerReferral: params.buyerReferral,
    expiry: params.expiry,
    prioFeeMicroLamports: params.prioFeeMicroLamports,
    maxPrioFeeLamports: params.maxPrioFeeLamports,
    exactPrioFeeLamports: params.exactPrioFeeLamports,
  }),

  /**
   * Maps generic take item offer parameters to Solana-specific API request
   */
  takeItemOfferRequest: (params: SolanaTakeItemOfferParams): V2TakeItemOfferRequest => ({
    auctionHouseAddress: params.auctionHouseAddress,
    buyer: params.buyer,
    seller: params.seller,
    tokenMint: params.tokenAddress,
    tokenATA: params.tokenATA,
    price: params.price,
    newPrice: params.newPrice,
    buyerReferral: params.buyerReferral,
    sellerReferral: params.sellerReferral,
    buyerExpiry: params.buyerExpiry,
    sellerExpiry: params.sellerExpiry,
    prioFeeMicroLamports: params.prioFeeMicroLamports,
    maxPrioFeeLamports: params.maxPrioFeeLamports,
    exactPrioFeeLamports: params.exactPrioFeeLamports,
  }),

  /**
   * Maps generic buy parameters to Solana-specific API request
   */
  buyRequest: (params: SolanaBuyParams): V2BuyRequest => ({
    auctionHouseAddress: params.auctionHouseAddress,
    buyer: params.buyer,
    seller: params.seller,
    tokenMint: params.tokenAddress,
    tokenATA: params.tokenATA,
    price: params.price,
    buyerReferral: params.buyerReferral,
    sellerReferral: params.sellerReferral,
    buyerExpiry: params.buyerExpiry,
    sellerExpiry: params.sellerExpiry,
    buyerCreatorRoyaltyPercent: params.buyerCreatorRoyaltyPercent,
    splPrice: params.splPrice,
  }),

  /**
   * Maps generic transfer parameters to Solana-specific API request
   */
  transferRequest: (params: SolanaTransferParams): V2TransferRequest => ({
      from: params.from,
      to: params.to,
      mint: params.tokenAddress,
      isCompressed: params.isCompressed,
    }),
  },
};
