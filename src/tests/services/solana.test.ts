import { SolanaNftService } from '../../services/nft/solana';
import { SolanaApiMappers } from '../../mappers/nft/solana';
import { SolanaTransactionAdapters } from '../../adapters/transactions/solana';
import { V2ApiClient } from '../../api/clients/v2';
import { ChainType } from '../../types';

// Mock dependencies
jest.mock('../../mappers/nft/solana');
jest.mock('../../adapters/transactions/solana');
jest.mock('../../api/clients/v2');

describe('SolanaNftService', () => {
  let service: SolanaNftService;
  let mockWallet: any;
  let mockV2ApiClient: jest.Mocked<V2ApiClient>;
  let mockTransaction: any;
  let mockApiResponse: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock transaction
    mockTransaction = {
      /* mock transaction object */
      serialize: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
    };

    // Create mock API response
    mockApiResponse = {
      v0: {
        txSigned: {
          type: 'Buffer',
          data: [1, 2, 3],
        },
      },
    };

    // Create mock wallet
    mockWallet = {
      signAndSendTransaction: jest.fn().mockResolvedValue('mockTxHash123'),
    };

    // Create service instance
    service = new SolanaNftService({
      chain: ChainType.SOLANA,
      apiKey: 'test-api-key',
      wallet: mockWallet,
    });

    // Get mock API client instance
    mockV2ApiClient = (V2ApiClient as jest.MockedClass<typeof V2ApiClient>).mock
      .instances[0] as jest.Mocked<V2ApiClient>;

    // Setup default mock implementations
    (SolanaTransactionAdapters.fromInstructionsResponse as jest.Mock).mockReturnValue(mockTransaction);
  });

  describe('list', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      const mockApiRequest = { tokenMint: 'mockTokenMint' /* other fields */ };
      
      // Setup mock implementations
      (SolanaApiMappers.v2.listRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV2ApiClient.list.mockResolvedValue(mockApiResponse);

      // Call the method
      const result = await service.list(mockParams);

      // Verify the flow
      expect(SolanaApiMappers.v2.listRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV2ApiClient.list).toHaveBeenCalledWith(mockApiRequest);
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual({ txId: 'mockTxHash123', status: 'pending' });
    });

    it('should handle API errors', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      // Setup mock to throw error
      mockV2ApiClient.list.mockRejectedValue(new Error('API error'));

      // Call the method and expect it to throw
      await expect(service.list(mockParams)).rejects.toThrow('API error');
    });

    it('should handle wallet errors', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      // Setup wallet to throw error
      mockWallet.signAndSendTransaction.mockRejectedValue(new Error('Wallet error'));

      // Call the method and expect it to throw
      await expect(service.list(mockParams)).rejects.toThrow('Wallet error');
    });
  });

  describe('cancelListing', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      const mockApiRequest = { tokenMint: 'mockTokenMint' /* other fields */ };
      
      // Setup mock implementations
      (SolanaApiMappers.v2.cancelListingRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV2ApiClient.cancelListing.mockResolvedValue(mockApiResponse);

      // Call the method
      const result = await service.cancelListing(mockParams);

      // Verify the flow
      expect(SolanaApiMappers.v2.cancelListingRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV2ApiClient.cancelListing).toHaveBeenCalledWith(mockApiRequest);
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual({ txId: 'mockTxHash123', status: 'pending' });
    });
  });

  describe('makeItemOffer', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        buyer: 'mockBuyer',
        auctionHouseAddress: 'mockAuctionHouse',
        expiry: 1234567890,
      };

      const mockApiRequest = { tokenMint: 'mockTokenMint' /* other fields */ };
      
      // Setup mock implementations
      (SolanaApiMappers.v2.makeItemOfferRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV2ApiClient.makeItemOffer.mockResolvedValue(mockApiResponse);

      // Call the method
      const result = await service.makeItemOffer(mockParams);

      // Verify the flow
      expect(SolanaApiMappers.v2.makeItemOfferRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV2ApiClient.makeItemOffer).toHaveBeenCalledWith(mockApiRequest);
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual({ txId: 'mockTxHash123', status: 'pending' });
    });
  });

  describe('cancelItemOffer', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        buyer: 'mockBuyer',
        auctionHouseAddress: 'mockAuctionHouse',
        expiry: 1234567890,
      };

      const mockApiRequest = { tokenMint: 'mockTokenMint' /* other fields */ };
      
      // Setup mock implementations
      (SolanaApiMappers.v2.cancelItemOfferRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV2ApiClient.cancelItemOffer.mockResolvedValue(mockApiResponse);

      // Call the method
      const result = await service.cancelItemOffer(mockParams);

      // Verify the flow
      expect(SolanaApiMappers.v2.cancelItemOfferRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV2ApiClient.cancelItemOffer).toHaveBeenCalledWith(mockApiRequest);
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual({ txId: 'mockTxHash123', status: 'pending' });
    });
  });

  describe('takeItemOffer', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        buyer: 'mockBuyer',
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenATA: 'mockTokenATA',
        price: 1000000000,
        newPrice: 1100000000,
        buyerExpiry: 1234567890,
        sellerExpiry: 1234567891,
      };

      const mockApiRequest = { tokenMint: 'mockTokenMint' /* other fields */ };
      
      // Setup mock implementations
      (SolanaApiMappers.v2.takeItemOfferRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV2ApiClient.takeItemOffer.mockResolvedValue(mockApiResponse);

      // Call the method
      const result = await service.takeItemOffer(mockParams);

      // Verify the flow
      expect(SolanaApiMappers.v2.takeItemOfferRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV2ApiClient.takeItemOffer).toHaveBeenCalledWith(mockApiRequest);
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual({ txId: 'mockTxHash123', status: 'pending' });
    });
  });

  describe('buy', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        buyer: 'mockBuyer',
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenATA: 'mockTokenATA',
        price: 1000000000,
        sellerExpiry: 1234567891,
      };

      const mockApiRequest = { tokenMint: 'mockTokenMint' /* other fields */ };
      
      // Setup mock implementations
      (SolanaApiMappers.v2.buyRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV2ApiClient.buy.mockResolvedValue(mockApiResponse);

      // Call the method
      const result = await service.buy(mockParams);

      // Verify the flow
      expect(SolanaApiMappers.v2.buyRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV2ApiClient.buy).toHaveBeenCalledWith(mockApiRequest);
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual({ txId: 'mockTxHash123', status: 'pending' });
    });
  });

  describe('transfer', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        from: 'mockFrom',
        to: 'mockTo',
      };

      const mockApiRequest = { mint: 'mockTokenMint' /* other fields */ };
      
      // Setup mock implementations
      (SolanaApiMappers.v2.transferRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV2ApiClient.transfer.mockResolvedValue(mockApiResponse);

      // Call the method
      const result = await service.transfer(mockParams);

      // Verify the flow
      expect(SolanaApiMappers.v2.transferRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV2ApiClient.transfer).toHaveBeenCalledWith(mockApiRequest);
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(mockApiResponse);
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual({ txId: 'mockTxHash123', status: 'pending' });
    });
  });

  describe('error handling', () => {
    it('should handle adapter errors', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      // Setup adapter to throw error
      (SolanaTransactionAdapters.fromInstructionsResponse as jest.Mock).mockImplementation(() => {
        throw new Error('Adapter error');
      });

      // Call the method and expect it to throw
      await expect(service.list(mockParams)).rejects.toThrow('Adapter error');
    });

    it('should handle mapper errors', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      // Setup mapper to throw error
      (SolanaApiMappers.v2.listRequest as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid transaction response format');
      });

      // Call the method and expect it to throw
      await expect(service.list(mockParams)).rejects.toThrow('Invalid transaction response format');
    });
  });

  describe('edge cases', () => {
    it('should handle empty transaction response', async () => {
      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      // Setup API to return empty response
      mockV2ApiClient.list.mockResolvedValue({} as any);

      // Setup adapter to throw for empty response
      (SolanaTransactionAdapters.fromInstructionsResponse as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid transaction response format');
      });

      // Call the method and expect it to throw
      await expect(service.list(mockParams)).rejects.toThrow('Invalid transaction response format');
    });

    it('should handle null wallet', async () => {
      // Create service with null wallet
      service = new SolanaNftService({
        chain: ChainType.SOLANA,
        apiKey: 'test-api-key',
        wallet: null as any,
      });

      // Setup mocks
      const mockParams = {
        tokenAddress: 'mockTokenMint',
        price: 1000000000,
        seller: 'mockSeller',
        auctionHouseAddress: 'mockAuctionHouse',
        tokenAccount: 'mockTokenAccount',
        expiry: 1234567890,
      };

      // Call the method and expect it to throw
      await expect(service.list(mockParams)).rejects.toThrow();
    });
  });
});
