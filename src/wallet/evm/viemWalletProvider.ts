import {
  WalletClient as ViemWalletClient,
  createPublicClient,
  http,
  TransactionRequest,
  PublicClient as ViemPublicClient,
  ReadContractParameters,
  ReadContractReturnType,
  Abi,
  ContractFunctionName,
  ContractFunctionArgs,
} from 'viem';
import { EvmWalletProvider } from './evmWalletProvider';
import { WalletTxReceipt } from '../provider';

/**
 * Configuration for gas multipliers.
 */
export interface ViemWalletProviderGasConfig {
  /**
   * An internal multiplier on gas limit estimation.
   */
  gasLimitMultiplier?: number;

  /**
   * An internal multiplier on fee per gas estimation.
   */
  feePerGasMultiplier?: number;
}

/**
 * A wallet provider that uses the Viem library.
 */
export class ViemWalletProvider extends EvmWalletProvider {
  private readonly walletClient: ViemWalletClient;
  private readonly publicClient: ViemPublicClient;
  private readonly gasLimitMultiplier: number;
  private readonly feePerGasMultiplier: number;

  /**
   * Constructs a new ViemWalletProvider.
   *
   * @param walletClient - The wallet client.
   * @param gasConfig - Configuration for gas multipliers.
   */
  constructor(walletClient: ViemWalletClient, gasConfig?: ViemWalletProviderGasConfig) {
    super();

    this.walletClient = walletClient;
    this.publicClient = createPublicClient({
      chain: walletClient.chain,
      transport: http(),
    });
    this.gasLimitMultiplier = Math.max(gasConfig?.gasLimitMultiplier ?? 1.2, 1);
    this.feePerGasMultiplier = Math.max(gasConfig?.feePerGasMultiplier ?? 1, 1);
  }

  /**
   * Signs a message.
   *
   * @param message - The message to sign.
   * @returns The signed message.
   */
  async signMessage(message: string): Promise<`0x${string}`> {
    const account = this.walletClient.account;
    if (!account) {
      throw new Error('Account not found');
    }

    return this.walletClient.signMessage({ account, message });
  }

  /**
   * Signs a typed data object.
   *
   * @param typedData - The typed data object to sign.
   * @returns The signed typed data object.
   */
  async signTypedData(typedData: any): Promise<`0x${string}`> {
    return this.walletClient.signTypedData({
      account: this.walletClient.account!,
      domain: typedData.domain!,
      types: typedData.types!,
      primaryType: typedData.primaryType!,
      message: typedData.message!,
    });
  }

  /**
   * Signs a transaction.
   *
   * @param transaction - The transaction to sign.
   * @returns The signed transaction.
   */
  async signTransaction(transaction: TransactionRequest): Promise<`0x${string}`> {
    const txParams = {
      account: this.walletClient.account!,
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
      chain: this.walletClient.chain,
    };

    return this.walletClient.signTransaction(txParams);
  }

  /**
   * Sends a transaction.
   *
   * @param transaction - The transaction to send.
   * @returns The hash of the transaction.
   */
  async signAndSendTransaction(transaction: TransactionRequest): Promise<`0x${string}`> {
    const account = this.walletClient.account;
    if (!account) {
      throw new Error('Account not found');
    }

    const chain = this.walletClient.chain;
    if (!chain) {
      throw new Error('Chain not found');
    }

    const feeData = await this.publicClient.estimateFeesPerGas();
    const maxFeePerGas = BigInt(Math.round(Number(feeData.maxFeePerGas) * this.feePerGasMultiplier));
    const maxPriorityFeePerGas = BigInt(Math.round(Number(feeData.maxPriorityFeePerGas) * this.feePerGasMultiplier));

    const gasLimit = await this.publicClient.estimateGas({
      account,
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
    });
    const gas = BigInt(Math.round(Number(gasLimit) * this.gasLimitMultiplier));

    const txParams = {
      account: account,
      chain: chain,
      data: transaction.data,
      to: transaction.to,
      value: transaction.value,
      gas,
      maxFeePerGas,
      maxPriorityFeePerGas,
    };

    return this.walletClient.sendTransaction(txParams);
  }

  /**
   * Gets the address of the wallet.
   *
   * @returns The address of the wallet.
   */
  getAddress(): string {
    return this.walletClient.account?.address ?? '';
  }

  /**
   * Gets the balance of the wallet.
   *
   * @returns The balance of the wallet.
   */
  async getBalance(): Promise<bigint> {
    const account = this.walletClient.account;
    if (!account) {
      throw new Error('Account not found');
    }

    return this.publicClient.getBalance({ address: account.address });
  }

  /**
   * Waits for a transaction receipt.
   *
   * @param txHash - The hash of the transaction to wait for.
   * @returns The transaction receipt.
   */
  async waitForTransactionConfirmation(txHash: `0x${string}`): Promise<WalletTxReceipt> {
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });
    return {
      txId: txHash,
      status: receipt.status === 'success' ? 'confirmed' : 'failed',
      error: receipt.status === 'reverted' ? 'Transaction reverted' : undefined,
      metadata: {
        from: receipt.from,
        to: receipt.to,
        contractAddress: receipt.contractAddress,
        status: receipt.status,
        transactionHash: receipt.transactionHash,
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        transactionIndex: receipt.transactionIndex,
        logs: receipt.logs,
        logsBloom: receipt.logsBloom,
        type: receipt.type,
        gasUsed: receipt.gasUsed,
        effectiveGasPrice: receipt.effectiveGasPrice,
        cumulativeGasUsed: receipt.cumulativeGasUsed
      },
    };
  }

  /**
   * Reads a contract.
   *
   * @param params - The parameters to read the contract.
   * @returns The response from the contract.
   */
  async readContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
    const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  >(
    params: ReadContractParameters<abi, functionName, args>,
  ): Promise<ReadContractReturnType<abi, functionName, args>> {
    return this.publicClient.readContract<abi, functionName, args>(params);
  }
}
