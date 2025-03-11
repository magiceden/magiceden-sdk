import { BaseApiClient } from './base';
import { ChainType, ClientConfig } from '../../types';
import { supportedOn } from '../utils/decorators';

/**
 * V4 API client implementation (for launchpad operations)
 */
export class V4ApiClient extends BaseApiClient {
  constructor(config: ClientConfig) {
    super(config);
  }

  /**
   * Gets instructions to create a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async createLaunchpad(params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/self_serve/nft/create_token', {
      ...params,
      creatorWallet: walletAddress,
    });
  }

  /**
   * Gets instructions to update a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async updateLaunchpad(launchpadId: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post(`/self_serve/nft/update_token`, {
      ...params,
      creatorWallet: walletAddress,
    });
  }

  @supportedOn([ChainType.SOLANA])
  async publishLaunchpad(launchpadId: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post(`/self_serve/nft/publish`, {
      ...params,
      creatorWallet: walletAddress,
    });
  }

  /**
   * Gets instructions to mint from a launchpad
   */
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async mint(launchpadId: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post(`/self_serve/nft/mint_token`, {
      ...params,
      minter: walletAddress,
    });
  }

  // Helper methods for API URLs
  getBaseUrl(): string {
    // Same url for dev and prod
    return 'https://api-mainnet.magiceden.dev/v4';
  }
}
