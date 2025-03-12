import { BaseNftService } from './base';
import {
  CreateLaunchpadParams,
  UpdateLaunchpadParams,
  MintParams,
  ListParams,
  CancelListingParams,
  MakeItemOfferParams,
  CancelItemOfferParams,
  TakeItemOfferParams,
  TransferParams,
  TransactionResponse,
  ChainMethodParams,
} from '../../types';
import { ClientConfig } from '../../types';
import { ChainTransaction } from '../../wallet';

/**
 * Solana-specific NFT service implementation
 */
export class SolanaNftService extends BaseNftService<'solana'> {
  constructor(config: ClientConfig<'solana'>) {
    super(config);
  }

  /**
   * Get create launchpad transaction instructions from API
   * @param params Launchpad creation parameters
   */
  protected async getCreateLaunchpadInstructions(
    params: ChainMethodParams<'solana', 'createLaunchpad'>,
  ): Promise<ChainTransaction<'solana'>> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.createLaunchpad(params);
  }

  /**
   * Get update launchpad transaction instructions from API
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadInstructions(
    params: ChainMethodParams<'solana', 'updateLaunchpad'>,
  ): Promise<ChainTransaction<'solana'>> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.updateLaunchpad(launchpadId, params);
  }

  /**
   * Get mint transaction instructions from API
   * @param params Mint parameters
   */
  protected async getMintInstructions(
    params: ChainMethodParams<'solana', 'mint'>,
  ): Promise<ChainTransaction<'solana'>> {
    throw new Error('Not implemented');
    // return this.v4ApiClient.mint(launchpadId, params);
  }

  /**
   * Get list transaction instructions from API
   * @param params Listing parameters
   */
  protected async getListInstructions(
    params: ChainMethodParams<'solana', 'list'>,
  ): Promise<ChainTransaction<'solana'>> {
    // Map parameters to V2ListRequest
    return this.v2ApiClient.list({
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
    });
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingInstructions(
    params: ChainMethodParams<'solana', 'cancelListing'>,
  ): Promise<ChainTransaction<'solana'>> {
    // Map parameters to V2CancelListingRequest
    return this.v2ApiClient.cancelListing({
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
    });
  }

  /**
   * Get make item offer transaction instructions from API
   * @param params Make item offer parameters
   */
  protected async getMakeItemOfferInstructions(
    params: ChainMethodParams<'solana', 'makeItemOffer'>,
  ): Promise<ChainTransaction<'solana'>> {
    // Map parameters to V2MakeItemOfferRequest
    return this.v2ApiClient.makeItemOffer({
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
    });
  }

  /**
   * Get take item offer transaction instructions from API
   * @param params Take item offer parameters
   */
  protected async getTakeItemOfferInstructions(
    params: ChainMethodParams<'solana', 'takeItemOffer'>,
  ): Promise<ChainTransaction<'solana'>> {
    // Map parameters to V2TakeItemOfferRequest
    return this.v2ApiClient.takeItemOffer({
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
    });
  }

  /**
   * Get cancel item offer transaction instructions from API
   * @param params Cancel item offer parameters
   */
  protected async getCancelItemOfferInstructions(
    params: ChainMethodParams<'solana', 'cancelItemOffer'>,
  ): Promise<ChainTransaction<'solana'>> {
    // Map parameters to V2CancelItemOfferRequest
    return this.v2ApiClient.cancelItemOffer({
      buyer: params.buyer,
      tokenMint: params.tokenAddress,
      auctionHouseAddress: params.auctionHouseAddress,
      price: params.price,
      buyerReferral: params.buyerReferral,
      expiry: params.expiry,
      prioFeeMicroLamports: params.prioFeeMicroLamports,
      maxPrioFeeLamports: params.maxPrioFeeLamports,
      exactPrioFeeLamports: params.exactPrioFeeLamports,
    });
  }

  /**
   * Get buy transaction instructions from API
   * @param params Buy parameters
   */
  protected async getBuyInstructions(
    params: ChainMethodParams<'solana', 'buy'>,
  ): Promise<ChainTransaction<'solana'>> {
    // Map parameters to V2BuyRequest
    return this.v2ApiClient.buy({
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
    });
  }

  /**
   * Get transfer transaction instructions from API
   * @param params Transfer parameters
   */
  protected async getTransferInstructions(
    params: ChainMethodParams<'solana', 'transfer'>,
  ): Promise<ChainTransaction<'solana'>> {
    // Map parameters to V2TransferRequest
    return this.v2ApiClient.transfer({
      from: params.from,
      to: params.to,
      mint: params.tokenAddress,
      isCompressed: params.isCompressed,
    });
  }

  /**
   * Convert a transaction hash to a transaction response
   */
  protected async txHashToTransactionResponse(txHash: string): Promise<TransactionResponse> {
    return {
      txId: txHash,
      status: 'pending',
    };
  }
}