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
    return this.v4ApiClient.createLaunchpad(params);
  }

  /**
   * Get update launchpad transaction instructions from API
   * @param launchpadId The launchpad ID
   * @param params Launchpad update parameters
   */
  protected async getUpdateLaunchpadInstructions(launchpadId: string, params: UpdateLaunchpadParams): Promise<any> {
    return this.v4ApiClient.updateLaunchpad(launchpadId, params);
  }

  /**
   * Get mint transaction instructions from API
   * @param launchpadId The launchpad ID
   * @param params Mint parameters
   */
  protected async getMintInstructions(launchpadId: string, params: MintParams): Promise<any> {
    return this.v4ApiClient.mint(launchpadId, params);
  }

  /**
   * Get list transaction instructions from API
   * @param params Listing parameters
   */
  protected async getListInstructions(params: ListParams): Promise<any> {
    return this.v2ApiClient.list(params);
  }

  /**
   * Get cancel listing transaction instructions from API
   * @param params Cancel listing parameters
   */
  protected async getCancelListingInstructions(params: CancelListingParams): Promise<any> {
    return this.v2ApiClient.cancelListing(params);
  }

  /**
   * Get buy transaction instructions from API
   * @param params Buy parameters
   */
  protected async getBuyInstructions(params: BuyParams): Promise<any> {
    return this.v2ApiClient.buy(params);
  }

  /**
   * Get make offer transaction instructions from API
   * @param params Make offer parameters
   */
  protected async getMakeOfferInstructions(params: MakeOfferParams): Promise<any> {
    return this.v2ApiClient.makeOffer(params);
  }

  /**
   * Get cancel offer transaction instructions from API
   * @param params Cancel offer parameters
   */
  protected async getCancelOfferInstructions(params: CancelOfferParams): Promise<any> {
    return this.v2ApiClient.cancelOffer(params);
  }

  /**
   * Get take offer transaction instructions from API
   * @param params Take offer parameters
   */
  protected async getTakeOfferInstructions(params: TakeOfferParams): Promise<any> {
    return this.v2ApiClient.takeOffer(params);
  }

  /**
   * Get transfer transaction instructions from API
   * @param mintAddress The mint address of the NFT
   * @param params Transfer parameters
   */
  protected async getTransferInstructions(params: TransferParams): Promise<any> {
    return this.v2ApiClient.transfer(params);
  }
}
