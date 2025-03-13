import { ChainMethodParams, ClientConfig, TransactionResponse } from '../../types';
import { SupportedChain } from '../../types/chain';
import { ChainTransaction, WalletTxReceipt } from '../../wallet';
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
  async createLaunchpad(
    params: ChainMethodParams<C, 'createLaunchpad'>,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.getCreateLaunchpadTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get create launchpad transaction instructions from API
   */
  protected abstract getCreateLaunchpadTransactions(
    params: ChainMethodParams<C, 'createLaunchpad'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Updates an existing launchpad
   */
  async updateLaunchpad(
    params: ChainMethodParams<C, 'updateLaunchpad'>,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.getUpdateLaunchpadTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get update launchpad transaction instructions from API
   */
  protected abstract getUpdateLaunchpadTransactions(
    params: ChainMethodParams<C, 'updateLaunchpad'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Mints an NFT from a launchpad
   */
  async mint(params: ChainMethodParams<C, 'mint'>): Promise<TransactionResponse[]> {
    const transactions = await this.getMintTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get mint transaction instructions from API
   */
  protected abstract getMintTransactions(
    params: ChainMethodParams<C, 'mint'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Lists an NFT for sale
   */
  async list(params: ChainMethodParams<C, 'list'>): Promise<TransactionResponse[]> {
    const transactions = await this.getListTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get list transaction instructions from API
   */
  protected abstract getListTransactions(
    params: ChainMethodParams<C, 'list'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Cancels an NFT listing
   */
  async cancelListing(
    params: ChainMethodParams<C, 'cancelListing'>,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.getCancelListingTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get cancel listing transaction instructions from API
   */
  protected abstract getCancelListingTransactions(
    params: ChainMethodParams<C, 'cancelListing'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Takes an item offer on an NFT
   */
  async takeItemOffer(
    params: ChainMethodParams<C, 'takeItemOffer'>,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.getTakeItemOfferTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get take item offer transaction instructions from API
   */
  protected abstract getTakeItemOfferTransactions(
    params: ChainMethodParams<C, 'takeItemOffer'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Makes an item offer on an NFT
   */
  async makeItemOffer(
    params: ChainMethodParams<C, 'makeItemOffer'>,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.getMakeItemOfferTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get make item offer transaction instructions from API
   */
  protected abstract getMakeItemOfferTransactions(
    params: ChainMethodParams<C, 'makeItemOffer'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Cancels an item offer
   */
  async cancelItemOffer(
    params: ChainMethodParams<C, 'cancelItemOffer'>,
  ): Promise<TransactionResponse[]> {
    const transactions = await this.getCancelItemOfferTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get cancel item offer transaction instructions from API
   */
  protected abstract getCancelItemOfferTransactions(
    params: ChainMethodParams<C, 'cancelItemOffer'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Buys an NFT
   */
  async buy(params: ChainMethodParams<C, 'buy'>): Promise<TransactionResponse[]> {
    const transactions = await this.getBuyTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getBuyTransactions(
    params: ChainMethodParams<C, 'buy'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Transfers an NFT to another wallet
   */
  async transfer(params: ChainMethodParams<C, 'transfer'>): Promise<TransactionResponse[]> {
    const transactions = await this.getTransferTransactions(params);
    return await this.sendAndConfirmTransactions(transactions);
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getTransferTransactions(
    params: ChainMethodParams<C, 'transfer'>,
  ): Promise<ChainTransaction<C>[]>;

  /**
   * Send and confirm transactions sequentially
   */
  private async sendAndConfirmTransactions(
    transactions: ChainTransaction<C>[],
  ): Promise<TransactionResponse[]> {
    const results: TransactionResponse[] = [];

    for (const tx of transactions) {
      const signature = await this.config.wallet!.signAndSendTransaction(tx);
      const txReceipt = await this.config.wallet!.waitForTransactionConfirmation(signature);

      results.push(await this.txHashToTransactionResponse(txReceipt));
    }

    return results;
  }

  /**
   * Convert a transaction hash to a transaction response
   */
  private async txHashToTransactionResponse(txReceipt: WalletTxReceipt): Promise<TransactionResponse> {
    return {
      txId: txReceipt.txId,
      status: txReceipt.status,
    };
  }
}
