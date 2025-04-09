# Magic Eden SDK

A TypeScript SDK for interacting with Magic Eden's API across multiple chains (Solana and EVM-compatible blockchains).

> **BETA NOTICE**: This SDK is currently in beta. Only the endpoints and methods documented in this README have been confirmed to work. Other endpoints are still being tested and may have issues. API signatures and parameters may change before the stable release.

## Installation

```bash
npm install @magiceden/magiceden-sdk
```

## Getting Started

The Magic Eden SDK provides a unified interface for interacting with NFTs across different blockchains. Here's how to get started:

### Initialize the SDK

```typescript
import { MagicEdenSDK } from '@magiceden/magiceden-sdk';
```

## Solana SDK

### Initialization (Solana)

```typescript
import { MagicEdenSDK } from '@magiceden/magiceden-sdk';
import { Keypair } from '@solana/web3.js';
import { Blockchain } from '@magiceden/magiceden-sdk';

// Initialize with a keypair
const solanaKeypair = Keypair.generate(); // Or load your existing keypair
const solanaClient = MagicEdenSDK.v1.createSolanaKeypairClient(
  'YOUR_API_KEY',
  solanaKeypair,
  {
    rpcUrl: 'SOLANA_RPC_URL'
  }
);
```

### Listing an NFT (Solana)

```typescript
// List an NFT for sale
const listResult = await solanaClient.nft.list({
  token: '7um9nU7CDhss1fepFMRpjHhB3qm7exfQf47cdbRSUGuS', // NFT mint address
  price: '1000000000', // Price in lamports (1 SOL)
});

console.log('Listing created:', listResult);
```

### Canceling a Listing (Solana)

```typescript
// Cancel an existing listing
const cancelResult = await solanaClient.nft.cancelListing({
  token: '7um9nU7CDhss1fepFMRpjHhB3qm7exfQf47cdbRSUGuS', // NFT mint address
  price: '1000000000', // Price in lamports (1 SOL)
});

console.log('Listing canceled:', cancelResult);
```

### Making an Offer (Solana)

```typescript
// Make an offer on an NFT
const offerResult = await solanaClient.nft.makeItemOffer({
  token: '7YCrxt8Ux9dym832BKLDQQWJYZ2uziXgbF6cYfZaChdP', // NFT mint address
  price: '900000', // Price in lamports (0.0009 SOL)
});

console.log('Offer made:', offerResult);
```

### Canceling an Offer (Solana)

```typescript
// Cancel an existing offer
const cancelOfferResult = await solanaClient.nft.cancelItemOffer({
  token: '7YCrxt8Ux9dym832BKLDQQWJYZ2uziXgbF6cYfZaChdP', // NFT mint address
  price: '900000', // Price in lamports (0.0009 SOL)
});

console.log('Offer canceled:', cancelOfferResult);
```

### Taking an Offer (Selling to an Offer)

```typescript
// Accept an offer from a buyer
const takeOfferResult = await solanaClient.nft.takeItemOffer({
  token: '7um9nU7CDhss1fepFMRpjHhB3qm7exfQf47cdbRSUGuS', // NFT mint address
  buyer: '4H2bigFBsMoTAwkn7THDnThiRQuLCrFDGUWHf4YDpf14', // Buyer's wallet address
  price: '1500000', // Original offer price in lamports (0.0015 SOL)
  newPrice: '1000000', // Accepted price in lamports (0.001 SOL)
});

console.log('Offer accepted:', takeOfferResult);
```

### Buying an NFT (Solana)

```typescript
// Buy an NFT at the listed price
const buyResult = await solanaClient.nft.buy({
  token: '7um9nU7CDhss1fepFMRpjHhB3qm7exfQf47cdbRSUGuS', // NFT mint address
  seller: '4H2bigFBsMoTAwkn7THDnThiRQuLCrFDGUWHf4YDpf14', // Seller's wallet address
  price: '1500000', // Price in lamports (0.0015 SOL)
});

console.log('Purchase completed:', buyResult);
```

### Transferring an NFT (Solana)

