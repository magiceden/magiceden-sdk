import {
  ClientConfig,
  TransactionResponse,
  CreateLaunchpadParams,
  UpdateLaunchpadParams,
  MintParams,
  ListParams,
  CancelListingParams,
  BuyParams,
  MakeOfferParams,
  CancelOfferParams,
  TakeOfferParams,
  TransferParams,
} from '../../types';

/**
 * Base class for NFT services
 */
export abstract class BaseNftService {
  protected readonly config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  /**
   * Creates a new launchpad
   */
  async createLaunchpad(params: CreateLaunchpadParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCreateLaunchpadInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get create launchpad transaction instructions from API
   */
  protected abstract getCreateLaunchpadInstructions(params: CreateLaunchpadParams): Promise<any>;

  /**
   * Updates an existing launchpad
   */
  async updateLaunchpad(
    launchpadId: string,
    params: UpdateLaunchpadParams,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getUpdateLaunchpadInstructions(launchpadId, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get update launchpad transaction instructions from API
   */
  protected abstract getUpdateLaunchpadInstructions(
    launchpadId: string,
    params: UpdateLaunchpadParams,
  ): Promise<any>;

  /**
   * Mints an NFT from a launchpad
   */
  async mint(launchpadId: string, params: MintParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getMintInstructions(launchpadId, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get mint transaction instructions from API
   */
  protected abstract getMintInstructions(launchpadId: string, params: MintParams): Promise<any>;

  /**
   * Lists an NFT for sale
   */
  async list(identifier: string, params: ListParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getListInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get list transaction instructions from API
   */
  protected abstract getListInstructions(identifier: string, params: ListParams): Promise<any>;

  /**
   * Cancels an NFT listing
   */
  async cancelListing(
    identifier: string,
    params: CancelListingParams,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelListingInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get cancel listing transaction instructions from API
   */
  protected abstract getCancelListingInstructions(
    identifier: string,
    params: CancelListingParams,
  ): Promise<any>;

  /**
   * Buys an NFT
   */
  async buy(identifier: string, params: BuyParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getBuyInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get buy transaction instructions from API
   */
  protected abstract getBuyInstructions(identifier: string, params: BuyParams): Promise<any>;

  /**
   * Makes an item offer on an NFT
   */
  async makeItemOffer(identifier: string, params: MakeOfferParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getMakeItemOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get make item offer transaction instructions from API
   */
  protected abstract getMakeItemOfferInstructions(
    identifier: string,
    params: MakeOfferParams,
  ): Promise<any>;

  /**
   * Cancels an item offer
   */
  async cancelItemOffer(identifier: string, params: CancelOfferParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelItemOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get cancel item offer transaction instructions from API
   */
  protected abstract getCancelItemOfferInstructions(
    identifier: string,
    params: CancelOfferParams,
  ): Promise<any>;

  /**
   * Takes an item offer on an NFT
   */
  async takeItemOffer(identifier: string, params: TakeOfferParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getTakeItemOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Get take item offer transaction instructions from API
   */
  protected abstract getTakeItemOfferInstructions(
    identifier: string,
    params: TakeOfferParams,
  ): Promise<any>;

  /**
   * Transfers an NFT to another wallet
   */
  async transfer(identifier: string, params: TransferParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getTransferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(await this.config.wallet!.signAndSendTransaction(txInstructions));
  }

  /**
   * Convert a transaction hash to a transaction response
   */
  protected abstract txHashToTransactionResponse(txHash: string): Promise<TransactionResponse>;

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getTransferInstructions(
    identifier: string,
    params: TransferParams,
  ): Promise<any>;
}
