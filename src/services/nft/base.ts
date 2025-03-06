import { ApiManager } from '../../utils/api';
import {
  ClientConfig,
  NFT,
  NFTListing,
  PaginationParams,
  TransactionResponse,
  NFTCollection,
} from '../../types';
import { ApiError } from '../../errors';

/**
 * Base class for NFT services
 */
export abstract class BaseNftService {
  protected readonly api: ApiManager;
  protected readonly config: ClientConfig;

  constructor(api: ApiManager, config: ClientConfig) {
    this.api = api;
    this.config = config;
  }

  /**
   * Gets an NFT by identifier
   */
  abstract getNft(identifier: string): Promise<NFT>;

  /**
   * Gets NFTs owned by an address
   */
  abstract getByOwner(ownerAddress: string, params?: PaginationParams): Promise<NFT[]>;

  /**
   * Gets a collection by identifier
   */
  abstract getCollection(identifier: string): Promise<NFTCollection>;

  /**
   * Gets listings for a collection
   */
  abstract getListings(identifier: string, params?: PaginationParams): Promise<NFTListing[]>;

  /**
   * Gets listings for a specific NFT
   */
  abstract getListingsByNft(identifier: string): Promise<NFTListing[]>;

  /**
   * Lists an NFT for sale
   */
  async list(identifier: string, price: number, options?: any): Promise<TransactionResponse> {
    this.requireApiKey('listing NFTs');
    this.requireWallet('listing NFTs');

    // 1. Get transaction instructions from API
    const txInstructions = await this.getListInstructions(identifier, price, options);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get list transaction instructions from API
   */
  protected abstract getListInstructions(
    identifier: string,
    price: number,
    options?: any,
  ): Promise<any>;

  /**
   * Cancels an NFT listing
   */
  async cancelListing(identifier: string, options?: any): Promise<TransactionResponse> {
    this.requireApiKey('canceling listings');
    this.requireWallet('canceling listings');

    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelListingInstructions(identifier, options);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get cancel listing transaction instructions from API
   */
  protected abstract getCancelListingInstructions(identifier: string, options?: any): Promise<any>;

  /**
   * Buys an NFT
   */
  async buy(identifier: string, price: number, options?: any): Promise<TransactionResponse> {
    this.requireApiKey('buying NFTs');
    this.requireWallet('buying NFTs');

    // 1. Get transaction instructions from API
    const txInstructions = await this.getBuyInstructions(identifier, price, options);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get buy transaction instructions from API
   */
  protected abstract getBuyInstructions(
    identifier: string,
    price: number,
    options?: any,
  ): Promise<any>;

  /**
   * Makes an offer on an NFT
   */
  async makeOffer(identifier: string, price: number, options?: any): Promise<TransactionResponse> {
    this.requireApiKey('making offers');
    this.requireWallet('making offers');

    // 1. Get transaction instructions from API
    const txInstructions = await this.getMakeOfferInstructions(identifier, price, options);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get make offer transaction instructions from API
   */
  protected abstract getMakeOfferInstructions(
    identifier: string,
    price: number,
    options?: any,
  ): Promise<any>;

  /**
   * Cancels an offer
   */
  async cancelOffer(identifier: string, options?: any): Promise<TransactionResponse> {
    this.requireApiKey('canceling offers');
    this.requireWallet('canceling offers');

    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelOfferInstructions(identifier, options);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get cancel offer transaction instructions from API
   */
  protected abstract getCancelOfferInstructions(identifier: string, options?: any): Promise<any>;

  /**
   * Accepts an offer on an NFT
   */
  async acceptOffer(identifier: string, options?: any): Promise<TransactionResponse> {
    this.requireApiKey('accepting offers');
    this.requireWallet('accepting offers');

    // 1. Get transaction instructions from API
    const txInstructions = await this.getAcceptOfferInstructions(identifier, options);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get accept offer transaction instructions from API
   */
  protected abstract getAcceptOfferInstructions(identifier: string, options?: any): Promise<any>;

  /**
   * Transfers an NFT to another wallet
   */
  async transfer(identifier: string, recipient: string): Promise<TransactionResponse> {
    this.requireApiKey('transferring NFTs');
    this.requireWallet('transferring NFTs');

    // 1. Get transaction instructions from API
    const txInstructions = await this.getTransferInstructions(identifier, recipient);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getTransferInstructions(identifier: string, recipient: string): Promise<any>;

  /**
   * Checks if the API key is provided
   */
  protected requireApiKey(operation: string): void {
    if (!this.config.apiKey) {
      throw new ApiError(`API key is required for ${operation}`);
    }
  }

  /**
   * Checks if the wallet is provided
   */
  protected requireWallet(operation: string): void {
    if (!this.config.wallet) {
      throw new ApiError(`Wallet is required for ${operation}`);
    }

    if (!this.config.wallet.isConnected()) {
      throw new ApiError(`Wallet must be connected for ${operation}`);
    }
  }
}
