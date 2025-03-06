import { ApiManager } from '../../utils/api';
import { ClientConfig, ChainType } from '../../types';
import { BaseNftService } from './base';
import { SolanaNftService } from './solana';
import { ApiError } from '../../errors';

/**
 * Factory for creating NFT services
 */
export class NftServiceFactory {
  /**
   * Creates an NFT service based on the chain
   */
  static create(api: ApiManager, config: ClientConfig): BaseNftService {
    switch (config.chain) {
      case 'solana':
        return new SolanaNftService(api, config);
      case 'ethereum':
      case 'arbitrum':
      case 'base':
      case 'polygon':
        // For MVP, we'll throw an error for EVM chains
        // Later we can implement EVM-specific NFT services
        throw new ApiError(`EVM chain support for ${config.chain} is coming soon`);
      case 'bitcoin':
        throw new ApiError('Bitcoin NFT support is coming soon');
      default:
        throw new ApiError(`Unsupported chain: ${config.chain}`);
    }
  }
}
