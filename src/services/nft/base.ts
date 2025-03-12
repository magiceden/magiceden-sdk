import {
  ChainMethodParams,
  ClientConfig,
  TransactionResponse,
} from '../../types';
import { SupportedChain } from '../../types/chain';
import { ChainTransaction } from '../../wallet';
import { V2ApiClient } from '../../api/clients/v2';
import { V4ApiClient } from '../../api/clients/v4';
import { V3ApiClient } from '../../api/clients/v3';
import { ApiClientOptions } from '../../api/clients/base';

/**
 * Base class for NFT services
 */
export abstract class BaseNftService<C extends SupportedChain = SupportedChain> {
  protected readonly config: ClientConfig<C>;

  protected readonly v2ApiClient: V2ApiClient;
  protected readonly v3ApiClient: V3ApiClient;
  protected readonly v4ApiClient: V4ApiClient;

  constructor(config: ClientConfig<C>) {
    this.config = config;

    const apiOptions: ApiClientOptions = {
      chain: config.chain,
      apiKey: config.apiKey,
      headers: config.headers,
      timeout: config.timeout,
    };

    this.v2ApiClient = new V2ApiClient(apiOptions);
    this.v3ApiClient = new V3ApiClient(apiOptions);
    this.v4ApiClient = new V4ApiClient(apiOptions);
  }

  /**
   * Creates a new launchpad
   */
  async createLaunchpad(params: ChainMethodParams<C, 'createLaunchpad'>): Promise<TransactionResponse> {
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
  protected abstract getCreateLaunchpadInstructions(
    params: ChainMethodParams<C, 'createLaunchpad'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Updates an existing launchpad
   */
  async updateLaunchpad(
    params: ChainMethodParams<C, 'updateLaunchpad'>,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getUpdateLaunchpadInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get update launchpad transaction instructions from API
   */
  protected abstract getUpdateLaunchpadInstructions(
    params: ChainMethodParams<C, 'updateLaunchpad'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Mints an NFT from a launchpad
   */
  async mint(params: ChainMethodParams<C, 'mint'>): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getMintInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get mint transaction instructions from API
   */
  protected abstract getMintInstructions(
    params: ChainMethodParams<C, 'mint'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Lists an NFT for sale
   */
  async list(params: ChainMethodParams<C, 'list'>): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getListInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get list transaction instructions from API
   */
  protected abstract getListInstructions(
    params: ChainMethodParams<C, 'list'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Cancels an NFT listing
   */
  async cancelListing(
    params: ChainMethodParams<C, 'cancelListing'>,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelListingInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get cancel listing transaction instructions from API
   */
  protected abstract getCancelListingInstructions(
    params: ChainMethodParams<C, 'cancelListing'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Takes an item offer on an NFT
   */
  async takeItemOffer(
    params: ChainMethodParams<C, 'takeItemOffer'>,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getTakeItemOfferInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get take item offer transaction instructions from API
   */
  protected abstract getTakeItemOfferInstructions(
    params: ChainMethodParams<C, 'takeItemOffer'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Makes an item offer on an NFT
   */
  async makeItemOffer(
    params: ChainMethodParams<C, 'makeItemOffer'>,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getMakeItemOfferInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get make item offer transaction instructions from API
   */
  protected abstract getMakeItemOfferInstructions(
    params: ChainMethodParams<C, 'makeItemOffer'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Cancels an item offer
   */
  async cancelItemOffer(
    params: ChainMethodParams<C, 'cancelItemOffer'>,
  ): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getCancelItemOfferInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get cancel item offer transaction instructions from API
   */
  protected abstract getCancelItemOfferInstructions(
    params: ChainMethodParams<C, 'cancelItemOffer'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Buys an NFT
   */
  async buy(params: ChainMethodParams<C, 'buy'>): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getBuyInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getBuyInstructions(
    params: ChainMethodParams<C, 'buy'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Transfers an NFT to another wallet
   */
  async transfer(params: ChainMethodParams<C, 'transfer'>): Promise<TransactionResponse> {
    // 1. Get transaction instructions from API
    const txInstructions = await this.getTransferInstructions(params);

    // 2. Sign and send transaction using wallet
    return await this.txHashToTransactionResponse(
      await this.config.wallet!.signAndSendTransaction(txInstructions),
    );
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getTransferInstructions(
    params: ChainMethodParams<C, 'transfer'>,
  ): Promise<ChainTransaction<C>>;

  /**
   * Convert a transaction hash to a transaction response
   */
  protected abstract txHashToTransactionResponse(txHash: string): Promise<TransactionResponse>;
}
