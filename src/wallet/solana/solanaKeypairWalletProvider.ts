import {
  Connection,
  Keypair,
  VersionedTransaction,
  RpcResponseAndContext,
  SignatureStatus,
  SignatureStatusConfig,
} from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { WalletTxReceipt } from '../provider';
import { SolanaWalletProvider } from './solanaWalletProvider';


/**
 * Configuration for the Solana wallet adapter
 */
export type KeypairWalletConfig = {
  /** Secret key in either base58 string format or raw bytes */
  secretKey: string | Uint8Array;

  /** RPC endpoint URL */
  rpcEndpoint: string;
};

/**
 * A Solana wallet implementation using a local keypair
 */
export class SolanaKeypairWalletProvider extends SolanaWalletProvider {
  private readonly connection: Connection;
  private readonly keypair: Keypair;

  /**
   * Creates a new Solana wallet provider
   */
  constructor(config: KeypairWalletConfig) {
    super();

    // Initialize the RPC connection
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');

    // Create the keypair from the provided secret
    this.keypair = this.createKeyFromSecret(config.secretKey);
  }

  /**
   * Gets the RPC connection
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the wallet's public address
   */
  getAddress(): string {
    return this.keypair.publicKey.toBase58();
  }

  /**
   * Gets the wallet's SOL balance
   */
  async getBalance(): Promise<bigint> {
    return this.connection.getBalance(this.keypair.publicKey).then((balance) => BigInt(balance));
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
   * Sign and send a transaction
   *
   * @param transaction - The transaction to sign and send
   * @returns The signature
   */
  async signAndSendTransaction(transaction: VersionedTransaction): Promise<string> {
    const signedTransaction = await this.signTransaction(transaction);
    return await this.connection.sendTransaction(signedTransaction);
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
  async waitForTransactionConfirmation(signature: string): Promise<WalletTxReceipt> {
    try {
      // Get the latest blockhash for transaction confirmation
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash({
        commitment: 'confirmed',
      });

      // Wait for confirmation
      const confirmResult = await this.connection.confirmTransaction(
        {
          blockhash,
          lastValidBlockHeight,
          signature,
        },
        'confirmed',
      );

      // Format the receipt
      return {
        txId: signature,
        status: confirmResult.value.err ? 'failed' : 'confirmed',
        error: confirmResult.value.err ? String(confirmResult.value.err) : undefined,
        metadata: {
          blockhash,
          lastValidBlockHeight,
        },
      };
    } catch (error) {
      // Handle timeout or other errors
      return {
        txId: signature,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error during confirmation',
        metadata: {
          errorType: error instanceof Error ? error.name : 'Unknown',
        },
      };
    }
  }

  /**
   * Helper to create a keypair from different secret formats
   */
  private createKeyFromSecret(secret: string | Uint8Array): Keypair {
    if (typeof secret === 'string') {
      try {
        const decoded = bs58.decode(secret);
        return Keypair.fromSecretKey(decoded);
      } catch (error) {
        throw new Error('Invalid base58 encoded secret key');
      }
    } else {
      try {
        return Keypair.fromSecretKey(secret);
      } catch (error) {
        throw new Error('Invalid secret key bytes');
      }
    }
  }

  /**
   * Helper to convert message to bytes
   */
  private convertToBytes(message: string | Uint8Array): Uint8Array {
    if (typeof message === 'string') {
      return new TextEncoder().encode(message);
    }
    return message;
  }
}
