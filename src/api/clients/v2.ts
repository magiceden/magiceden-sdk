import { BaseApiClient } from './base';
import { ClientConfig } from '../../types';
import { supportedOn } from '../utils/decorators';


/**
 * V2 API client implementation (primarily for Solana marketplace operations)
 */
export class V2ApiClient extends BaseApiClient {
  constructor(config: ClientConfig) {
    super(config);
  }

  /**
   * Gets instructions to list an NFT
   */
  @supportedOn(['solana'])
  async list(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/sell', {
      mintAddress,
      sellerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to cancel a listing
   */
  @supportedOn(['solana'])
  async cancelListing(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/sell_cancel', {
      mintAddress,
      sellerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to accept an offer
   */
  @supportedOn(['solana'])
  async takeOffer(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/sell_now', {
      mintAddress,
      sellerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to make an offer on an NFT
   */
  @supportedOn(['solana'])
  async makeOffer(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/buy', {
      mintAddress,
      buyerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to cancel an offer
   */
  @supportedOn(['solana'])
  async cancelOffer(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/buy_cancel', {
      mintAddress,
      buyerWallet: walletAddress,
      ...params,
    });
  }
  
  /**
   * Gets instructions to buy an NFT
   */
  @supportedOn(['solana'])
  async buy(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/buy_now', {
      mintAddress,
      buyerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to transfer an NFT
   */
  @supportedOn(['solana'])
  async transfer(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/ocp/transfer', {
      mintAddress,
      fromWallet: walletAddress,
      ...params,
    });
  }

  // Helper methods for API URLs
  getBaseUrl(): string {
    const isDev = this.config.environment === 'development';
    return isDev ? 'https://api-mainnet.magiceden.dev/v2' : 'https://api-mainnet.magiceden.dev/v2';
  }
}
