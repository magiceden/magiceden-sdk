import { SolanaWalletProvider } from './solanaWalletProvider';

export class MockSolanaWalletProvider extends SolanaWalletProvider {
  constructor() {
    super();
  }

  getAddress = () => '0x123';
  getBalance = async () => BigInt(1000000);
  signMessage = async (message: string | Uint8Array) => '0x123';
  signTransaction = async (transaction: any) => transaction;
  sendTransaction = async () => '0x123';
  signAndSendTransaction = async () => '0x123';
  waitForTransactionConfirmation = async (txIdentifier: string) => ({
    txId: txIdentifier,
    status: 'confirmed' as any,
    context: { slot: 1 },
    value: { err: null },
  });
  getConnection = () => ({}) as any;
  getSignatureStatus = async (signature: string) => ({
    context: { slot: 1 },
    value: { slot: 1, confirmations: 1, err: null, confirmationStatus: 'confirmed' as any },
  });
}
