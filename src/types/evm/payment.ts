import { EvmChainId } from '../chains/evm';

export interface PaymentTokenWithoutChain {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  name: string;
}

export interface EvmPaymentToken extends PaymentTokenWithoutChain {
  chainId: EvmChainId;
}