```typescript
// Transfer an NFT to another wallet
const transferResult = await solanaClient.nft.transfer({
  token: 'BxRLKzJVJzyNBRqE6bnhqthbHGMSvyv9GotKihwX6LqJ', // NFT mint address
  to: '4H2bigFBsMoTAwkn7THDnThiRQuLCrFDGUWHf4YDpf14', // Recipient's wallet address
  isCompressed: true, // Whether the NFT is compressed
});

console.log('Transfer completed:', transferResult);
```

### Creating a Launchpad (Solana)

Creating a launchpad on Solana is a two-step process. The steps are as follows:

1. Create the launchpad with `createLaunchpad`.
2. Publish the launchpad with `publishLaunchpad`.

```typescript
// Create a new NFT launchpad
const launchpadResult = await client.nft.createLaunchpad({
  chain: Blockchain.SOLANA,
  protocol: SolProtocolType.METAPLEX_CORE,
  creator: walletAddress,
  name: 'TestCollection',
  symbol: 'TEST',
  description: 'This is a test collection created with the Magic Eden self-serve API',
  nftMetadataUrl: 'https://bafybeic3rs6wmnnhqachwxsiizlblignek6aitc5b3ooenhhtkez3onmwu.ipfs.w3s.link',
  royaltyBps: 500, // 5%
  royaltyRecipients: [{ address: walletAddress, share: 100 }],
  payoutRecipient: walletAddress,
  social: {
    discordUrl: 'https://discord.gg/magiceden',
    twitterUsername: 'magiceden',
    externalUrl: 'https://magiceden.io',
  },
  mintStages: {
    maxSupply: 10000,
    stages: [
      {
        kind: MintStageKind.Allowlist,
        price: {
          currency: {
            chain: Blockchain.SOLANA,
            assetId: 'So11111111111111111111111111111111111111112',
          },
          raw: '1', // Price in lamports
        },
        startTime: '2025-03-20T00:00:00.000Z',
        endTime: '2025-03-27T00:00:00.000Z',
        walletLimit: 2,
        allowlist: [
          walletAddress,
          "5FHwkrdxkrR7zKy1jHmqh5uWyKj1ZbM7PKhRgw7F8Z8K",
          "8HXhDbwLVeS7neCC93dYeM9LCokRMSbSw2q9ofsPRgWi"
        ],
      },
      {
        kind: MintStageKind.Public,
        price: {
          currency: {
            chain: Blockchain.SOLANA,
            assetId: 'So11111111111111111111111111111111111111112',
          },
          raw: '1', // Price in lamports
        },
        startTime: '2025-03-28T00:00:00.000Z',
        endTime: '2030-03-30T00:00:00.000Z',
        walletLimit: 10
      },
    ],
  },
  isOpenEdition: false,
});

console.log('Launchpad created successfully:', launchpadResult);

// Gives you the following response, which contains all transactions that were created and sent in the process as well as some metadata about the launchpad:
/**
 * [
  {
    "txId": "<TX_ID>",
    "status": "confirmed",
    "metadata": {
      "operation": {
        "payload": {
          "chain": "solana",
          "candyMachineId": "<CANDY_MACHINE_ID>",
          "collectionId": "<COLLECTION_ID>",
          "symbol": "<SYMBOL>",
          "authorization": {
            "signer": "<SIGNER>",
          }
        }
      },
      "receipt": {
        "blockhash": "<BLOCK_HASH>",
        "lastValidBlockHeight": <BLOCK_HEIGHT>
      }
    }
  },
  {
    "txId": "<TX_ID>",
    "status": "confirmed",
    "metadata": {
      "operation": {
        "payload": {
          "chain": "solana",
          "candyMachineId": "<CANDY_MACHINE_ID>",
          "collectionId": "<COLLECTION_ID>",
          "symbol": "<SYMBOL>",
          "authorization": {
            "signer": "<SIGNER>",
          }
        }
      },
      "receipt": {
        "blockhash": "<BLOCK_HASH>",
        "lastValidBlockHeight": <BLOCK_HEIGHT>
      }
    }
  },
  {
    "txId": "<TX_ID>",
    "status": "confirmed",
    "metadata": {
      "operation": {
        "payload": {
          "chain": "solana",
          "candyMachineId": "<CANDY_MACHINE_ID>",
          "collectionId": "<COLLECTION_ID>",
          "symbol": "<SYMBOL>",
          "authorization": {
            "signer": "<SIGNER>",
          }
        }
      },
      "receipt": {
        "blockhash": "<BLOCK_HASH>",
        "lastValidBlockHeight": <BLOCK_HEIGHT>
      }
    }
  },
  {
    "txId": "<TX_ID>",
    "status": "confirmed",
    "metadata": {
      "operation": {
        "payload": {
          "chain": "solana",
          "candyMachineId": "<CANDY_MACHINE_ID>",
          "collectionId": "<COLLECTION_ID>",
          "symbol": "<SYMBOL>",
          "authorization": {
            "signer": "<SIGNER>",
          }
        }
      },
      "receipt": {
        "blockhash": "<BLOCK_HASH>",
        "lastValidBlockHeight": <BLOCK_HEIGHT>
      }
    }
  }
]
 */
```

