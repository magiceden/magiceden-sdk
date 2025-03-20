import { ApiError } from '../../errors';
import { BaseApiClient } from '../clients/base';
import { ChainType } from '../../types';

/**
 * Decorator factory that creates a decorator to specify which chains support an operation
 * @param chains Array of chains that support this operation
 * @returns A method decorator that validates chain support
 */
export function supportedOn(chains: ChainType[]) {
  return function(
    originalMethod: any,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);
    
    return function(this: BaseApiClient, ...args: any[]) {
      const currentChain = this.chain;
      
      if (!chains.includes(currentChain)) {
        throw new Error(`Operation ${methodName} is not supported on ${currentChain}`);
      }
      
      return originalMethod.apply(this, args);
    };
  };
}
