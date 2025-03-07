/**
 * Parameters for creating a launchpad
 */
export interface CreateLaunchpadParams {
  /**
   * Name of the launchpad
   */
  name: string;

  /**
   * Symbol for the collection
   */
  symbol: string;

  /**
   * Description of the collection
   */
  description: string;

  /**
   * Total supply of NFTs
   */
  supply: number;

  /**
   * Price per NFT
   */
  price: number;

  /**
   * Start time of the sale (Unix timestamp)
   */
  startTime: number;

  /**
   * End time of the sale (Unix timestamp)
   */
  endTime: number;

  /**
   * Royalty percentage (0-100)
   */
  royaltyPercentage: number;

  /**
   * Creator wallet addresses and shares
   */
  creators: Array<{
    address: string;
    share: number;
  }>;

  /**
   * Collection image URL
   */
  image?: string;

  /**
   * Collection banner URL
   */
  banner?: string;

  /**
   * Maximum NFTs per wallet (0 for unlimited)
   */
  maxPerWallet?: number;

  /**
   * Whether the collection is hidden from public view
   */
  isHidden?: boolean;

  /**
   * Additional configuration options
   */
  [key: string]: any;
}

/**
 * Parameters for updating a launchpad
 */
export interface UpdateLaunchpadParams {
  /**
   * Updated name
   */
  name?: string;

  /**
   * Updated description
   */
  description?: string;

  /**
   * Updated price
   */
  price?: number;

  /**
   * Updated start time
   */
  startTime?: number;

  /**
   * Updated end time
   */
  endTime?: number;

  /**
   * Updated max per wallet
   */
  maxPerWallet?: number;

  /**
   * Updated hidden status
   */
  isHidden?: boolean;

  /**
   * Additional update parameters
   */
  [key: string]: any;
}

/**
 * Parameters for minting NFTs
 */
export interface MintParams {
  /**
   * Number of NFTs to mint
   */
  quantity?: number;

  /**
   * Recipient address (defaults to connected wallet)
   */
  recipient?: string;

  /**
   * Additional mint parameters
   */
  [key: string]: any;
}

/**
 * Parameters for listing an NFT
 */
export interface ListParams {
  /**
   * Price in native currency
   */
  price: number;

  /**
   * Expiry time in seconds (0 for no expiry)
   */
  expiry?: number;

  /**
   * Additional listing parameters
   */
  [key: string]: any;
}

/**
 * Parameters for canceling an NFT listing
 */
export interface CancelListingParams {
  /**
   * Price of the listing to cancel (required for some chains)
   */
  price?: number;

  /**
   * Additional cancel parameters
   */
  [key: string]: any;
}

/**
 * Parameters for buying an NFT
 */
export interface BuyParams {
  /**
   * Price to pay
   */
  price: number;

  /**
   * Seller address (optional, can be determined from listing)
   */
  seller?: string;

  /**
   * Additional buy parameters
   */
  [key: string]: any;
}

/**
 * Parameters for making an offer on an NFT
 */
export interface MakeOfferParams {
  /**
   * Offer price
   */
  price: number;

  /**
   * Expiry time in seconds (0 for no expiry)
   */
  expiry?: number;

  /**
   * Additional offer parameters
   */
  [key: string]: any;
}

/**
 * Parameters for canceling an offer
 */
export interface CancelOfferParams {
  /**
   * Price of the offer to cancel
   */
  price?: number;

  /**
   * Additional cancel parameters
   */
  [key: string]: any;
}

/**
 * Parameters for accepting an offer
 */
export interface TakeOfferParams {
  /**
   * Buyer address
   */
  buyer?: string;

  /**
   * Offer price
   */
  price?: number;

  /**
   * Additional accept parameters
   */
  [key: string]: any;
}

/**
 * Parameters for transferring an NFT
 */
export interface TransferParams {
  /**
   * Recipient address
   */
  recipient: string;

  /**
   * Additional transfer parameters
   */
  [key: string]: any;
}
