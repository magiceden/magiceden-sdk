import {
  EvmApiMappers,
  EvmMintParams,
  EvmProtocolType,
  EvmUpdateLaunchpadParams,
  V4MintResponse,
  V4UpdateLaunchpadResponse,
} from '../../..';
import {
  EvmCreateLaunchpadParams,
  EvmTransactionAdapters,
  MintStageKind,
  V4CreateLaunchpadResponse,
} from '../../..';
import { Blockchain, ChainType } from '../../../types/chains';
import { EvmNftService } from '../../../services/nft/evm';
import { V4TransactionResponse } from '../../../types/api';
import { V4ApiClient } from '../../../api/clients/v4';
import { V3ApiClient } from '../../../api/clients/v3';
import { TransactionRequest } from 'viem';

// Mock dependencies
jest.mock('../../../mappers/nft/ethereum');
jest.mock('../../../adapters/transactions/ethereum');
jest.mock('../../../api/clients/v3');
jest.mock('../../../api/clients/v4');

describe('EvmNftService V4', () => {
  let service: EvmNftService;
  let mockWallet: any;
  let mockV3ApiClient: jest.Mocked<V3ApiClient>;
  let mockV4ApiClient: jest.Mocked<V4ApiClient>;
  let mockTransaction: TransactionRequest;

  let mockV4Response: V4TransactionResponse;
  const validEvmAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock transaction
    mockTransaction = {
      from: '0x1234567890123456789012345678901234567890' as `0x${string}`,
      to: '0x0987654321098765432109876543210987654321' as `0x${string}`,
      data: '0x123456',
    };

    // Create mock V4 API response
    mockV4Response = {
      steps: [
        {
          id: 'step1',
          chain: Blockchain.ETHEREUM,
          method: 'eth_sendTransaction',
          params: {
            from: validEvmAddress,
            to: '0x0987654321098765432109876543210987654321',
            data: '0x123456',
          },
        },
      ],
    };

    // Create mock wallet
    mockWallet = {
      getAddress: jest.fn().mockReturnValue(validEvmAddress),
      signAndSendTransaction: jest.fn().mockResolvedValue('0xmock-transaction-hash'),
      waitForTransactionConfirmation: jest.fn().mockResolvedValue({
        txId: '0xmock-transaction-hash',
        status: 'confirmed',
      }),
    };

    // Create service instance
    service = new EvmNftService({
      chain: ChainType.EVM,
      apiKey: 'test-api-key',
      wallet: mockWallet,
    });

    // Create mock API clients manually
    mockV3ApiClient = {
      list: jest.fn(),
      cancelListing: jest.fn(),
      makeItemOffer: jest.fn(),
      takeItemOffer: jest.fn(),
      cancelItemOffer: jest.fn(),
      buy: jest.fn(),
      transfer: jest.fn(),
    } as unknown as jest.Mocked<V3ApiClient>;

    mockV4ApiClient = {
      createLaunchpad: jest.fn(),
      updateLaunchpad: jest.fn(),
      mint: jest.fn(),
      publishLaunchpad: jest.fn(),
    } as unknown as jest.Mocked<V4ApiClient>;

    // Replace the service's API clients with our mocks
    (service as any).v3ApiClient = mockV3ApiClient;
    (service as any).v4ApiClient = mockV4ApiClient;

    // Setup default mock implementations
    (EvmTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockReturnValue([
      mockTransaction,
    ]);
  });

  // Helper function to create standard launchpad params
  const createLaunchpadParams = (): EvmCreateLaunchpadParams => ({
    name: 'Test Collection',
    symbol: 'TEST',
    description: 'Test description',
    chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
    creator: validEvmAddress,
    payoutRecipient: validEvmAddress,
    royaltyRecipients: [{ address: validEvmAddress, share: 100 }],
    imageUrl: 'https://example.com/image.png',
    tokenImageUrl: 'https://example.com/token.png',
    protocol: EvmProtocolType.ERC721,
    royaltyBps: 500,
    mintStages: {
      stages: [
        {
          kind: MintStageKind.Public,
          price: {
            currency: 'ETH',
            raw: '1000000000000000000',
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
  const createMintParams = (): EvmMintParams => ({
    chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
    collectionId: validEvmAddress,
    wallet: validEvmAddress,
    nftAmount: 1,
    stageId: 'stage1',
    kind: MintStageKind.Public,
    protocol: EvmProtocolType.ERC721,
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
      (EvmApiMappers.v4.createLaunchpadRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV4ApiClient.createLaunchpad.mockResolvedValue(mockResponseWithMetadata);

      // Call the method
      const result = await service.createLaunchpad(mockParams);

      // Verify the flow
      expect(EvmApiMappers.v4.createLaunchpadRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV4ApiClient.createLaunchpad).toHaveBeenCalledWith(mockApiRequest);
      expect(EvmTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
        mockResponseWithMetadata,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: '0xmock-transaction-hash', status: 'confirmed' }]);
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
      const mockParams: EvmUpdateLaunchpadParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        protocol: EvmProtocolType.ERC721,
        collection: validEvmAddress,
        owner: validEvmAddress,
        message: 'Update collection message',
        signature: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
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
          { address: validEvmAddress, share: 70 },
          { address: validEvmAddress, share: 30 },
        ],
        payoutRecipient: validEvmAddress,
      };

      const mockApiRequest = { collection: validEvmAddress /* other fields */ };

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
      (EvmApiMappers.v4.updateLaunchpadRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV4ApiClient.updateLaunchpad.mockResolvedValue(mockResponseWithMetadata);

      // Call the method
      const result = await service.updateLaunchpad(mockParams);

      // Verify the flow
      expect(EvmApiMappers.v4.updateLaunchpadRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV4ApiClient.updateLaunchpad).toHaveBeenCalledWith(mockApiRequest);
      expect(EvmTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
        mockResponseWithMetadata,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: '0xmock-transaction-hash', status: 'confirmed' }]);
    });

    it('should handle API errors', async () => {
      // Setup mocks
      const mockParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
        collection: validEvmAddress,
        owner: validEvmAddress,
        message: 'Update collection message',
        signature: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
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
          { address: validEvmAddress, share: 70 },
          { address: validEvmAddress, share: 30 },
        ],
        payoutRecipient: validEvmAddress,
      };

      // Setup mock to throw error
      mockV4ApiClient.updateLaunchpad.mockRejectedValue(new Error('API error'));

      // Call the method and expect it to throw
      await expect(service.updateLaunchpad(mockParams)).rejects.toThrow('API error');
    });
  });

  describe('mint', () => {
    it('should map parameters, call API, and sign transaction', async () => {
      // Setup mocks
      const mockParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        params: [
          {
            chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
            protocol: EvmProtocolType.ERC721,
            collectionId: validEvmAddress,
            wallet: validEvmAddress,
            nftAmount: 3,
            stageId: 'stage1',
            kind: MintStageKind.Public,
          },
        ],
      };

      const mockApiRequest = { collection: validEvmAddress /* other fields */ };

      // Create mock response according to V4MintResponse (no metadata)
      const mockMintResponse: V4MintResponse = {
        steps: mockV4Response.steps,
      };

      // Setup mock implementations
      (EvmApiMappers.v4.mintRequest as jest.Mock).mockReturnValue(mockApiRequest);
      mockV4ApiClient.mint.mockResolvedValue(mockMintResponse);

      // Call the method
      const result = await service.mint(mockParams);

      // Verify the flow
      expect(EvmApiMappers.v4.mintRequest).toHaveBeenCalledWith(mockParams);
      expect(mockV4ApiClient.mint).toHaveBeenCalledWith(mockApiRequest);
      expect(EvmTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
        mockMintResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual([{ txId: '0xmock-transaction-hash', status: 'confirmed' }]);
    });

    it('should handle multiple transactions', async () => {
      // Setup mocks
      const mockParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        params: [
          {
            chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
            protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
            collectionId: validEvmAddress,
            wallet: validEvmAddress,
            nftAmount: 3,
            stageId: 'stage1',
            kind: MintStageKind.Public,
          },
        ],
      };

      // Create a response with multiple transactions (no metadata for V4MintResponse)
      const multiTxResponse: V4MintResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.ETHEREUM,
            method: 'eth_sendTransaction',
            params: {
              from: validEvmAddress,
              to: '0x0987654321098765432109876543210987654321',
              data: '0x123456',
            },
          },
          {
            id: 'step2',
            chain: Blockchain.ETHEREUM,
            method: 'eth_sendTransaction',
            params: {
              from: validEvmAddress,
              to: '0x0987654321098765432109876543210987654321',
              data: '0x789abc',
            },
          },
        ],
      };

      const mockTransaction1 = {
        from: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        to: '0x0987654321098765432109876543210987654321' as `0x${string}`,
        data: '0x123456',
      };
      const mockTransaction2 = {
        from: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        to: '0x0987654321098765432109876543210987654321' as `0x${string}`,
        data: '0x789abc',
      };

      // Setup mock implementations
      (EvmApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({
        collection: validEvmAddress,
      });
      mockV4ApiClient.mint.mockResolvedValue(multiTxResponse);
      (EvmTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockReturnValue([
        mockTransaction1,
        mockTransaction2,
      ]);

      // Mock wallet to return different signatures for each transaction
      mockWallet.signAndSendTransaction
        .mockResolvedValueOnce('0xmock-transaction-hash-1')
        .mockResolvedValueOnce('0xmock-transaction-hash-2');

      mockWallet.waitForTransactionConfirmation
        .mockResolvedValueOnce({ txId: '0xmock-transaction-hash-1', status: 'confirmed' })
        .mockResolvedValueOnce({ txId: '0xmock-transaction-hash-2', status: 'confirmed' });

      // Call the method
      const result = await service.mint(mockParams);

      // Verify the flow
      expect(mockV4ApiClient.mint).toHaveBeenCalledWith({ collection: validEvmAddress });
      expect(EvmTransactionAdapters.fromV4TransactionResponse).toHaveBeenCalledWith(
        multiTxResponse,
      );
      expect(mockWallet.signAndSendTransaction).toHaveBeenCalledTimes(2);
      expect(mockWallet.waitForTransactionConfirmation).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        { txId: '0xmock-transaction-hash-1', status: 'confirmed' },
        { txId: '0xmock-transaction-hash-2', status: 'confirmed' },
      ]);
    });

    it('should handle adapter errors for V4 responses', async () => {
      // Setup mocks
      const mockParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        params: [
          {
            chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
            protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
            collectionId: validEvmAddress,
            wallet: validEvmAddress,
            nftAmount: 3,
            stageId: 'stage1',
            kind: MintStageKind.Public,
          },
        ],
      };

      // Setup adapter to throw error
      (EvmTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockImplementation(() => {
        throw new Error('Adapter error');
      });

      // Setup mock implementations
      (EvmApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({
        collection: validEvmAddress,
      });
      mockV4ApiClient.mint.mockResolvedValue(mockV4Response);

      // Call the method and expect it to throw
      await expect(service.mint(mockParams)).rejects.toThrow('Adapter error');
    });

    it('should handle invalid V4 response format', async () => {
      // Setup mocks
      const mockParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        params: [
          {
            chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
            protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
            collectionId: validEvmAddress,
            wallet: validEvmAddress,
            nftAmount: 3,
            stageId: 'stage1',
            kind: MintStageKind.Public,
          },
        ],
      };

      // Create an invalid response
      const invalidResponse = {
        steps: [
          {
            id: 'step1',
            chain: Blockchain.SOLANA, // Wrong chain
            method: 'signAllAndSendTransactions',
            params: {
              feePayer: '11111111111111111111111111111111',
              transactions: [
                {
                  transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
                  signerPubkeys: [],
                },
              ],
            },
          },
        ],
      };

      // Setup mock implementations
      (EvmApiMappers.v4.mintRequest as jest.Mock).mockReturnValue({
        collection: validEvmAddress,
      });
      mockV4ApiClient.mint.mockResolvedValue(invalidResponse as any);

      // Make the adapter throw the expected error for invalid format
      (EvmTransactionAdapters.fromV4TransactionResponse as jest.Mock).mockImplementation(() => {
        throw new Error('No valid EVM transaction steps found in response');
      });

      // Call the method and expect it to throw
      await expect(service.mint(mockParams)).rejects.toThrow(
        'No valid EVM transaction steps found in response',
      );
    });
  });

  describe('publishLaunchpad', () => {
    it('should throw an error as it is not supported on EVM', async () => {
      const mockParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        collection: validEvmAddress,
      };

      await expect(service.publishLaunchpad(mockParams)).rejects.toThrow('Not supported on EVM');
    });
  });
});
