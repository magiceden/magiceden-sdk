import { SolanaTransactionAdapters } from '../../adapters/transactions';
import { VersionedTransaction } from '@solana/web3.js';
import { Blockchain } from '../../types/chains';
import { V4TransactionResponse, V4CreateLaunchpadResponse, V4UpdateLaunchpadResponse, V4MintResponse } from '../../types/api';
import { SolanaTransactionParams } from '../../types/services/nft/shared/steps';
import { TransactionStep } from '../../types/services/nft/shared';
import { SolanaSignAndSendStep } from '../../types/services/nft/shared/steps';

describe('SolanaTransactionAdapters', () => {
  describe('fromInstructionsResponse', () => {
    it('should handle versioned transaction with signed data', () => {
      // Mock buffer data
      const mockData = new Uint8Array([1, 0, 1, 3, 206, 211]);
      
      const mockResponse = {
        v0: {
          txSigned: {
            type: 'Buffer',
            data: Array.from(mockData)
          }
        }
      };

      // Mock VersionedTransaction.deserialize
      const deserializeSpy = jest
        .spyOn(VersionedTransaction, 'deserialize')
        .mockImplementation(() => ({ mockTransaction: true }) as unknown as VersionedTransaction);

      const result = SolanaTransactionAdapters.fromInstructionsResponse(mockResponse as any);

      expect(deserializeSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });

      deserializeSpy.mockRestore();
    });

    it('should handle versioned transaction with unsigned data', () => {
      // Mock buffer data
      const mockData = new Uint8Array([1, 0, 1, 3, 206, 211]);
      
      const mockResponse = {
        v0: {
          tx: {
            type: 'Buffer',
            data: Array.from(mockData)
          }
        }
      };

      // Mock VersionedTransaction.deserialize
      const deserializeSpy = jest
        .spyOn(VersionedTransaction, 'deserialize')
        .mockImplementation(() => ({ mockTransaction: true }) as unknown as VersionedTransaction);

      const result = SolanaTransactionAdapters.fromInstructionsResponse(mockResponse as any);

      expect(deserializeSpy).toHaveBeenCalled();
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });

      deserializeSpy.mockRestore();
    });

    it('should throw error for invalid response', () => {
      const mockResponse = {};

      expect(() => {
        SolanaTransactionAdapters.fromInstructionsResponse(mockResponse as any);
      }).toThrow('Invalid transaction response format, only versioned transactions are supported');
    });

    it('should throw error for legacy transaction format', () => {
      const mockResponse = {
        txSigned: {
          type: 'Buffer',
          data: [1, 0, 1, 3, 206, 211]
        }
      };

      expect(() => {
        SolanaTransactionAdapters.fromInstructionsResponse(mockResponse as any);
      }).toThrow('Invalid transaction response format, only versioned transactions are supported');
    });
  });

  describe('fromBuffer', () => {
    it('should deserialize versioned transaction from buffer', () => {
      // Setup
      const mockBuffer = Buffer.from([1, 2, 3]);
      const mockTransaction = { mockTransaction: true };
      
      // Mock VersionedTransaction.deserialize
      const deserializeSpy = jest.spyOn(VersionedTransaction, 'deserialize')
        .mockReturnValue(mockTransaction as any);
      
      // Call the method
      const result = SolanaTransactionAdapters.fromBuffer(mockBuffer);
      
      // Verify
      expect(deserializeSpy).toHaveBeenCalledWith(mockBuffer);
      expect(result).toBeInstanceOf(Array);
      
      // Update expectation to match the actual structure
      expect(result[0]).toEqual({
        mockTransaction: true
      });
      
      // Clean up
      deserializeSpy.mockRestore();
    });

    it('should throw error for invalid buffer data', () => {
      const mockBuffer = Buffer.from([0, 1, 2, 3]); // Invalid format
      
      // Mock VersionedTransaction.deserialize to throw
      jest.spyOn(VersionedTransaction, 'deserialize')
        .mockImplementation(() => {
          throw new Error('Invalid transaction response format, only Solana transactions are supported');
        });

      expect(() => {
        SolanaTransactionAdapters.fromBuffer(mockBuffer);
      }).toThrow('Invalid transaction data, only versioned transactions are supported');
    });
  });

  describe('fromV4TransactionResponse', () => {
    // Mock transaction data
    const mockTransactionBase64 = 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
    
    // Valid Solana public key format for tests
    const validSolanaPubkey = '11111111111111111111111111111111';
    
    // Setup mock for VersionedTransaction.deserialize
    let deserializeSpy: jest.SpyInstance;
    
    beforeEach(() => {
      // Remove console.log statements from the implementation for cleaner test output
      jest.spyOn(console, 'log').mockImplementation(() => {});
      
      deserializeSpy = jest.spyOn(VersionedTransaction, 'deserialize')
        .mockImplementation(() => ({ mockTransaction: true }) as unknown as VersionedTransaction);
    });
    
    afterEach(() => {
      deserializeSpy.mockRestore();
      jest.restoreAllMocks();
    });

    // Helper function to create a valid Solana transaction step
    const createValidSolanaStep = (id: string, feePayer: string, transactions: Array<{
      transaction: string;
      signerPubkeys?: string[];
    }>): TransactionStep => ({
      id,
      chain: Blockchain.SOLANA,
      method: 'signAllAndSendTransactions',
      params: {
        feePayer,
        transactions
      }
    });

    it('should handle basic V4 transaction response with signAllAndSendTransactions method', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          createValidSolanaStep('step1', validSolanaPubkey, [
            {
              transaction: mockTransactionBase64,
              signerPubkeys: []
            }
          ])
        ]
      };

      const result = SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(deserializeSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
    });

    it('should handle V4CreateLaunchpadResponse with metadata', () => {
      const mockResponse: V4CreateLaunchpadResponse = {
        steps: [
          createValidSolanaStep('step1', validSolanaPubkey, [
            {
              transaction: mockTransactionBase64,
              signerPubkeys: []
            }
          ])
        ],
        metadata: {
          imageUrl: 'https://example.com/image.png',
          tokenImage: 'https://example.com/token.png',
          metadataUrl: 'https://example.com/metadata.json'
        }
      };

      const result = SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(deserializeSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
    });

    it('should handle V4UpdateLaunchpadResponse with metadata', () => {
      const mockResponse: V4UpdateLaunchpadResponse = {
        steps: [
          createValidSolanaStep('step1', validSolanaPubkey, [
            {
              transaction: mockTransactionBase64,
              signerPubkeys: []
            }
          ])
        ],
        metadata: {
          imageUrl: 'https://example.com/updated-image.png',
          metadataUrl: 'https://example.com/updated-metadata.json'
        }
      };

      const result = SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(deserializeSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
    });

    it('should handle V4MintResponse', () => {
      const mockResponse: V4MintResponse = {
        steps: [
          createValidSolanaStep('step1', validSolanaPubkey, [
            {
              transaction: mockTransactionBase64,
              signerPubkeys: []
            }
          ])
        ]
      };

      const result = SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(deserializeSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
    });

    it('should handle multiple transactions in a single step', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          createValidSolanaStep('step1', validSolanaPubkey, [
            {
              transaction: mockTransactionBase64,
              signerPubkeys: []
            },
            {
              transaction: mockTransactionBase64,
              signerPubkeys: [validSolanaPubkey, validSolanaPubkey]
            }
          ])
        ]
      };

      const result = SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);

      expect(deserializeSpy).toHaveBeenCalledTimes(2);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
      expect(result[1]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
    });

    it('should handle multiple steps with transactions', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          createValidSolanaStep('step1', validSolanaPubkey, [
            {
              transaction: mockTransactionBase64,
              signerPubkeys: []
            }
          ]),
          createValidSolanaStep('step2', validSolanaPubkey, [
            {
              transaction: mockTransactionBase64,
              signerPubkeys: [validSolanaPubkey]
            }
          ])
        ]
      };

      const result = SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);

      // Should process both steps
      expect(deserializeSpy).toHaveBeenCalledTimes(2);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
      expect(result[1]).toEqual({
        type: 'transaction',
        transactionData: { mockTransaction: true }
      });
    });

    it('should throw error for empty steps array', () => {
      const mockResponse: V4TransactionResponse = {
        steps: []
      };

      expect(() => {
        SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('Invalid transaction response format, only Solana transactions are supported');
    });

    it('should throw error for non-Solana chain', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.ETHEREUM,
            method: 'eth_sendTransaction',
            params: {
              from: '0x123',
              to: '0x456',
              value: '0x0',
              data: '0x0'
            }
          }
        ]
      };

      expect(() => {
        SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('Invalid transaction response format, only Solana transactions are supported');
    });

    it('should throw error for unsupported method', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.SOLANA,
            method: 'unsupportedMethod' as any,
            params: {
              feePayer: 'mockFeePayer',
              transactions: []
            }
          }
        ]
      };

      expect(() => {
        SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('Invalid transaction response format, only Solana transactions are supported');
    });

    it('should throw error for invalid transaction data', () => {
      const mockResponse: V4TransactionResponse = {
        steps: [
          createValidSolanaStep('step1', 'mockFeePayer', [
            {
              transaction: 'invalid-base64',
              signerPubkeys: []
            }
          ])
        ]
      };

      // Mock deserialize to throw an error
      deserializeSpy.mockImplementation(() => {
        throw new Error('Invalid transaction response format, only Solana transactions are supported');
      });

      expect(() => {
        SolanaTransactionAdapters.fromV4TransactionResponse(mockResponse);
      }).toThrow('Invalid transaction response format, only Solana transactions are supported');
    });
  });
});