### Updating a Launchpad (Solana)

```typescript
// Update an existing NFT launchpad
const updateResult = await client.nft.updateLaunchpad({
  chain: Blockchain.SOLANA,
  protocol: SolProtocolType.METAPLEX_CORE,
  collectionId: '<COLLECTION_ID>',
  owner: walletAddress,
  payer: walletAddress,
  symbol: 'TEST2',
  newSymbol: 'TEST',
  candyMachineId: '<CANDY_MACHINE_ID>',
  name: 'TestCollection',
  payoutRecipient: walletAddress,
  royaltyRecipients: [{ address: walletAddress, share: 100 }],
});

console.log('Launchpad updated successfully!', updateResult);
```

### Minting an NFT (Solana)

```typescript
// Mint NFTs from a launchpad
const mintResult = await client.nft.mint({
  chain: Blockchain.SOLANA,
  collectionId: '22zxgVwS7cXkTRfvFgERnN5KZpLgukQXAoauNkHtghX2',
  nftAmount: 1,
  kind: MintStageKind.Public,
  candyMachineId: 'iQU3uT6WnnYkCXqXreXm2ysihoj8WGXk5GJtczcos6a',
  symbol: 'TEST',
});

console.log('Mint completed successfully!', mintResult);
```

### Complete Example (Solana)

```typescript
// Example testing file
import { MagicEdenSDK } from '@magiceden/magiceden-sdk';
import { Keypair } from '@solana/web3.js';
import { Blockchain, SolProtocolType, MintStageKind } from '@magiceden/magiceden-sdk';
import bs58 from 'bs58';

// Initialize with your keypair
const apiKey = 'YOUR_API_KEY';
const keypair = Keypair.fromSecretKey(
  bs58.decode('YOUR_PRIVATE_KEY')
);

// Create a Solana client
const client = MagicEdenSDK.v1.createSolanaKeypairClient(apiKey, keypair, {
  rpcUrl: 'https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY',
});

// Example function to list an NFT
async function listNFT() {
  try {
    await client.nft.list({
      token: '7um9nU7CDhss1fepFMRpjHhB3qm7exfQf47cdbRSUGuS',
      price: '1000000000', // 1 SOL
    });
    console.log('NFT listed successfully!');
  } catch (error) {
    console.error('Error listing NFT:', error);
  }
}

// Run the example
listNFT();
```

## EVM SDK (Ethereum, Polygon, Base, etc)

### Initialization (EVM)

```typescript
import { MagicEdenSDK } from '@magiceden/magiceden-sdk';
import { Blockchain } from '@magiceden/magiceden-sdk';

// Initialize with a private key or wallet
const evmClient = MagicEdenSDK.v1.createViemEvmClient(
  'YOUR_API_KEY',
  '0xYOUR_PRIVATE_KEY',
  Blockchain.BASE // or Blockchain.ETHEREUM, Blockchain.POLYGON, etc.
);
```

### Listing an NFT (EVM)

```typescript
// List an NFT for sale on EVM chains
const listResult = await client.nft.list({
  chain: Blockchain.BASE,
  params: [{
    token: '0x949de1b4d4cc4a8e63b7565b6dc525d8eb5dd15a:0',
    price: '10000000012',
  }]
});

console.log('List completed successfully!', listResult);
```

### Canceling a Listing (EVM)

