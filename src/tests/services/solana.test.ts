import { SolanaNftService } from '../../services/nft/solana';
import { SolanaApiMappers } from '../../mappers/nft/solana';
import { SolanaTransactionAdapters } from '../../adapters/transactions/solana';
import { V2ApiClient } from '../../api/clients/v2';
import { V4ApiClient } from '../../api/clients/v4';
import {
  ChainType,
  Blockchain,
  MintStageKind,
  SolanaCreateLaunchpadParams,
  SolanaUpdateLaunchpadParams,
  SolanaMintParams,
} from '../../types';
import {
  V4TransactionResponse,
  V4CreateLaunchpadResponse,
  V4UpdateLaunchpadResponse,
  V4MintResponse,
} from '../../types/api';
import { SolProtocolType } from '../../types';

// Mock dependencies
jest.mock('../../mappers/nft/solana');
jest.mock('../../adapters/transactions/solana');
jest.mock('../../api/clients/v2');
jest.mock('../../api/clients/v4');

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
      getAddress: jest.fn().mockReturnValue('mock-address'),
      signAndSendTransaction: jest.fn().mockResolvedValue('mock-signature'),
      waitForTransactionConfirmation: jest.fn().mockResolvedValue({
        txId: 'mock-signature',
        status: 'confirmed',
      }),
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
    (SolanaTransactionAdapters.fromInstructionsResponse as jest.Mock).mockReturnValue([
      mockTransaction,
    ]);
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
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(
        mockApiResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
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
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(
        mockApiResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
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
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(
        mockApiResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
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
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(
        mockApiResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
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
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(
        mockApiResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
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
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(
        mockApiResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
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
      expect(SolanaTransactionAdapters.fromInstructionsResponse).toHaveBeenCalledWith(
        mockApiResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
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

  describe('V4 endpoints', () => {
    let mockV4ApiClient: jest.Mocked<V4ApiClient>;
    let mockV4Response: V4TransactionResponse;
    const validSolanaPubkey = '11111111111111111111111111111111';
    const mockTransactionBase64 =
      'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();

      // Create mock transaction
      mockTransaction = {
        /* mock transaction object */
        serialize: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
      };

      // Create mock V4 API response
      mockV4Response = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.SOLANA,
            method: 'signAllAndSendTransactions',
            params: {
              feePayer: validSolanaPubkey,
              transactions: [
                {
                  transaction: mockTransactionBase64,
                  signerPubkeys: [],
                },
              ],
            },
          },
        ],
      };

      // Create mock wallet
      mockWallet = {
        getAddress: jest.fn().mockReturnValue(validSolanaPubkey),
        signAndSendTransaction: jest.fn().mockResolvedValue('mock-signature'),
        waitForTransactionConfirmation: jest.fn().mockResolvedValue({
          txId: 'mock-signature',
          status: 'confirmed',
        }),
      };

      // Create service instance
      service = new SolanaNftService({
        chain: ChainType.SOLANA,
        apiKey: 'test-api-key',
        wallet: mockWallet,
      });

      // Get mock API client instances
      mockV2ApiClient = (V2ApiClient as jest.MockedClass<typeof V2ApiClient>).mock
        .instances[0] as jest.Mocked<V2ApiClient>;
      mockV4ApiClient = (V4ApiClient as jest.MockedClass<typeof V4ApiClient>).mock
        .instances[0] as jest.Mocked<V4ApiClient>;

      // Setup default mock implementations
      (SolanaTransactionAdapters.fromInstructionsResponse as jest.Mock).mockReturnValue([
        mockTransaction,
      ]);
      (SolanaTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockReturnValue([
        mockTransaction,
      ]);
    });

    describe('createLaunchpad', () => {
      it('should map parameters, call API, and sign transaction', async () => {
        // Setup mocks with the correct parameter structure based on the error message
        const mockParams: SolanaCreateLaunchpadParams = {
          chain: Blockchain.SOLANA as Blockchain.SOLANA,
          protocol: SolProtocolType.METAPLEX_CORE as SolProtocolType.METAPLEX_CORE,
          creator: 'creatorAddress123',
          social: {
            discordUrl: 'https://discord.com/test',
            externalUrl: 'https://example.com',
            twitterUsername: 'testuser',
          },
          name: 'Test Collection',
          symbol: 'TEST',
          imageUrl: 'https://example.com/image.png',
          description: 'Test description',
          royaltyBps: 500,
          royaltyRecipients: [
            { address: 'recipient1', share: 60 },
            { address: 'recipient2', share: 40 },
          ],
          payoutRecipient: 'payoutAddress123',
          nftMetadataUrl: 'https://example.com/metadata.json',
          tokenImageUrl: 'https://example.com/token.png',
          mintStages: {
            stages: [
              {
                kind: MintStageKind.Public,
                price: {
                  currency: 'SOL',
                  raw: '1000000000',
                },
                startTime: '2023-01-01T00:00:00Z',
                endTime: '2023-01-02T00:00:00Z',
                walletLimit: 5,
                maxSupply: 100,
              },
            ],
            maxSupply: 100,
          },
          isOpenEdition: false,
        };

        const mockApiRequest = { name: 'Test Launchpad' /* other fields */ };

        // Create mock response with metadata according to V4CreateLaunchpadResponse
        const mockResponseWithMetadata: V4CreateLaunchpadResponse = {
          steps: mockV4Response.steps,
          metadata: {
            imageUrl: 'https://example.com/image.png',
            tokenImage: 'https://example.com/token.png',
            metadataUrl: 'https://example.com/metadata.json',
          },
        };

        // Setup mock implementations
        (SolanaApiMappers.v4.createLaunchpadRequest as jest.Mock).mockReturnValue(mockApiRequest);
        mockV4ApiClient.createLaunchpad.mockResolvedValue(mockResponseWithMetadata);

        // Call the method
        const result = await service.createLaunchpad(mockParams);

        // Verify the flow
        expect(SolanaApiMappers.v4.createLaunchpadRequest).toHaveBeenCalledWith(mockParams);
        expect(mockV4ApiClient.createLaunchpad).toHaveBeenCalledWith(mockApiRequest);
        expect(SolanaTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
          mockResponseWithMetadata,
        );
        expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
        expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
      });

      it('should handle API errors', async () => {
        // Setup mocks with the correct parameter structure
        const mockParams: SolanaCreateLaunchpadParams = {
          chain: Blockchain.SOLANA as Blockchain.SOLANA,
          protocol: SolProtocolType.METAPLEX_CORE as SolProtocolType.METAPLEX_CORE,
          creator: 'creatorAddress123',
          social: {
            discordUrl: 'https://discord.com/test',
            externalUrl: 'https://example.com',
            twitterUsername: 'testuser',
          },
          name: 'Test Collection',
          symbol: 'TEST',
          imageUrl: 'https://example.com/image.png',
          description: 'Test description',
          royaltyBps: 500,
          royaltyRecipients: [
            { address: 'recipient1', share: 60 },
            { address: 'recipient2', share: 40 },
          ],
          payoutRecipient: 'payoutAddress123',
          nftMetadataUrl: 'https://example.com/metadata.json',
          tokenImageUrl: 'https://example.com/token.png',
          mintStages: {
            stages: [
              {
                kind: MintStageKind.Public,
                price: {
                  currency: 'SOL',
                  raw: '1000000000',
                },
                startTime: '2023-01-01T00:00:00Z',
                endTime: '2023-01-02T00:00:00Z',
                walletLimit: 5,
                maxSupply: 100,
              },
            ],
            maxSupply: 100,
          },
          isOpenEdition: false,
        };

        // Setup mock to throw error
        mockV4ApiClient.createLaunchpad.mockRejectedValue(new Error('API error'));

        // Call the method and expect it to throw
        await expect(service.createLaunchpad(mockParams)).rejects.toThrow('API error');
      });
    });

    describe('updateLaunchpad', () => {
      it('should map parameters, call API, and sign transaction', async () => {
        // Setup mocks with the correct parameter structure
        const mockParams: SolanaUpdateLaunchpadParams = {
          chain: Blockchain.SOLANA as Blockchain.SOLANA,
          protocol: SolProtocolType.METAPLEX_CORE as SolProtocolType.METAPLEX_CORE,
          collection: 'collectionAddress123',
          owner: 'ownerAddress123',
          social: {
            discordUrl: 'https://discord.com/test',
            externalUrl: 'https://example.com',
            twitterUsername: 'testuser',
          },
          name: 'Updated Collection',
          imageUrl: 'https://example.com/updated-image.png',
          description: 'Updated description',
          royaltyBps: 700,
          royaltyRecipients: [
            { address: 'recipient1', share: 70 },
            { address: 'recipient2', share: 30 },
          ],
          payoutRecipient: 'updatedPayoutAddress123',
          candyMachineId: 'candyMachineId123',
          symbol: 'TEST',
          newSymbol: 'UPDT',
          externalLink: 'https://example.com/external',
          payer: 'payerAddress123',
          authorization: {
            signature: 'signature123',
            signer: 'signerAddress123',
            timestamp: 'timestamp123',
          },
        };

        const mockApiRequest = { launchpadAddress: validSolanaPubkey /* other fields */ };

        // Create mock response with metadata according to V4UpdateLaunchpadResponse
        const mockResponseWithMetadata: V4UpdateLaunchpadResponse = {
          steps: mockV4Response.steps,
          metadata: {
            imageUrl: 'https://example.com/updated-image.png',
            tokenImage: 'https://example.com/updated-token.png',
            metadataUrl: 'https://example.com/updated-metadata.json',
          },
        };

        // Setup mock implementations
        (SolanaApiMappers.v4.updateLaunchpadRequest as jest.Mock).mockReturnValue(mockApiRequest);
        mockV4ApiClient.updateLaunchpad.mockResolvedValue(mockResponseWithMetadata);

        // Call the method
        const result = await service.updateLaunchpad(mockParams);

        // Verify the flow
        expect(SolanaApiMappers.v4.updateLaunchpadRequest).toHaveBeenCalledWith(mockParams);
        expect(mockV4ApiClient.updateLaunchpad).toHaveBeenCalledWith(mockApiRequest);
        expect(SolanaTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
          mockResponseWithMetadata,
        );
        expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
        expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
      });
    });

    describe('mint', () => {
      it('should map parameters, call API, and sign transaction', async () => {
        // Setup mocks
        const mockParams: SolanaMintParams = {
          chain: Blockchain.SOLANA as Blockchain.SOLANA,
          collectionId: 'collectionId123',
          wallet: 'walletAddress123',
          nftAmount: 3,
          stageId: 'stage1',
          kind: MintStageKind.Public,
          candyMachineId: 'candyMachineId123',
          symbol: 'TEST',
          payer: 'payerAddress123',
          recipient: 'recipientAddress123',
        };

        const mockApiRequest = { launchpadAddress: validSolanaPubkey /* other fields */ };

        // Create mock response according to V4MintResponse (no metadata)
        const mockMintResponse: V4MintResponse = {
          steps: mockV4Response.steps,
        };

        // Setup mock implementations
        (SolanaApiMappers.v4.mintRequest as jest.Mock).mockReturnValue(mockApiRequest);
        mockV4ApiClient.mint.mockResolvedValue(mockMintResponse);

        // Call the method
        const result = await service.mint(mockParams);

        // Verify the flow
        expect(SolanaApiMappers.v4.mintRequest).toHaveBeenCalledWith(mockParams);
        expect(mockV4ApiClient.mint).toHaveBeenCalledWith(mockApiRequest);
        expect(SolanaTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
          mockMintResponse,
        );
        expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
        expect(result).toEqual([{ txId: 'mock-signature', status: 'confirmed' }]);
      });

      it('should handle multiple transactions', async () => {
        // Setup mocks
        const mockParams: SolanaMintParams = {
          chain: Blockchain.SOLANA as Blockchain.SOLANA,
          collectionId: 'collectionId123',
          wallet: 'walletAddress123',
          nftAmount: 3,
          stageId: 'stage1',
          kind: MintStageKind.Public,
          candyMachineId: 'candyMachineId123',
          symbol: 'TEST',
          payer: 'payerAddress123',
          recipient: 'recipientAddress123',
        };

        // Create a response with multiple transactions (no metadata for V4MintResponse)
        const multiTxResponse: V4MintResponse = {
          steps: [
            {
              id: 'step1',
              chain: Blockchain.SOLANA,
              method: 'signAllAndSendTransactions',
              params: {
                feePayer: validSolanaPubkey,
                transactions: [
                  {
                    transaction: mockTransactionBase64,
                    signerPubkeys: [],
                  },
                  {
                    transaction: mockTransactionBase64,
                    signerPubkeys: [],
                  },
                ],
              },
            },
          ],
        };

        const mockTransaction1 = {
          serialize: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
        };
        const mockTransaction2 = {
          serialize: jest.fn().mockReturnValue(new Uint8Array([4, 5, 6])),
        };

        // Setup mock implementations
        (SolanaApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({
          launchpadAddress: validSolanaPubkey,
        });
        mockV4ApiClient.mint.mockResolvedValue(multiTxResponse);
        (SolanaTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockReturnValue([
          mockTransaction1,
          mockTransaction2,
        ]);

        // Mock wallet to return different signatures for each transaction
        mockWallet.signAndSendTransaction
          .mockResolvedValueOnce('mock-signature-1')
          .mockResolvedValueOnce('mock-signature-2');

        mockWallet.waitForTransactionConfirmation
          .mockResolvedValueOnce({ txId: 'mock-signature-1', status: 'confirmed' })
          .mockResolvedValueOnce({ txId: 'mock-signature-2', status: 'confirmed' });

        // Call the method
        const result = await service.mint(mockParams);

        // Verify the flow
        expect(mockV4ApiClient.mint).toHaveBeenCalledWith({ launchpadAddress: validSolanaPubkey });
        expect(SolanaTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
          multiTxResponse,
        );
        expect(mockWallet.signAndSendTransaction).toHaveBeenCalledTimes(2);
        expect(mockWallet.waitForTransactionConfirmation).toHaveBeenCalledTimes(2);
        expect(result).toEqual([
          { txId: 'mock-signature-1', status: 'confirmed' },
          { txId: 'mock-signature-2', status: 'confirmed' },
        ]);
      });

      it('should handle adapter errors for V4 responses', async () => {
        // Setup mocks
        const mockParams = {
          chain: Blockchain.SOLANA as Blockchain.SOLANA,
          collectionId: 'collectionId123',
          wallet: 'walletAddress123',
          nftAmount: 3,
          stageId: 'stage1',
          kind: MintStageKind.Public,
          candyMachineId: 'candyMachineId123',
          symbol: 'TEST',
          payer: 'payerAddress123',
          recipient: 'recipientAddress123',
        };

        // Setup adapter to throw error
        (SolanaTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockImplementation(() => {
          throw new Error('Adapter error');
        });

        // Setup mock implementations
        (SolanaApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({ launchpadAddress: validSolanaPubkey });
        mockV4ApiClient.mint.mockResolvedValue(mockV4Response);

        // Call the method and expect it to throw
        await expect(service.mint(mockParams)).rejects.toThrow('Adapter error');
      });

      it('should handle invalid V4 response format', async () => {
        // Setup mocks
        const mockParams = {
          chain: Blockchain.SOLANA as Blockchain.SOLANA,
          collectionId: 'collectionId123',
          wallet: 'walletAddress123',
          nftAmount: 3,
          stageId: 'stage1',
          kind: MintStageKind.Public,
          candyMachineId: 'candyMachineId123',
          symbol: 'TEST',
          payer: 'payerAddress123',
          recipient: 'recipientAddress123',
        };

        // Create an invalid response
        const invalidResponse = {
          steps: [
            {
              id: 'step1',
              chain: Blockchain.ETHEREUM, // Wrong chain
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

        // Setup mock implementations
        (SolanaApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({ launchpadAddress: validSolanaPubkey });
        mockV4ApiClient.mint.mockResolvedValue(invalidResponse as any);
        
        // Make the adapter throw the expected error for invalid format
        (SolanaTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockImplementation(() => {
          throw new Error('Invalid transaction response format');
        });

        // Call the method and expect it to throw
        await expect(service.mint(mockParams)).rejects.toThrow('Invalid transaction response format');
      });
    });
  });
});
