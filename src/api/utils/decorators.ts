import { ApiError } from '../../errors';
import { BaseApiClient } from '../clients/base';
import { ChainType } from '../../types';

/**
 * Decorator factory that creates a decorator to specify which chains support an operation
 * @param chains Array of chains that support this operation
 */
export function supportedOn(chains: ChainType[]): any {
  return function (target: any, key: string, descriptor: any): any {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]): any {
      const currentChain = this.config.chain;

      if (!chains.includes(currentChain)) {
        throw new ApiError(`Operation ${key} is not supported on ${currentChain}`);
      }

      return original.apply(this, args);
    };

    return descriptor;
  };
}