```typescript
// Cancel an existing listing on EVM chains
const cancelResult = await client.nft.cancelListing({
  chain: Blockchain.BASE,
  orderIds: ['0xc34124b0276f92ca985c2b7e25e9a5c3164c5aa45a2fe1ff1ac6c33b4665649c'],
});

console.log('Listing canceled successfully!', cancelResult);
```

### Making an Offer (EVM)

```typescript
// Make an offer on an NFT
const makeItemOfferResponse = await client.nft.makeItemOffer({
  chain: Blockchain.BASE,
  params: [{
    token: '0x1195cf65f83b3a5768f3c496d3a05ad6412c64b7:304163',
    price: '9000',
  }]
});

console.log('Offer made successfully!', makeItemOfferResponse);
```

### Canceling an Offer (EVM)

```typescript
// Cancel an existing offer
const cancelOfferResult = await client.nft.cancelItemOffer({
  chain: Blockchain.BASE,
  orderIds: ['0x18fc51e19bc96bc07b9bdd804eb055a691e46e3cd2c37a5d7e53daedebae70c4'],
});

console.log('Offer canceled successfully!', cancelOfferResult);
```

### Taking an Offer (EVM)

```typescript
// Accept an offer on your NFT
const takeOfferResult = await client.nft.takeItemOffer({
  chain: Blockchain.BASE,
  items: [{
    token: '0x949de1b4d4cc4a8e63b7565b6dc525d8eb5dd15a:0',
    quantity: 1,
    // Optional specific order id to take
    orderId: '0x18fc51e19bc96bc07b9bdd804eb055a691e46e3cd2c37a5d7e53daedebae70c4',
  }],
});

console.log('Offer accepted successfully!', takeOfferResult);
```

### Buying an NFT (EVM)

```typescript
// Buy an NFT at the listed price
const buyResult = await client.nft.buy({
  chain: Blockchain.BASE,
  items: [{
    token: '0x1c55ec22ec5083dd0937b9590df4f2629ee43fe9:3030',
    quantity: 1,
  }],
});

console.log('Buy completed successfully!', buyResult);
```

### Transferring an NFT (EVM)

```typescript
// Transfer an NFT to another wallet
const transferResult = await client.nft.transfer({
  chain: Blockchain.BASE,
  items: [{
    token: '0x1c55ec22ec5083dd0937b9590df4f2629ee43fe9:3030',
    quantity: 1,
  }],
  to: '0x1fDcfcdeE9e8fA32D95b9648a30E5Cb8C6C7197b',
});

console.log('Transfer completed successfully!', transferResult);
```

### Minting an NFT (EVM)

```typescript
// Mint an NFT from a collection
const mintResult = await evmClient.nft.mint({
  chain: Blockchain.BASE,
  collectionId: '0x949de1b4d4cc4a8e63b7565b6dc525d8eb5dd15a', // Collection contract address
  nftAmount: 1, // Number of NFTs to mint
  tokenId: 0, // Token ID to mint
  kind: MintStageKind.Public, // Mint stage type
  protocol: EvmProtocolType.ERC1155, // NFT standard (ERC721 or ERC1155)
});
console.log('Mint completed:', mintResult);
```

### Complete Example

```typescript
// Example testing file for EVM
import { MagicEdenSDK } from '@magiceden/magiceden-sdk';
import { Blockchain, EvmProtocolType, MintStageKind } from '@magiceden/magiceden-sdk';

// Initialize with your private key
const apiKey = 'YOUR_API_KEY';
const privateKey = '0xYOUR_PRIVATE_KEY';

// Create an EVM client
const evmClient = MagicEdenSDK.v1.createViemEvmClient(
  apiKey,
  privateKey,
  Blockchain.BASE
);

// Example function to mint an NFT
async function mintNFT() {
  try {
    const result = await evmClient.nft.mint({
      chain: Blockchain.BASE,
      collectionId: '0x949de1b4d4cc4a8e63b7565b6dc525d8eb5dd15a',
      nftAmount: 1,
      tokenId: 0,
      kind: MintStageKind.Public,
      protocol: EvmProtocolType.ERC1155,
    });
    console.log('NFT minted successfully!', result);
  } catch (error) {
    console.error('Error minting NFT:', error);
  }
}

// Run the example
mintNFT();
```
