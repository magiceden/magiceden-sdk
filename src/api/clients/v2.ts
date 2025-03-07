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
  async getListInstructions(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/list', {
      mintAddress,
      sellerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to cancel a listing
   */
  @supportedOn(['solana'])
  async getCancelListingInstructions(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/cancel', {
      mintAddress,
      sellerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to buy an NFT
   */
  @supportedOn(['solana'])
  async getBuyInstructions(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/buy', {
      mintAddress,
      buyerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to make an offer on an NFT
   */
  @supportedOn(['solana'])
  async getMakeOfferInstructions(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/offer', {
      mintAddress,
      buyerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to cancel an offer
   */
  @supportedOn(['solana'])
  async getCancelOfferInstructions(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/canceloffer', {
      mintAddress,
      buyerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to accept an offer
   */
  @supportedOn(['solana'])
  async getTakeOfferInstructions(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/takeoffer', {
      mintAddress,
      sellerWallet: walletAddress,
      ...params,
    });
  }

  /**
   * Gets instructions to transfer an NFT
   */
  @supportedOn(['solana'])
  async getTransferInstructions(mintAddress: string, params: any): Promise<any> {
    const walletAddress = await this.config.wallet!.getAddress();

    return this.api.post('/instructions/transfer', {
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
