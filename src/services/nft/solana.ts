import { BaseNftService } from './base';
import {
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
import { ClientConfig } from '../../types';
import { V4ApiClient } from '../../api/clients/v4';
import { V2ApiClient } from '../../api/clients/v2';

/**
 * Solana-specific NFT service implementation
 */
export class SolanaNftService extends BaseNftService {
  private readonly v2ApiClient: V2ApiClient;
  private readonly v4ApiClient: V4ApiClient;

  constructor(config: ClientConfig) {
    super(config);
    
    this.v2ApiClient = new V2ApiClient(config);
    this.v4ApiClient = new V4ApiClient(config);
  }

  /**
   * Get create launchpad transaction instructions from API
   * @param params Launchpad creation parameters
   */
  protected async getCreateLaunchpadInstructions(params: CreateLaunchpadParams): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.v4ApiClient.createLaunchpad(params);
  }

  /**
   * Get update launchpad transaction instructions from API
   * @param launchpadId The launchpad ID
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadInstructions(launchpadId: string, params: UpdateLaunchpadParams): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.v4ApiClient.updateLaunchpad(launchpadId, params);
  }

  /**
   * Get mint transaction instructions from API
   * @param launchpadId The launchpad ID
   * @param params Mint parameters
   */
  protected async getMintInstructions(launchpadId: string, params: MintParams): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.v4ApiClient.mint(launchpadId, params);
  }

  /**
   * Get list transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Listing parameters
   */
  protected async getListInstructions(mintAddress: string, params: ListParams): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.v2ApiClient.list(mintAddress, params);
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Cancel listing parameters
   */
  protected async getCancelListingInstructions(mintAddress: string, params: CancelListingParams): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.v2ApiClient.cancelListing(mintAddress, params);
  }

  /**
   * Get buy transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Buy parameters
   */
  protected async getBuyInstructions(mintAddress: string, params: BuyParams): Promise<any> {
    const buyerWallet = await this.config.wallet!.getAddress();

    return this.v2ApiClient.buy(mintAddress, params);
  }

  /**
   * Get make offer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Make offer parameters
   */
  protected async getMakeOfferInstructions(mintAddress: string, params: MakeOfferParams): Promise<any> {
    const buyerWallet = await this.config.wallet!.getAddress();

    return this.v2ApiClient.makeOffer(mintAddress, params);
  }

  /**
   * Get cancel offer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Cancel offer parameters
   */
  protected async getCancelOfferInstructions(mintAddress: string, params: CancelOfferParams): Promise<any> {
    const buyerWallet = await this.config.wallet!.getAddress();

    return this.v2ApiClient.cancelOffer(mintAddress, params);
  }

  /**
   * Get take offer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Take offer parameters
   */
  protected async getTakeOfferInstructions(mintAddress: string, params: TakeOfferParams): Promise<any> {
    const buyerWallet = await this.config.wallet!.getAddress();

    return this.v2ApiClient.takeOffer(mintAddress, params);
  }

  /**
   * Get transfer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Transfer parameters
   */
  protected async getTransferInstructions(mintAddress: string, params: TransferParams): Promise<any> {
    const senderWallet = await this.config.wallet!.getAddress();

    return this.v2ApiClient.transfer(mintAddress, params);
  }
}
