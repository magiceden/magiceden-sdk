import { EvmApiMappers } from '../../mappers/nft/ethereum';
import { EvmCreateLaunchpadParams, EvmUpdateLaunchpadParams, EvmMintParams } from '../../types';
import { Blockchain } from '../../types/chains';
import { EvmProtocolType } from '../../types/protocol';
import { MintStageKind } from '../../types/services/nft/shared';

describe('EvmApiMappers V4', () => {
  describe('createLaunchpadRequest', () => {
    it('should correctly map create launchpad parameters for ERC721', () => {
      const params: EvmCreateLaunchpadParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
        creator: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'Test Collection',
        symbol: 'TEST',
        imageUrl: 'https://example.com/image.png',
        description: 'Test description',
        royaltyBps: 500,
        royaltyRecipients: [
          { address: '0xabcdef1234567890abcdef1234567890abcdef12', share: 60 },
          { address: '0x7890abcdef1234567890abcdef1234567890abcd', share: 40 },
        ],
        payoutRecipient: '0x2345678901abcdef2345678901abcdef23456789',
        nftMetadataUrl: 'https://example.com/metadata.json',
        tokenImageUrl: 'https://example.com/token.png',
        mintStages: {
          stages: [
            {
              kind: MintStageKind.Public,
              price: {
                currency: { chain: Blockchain.ETHEREUM, assetId: '0x0000000000000000000000000000000000000000' },
                raw: '100000000000000000',
              },
              startTime: '2023-01-01T00:00:00Z',
              endTime: '2023-01-02T00:00:00Z',
              walletLimit: 5,
              maxSupply: 100,
            },
          ],
          maxSupply: 100,
        },
      };

      const result = EvmApiMappers.v4.createLaunchpadRequest(params);

      // Verify the result is a valid V4CreateLaunchpadRequest
      expect(result).toBeDefined();

      // Verify required EVM-specific properties
      expect(result.chain).toBe(Blockchain.ETHEREUM);
      expect(result.protocol).toBe(EvmProtocolType.ERC721);
      expect(result.creator).toBe('0x1234567890abcdef1234567890abcdef12345678');
      expect(result.social?.discordUrl).toBe('https://discord.com/test');
      expect(result.social?.externalUrl).toBe('https://example.com');
      expect(result.social?.twitterUsername).toBe('testuser');
      expect(result.name).toBe('Test Collection');
      expect(result.symbol).toBe('TEST');
      expect(result.imageUrl).toBe('https://example.com/image.png');
      expect(result.description).toBe('Test description');
      expect(result.royaltyBps).toBe(500);
      expect(result.royaltyRecipients).toHaveLength(2);
      expect(result.payoutRecipient).toBe('0x2345678901abcdef2345678901abcdef23456789');
      expect(result.nftMetadataUrl).toBe('https://example.com/metadata.json');
      expect(result.tokenImageUrl).toBe('https://example.com/token.png');

      // Verify mint stages
      expect(result.mintStages).toBeDefined();
      expect(result.mintStages.stages).toHaveLength(1);
      expect(result.mintStages.stages[0].kind).toBe(MintStageKind.Public);
      expect(result.mintStages.stages[0].price.currency).toBe('ETH');
      expect(result.mintStages.stages[0].price.raw).toBe('100000000000000000');
      expect(result.mintStages.maxSupply).toBe(100);
    });

    it('should correctly map create launchpad parameters for ERC1155', () => {
      const params: EvmCreateLaunchpadParams = {
        chain: Blockchain.POLYGON as Blockchain.POLYGON,
        protocol: EvmProtocolType.ERC1155 as EvmProtocolType.ERC1155,
        creator: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'Test Collection',
        symbol: 'TEST',
        imageUrl: 'https://example.com/image.png',
        description: 'Test description',
        royaltyBps: 500,
        royaltyRecipients: [{ address: '0xabcdef1234567890abcdef1234567890abcdef12', share: 100 }],
        payoutRecipient: '0x2345678901abcdef2345678901abcdef23456789',
        nftMetadataUrl: 'https://example.com/metadata.json',
        tokenImageUrl: 'https://example.com/token.png',
        mintStages: {
          stages: [
            {
              kind: MintStageKind.Public,
              price: {
                currency: { chain: Blockchain.POLYGON, assetId: '0x0000000000000000000000000000000000000000' },
                raw: '1000000000000000000',
              },
              startTime: '2023-01-01T00:00:00Z',
              endTime: '2023-01-02T00:00:00Z',
              walletLimit: 10,
              maxSupply: 1000,
            },
          ],
          maxSupply: 1000,
        },
      };

      const result = EvmApiMappers.v4.createLaunchpadRequest(params);

      // Verify the result is a valid V4CreateLaunchpadRequest
      expect(result).toBeDefined();

      // Verify required EVM-specific properties
      expect(result.chain).toBe(Blockchain.POLYGON);
      expect(result.protocol).toBe(EvmProtocolType.ERC1155);
      expect(result.creator).toBe('0x1234567890abcdef1234567890abcdef12345678');
      expect(result.name).toBe('Test Collection');
      expect(result.symbol).toBe('TEST');

      // Verify mint stages for ERC1155
      expect(result.mintStages).toBeDefined();
      expect(result.mintStages.stages[0].price.currency).toBe('MATIC');
      expect(result.mintStages.maxSupply).toBe(1000);
    });
  });

  describe('updateLaunchpadRequest', () => {
    it('should correctly map update launchpad parameters', () => {
      const params: EvmUpdateLaunchpadParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
        collectionId: '0x3456789012abcdef3456789012abcdef34567890',
        owner: '0x4567890123abcdef4567890123abcdef45678901',
        social: {
          discordUrl: 'https://discord.com/updated',
          externalUrl: 'https://example.com/updated',
          twitterUsername: 'updateduser',
        },
        name: 'Updated Collection',
        imageUrl: 'https://example.com/updated-image.png',
        description: 'Updated description',
        royaltyBps: 700,
        royaltyRecipients: [
          { address: '0xabcdef1234567890abcdef1234567890abcdef12', share: 70 },
          { address: '0x7890abcdef1234567890abcdef1234567890abcd', share: 30 },
        ],
        payoutRecipient: '0x5678901234abcdef5678901234abcdef56789012',
        message: 'Update collection message to sign',
        signature: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        mintStages: {
          stages: [
            {
              kind: MintStageKind.Public,
              price: {
                currency: { chain: Blockchain.ETHEREUM, assetId: '0x0000000000000000000000000000000000000000' },
                raw: '200000000000000000',
              },
              startTime: '2023-02-01T00:00:00Z',
              endTime: '2023-02-02T00:00:00Z',
              walletLimit: 3,
              maxSupply: 50,
            },
          ],
          maxSupply: 50,
        },
      };

      const result = EvmApiMappers.v4.updateLaunchpadRequest(params);

      // Verify the result is a valid V4UpdateLaunchpadRequest
      expect(result).toBeDefined();

      // Verify chain and protocol
      expect(result.chain).toBe(Blockchain.ETHEREUM);
      expect(result.protocol).toBe(EvmProtocolType.ERC721);

      // Verify collection and owner identifiers
      expect(result.collectionId).toBe('0x3456789012abcdef3456789012abcdef34567890');
      expect(result.owner).toBe('0x4567890123abcdef4567890123abcdef45678901');

      // Verify social media links
      expect(result.social?.discordUrl).toBe('https://discord.com/updated');
      expect(result.social?.externalUrl).toBe('https://example.com/updated');
      expect(result.social?.twitterUsername).toBe('updateduser');

      // Verify metadata updates
      expect(result.name).toBe('Updated Collection');
      expect(result.imageUrl).toBe('https://example.com/updated-image.png');
      expect(result.description).toBe('Updated description');

      // Verify royalty updates
      expect(result.royaltyBps).toBe(700);
      expect(result.royaltyRecipients).toHaveLength(2);
      expect(result.royaltyRecipients![0].address).toBe(
        '0xabcdef1234567890abcdef1234567890abcdef12',
      );
      expect(result.royaltyRecipients![0].share).toBe(70);
      expect(result.royaltyRecipients![1].address).toBe(
        '0x7890abcdef1234567890abcdef1234567890abcd',
      );
      expect(result.royaltyRecipients![1].share).toBe(30);

      // Verify payout recipient
      expect(result.payoutRecipient).toBe('0x5678901234abcdef5678901234abcdef56789012');

      // Verify EVM-specific properties
      expect(result.message).toBe('Update collection message to sign');
      expect(result.signature).toBe(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      );

      // Verify mint stages
      expect(result.mintStages).toBeDefined();
      expect(result.mintStages!.stages[0].price.currency).toBe('ETH');
      expect(result.mintStages!.maxSupply).toBe(50);
    });

    it('should handle optional parameters for ERC1155', () => {
      const params: EvmUpdateLaunchpadParams = {
        chain: Blockchain.POLYGON as Blockchain.POLYGON,
        protocol: EvmProtocolType.ERC1155 as EvmProtocolType.ERC1155,
        collectionId: '0x3456789012abcdef3456789012abcdef34567890',
        owner: '0x4567890123abcdef4567890123abcdef45678901',
        name: 'Updated ERC1155 Collection',
        tokenId: 1,
        message: 'Update ERC1155 collection message',
        signature: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      };

      const result = EvmApiMappers.v4.updateLaunchpadRequest(params);

      // Verify required properties
      expect(result.chain).toBe(Blockchain.POLYGON);
      expect(result.protocol).toBe(EvmProtocolType.ERC1155);
      expect(result.collectionId).toBe('0x3456789012abcdef3456789012abcdef34567890');
      expect(result.owner).toBe('0x4567890123abcdef4567890123abcdef45678901');
      expect(result.name).toBe('Updated ERC1155 Collection');
      expect(result.tokenId).toBe(1);
      expect(result.message).toBe('Update ERC1155 collection message');
      expect(result.signature).toBe(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      );

      // Verify optional properties are undefined
      expect(result.description).toBeUndefined();
      expect(result.royaltyBps).toBeUndefined();
      expect(result.royaltyRecipients).toBeUndefined();
    });
  });

  describe('mintRequest', () => {
    it('should correctly map mint parameters for ERC721', () => {
      const params: EvmMintParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
        collectionId: '0x3456789012abcdef3456789012abcdef34567890',
        nftAmount: 3,
        stageId: 'stage1',
        kind: MintStageKind.Public,
      };

      const result = EvmApiMappers.v4.mintRequest('0x4567890123abcdef4567890123abcdef45678901', params);

      // Verify the result is a valid V4MintRequest
      expect(result).toBeDefined();

      // Verify required EVM-specific properties
      expect(result.collectionId).toBe('0x3456789012abcdef3456789012abcdef34567890');
      expect(result.wallet).toBe('0x4567890123abcdef4567890123abcdef45678901');
      expect(result.nftAmount).toBe(3);
      expect(result.stageId).toBe('stage1');
      expect(result.kind).toBe(MintStageKind.Public);
      expect(result.protocol).toBe(EvmProtocolType.ERC721);
      expect(result.tokenId).toBeUndefined();
    });

    it('should correctly map mint parameters for ERC1155', () => {
      const params: EvmMintParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        protocol: EvmProtocolType.ERC1155 as EvmProtocolType.ERC1155,
        collectionId: '0x3456789012abcdef3456789012abcdef34567890',
        nftAmount: 5,
        kind: MintStageKind.Public,
        tokenId: 1,
      };

      const result = EvmApiMappers.v4.mintRequest('0x4567890123abcdef4567890123abcdef45678901', params);

      // Verify required properties
      expect(result.collectionId).toBe('0x3456789012abcdef3456789012abcdef34567890');
      expect(result.wallet).toBe('0x4567890123abcdef4567890123abcdef45678901');
      expect(result.nftAmount).toBe(5);
      expect(result.kind).toBe(MintStageKind.Public);
      expect(result.protocol).toBe(EvmProtocolType.ERC1155);
      expect(result.tokenId).toBe(1);

      // Verify optional properties are undefined
      expect(result.stageId).toBeUndefined();
    });

    it('should handle optional parameters', () => {
      const params: EvmMintParams = {
        chain: Blockchain.ETHEREUM as Blockchain.ETHEREUM,
        protocol: EvmProtocolType.ERC721 as EvmProtocolType.ERC721,
        collectionId: '0x3456789012abcdef3456789012abcdef34567890',
        nftAmount: 1,
        kind: MintStageKind.Public,
      };

      const result = EvmApiMappers.v4.mintRequest('0x4567890123abcdef4567890123abcdef45678901', params);

      // Verify required properties
      expect(result.collectionId).toBe('0x3456789012abcdef3456789012abcdef34567890');
      expect(result.wallet).toBe('0x4567890123abcdef4567890123abcdef45678901');
      expect(result.nftAmount).toBe(1);
      expect(result.kind).toBe(MintStageKind.Public);
      expect(result.protocol).toBe(EvmProtocolType.ERC721);

      // Verify optional properties are undefined
      expect(result.stageId).toBeUndefined();
      expect(result.tokenId).toBeUndefined();
    });
  });
});
