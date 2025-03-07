/**
 * NFT metadata interface
 */
export interface NFTMetadata {
  name: string;
  description?: string;
  image?: string;
  attributes?: NFTAttribute[];
  externalUrl?: string;
  animationUrl?: string;
  [key: string]: any;
}

/**
 * NFT attribute
 */
export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

/**
 * Base NFT interface
 */
export interface BaseNFT {
  name: string;
  image: string;
  description?: string;
  attributes?: NFTAttribute[];
  [key: string]: any;
}

/**
 * Solana NFT interface
 */
export interface SolanaNFT extends BaseNFT {
  mintAddress: string;
  owner: string;
  supply: number;
  collection?: string;
  updateAuthority: string;
  primarySaleHappened: boolean;
  sellerFeeBasisPoints: number;
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
    }>;
    category?: string;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  };
  tokenStandard?: string;
}

/**
 * EVM NFT interface
 */
export interface EvmNFT extends BaseNFT {
  tokenId: string;
  contractAddress: string;
  owner: string;
  tokenType: 'ERC721' | 'ERC1155';
  supply?: number;
  metadata: NFTMetadata;
}

/**
 * Union type for all NFT types
 */
export type NFT = SolanaNFT | EvmNFT;

/**
 * Base NFT listing interface
 */
export interface BaseNFTListing {
  price: number;
  seller: string;
  createdAt: number;
  expiry?: number;
}

/**
 * Solana NFT listing interface
 */
export interface SolanaNFTListing extends BaseNFTListing {
  pdaAddress: string;
  auctionHouse: string;
  tokenAddress: string;
  tokenMint: string;
  tokenSize: number;
}

/**
 * EVM NFT listing interface
 */
export interface EvmNFTListing extends BaseNFTListing {
  listingId: string;
  contractAddress: string;
  tokenId: string;
  marketplace: string;
  currency: string;
}

/**
 * Union type for all NFT listing types
 */
export type NFTListing = SolanaNFTListing | EvmNFTListing;

/**
 * NFT collection interface
 */
export interface NFTCollection {
  symbol: string;
  name: string;
  description?: string;
  image?: string;
  twitter?: string;
  discord?: string;
  website?: string;
  floorPrice?: number;
  volumeAll?: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  offset?: number;
  limit?: number;
}