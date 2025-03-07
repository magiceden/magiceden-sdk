import { WalletProvider } from './provider';
import { TransactionResponse } from '../types';
import { WalletError, TransactionError } from '../errors';

/**
 * Solana wallet provider
 */
export class SolanaWalletProvider implements WalletProvider {
  private readonly wallet: any;

  constructor(wallet: any) {
    this.wallet = wallet;

    if (!wallet) {
      throw new WalletError('Solana wallet is required');
    }
  }

  async getAddress(): Promise<string> {
    try {
      return this.wallet.publicKey.toString();
    } catch (error: any) {
      throw new WalletError(`Failed to get wallet address: ${error.message}`);
    }
  }

  async signAndSendTransaction(transaction: any): Promise<TransactionResponse> {
    try {
      const signature = await this.wallet.signAndSendTransaction(transaction);

      return {
        txId: signature,
        signature,
        status: 'pending',
      };
    } catch (error: any) {
      throw new TransactionError(
        `Failed to sign and send transaction: ${error.message}`,
        error.txId,
        error.logs,
      );
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const signedMessage = await this.wallet.signMessage(messageBytes);

      return Buffer.from(signedMessage).toString('base64');
    } catch (error: any) {
      throw new WalletError(`Failed to sign message: ${error.message}`);
    }
  }

  isConnected(): boolean {
    return !!this.wallet && !!this.wallet.publicKey;
  }
}
