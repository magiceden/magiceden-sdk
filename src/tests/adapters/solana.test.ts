import { SolanaTransactionAdapters } from '../../adapters/transactions';
import { VersionedTransaction } from '@solana/web3.js';

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
      expect(result[0]).toEqual({ mockTransaction: true });

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
      expect(result[0]).toEqual({ mockTransaction: true });

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
      const mockBuffer = Buffer.from([1, 0, 1, 3, 206, 211]);
      
      // Mock VersionedTransaction.deserialize
      const deserializeSpy = jest
        .spyOn(VersionedTransaction, 'deserialize')
        .mockImplementation(() => ({ mockTransaction: true }) as unknown as VersionedTransaction);

      const result = SolanaTransactionAdapters.fromBuffer(mockBuffer);

      expect(deserializeSpy).toHaveBeenCalledWith(mockBuffer);
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toEqual({ mockTransaction: true });

      deserializeSpy.mockRestore();
    });

    it('should throw error for invalid buffer data', () => {
      const mockBuffer = Buffer.from([0, 1, 2, 3]); // Invalid format
      
      // Mock VersionedTransaction.deserialize to throw
      jest.spyOn(VersionedTransaction, 'deserialize')
        .mockImplementation(() => {
          throw new Error('Deserialization error');
        });

      expect(() => {
        SolanaTransactionAdapters.fromBuffer(mockBuffer);
      }).toThrow('Invalid transaction data, only versioned transactions are supported');
    });
  });
});
