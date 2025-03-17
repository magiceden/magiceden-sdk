import { WalletProvider, WalletTxReceipt } from '../provider';
import {
  TransactionRequest,
  ReadContractParameters,
  ReadContractReturnType,
  ContractFunctionName,
  Abi,
  ContractFunctionArgs,
} from 'viem';

export abstract class EvmWalletProvider extends WalletProvider<
  TransactionRequest,
  `0x${string}`,
  `0x${string}`,
  WalletTxReceipt
> {
  /**
   * Sign a typed data.
   *
   * @param typedData - The typed data to sign.
   * @returns The signed typed data.
   */
  abstract signTypedData(typedData: any): Promise<`0x${string}`>;

  /**
   * Read a contract.
   *
   * @param params - The parameters to read the contract.
   * @returns The response from the contract.
   */
  abstract readContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
    const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  >(
    params: ReadContractParameters<abi, functionName, args>,
  ): Promise<ReadContractReturnType<abi, functionName, args>>;
}
