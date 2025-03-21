# Magic Eden SDK

A TypeScript SDK for interacting with Magic Eden's API across multiple chains (Solana and EVM-compatible blockchains).

## Installation

```bash
npm install @magiceden/magiceden-sdk
```

## Getting Started

The Magic Eden SDK provides a unified interface for interacting with NFTs across different blockchains. Here's how to get started:

### Initialize the SDK

```typescript
import { MagicEdenSDK } from 'magiceden-api-client';
import { Keypair } from '@solana/web3.js';

// For Solana
const solanaKeypair = Keypair.generate(); // Or load your existing keypair
const solanaClient = MagicEdenSDK.v1.createSolanaKeypairClient(
  'YOUR_API_KEY',
  solanaKeypair,
  {
    rpcUrl: 'https://api.mainnet-beta.solana.com'
  }
);

// For EVM chains (Ethereum, Polygon, etc.)
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

const account = privateKeyToAccount('0x...');
const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http()
});

const evmClient = MagicEdenSDK.v1.createViemEvmClient(
  'YOUR_API_KEY',
  walletClient
);
```

## Working with NFTs

### Listing an NFT (Solana)

```typescript
const listResult = await solanaClient.nft.list({
  token: 'TOKEN_MINT_ADDRESS',
  price: '1000000000', // Price in lamports (1 SOL)
  auctionHouseAddress: 'AUCTION_HOUSE_ADDRESS',
  tokenAccount: 'TOKEN_ACCOUNT_ADDRESS',
  expiry: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
});

console.log('Listing created:', listResult);
```

### Buying an NFT (EVM)

```typescript
const buyResult = await evmClient.nft.buy({
  token: '0xNFT_CONTRACT_ADDRESS',
  tokenId: '123',
  price: '1000000000000000000', // Price in wei (1 ETH)
  seller: '0xSELLER_ADDRESS',
  marketplace: 'MARKETPLACE_ADDRESS'
});

console.log('Purchase completed:', buyResult);
```

### Making an Offer on an NFT (Solana)]

```typescript
const offerResult = await solanaClient.nft.makeItemOffer({
  token: 'TOKEN_MINT_ADDRESS',
  price: '500000000', // Price in lamports (0.5 SOL)
  auctionHouseAddress: 'AUCTION_HOUSE_ADDRESS',
  expiry: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
});

console.log('Offer made:', offerResult);
```

### Creating a Launchpad (EVM)

```typescript
const launchpadResult = await evmClient.nft.createLaunchpad({
  name: 'My NFT Collection',
  symbol: 'MYNFT',
  description: 'A collection of amazing NFTs',
  chain: 'ethereum',
  protocol: 'erc721',
  creator: '0xCREATOR_ADDRESS',
  payoutRecipient: '0xPAYOUT_ADDRESS',
  royaltyBps: 500, // 5%
  royaltyRecipients: [{ address: '0xROYALTY_ADDRESS', share: 100 }], // 100% of royalties
  imageUrl: 'https://example.com/image.png',
  mintStages: {
    maxSupply: 1000,
    stages: [
      {
        kind: 'public',
        price: {
          currency: 'ETH',
          raw: '100000000000000000' // 0.1 ETH
        },
        startTime: '2023-01-01T00:00:00Z',
        endTime: '2023-01-02T00:00:00Z',
        walletLimit: 5,
        maxSupply: 1000
      }
    ]
  }
});

console.log('Launchpad created:', launchpadResult);
```

### Minting from a Launchpad (Solana)

```typescript
const mintResult = await solanaClient.nft.mint({
  collectionId: 'COLLECTION_ID',
  nftAmount: 1,
  stageId: 'STAGE_ID',
  kind: 'public',
  candyMachineId: 'CANDY_MACHINE_ID',
  symbol: 'SYMBOL'
});

console.log('NFT minted:', mintResult);
```
