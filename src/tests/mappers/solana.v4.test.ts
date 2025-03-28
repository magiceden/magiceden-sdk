import { SolanaApiMappers } from '../../mappers/nft/solana';
import {
  SolanaCreateLaunchpadParams,
  SolanaUpdateLaunchpadParams,
  SolanaMintParams,
} from '../../types';
import { Blockchain } from '../../types/chains';
import { SolProtocolType } from '../../types/protocol';
import { MintStageKind } from '../../types/services/nft/shared';
import { V4CreateLaunchpadRequest, V4UpdateLaunchpadRequest, V4MintRequest } from '../../types/api';

describe('SolanaApiMappers V4', () => {
  describe('createLaunchpadRequest', () => {
    it('should correctly map create launchpad parameters', () => {
      const params: SolanaCreateLaunchpadParams = {
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
        isOpenEdition: false,
      };

      const result = SolanaApiMappers.v4.createLaunchpadRequest(params);

      // Verify the result is a valid V4CreateLaunchpadRequest
      expect(result).toBeDefined();

      // Verify required Solana-specific properties
      expect(result.chain).toBe(Blockchain.SOLANA);
      expect(result.protocol).toBe(SolProtocolType.METAPLEX_CORE);
      expect(result.creator).toBe('creatorAddress123');
      expect(result.social?.discordUrl).toBe('https://discord.com/test');
      expect(result.social?.externalUrl).toBe('https://example.com');
      expect(result.social?.twitterUsername).toBe('testuser');
      expect(result.name).toBe('Test Collection');
      expect(result.symbol).toBe('TEST');
      expect(result.imageUrl).toBe('https://example.com/image.png');
      expect(result.description).toBe('Test description');
      expect(result.royaltyBps).toBe(500);
      expect(result.royaltyRecipients).toHaveLength(2);
      expect(result.payoutRecipient).toBe('payoutAddress123');
      expect(result.nftMetadataUrl).toBe('https://example.com/metadata.json');
      expect(result.tokenImageUrl).toBe('https://example.com/token.png');
      expect(result.isOpenEdition).toBe(false);

      // Verify mint stages
      expect(result.mintStages).toBeDefined();
      expect(result.mintStages.stages).toHaveLength(1);
      expect(result.mintStages.stages[0].kind).toBe(MintStageKind.Public);
      expect(result.mintStages.stages[0].price.currency).toBe('SOL');
      expect(result.mintStages.stages[0].price.raw).toBe('1000000000');
      expect(result.mintStages.maxSupply).toBe(100);
    });
  });

  describe('updateLaunchpadRequest', () => {
    it('should correctly map update launchpad parameters', () => {
      const params: SolanaUpdateLaunchpadParams = {
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

      const result = SolanaApiMappers.v4.updateLaunchpadRequest(params);

      // Verify the result is a valid V4UpdateLaunchpadRequest
      expect(result).toBeDefined();

      // Verify chain and protocol
      expect(result.chain).toBe(Blockchain.SOLANA);
      expect(result.protocol).toBe(SolProtocolType.METAPLEX_CORE);

      // Verify collection and owner identifiers
      expect(result.collection).toBe('collectionAddress123');
      expect(result.owner).toBe('ownerAddress123');

      // Verify social media links
      expect(result.social?.discordUrl).toBe('https://discord.com/test');
      expect(result.social?.externalUrl).toBe('https://example.com');
      expect(result.social?.twitterUsername).toBe('testuser');

      // Verify metadata updates
      expect(result.name).toBe('Updated Collection');
      expect(result.imageUrl).toBe('https://example.com/updated-image.png');
      expect(result.description).toBe('Updated description');
      expect(result.externalLink).toBe('https://example.com/external');

      // Verify royalty updates
      expect(result.royaltyBps).toBe(700);
      expect(result.royaltyRecipients).toHaveLength(2);
      expect(result.royaltyRecipients![0].address).toBe('recipient1');
      expect(result.royaltyRecipients![0].share).toBe(70);
      expect(result.royaltyRecipients![1].address).toBe('recipient2');
      expect(result.royaltyRecipients![1].share).toBe(30);

      // Verify payout recipient
      expect(result.payoutRecipient).toBe('updatedPayoutAddress123');

      // Verify Solana-specific properties
      expect(result.candyMachineId).toBe('candyMachineId123');
      expect(result.symbol).toBe('TEST');
      expect(result.newSymbol).toBe('UPDT');
      expect(result.payer).toBe('payerAddress123');

      // Verify authorization
      expect(result.authorization).toBeDefined();
      expect(result.authorization!.signature).toBe('signature123');
      expect(result.authorization!.signer).toBe('signerAddress123');
      expect(result.authorization!.timestamp).toBe('timestamp123');
    });
  });

  describe('mintRequest', () => {
    it('should correctly map mint parameters', () => {
      const params: SolanaMintParams = {
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

      const result = SolanaApiMappers.v4.mintRequest(params);

      // Verify the result is a valid V4MintRequest
      expect(result).toBeDefined();

      // Verify required Solana-specific properties
      expect(result.collectionId).toBe('collectionId123');
      expect(result.wallet).toBe('walletAddress123');
      expect(result.nftAmount).toBe(3);
      expect(result.stageId).toBe('stage1');
      expect(result.kind).toBe(MintStageKind.Public);
      expect(result.candyMachineId).toBe('candyMachineId123');
      expect(result.symbol).toBe('TEST');
      expect(result.payer).toBe('payerAddress123');
      expect(result.recipient).toBe('recipientAddress123');
    });

    it('should handle optional parameters', () => {
      const params: SolanaMintParams = {
        chain: Blockchain.SOLANA as Blockchain.SOLANA,
        collectionId: 'collectionId123',
        wallet: 'walletAddress123',
        nftAmount: 1,
        kind: MintStageKind.Public,
        candyMachineId: 'candyMachineId123',
        symbol: 'TEST',
        payer: 'payerAddress123',
      };

      const result = SolanaApiMappers.v4.mintRequest(params);

      // Verify required properties
      expect(result.collectionId).toBe('collectionId123');
      expect(result.wallet).toBe('walletAddress123');
      expect(result.nftAmount).toBe(1);
      expect(result.kind).toBe(MintStageKind.Public);
      expect(result.candyMachineId).toBe('candyMachineId123');
      expect(result.symbol).toBe('TEST');
      expect(result.payer).toBe('payerAddress123');

      // Verify optional properties are undefined
      expect(result.stageId).toBeUndefined();
      expect(result.recipient).toBeUndefined();
    });
  });
});
