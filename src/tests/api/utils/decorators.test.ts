// src/tests/api/utils/decorators.test.ts
import { supportedOn } from '../../../api/utils/decorators';
import { ApiError } from '../../../errors';
import { BaseApiClient } from '../../../api/clients/base';
import { ChainType } from '../../../types';


// Mock class that extends BaseApiClient for testing
class TestApiClient extends BaseApiClient {
  constructor(chain: ChainType) {
    super({
      chain,
      apiKey: 'test-key',
    });
  }

  // Method that's only supported on Solana and Ethereum
  @supportedOn([ChainType.SOLANA, ChainType.EVM])
  async testMethod(param: string): Promise<string> {
    return `Called with ${param}`;
  }

  // Method that's only supported on Solana
  @supportedOn([ChainType.SOLANA])
  async solanaOnlyMethod(param: string): Promise<string> {
    return `Solana method called with ${param}`;
  }

  getBaseUrl(): string {
    return 'https://api.example.com';
  }
}

describe('supportedOn decorator', () => {
  it('should allow method calls on supported chains', async () => {
    // Create client for Solana
    const solanaClient = new TestApiClient(ChainType.SOLANA);

    // Should work fine
    const result = await solanaClient.testMethod('test');
    expect(result).toBe('Called with test');

    // Create client for Ethereum
    const evmClient = new TestApiClient(ChainType.EVM);

    // Should also work fine
    const ethResult = await evmClient.testMethod('eth-test');
    expect(ethResult).toBe('Called with eth-test');
  });

  it('should throw ApiError when method is called on unsupported chain', async () => {
    // Create client for an EVM chain (not Solana)
    const evmClient = new TestApiClient(ChainType.EVM);

    let error: unknown;
    try {
      await evmClient.solanaOnlyMethod('test');
    } catch (e) {
      error = e;
    }

    // Now check the error outside the try/catch
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(ApiError);
    
    if (error instanceof ApiError) {
      expect(error.message).toBe('Operation solanaOnlyMethod is not supported on evm');
    }
  });
});
