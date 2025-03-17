import { TransactionRequest } from 'viem';
import { EvmWalletProvider } from './evmWalletProvider';

export class MockEvmWalletProvider extends EvmWalletProvider {
  constructor() {
    super();
  }

  getAddress = () => '0x123';
  getBalance = async () => BigInt(1000000);
  signMessage = async (message: string | Uint8Array) => '0x123';
  signTransaction = async (transaction: TransactionRequest) => '0x123' as `0x${string}`;
  signAndSendTransaction = async (tx: TransactionRequest) => '0x123' as `0x${string}`;
  waitForTransactionConfirmation = async (txIdentifier: `0x${string}`) => ({
    txId: txIdentifier,
    status: 'confirmed' as any,
  });
  signTypedData = async (typedData: any) => '0x123' as `0x${string}`;
  waitForTransactionReceipt = async (txHash: `0x${string}`) => ({});
  readContract = async (params: any) => ({}) as any;
}
