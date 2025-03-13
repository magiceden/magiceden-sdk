import { SolanaApiMappers } from '../../mappers/nft/solana';
import { SolanaCreateLaunchpadParams } from '../../types';
import { Blockchain } from '../../types/chain';
import { SolProtocolType } from '../../types/protocol';
import { MintStageKind } from '../../types/services/nft/shared';

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
                currency: 'SOL',
                raw: '1000000000'
              },
              startTime: '2023-01-01T00:00:00Z',
              endTime: '2023-01-02T00:00:00Z',
              walletLimit: 5,
              maxSupply: 100
            }
          ],
          maxSupply: 100
        },
        isOpenEdition: false,
      };

      const result = SolanaApiMappers.v4.createLaunchpadRequest(params);

      expect(result).toEqual(params);
    });
  });

  describe('updateLaunchpadRequest', () => {
    it('should correctly map update launchpad parameters', () => {
      const params = {
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

      expect(result).toEqual(params);
    });
  });

  describe('mintRequest', () => {
    it('should correctly map mint parameters', () => {
      const params = {
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

      expect(result).toEqual(params);
    });

    it('should handle optional parameters', () => {
      const params = {
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

      expect(result.stageId).toBeUndefined();
      expect(result.recipient).toBeUndefined();
    });
  });
});
