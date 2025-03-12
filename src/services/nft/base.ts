import {
  ClientConfig,
  TransactionResponse,
  CreateLaunchpadParams,
  UpdateLaunchpadParams,
  MintParams,
  ListParams,
  CancelListingParams,
  MakeItemOfferParams,
  CancelItemOfferParams,
  TakeItemOfferParams,
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
  async createLaunchpad<T extends CreateLaunchpadParams>(params: T): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCreateLaunchpadInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get create launchpad transaction instructions from API
   */
  protected abstract getCreateLaunchpadInstructions<T extends CreateLaunchpadParams>(
    params: T,
  ): Promise<any>;

  /**
   * Updates an existing launchpad
   */
  async updateLaunchpad<T extends UpdateLaunchpadParams>(
    launchpadId: string,
    params: T,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getUpdateLaunchpadInstructions(launchpadId, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get update launchpad transaction instructions from API
   */
  protected abstract getUpdateLaunchpadInstructions<T extends UpdateLaunchpadParams>(
    launchpadId: string,
    params: T,
  ): Promise<any>;

  /**
   * Mints an NFT from a launchpad
   */
  async mint<T extends MintParams>(launchpadId: string, params: T): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getMintInstructions(launchpadId, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get mint transaction instructions from API
   */
  protected abstract getMintInstructions<T extends MintParams>(
    launchpadId: string,
    params: T,
  ): Promise<any>;

  /**
   * Lists an NFT for sale
   */
  async list<T extends ListParams>(identifier: string, params: T): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getListInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get list transaction instructions from API
   */
  protected abstract getListInstructions<T extends ListParams>(
    identifier: string,
    params: T,
  ): Promise<any>;

  /**
   * Cancels an NFT listing
   */
  async cancelListing<T extends CancelListingParams>(
    identifier: string,
    params: T,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelListingInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get cancel listing transaction instructions from API
   */
  protected abstract getCancelListingInstructions<T extends CancelListingParams>(
    identifier: string,
    params: T,
  ): Promise<any>;

  /**
   * Makes an item offer on an NFT
   */
  async makeItemOffer<T extends MakeItemOfferParams>(
    identifier: string,
    params: T,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getMakeItemOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get make item offer transaction instructions from API
   */
  protected abstract getMakeItemOfferInstructions<T extends MakeItemOfferParams>(
    identifier: string,
    params: T,
  ): Promise<any>;

  /**
   * Cancels an item offer
   */
  async cancelItemOffer<T extends CancelItemOfferParams>(
    identifier: string,
    params: T,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelItemOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get cancel item offer transaction instructions from API
   */
  protected abstract getCancelItemOfferInstructions<T extends CancelItemOfferParams>(
    identifier: string,
    params: T,
  ): Promise<any>;

  /**
   * Takes an item offer on an NFT
   */
  async takeItemOffer<T extends TakeItemOfferParams>(
    identifier: string,
    params: T,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getTakeItemOfferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get take item offer transaction instructions from API
   */
  protected abstract getTakeItemOfferInstructions<T extends TakeItemOfferParams>(
    identifier: string,
    params: T,
  ): Promise<any>;

  /**
   * Transfers an NFT to another wallet
   */
  async transfer<T extends TransferParams>(identifier: string, params: T): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getTransferInstructions(identifier, params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getTransferInstructions<T extends TransferParams>(
    identifier: string,
    params: T,
  ): Promise<any>;

  /**
   * Convert a transaction hash to a transaction response
   */
  protected abstract txHashToTransactionResponse(txHash: string): Promise<TransactionResponse>;
}
