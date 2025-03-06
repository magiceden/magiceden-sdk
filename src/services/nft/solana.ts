import { BaseNftService } from './base';
import {
  SolanaNFT,
  NFTListing,
  PaginationParams,
  TransactionResponse,
  NFTCollection,
} from '../../types';

/**
 * Solana-specific NFT service implementation
 */
export class SolanaNftService extends BaseNftService {
  /**
   * Gets an NFT by mint address
   * @param mintAddress The mint address of the NFT
   */
  async getNft(mintAddress: string): Promise<SolanaNFT> {
    return this.api.get<SolanaNFT>(`/tokens/${mintAddress}`);
  }

  /**
   * Gets NFTs owned by an address
   * @param ownerAddress The owner's wallet address
   * @param params Pagination parameters
   */
  async getByOwner(ownerAddress: string, params: PaginationParams = {}): Promise<SolanaNFT[]> {
    return this.api.get<SolanaNFT[]>(`/wallets/${ownerAddress}/tokens`, params);
  }

  /**
   * Gets a collection by symbol
   * @param symbol The collection symbol
   */
  async getCollection(symbol: string): Promise<NFTCollection> {
    return this.api.get<NFTCollection>(`/collections/${symbol}`);
  }

  /**
   * Gets listings for a collection
   * @param symbol The collection symbol
   * @param params Pagination parameters
   */
  async getListings(symbol: string, params: PaginationParams = {}): Promise<NFTListing[]> {
    return this.api.get<NFTListing[]>(`/collections/${symbol}/listings`, params);
  }

  /**
   * Gets listings for a specific NFT
   * @param mintAddress The mint address of the NFT
   */
  async getListingsByNft(mintAddress: string): Promise<NFTListing[]> {
    return this.api.get<NFTListing[]>(`/tokens/${mintAddress}/listings`);
  }

  /**
   * Get list transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param price The price in SOL
   * @param options Additional options like expiry
   */
  protected async getListInstructions(
    mintAddress: string,
    price: number,
    options: { expiry?: number } = {},
  ): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post<any>('/instructions/list', {
      mintAddress,
      price,
      sellerWallet: walletAddress,
      expiry: options.expiry,
    });
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param options Additional options like price
   */
  protected async getCancelListingInstructions(
    mintAddress: string,
    options: { price: number },
  ): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post<any>('/instructions/cancel', {
      mintAddress,
      price: options.price,
      sellerWallet: walletAddress,
    });
  }

  /**
   * Get buy transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param price The price to pay in SOL
   * @param options Additional options like sellerReferral
   */
  protected async getBuyInstructions(
    mintAddress: string,
    price: number,
    options: { sellerReferral?: string } = {},
  ): Promise<any> {
    const buyerWallet = await this.config.wallet!.getAddress();

    return this.api.post<any>('/instructions/buy', {
      mintAddress,
      price,
      buyerWallet,
      sellerReferral: options.sellerReferral,
    });
  }

  /**
   * Get make offer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param price The offer price in SOL
   * @param options Additional options like expiry
   */
  protected async getMakeOfferInstructions(
    mintAddress: string,
    price: number,
    options: { expiry?: number } = {},
  ): Promise<any> {
    const buyerWallet = await this.config.wallet!.getAddress();

    return this.api.post<any>('/instructions/offer', {
      mintAddress,
      price,
      buyerWallet,
      expiry: options.expiry,
    });
  }

  /**
   * Get cancel offer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param options Additional options like price
   */
  protected async getCancelOfferInstructions(
    mintAddress: string,
    options: { price: number },
  ): Promise<any> {
    const buyerWallet = await this.config.wallet!.getAddress();

    return this.api.post<any>('/instructions/cancelOffer', {
      mintAddress,
      price: options.price,
      buyerWallet,
    });
  }

  /**
   * Get accept offer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param options Additional options like buyer and price
   */
  protected async getAcceptOfferInstructions(
    mintAddress: string,
    options: { buyer: string; price: number },
  ): Promise<any> {
    const sellerWallet = await this.config.wallet!.getAddress();

    return this.api.post<any>('/instructions/acceptOffer', {
      mintAddress,
      price: options.price,
      buyerWallet: options.buyer,
      sellerWallet,
    });
  }

  /**
   * Get transfer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param recipient The recipient's wallet address
   */
  protected async getTransferInstructions(mintAddress: string, recipient: string): Promise<any> {
    const senderWallet = await this.config.wallet!.getAddress();

    return this.api.post<any>('/instructions/transfer', {
      mintAddress,
      fromWallet: senderWallet,
      toWallet: recipient,
    });
  }

  /**
   * Gets activities for a collection
   * @param symbol The collection symbol
   * @param params Pagination parameters
   */
  async getActivities(symbol: string, params: PaginationParams = {}): Promise<any[]> {
    return this.api.get<any[]>(`/collections/${symbol}/activities`, params);
  }

  /**
   * Gets activities for a specific NFT
   * @param mintAddress The mint address of the NFT
   * @param params Pagination parameters
   */
  async getActivitiesByMint(mintAddress: string, params: PaginationParams = {}): Promise<any[]> {
    return this.api.get<any[]>(`/tokens/${mintAddress}/activities`, params);
  }

  /**
   * Gets the floor price for a collection
   * @param symbol The collection symbol
   */
  async getFloorPrice(symbol: string): Promise<{ floorPrice: number }> {
    const collection = await this.getCollection(symbol);
    return { floorPrice: collection.floorPrice || 0 };
  }
}
