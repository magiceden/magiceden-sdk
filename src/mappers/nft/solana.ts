// src/mappers/nft/solana.ts
import {
  SolanaListParams,
  SolanaCancelListingParams,
  SolanaMakeItemOfferParams,
  SolanaCancelItemOfferParams,
  SolanaTakeItemOfferParams,
  SolanaBuyParams,
  SolanaTransferParams,
  SolanaCreateLaunchpadParams,
  SolanaUpdateLaunchpadParams,
  SolanaMintParams,
  SolanaPublishLaunchpadParams,
} from '../../types/services/nft';

import {
  V2ListRequest,
  V2CancelListingRequest,
  V2MakeItemOfferRequest,
  V2CancelItemOfferRequest,
  V2TakeItemOfferRequest,
  V2BuyRequest,
  V2TransferRequest,
  V4CreateLaunchpadRequest,
  V4UpdateLaunchpadRequest,
  V4MintRequest,
  V4PublishLaunchpadRequest,
} from '../../types/api';

/**
 * Solana NFT Service Mappers
 * Provides mapping functions from service parameters to API requests
 */
export const SolanaApiMappers = {
  /**
   * Mappers for V2 API
   */
  v2: {
    /**
     * Maps generic list parameters to Solana-specific API request
     */
    listRequest: (seller: string, params: SolanaListParams): V2ListRequest => ({
      seller,
      tokenAccount: params.token,
      tokenMint: params.token,
      auctionHouseAddress: params.auctionHouseAddress,
      price: Number(params.price),
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
    cancelListingRequest: (seller: string, params: SolanaCancelListingParams): V2CancelListingRequest => ({
      seller,
      tokenMint: params.tokenAddress,
      auctionHouseAddress: params.auctionHouseAddress,
      tokenAccount: params.tokenAccount,
      price: Number(params.price),
      sellerReferral: params.sellerReferral,
      expiry: params.expiry,
      prioFeeMicroLamports: params.prioFeeMicroLamports,
      maxPrioFeeLamports: params.maxPrioFeeLamports,
      exactPrioFeeLamports: params.exactPrioFeeLamports,
    }),

    /**
     * Maps generic make item offer parameters to Solana-specific API request
     */
    makeItemOfferRequest: (buyer: string, params: SolanaMakeItemOfferParams): V2MakeItemOfferRequest => ({
      buyer,
      tokenMint: params.token,
      auctionHouseAddress: params.auctionHouseAddress,
      price: Number(params.price),
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
    cancelItemOfferRequest: (buyer: string, params: SolanaCancelItemOfferParams): V2CancelItemOfferRequest => ({
      buyer,
      tokenMint: params.tokenAddress,
      auctionHouseAddress: params.auctionHouseAddress,
      price: Number(params.price),
      buyerReferral: params.buyerReferral,
      expiry: params.expiry,
      prioFeeMicroLamports: params.prioFeeMicroLamports,
      maxPrioFeeLamports: params.maxPrioFeeLamports,
      exactPrioFeeLamports: params.exactPrioFeeLamports,
    }),

    /**
     * Maps generic take item offer parameters to Solana-specific API request
     */
    takeItemOfferRequest: (seller: string,params: SolanaTakeItemOfferParams): V2TakeItemOfferRequest => ({
      seller,
      buyer: params.buyer,
      auctionHouseAddress: params.auctionHouseAddress,
      tokenMint: params.tokenAddress,
      tokenATA: params.tokenATA,
      price: Number(params.price),
      newPrice: Number(params.newPrice),
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
    buyRequest: (buyer: string, params: SolanaBuyParams): V2BuyRequest => ({
      buyer,
      seller: params.seller,
      auctionHouseAddress: params.auctionHouseAddress,
      tokenMint: params.token,
      tokenATA: params.tokenATA,
      price: Number(params.price),
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
    transferRequest: (from: string, params: SolanaTransferParams): V2TransferRequest => ({
      from,
      to: params.to,
      mint: params.tokenAddress,
      isCompressed: params.isCompressed,
    }),
  },

  /**
   * Mappers for V4 API
   */
  v4: {
    /**
     * Maps Solana publish launchpad parameters to V4 publish launchpad request
     */
    publishLaunchpadRequest: (params: SolanaPublishLaunchpadParams): V4PublishLaunchpadRequest => ({
      ...params
    }),

    /**
     * Maps Solana create launchpad parameters to V4 create launchpad request
     */
    createLaunchpadRequest: (params: SolanaCreateLaunchpadParams): V4CreateLaunchpadRequest => ({
      // All variables have the same name
      ...params
    }),

    /**
     * Maps Solana update launchpad parameters to V4 update launchpad request
     */
    updateLaunchpadRequest: (params: SolanaUpdateLaunchpadParams): V4UpdateLaunchpadRequest => ({
      ...params
    }),

    /**
     * Maps Solana mint parameters to V4 mint request
     */
    mintRequest: (params: SolanaMintParams): V4MintRequest => ({
      ...params
    }),
  },
};
