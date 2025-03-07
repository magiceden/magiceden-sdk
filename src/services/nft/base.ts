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
    return this.config.wallet!.signAndSendTransaction(txInstructions);
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
    return this.config.wallet!.signAndSendTransaction(txInstructions);
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
    return this.config.wallet!.signAndSendTransaction(txInstructions);
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
    return this.config.wallet!.signAndSendTransaction(txInstructions);
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
    return this.config.wallet!.signAndSendTransaction(txInstructions);
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
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get buy transaction instructions from API
   */
  protected abstract getBuyInstructions(identifier: string, params: BuyParams): Promise<any>;

  /**
   * Makes an offer on an NFT
   */
  async makeOffer(identifier: string, params: MakeOfferParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getMakeOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get make offer transaction instructions from API
   */
  protected abstract getMakeOfferInstructions(
    identifier: string,
    params: MakeOfferParams,
  ): Promise<any>;

  /**
   * Cancels an offer
   */
  async cancelOffer(identifier: string, params: CancelOfferParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get cancel offer transaction instructions from API
   */
  protected abstract getCancelOfferInstructions(
    identifier: string,
    params: CancelOfferParams,
  ): Promise<any>;

  /**
   * Takes an offer on an NFT
   */
  async takeOffer(identifier: string, params: TakeOfferParams): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getTakeOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get accept offer transaction instructions from API
   */
  protected abstract getTakeOfferInstructions(
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
    return this.config.wallet!.signAndSendTransaction(txInstructions);
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getTransferInstructions(
    identifier: string,
    params: TransferParams,
  ): Promise<any>;
}
