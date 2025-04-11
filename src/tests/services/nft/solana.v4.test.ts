import {
  SolanaApiMappers,
  SolanaMintParams,
  SolanaUpdateLaunchpadParams,
  V4MintResponse,
  V4UpdateLaunchpadResponse,
} from '../../..';
import {
  MintStageKind,
  SolanaCreateLaunchpadParams,
  SolanaTransactionAdapters,
  SolProtocolType,
  V4CreateLaunchpadResponse,
} from '../../..';
import { Blockchain, ChainType } from '../../../types/chains';
import { SolanaNftService, V4TransactionResponse } from '../../..';
import { V4ApiClient } from '../../../api/clients/v4';
import { V2ApiClient } from '../../../api/clients/v2';

// Mock dependencies
jest.mock('../../../mappers/nft/solana');
jest.mock('../../../adapters/transactions/solana');
jest.mock('../../../api/clients/v2');
jest.mock('../../../api/clients/v4');

describe('SolanaNftService V4', () => {
  let service: SolanaNftService;
  let mockWallet: any;
  let mockV2ApiClient: jest.Mocked<V2ApiClient>;
  let mockV4ApiClient: jest.Mocked<V4ApiClient>;
  let mockTransaction: any;

  let mockV4Response: V4TransactionResponse;
  const validSolanaPubkey = '11111111111111111111111111111111';
  const mockTransactionBase64 = 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

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

    // Create mock API clients manually instead of trying to access instances
    mockV2ApiClient = {
      getInstructions: jest.fn(),
    } as unknown as jest.Mocked<V2ApiClient>;

    mockV4ApiClient = {
      createLaunchpad: jest.fn(),
      updateLaunchpad: jest.fn(),
      mint: jest.fn(),
    } as unknown as jest.Mocked<V4ApiClient>;

    // Replace the service's API clients with our mocks
    (service as any).v2ApiClient = mockV2ApiClient;
    (service as any).v4ApiClient = mockV4ApiClient;

    // Setup default mock implementations
    (SolanaTransactionAdapters.fromInstructionsResponse as jest.Mock).mockReturnValue([
      mockTransaction,
    ]);
    (SolanaTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockReturnValue([
      mockTransaction,
    ]);
  });

  // Helper function to create standard launchpad params
  const createLaunchpadParams = (): SolanaCreateLaunchpadParams => ({
    name: 'Test Collection',
    symbol: 'TEST',
    description: 'Test description',
    chain: Blockchain.SOLANA as Blockchain.SOLANA,
    protocol: SolProtocolType.METAPLEX_CORE as SolProtocolType.METAPLEX_CORE,
    creator: validSolanaPubkey,
    payoutRecipient: validSolanaPubkey,
    royaltyRecipients: [{ address: validSolanaPubkey, share: 100 }],
    imageUrl: 'https://example.com/image.png',
    tokenImageUrl: 'https://example.com/token.png',
    isOpenEdition: false,
    royaltyBps: 500,
    mintStages: {
      stages: [
        {
          kind: MintStageKind.Public,
          price: {
            currency: { chain: Blockchain.SOLANA, assetId: 'So11111111111111111111111111111111111111112' },
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
  });

  // Helper function to create standard mint params
  const createMintParams = (): SolanaMintParams => ({
    chain: Blockchain.SOLANA as Blockchain.SOLANA,
    collectionId: validSolanaPubkey,
    nftAmount: 1,
    stageId: 'stage1',
    kind: MintStageKind.Public,
    candyMachineId: validSolanaPubkey,
    symbol: 'TEST',
    recipient: validSolanaPubkey,
  });

  describe('createLaunchpad', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = createLaunchpadParams();
      const mockApiRequest = { name: 'Test Launchpad' /* other fields */ };

      // Create mock response with metadata
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
      // Setup mocks
      const mockParams = createLaunchpadParams();

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
        collectionId: 'collectionAddress123',
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
        nftAmount: 3,
        stageId: 'stage1',
        kind: MintStageKind.Public,
        candyMachineId: 'candyMachineId123',
        symbol: 'TEST',
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
        nftAmount: 3,
        stageId: 'stage1',
        kind: MintStageKind.Public,
        candyMachineId: 'candyMachineId123',
        symbol: 'TEST',
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
      (SolanaApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({
        launchpadAddress: validSolanaPubkey,
      });
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
              data: '0x0',
            },
          },
        ],
      };

      // Setup mock implementations
      (SolanaApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({
        launchpadAddress: validSolanaPubkey,
      });
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
