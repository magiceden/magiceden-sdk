import {
  ChainMethodParams,
  ClientConfig,
  SignatureResponse,
  TransactionResponse,
  TransactionStrategy,
} from '../../types';
import { SupportedChain } from '../../types/chains';
import { V2ApiClient } from '../../api/clients/v2';
import { V4ApiClient } from '../../api/clients/v4';
import { V3ApiClient } from '../../api/clients/v3';
import { ApiClientOptions } from '../../api/clients/base';
import {
  ChainOperation,
  OperationResponse,
  SignatureOperation,
  TransactionOperation,
} from '../../types/operations';

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
      ...config.apiOptions,
    };

    this.v2ApiClient = new V2ApiClient(apiOptions);
    this.v3ApiClient = new V3ApiClient(apiOptions);
    this.v4ApiClient = new V4ApiClient(apiOptions);
  }

  /**
   * Publish a launchpad
   *
   * Only available for Solana. Meant to be called after calling createLaunchpad and creating a launchpad on-chain.
   */
  public async publishLaunchpad(
    params: ChainMethodParams<C, 'publishLaunchpad'>,
  ): Promise<boolean> {
    return await this.getPublishLaunchpadResponse(params);
  }

  /**
   * Get publish launchpad response from API
   */
  protected abstract getPublishLaunchpadResponse(
    params: ChainMethodParams<C, 'publishLaunchpad'>,
  ): Promise<boolean>;

  /**
   * Creates a new launchpad
   */
  async createLaunchpad(
    params: ChainMethodParams<C, 'createLaunchpad'>,
  ): Promise<OperationResponse[]> {
    const operations = await this.getCreateLaunchpadOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get create launchpad transaction instructions from API
   */
  protected abstract getCreateLaunchpadOperations(
    params: ChainMethodParams<C, 'createLaunchpad'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Updates an existing launchpad
   */
  async updateLaunchpad(
    params: ChainMethodParams<C, 'updateLaunchpad'>,
  ): Promise<OperationResponse[]> {
    const operations = await this.getUpdateLaunchpadOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get update launchpad transaction instructions from API
   */
  protected abstract getUpdateLaunchpadOperations(
    params: ChainMethodParams<C, 'updateLaunchpad'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Mints an NFT from a launchpad
   */
  async mint(params: ChainMethodParams<C, 'mint'>): Promise<OperationResponse[]> {
    const operations = await this.getMintOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get mint transaction instructions from API
   */
  protected abstract getMintOperations(
    params: ChainMethodParams<C, 'mint'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Lists an NFT for sale.
   *
   * - Supported on EVM.
   * - Supported on Solana (every NFT type excluding cNFT).
   *
   * @param params - The parameters for the list operation
   * @returns The operation response
   */
  async list(params: ChainMethodParams<C, 'list'>): Promise<OperationResponse[]> {
    const operations = await this.getListOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get list transaction instructions from API
   */
  protected abstract getListOperations(
    params: ChainMethodParams<C, 'list'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Cancels an NFT listing
   */
  async cancelListing(params: ChainMethodParams<C, 'cancelListing'>): Promise<OperationResponse[]> {
    const operations = await this.getCancelListingOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get cancel listing transaction instructions from API
   */
  protected abstract getCancelListingOperations(
    params: ChainMethodParams<C, 'cancelListing'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Takes an item offer on an NFT
   */
  async takeItemOffer(params: ChainMethodParams<C, 'takeItemOffer'>): Promise<OperationResponse[]> {
    const operations = await this.getTakeItemOfferOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get take item offer transaction instructions from API
   */
  protected abstract getTakeItemOfferOperations(
    params: ChainMethodParams<C, 'takeItemOffer'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Makes an item offer on an NFT
   */
  async makeItemOffer(params: ChainMethodParams<C, 'makeItemOffer'>): Promise<OperationResponse[]> {
    const operations = await this.getMakeItemOfferOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get make item offer transaction instructions from API
   */
  protected abstract getMakeItemOfferOperations(
    params: ChainMethodParams<C, 'makeItemOffer'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Cancels an item offer
   */
  async cancelItemOffer(
    params: ChainMethodParams<C, 'cancelItemOffer'>,
  ): Promise<OperationResponse[]> {
    const operations = await this.getCancelItemOfferOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get cancel item offer transaction instructions from API
   */
  protected abstract getCancelItemOfferOperations(
    params: ChainMethodParams<C, 'cancelItemOffer'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Buys an NFT
   */
  async buy(params: ChainMethodParams<C, 'buy'>): Promise<OperationResponse[]> {
    const operations = await this.getBuyOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getBuyOperations(
    params: ChainMethodParams<C, 'buy'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Transfers an NFT to another wallet
   */
  async transfer(params: ChainMethodParams<C, 'transfer'>): Promise<OperationResponse[]> {
    const operations = await this.getTransferOperations(params);
    return await this.processOperations(operations);
  }

  /**
   * Get transfer transaction instructions from API
   */
  protected abstract getTransferOperations(
    params: ChainMethodParams<C, 'transfer'>,
  ): Promise<ChainOperation<C>[]>;

  /**
   * Process a sequence of operations
   */
  protected async processOperations(operations: ChainOperation<C>[]): Promise<OperationResponse[]> {
    const results: OperationResponse[] = [];

    for (const operation of operations) {
      switch (operation.type) {
        case 'transaction':
          const txResult = await this.processTransactionOperation(
            operation as TransactionOperation<C>,
          );
          results.push(txResult);
          break;
        case 'signature':
          const sigResult = await this.processSignatureOperation(
            operation as SignatureOperation<C>,
          );
          results.push(sigResult);
          break;
        default:
          throw new Error(`Unsupported operation type: ${(operation as any).type}`);
      }
    }

    return results;
  }

  /**
   * Process a transaction operation
   */
  protected async processTransactionOperation(
    operation: TransactionOperation<C>,
  ): Promise<TransactionResponse> {
    try {
      const signature = await this.config.wallet!.signAndSendTransaction(operation.transactionData);

      switch (this.config.transactionOptions?.strategy || TransactionStrategy.SignSendAndConfirm) {
        case TransactionStrategy.SignSendAndConfirm:
          const txReceipt = await this.config.wallet!.waitForTransactionConfirmation(signature);
          return {
            txId: txReceipt.txId,
            status: txReceipt.status,
            error: txReceipt.error,
            metadata: {
              operation: operation.metadata,
              receipt: txReceipt.metadata,
            },
          };
        case TransactionStrategy.SignAndSend:
          return {
            txId: signature,
            status: 'pending',
            metadata: {
              operation: operation.metadata,
            },
          };
        default:
          throw new Error(
            `Unsupported transaction strategy: ${this.config.transactionOptions?.strategy}`,
          );
      }
    } catch (error) {
      return {
        txId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          operation: operation.metadata
        }
      };
    }
  }

  /**
   * Process a signature operation
   */
  protected abstract processSignatureOperation(
    operation: SignatureOperation<C>,
  ): Promise<SignatureResponse>;
}
