import { ChainType, ClientConfig } from '../../types';
import { BaseNftService } from './base';
import { SolanaNftService } from './solana';
import { ApiError } from '../../errors';
import { EvmNftService } from './evm';

/**
 * Factory for creating NFT services
 */
export class NftServiceFactory {
  /**
   * Creates an NFT service based on the chain
   */
  static create(config: ClientConfig): BaseNftService {
    switch (config.chain) {
      case ChainType.SOLANA:
        return new SolanaNftService(config);
      case ChainType.EVM:
        return new EvmNftService(config);
      default:
        throw new ApiError(`Unsupported chain: ${config.chain}`);
    }
  }
}
