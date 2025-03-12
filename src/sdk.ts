import { ChainType } from './types';
import { MagicEdenClient } from './client';
import { ClientConfig } from './types';
import { Keypair } from '@solana/web3.js';
import { SolanaKeypairWalletProvider, SolanaWalletProvider } from './wallet/solana';

/**
 * Magic Eden SDK
 */
export class MagicEdenSDK {
  /**
   * Creates a new Magic Eden API client for Solana
   * @param apiKey Your Magic Eden API key
   * @param walletProvider The wallet provider to use
   * @param clientConfig Additional client configuration
   * @returns A new Magic Eden API client for Solana
   */
  public static createSolanaClient<T extends SolanaWalletProvider>(
    apiKey: string,
    walletProvider: T,
    clientConfig: Partial<Omit<ClientConfig, 'apiKey'>> = {}
  ): MagicEdenClient {
    if (!apiKey) {
      throw new Error('API key is required to create a Magic Eden client');
    }
    
    return new MagicEdenClient({
      apiKey,
      ...clientConfig,
      chain: ChainType.SOLANA,
      wallet: walletProvider,
    });
  }

  /**
   * Creates a new Magic Eden API client for Solana using a keypair
   * @param apiKey Your Magic Eden API key
   * @param keypair The Solana keypair to use for the client
   * @param options Optional configuration
   * @param options.rpcUrl Custom Solana RPC URL (defaults to public endpoint if not provided)
   * @param options.clientConfig Additional client configuration
   * @returns A new Magic Eden API client for Solana
   */
  public static createSolanaKeypairClient(
    apiKey: string,
    keypair: Keypair,
    options?: {
      rpcUrl?: string;
      clientConfig?: Partial<Omit<ClientConfig, 'apiKey'>>;
    }
  ): MagicEdenClient {
    const rpcUrl = options?.rpcUrl || 'https://api.mainnet-beta.solana.com';
    const walletProvider = new SolanaKeypairWalletProvider({ 
      keypair: keypair.secretKey, 
      rpcUrl 
    });
    
    return this.createSolanaClient(apiKey, walletProvider, options?.clientConfig);
  }
}
