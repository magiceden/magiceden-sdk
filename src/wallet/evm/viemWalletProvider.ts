import {
  WalletClient,
  createPublicClient,
  http,
  TransactionRequest,
  PublicClient,
  ReadContractParameters,
  ReadContractReturnType,
  Abi,
  ContractFunctionName,
  ContractFunctionArgs,
  createWalletClient,
} from 'viem';
import { EvmWalletProvider } from './evmWalletProvider';
import { WalletTxReceipt } from '../provider';
import { EvmBlockchain } from '../../types';
import { privateKeyToAccount } from 'viem/accounts';
import { getViemChainFromBlockchain } from '../../helpers/evm/chain';

/**
 * Options for the ViewWalletProvider
 */
export type ViemWalletProviderOptions = {
  /**
   * Gas configuration options
   */
  gas?: {
    /**
     * Multiplier for estimated gas limit (default: 1.2)
     */
    limitMultiplier?: number;

    /**
     * Multiplier for estimated gas fees (default: 1.0)
     */
    feeMultiplier?: number;
  };
};

/**
 * Configuration for the ViemWalletProvider
 */
export type ViemWalletProviderConfig = {
  /**
   * The private key to use for the wallet
   */
  privateKey: `0x${string}`;

  /**
   * The blockchain to use for the wallet
   */
  blockchain: EvmBlockchain;
  
  /**
   * Options for the ViemWalletProvider
   */
  options?: ViemWalletProviderOptions;
};

/**
 * Implementation of EvmWalletProvider using Viem library
 */
export class ViemWalletProvider extends EvmWalletProvider {
  private readonly wallet: WalletClient;
  private readonly rpcClient: PublicClient;
  private readonly gasOptions: Required<ViemWalletProviderOptions['gas']>;

  /**
   * Creates a new Ethereum wallet adapter using Viem
   */
  constructor(config: ViemWalletProviderConfig) {
    super();

    this.wallet = createWalletClient({
      account: privateKeyToAccount(config.privateKey),
      chain: getViemChainFromBlockchain(config.blockchain),
      transport: http(),
    });
    this.rpcClient = createPublicClient({
      chain: getViemChainFromBlockchain(config.blockchain),
      transport: http(),
    });

    // Set gas configuration with defaults
    this.gasOptions = {
      limitMultiplier: Math.max(config.options?.gas?.limitMultiplier ?? 1.2, 1),
      feeMultiplier: Math.max(config.options?.gas?.feeMultiplier ?? 1, 1),
    };
  }

  /**
   * Gets the current wallet address
   */
  getAddress(): string {
    return this.wallet.account?.address ?? '';
  }

  /**
   * Retrieves the wallet's native token balance
   */
  async getBalance(): Promise<bigint> {
    const account = this.validateAccount();
    return this.rpcClient.getBalance({ address: account.address });
  }

  /**
   * Signs a message with the wallet's private key
   */
  async signMessage(message: string): Promise<`0x${string}`> {
    const account = this.validateAccount();
    return this.wallet.signMessage({ account, message });
  }

  /**
   * Signs EIP-712 typed data
   */
  async signTypedData(data: any): Promise<`0x${string}`> {
    const account = this.validateAccount();

    return this.wallet.signTypedData({
      account,
      domain: data.domain!,
      types: data.types!,
      primaryType: data.primaryType!,
      message: data.message!,
    });
  }

  /**
   * Signs a transaction without broadcasting it
   */
  async signTransaction(tx: TransactionRequest): Promise<`0x${string}`> {
    const account = this.validateAccount();

    return this.wallet.signTransaction({
      account,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      chain: this.wallet.chain,
    });
  }

  /**
   * Signs and broadcasts a transaction
   */
  async signAndSendTransaction(tx: TransactionRequest): Promise<`0x${string}`> {
    const account = this.validateAccount();
    const chain = this.validateChain();

    // Calculate gas parameters with multipliers
    const { gas, maxFeePerGas, maxPriorityFeePerGas } = await this.calculateGasParameters(
      tx,
      account,
    );

    return this.wallet.sendTransaction({
      account,
      chain,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gas,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
  }

  /**
   * Waits for transaction confirmation and returns receipt
   */
  async waitForTransactionConfirmation(txHash: `0x${string}`): Promise<WalletTxReceipt> {
    const receipt = await this.rpcClient.waitForTransactionReceipt({ hash: txHash });

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
        cumulativeGasUsed: receipt.cumulativeGasUsed,
      },
    };
  }

  /**
   * Calls a read-only contract method
   */
  async readContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
    const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  >(
    params: ReadContractParameters<abi, functionName, args>,
  ): Promise<ReadContractReturnType<abi, functionName, args>> {
    return this.rpcClient.readContract<abi, functionName, args>(params);
  }

  /**
   * Helper to ensure account is available
   */
  private validateAccount() {
    const account = this.wallet.account;
    if (!account) {
      throw new Error('No account connected to wallet');
    }
    return account;
  }

  /**
   * Helper to ensure chain is available
   */
  private validateChain() {
    const chain = this.wallet.chain;
    if (!chain) {
      throw new Error('No chain configured for wallet');
    }
    return chain;
  }

  /**
   * Calculate gas parameters with configured multipliers
   */
  private async calculateGasParameters(
    tx: TransactionRequest,
    account: NonNullable<WalletClient['account']>,
  ) {
    // Estimate gas fees
    const feeData = await this.rpcClient.estimateFeesPerGas();
    const maxFeePerGas = BigInt(
      Math.round(Number(feeData?.maxFeePerGas) * this.gasOptions!.feeMultiplier),
    );
    const maxPriorityFeePerGas = BigInt(
      Math.round(Number(feeData?.maxPriorityFeePerGas) * this.gasOptions!.feeMultiplier),
    );

    // Estimate gas limit
    const gasEstimate = await this.rpcClient.estimateGas({
      account,
      to: tx.to,
      value: tx.value,
      data: tx.data,
    });
    const gas = BigInt(Math.round(Number(gasEstimate) * this.gasOptions!.limitMultiplier));

    return { gas, maxFeePerGas, maxPriorityFeePerGas };
  }
}
