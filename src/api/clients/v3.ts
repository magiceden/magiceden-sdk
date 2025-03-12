import { BaseApiClient, ApiClientOptions } from './base';

/**
 * V3 API client implementation (primarily for EVM chains)
 */
export class V3ApiClient extends BaseApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  // V3-specific implementation methods (completely different from V2)

  // Helper method for API URL
  getBaseUrl(): string {
    // Same url for dev and prod
    return 'https://api-mainnet.magiceden.dev/v3';
  }
}
