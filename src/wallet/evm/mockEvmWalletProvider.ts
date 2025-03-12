import { EvmWalletProvider } from './evmWalletProvider';

export class MockEvmWalletProvider extends EvmWalletProvider {
  constructor() {
    super();
  }

  getAddress = () => '0x123';
  getBalance = async () => BigInt(1000000);
  signMessage = async (message: string | Uint8Array) => '0x123';
  signTransaction = async (transaction: any) => '0x123' as `0x${string}`;
  sendTransaction = async () => '0x123' as `0x${string}`;
  signAndSendTransaction = async () => '0x123' as `0x${string}`;
  waitForTransactionConfirmation = async (txIdentifier: `0x${string}`) => ({});
  signTypedData = async (typedData: any) => '0x123' as `0x${string}`;
  waitForTransactionReceipt = async (txHash: `0x${string}`) => ({});
  readContract = async (params: any) => ({}) as any;
}
