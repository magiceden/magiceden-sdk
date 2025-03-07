import { BaseApiClient } from './base';
import { ClientConfig } from '../../types';
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
  @supportedOn(['solana', 'evm'])
  async createLaunchpad(params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/launchpad/create', {
      ...params,
      creatorWallet: walletAddress,
    });
  }

  /**
   * Gets instructions to update a launchpad
   */
  @supportedOn(['solana', 'evm'])
  async updateLaunchpad(launchpadId: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post(`/launchpad/${launchpadId}/update`, {
      ...params,
      creatorWallet: walletAddress,
    });
  }

  /**
   * Gets instructions to mint from a launchpad
   */
  @supportedOn(['solana', 'evm'])
  async mint(launchpadId: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post(`/collections/${launchpadId}/mint`, {
      ...params,
      minter: walletAddress,
    });
  }

  // Helper methods for API URLs
  getBaseUrl(): string {
    const isDev = this.config.environment === 'development';
    return isDev
      ? 'https://api-mainnet.magiceden.dev/v4'
      : 'https://api-mainnet.magiceden.dev/v4';
  }
}
