import { ClientConfig } from '../../types';
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
  static create(config: ClientConfig): BaseNftService {
    switch (config.chain) {
      case 'solana':
        return new SolanaNftService(config);
      case 'evm':
        throw new ApiError('EVM chain support is coming soon');
      case 'bitcoin':
        throw new ApiError('Bitcoin NFT support is coming soon');
      default:
        throw new ApiError(`Unsupported chain: ${config.chain}`);
    }
  }
}
