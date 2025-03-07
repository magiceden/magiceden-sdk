import { BaseApiClient } from './base';
import { ClientConfig } from '../../types';

/**
 * V3 API client implementation (primarily for EVM chains)
 */
export class V3ApiClient extends BaseApiClient {
  constructor(config: ClientConfig) {
    super(config);
  }

  // V3-specific implementation methods (completely different from V2)

  // Helper method for API URL
  getBaseUrl(): string {
    const isDev = this.config.environment === 'development';

    // You could add chain-specific paths if needed
    return isDev ? 'https://api-mainnet.magiceden.dev/v3' : 'https://api-mainnet.magiceden.dev/v3';
  }
}
