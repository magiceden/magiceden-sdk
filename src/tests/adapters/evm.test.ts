import { EvmTransactionAdapters } from '../../adapters/transactions';
import { Blockchain } from '../../types/chain';
import { V4TransactionResponse, V4CreateLaunchpadResponse, V4UpdateLaunchpadResponse, V4MintResponse } from '../../types/api';
import { TransactionStep } from '../../types/services/nft/shared';
import { EvmTransactionParams } from '../../types/services/nft/shared/steps';
import { TransactionRequest } from 'viem';

describe('EvmTransactionAdapters', () => {
  describe('fromV4TransactionResponse', () => {
    // Remove console.log statements for cleaner test output
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });

    // Helper function to create a valid EVM transaction step
    const createValidEvmStep = (id: string, from: string, to: string, value?: string, data?: string): TransactionStep => ({
      id,
      chain: Blockchain.ETHEREUM,
      method: 'eth_sendTransaction',
      params: {
        from,
        to,
        ...(value ? { value } : {}),
        ...(data ? { data } : {})
      }
    });

    it('should handle basic V4 transaction response with eth_sendTransaction method', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          createValidEvmStep('step1', '0x1234567890123456789012345678901234567890', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
        ]
      };

      const result = EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
      });
    });

    it('should handle V4CreateLaunchpadResponse with metadata', () => {
      const mockResponse: V4CreateLaunchpadResponse = {
        steps: [
          createValidEvmStep(
            'step1', 
            '0x1234567890123456789012345678901234567890', 
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            '0x123',
            '0x0123456789abcdef'
          )
        ],
        metadata: {
          imageUrl: 'https://example.com/image.png',
          tokenImage: 'https://example.com/token.png',
          metadataUrl: 'https://example.com/metadata.json'
        }
      };

      const result = EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        value: BigInt('0x123'),
        data: '0x0123456789abcdef'
      });
    });

    it('should handle V4UpdateLaunchpadResponse with metadata', () => {
      const mockResponse: V4UpdateLaunchpadResponse = {
        steps: [
          createValidEvmStep(
            'step1', 
            '0x1234567890123456789012345678901234567890', 
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            '0x0',
            '0xabcdef'
          )
        ],
        metadata: {
          imageUrl: 'https://example.com/updated-image.png',
          metadataUrl: 'https://example.com/updated-metadata.json'
        }
      };

      const result = EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        value: BigInt('0x0'),
        data: '0xabcdef'
      });
    });

    it('should handle V4MintResponse', () => {
      const mockResponse: V4MintResponse = {
        steps: [
          createValidEvmStep(
            'step1', 
            '0x1234567890123456789012345678901234567890', 
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            undefined,
            '0xabcdef0123456789'
          )
        ]
      };

      const result = EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        data: '0xabcdef0123456789'
      });
    });

    it('should handle multiple steps with transactions', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          createValidEvmStep(
            'step1', 
            '0x1234567890123456789012345678901234567890', 
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            '0x123'
          ),
          createValidEvmStep(
            'step2', 
            '0x2234567890123456789012345678901234567890', 
            '0xbbcdefabcdefabcdefabcdefabcdefabcdefabcd',
            '0x456',
            '0xfedcba'
          )
        ]
      };

      const result = EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        value: BigInt('0x123')
      });
      expect(result[1]).toEqual({
        from: '0x2234567890123456789012345678901234567890',
        to: '0xbbcdefabcdefabcdefabcdefabcdefabcdefabcd',
        value: BigInt('0x456'),
        data: '0xfedcba'
      });
    });

    it('should handle transaction with chainId and gas parameters', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.ETHEREUM,
            method: 'eth_sendTransaction',
            params: {
              from: '0x1234567890123456789012345678901234567890',
              to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
              value: '0x123',
              chainId: 1,
              gas: '0x5208' // 21000 in hex
            }
          }
        ]
      };

      const result = EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        from: '0x1234567890123456789012345678901234567890',
        to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        value: BigInt('0x123'),
        chainId: 1,
        gas: BigInt('0x5208')
      });
    });

    it('should throw error for empty steps array', () => {
      const mockResponse: V4TransactionResponse = {
        steps: []
      };

      expect(() => {
        EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('Invalid transaction response: missing steps');
    });

    it('should throw error for unsupported method', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.ETHEREUM,
            method: 'unsupportedMethod' as any,
            params: {
              from: '0x1234567890123456789012345678901234567890',
              to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
            }
          }
        ]
      };

      expect(() => {
        EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('No valid EVM transaction steps found in response');
    });

    it('should throw error for invalid from address', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.ETHEREUM,
            method: 'eth_sendTransaction',
            params: {
              from: 'invalid-address',
              to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
            }
          }
        ]
      };

      expect(() => {
        EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('No valid EVM transaction steps found in response');
    });

    it('should throw error for invalid to address', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.ETHEREUM,
            method: 'eth_sendTransaction',
            params: {
              from: '0x1234567890123456789012345678901234567890',
              to: 'invalid-address'
            }
          }
        ]
      };

      expect(() => {
        EvmTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('No valid EVM transaction steps found in response');
    });
  });

  describe('fromV3TransactionResponse', () => {
    it('should return an empty array', () => {
      const mockResponse = { someData: 'value' };
      const result = EvmTransactionAdapters.fromV3TransactionResponse(mockResponse);
      expect(result).toEqual([]);
    });
  });
});
