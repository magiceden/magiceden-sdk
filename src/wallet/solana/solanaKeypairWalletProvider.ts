import { SolanaWalletProvider } from './solanaWalletProvider';
import {
  Connection,
  Keypair,
  VersionedTransaction,
  RpcResponseAndContext,
  SignatureResult,
  SignatureStatus,
  SignatureStatusConfig,
} from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { WalletTxReceipt } from '../provider';

/**
 * SolanaKeypairWalletProvider is a wallet provider that uses a local Solana keypair.
 *
 * @augments SvmWalletProvider
 */
export class SolanaKeypairWalletProvider extends SolanaWalletProvider {
  private keypair: Keypair;
  private connection: Connection;

  /**
   * Creates a new SolanaKeypairWalletProvider
   *
   * @param args - Configuration arguments
   * @param args.keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
   * @param args.rpcUrl - URL of the Solana RPC endpoint
   * @param args.genesisHash - The genesis hash of the network
   */
  constructor({ keypair, rpcUrl }: { keypair: Uint8Array | string; rpcUrl: string }) {
    super();

    this.keypair =
      typeof keypair === 'string'
        ? Keypair.fromSecretKey(bs58.decode(keypair))
        : Keypair.fromSecretKey(keypair);
    this.connection = new Connection(rpcUrl);
  }

  /**
   * Create a new SolanaKeypairWalletProvider from a Connection and a keypair
   *
   * @param connection - The Connection to use
   * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
   * @returns The new SolanaKeypairWalletProvider
   */
  static async fromConnection<T extends SolanaKeypairWalletProvider>(
    connection: Connection,
    keypair: Uint8Array | string,
  ): Promise<T> {
    return (await this.fromRpcUrl(connection.rpcEndpoint, keypair)) as T;
  }

  /**
   * Create a new SolanaKeypairWalletProvider from an RPC URL and a keypair
   *
   * @param rpcUrl - The URL of the Solana RPC endpoint
   * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
   * @returns The new SolanaKeypairWalletProvider
   */
  static async fromRpcUrl<T extends SolanaKeypairWalletProvider>(
    rpcUrl: string,
    keypair: Uint8Array | string,
  ): Promise<T> {
    return new SolanaKeypairWalletProvider({
      keypair,
      rpcUrl,
    }) as T;
  }

  /**
   * Get the connection instance
   *
   * @returns The Solana connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get the address of the wallet
   *
   * @returns The base58 encoded address of the wallet
   */
  getAddress(): string {
    return this.keypair.publicKey.toBase58();
  }

  /**
   * Sign a message
   *
   * @param message - The message to sign
   * @returns The base58 encoded signature
   */
  async signMessage(message: string | Uint8Array): Promise<string> {
    const messageBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;
    const signature = nacl.sign.detached(messageBytes, this.keypair.secretKey);
    return bs58.encode(signature);
  }

  /**
   * Sign a transaction
   *
   * @param transaction - The transaction to sign
   * @returns The signed transaction
   */
  async signTransaction(transaction: VersionedTransaction): Promise<VersionedTransaction> {
    transaction.sign([this.keypair]);
    return transaction;
  }

  /**
   * Send a transaction
   *
   * @param transaction - The transaction to send
   * @returns The signature
   */
  async sendTransaction(transaction: VersionedTransaction): Promise<string> {
    const signature = await this.connection.sendTransaction(transaction);
    await this.waitForTransactionConfirmation(signature);
    return signature;
  }

  /**
   * Sign and send a transaction
   *
   * @param transaction - The transaction to sign and send
   * @returns The signature
   */
  async signAndSendTransaction(transaction: VersionedTransaction): Promise<string> {
    const signedTransaction = await this.signTransaction(transaction);
    return this.sendTransaction(signedTransaction);
  }

  /**
   * Get the status of a transaction
   *
   * @param signature - The signature
   * @param options - The options for the status
   * @returns The status
   */
  async getSignatureStatus(
    signature: string,
    options?: SignatureStatusConfig,
  ): Promise<RpcResponseAndContext<SignatureStatus | null>> {
    return this.connection.getSignatureStatus(signature, options);
  }

  /**
   * Wait for transaction confirmation
   *
   * @param signature - The signature
   * @returns The confirmation response
   */
  async waitForTransactionConfirmation(
    signature: string,
  ): Promise<WalletTxReceipt> {
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    const receipt = await this.connection.confirmTransaction({
      signature: signature,
      lastValidBlockHeight,
      blockhash,
    });
    
    return {
      txId: signature,
      status: receipt.value.err ? 'failed' : 'confirmed',
      error: receipt.value.err?.toString(),
      metadata: {
        blockhash,
        lastValidBlockHeight,
      },
    };
  }

  /**
   * Get the name of the wallet provider
   *
   * @returns The name of the wallet provider
   */
  getName(): string {
    return 'solana_keypair_wallet_provider';
  }

  /**
   * Get the balance of the wallet
   *
   * @returns The balance of the wallet
   */
  getBalance(): Promise<bigint> {
    return this.connection.getBalance(this.keypair.publicKey).then((balance) => BigInt(balance));
  }

  /**
   * Request SOL tokens from the Solana faucet. This method only works on devnet and testnet networks.
   *
   * @param lamports - The amount of lamports (1 SOL = 1,000,000,000 lamports) to request from the faucet
   * @returns A Promise that resolves to the signature of the airdrop
   */
  async requestAirdrop(lamports: number): Promise<string> {
    return await this.connection.requestAirdrop(this.keypair.publicKey, lamports);
  }
}
