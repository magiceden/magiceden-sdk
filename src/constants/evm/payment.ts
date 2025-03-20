import { EvmBlockchain, EvmChainId } from "../../types/chains/evm";
import { Blockchain } from "../../types/chains/general";
import { Contracts } from "./contracts";
import { PaymentTokenWithoutChain } from "../../types/evm";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const OTHER_PAYMENT_TOKENS: Record<EvmBlockchain, PaymentTokenWithoutChain[]> = {
  [Blockchain.ETHEREUM]: [
    {
      address: Contracts.APE_COIN_ETH,
      decimals: 18,
      symbol: 'APE',
      name: 'ApeCoin',
    },
    {
      address: Contracts.MEME_COIN_ETH,
      decimals: 18,
      symbol: 'MEME',
      name: 'Memecoin',
    },
    {
      address: Contracts.PORTAL_COIN_ETH,
      decimals: 18,
      symbol: 'PORTAL',
      name: 'Portal Coin',
    },
    {
      address: Contracts.PRIME_ETH,
      decimals: 18,
      symbol: 'PRIME',
      name: 'Prime',
    },
  ],
  [Blockchain.POLYGON]: [
    {
      address: Contracts.SAND_POLYGON,
      decimals: 18,
      symbol: 'SAND',
      name: 'The Sandbox',
    },
    {
      address: Contracts.GONE_POLYGON,
      decimals: 18,
      symbol: 'GONE',
      name: 'GONE',
    },
  ],
  [Blockchain.BASE]: [
    {
      address: Contracts.PRIME_BASE,
      decimals: 18,
      symbol: 'PRIME',
      name: 'Prime',
    },
  ],
  [Blockchain.SEI]: [],
  [Blockchain.ARBITRUM]: [
    {
      address: Contracts.G3_ARB,
      decimals: 18,
      symbol: 'G3',
      name: 'GAM3S.GG',
    },
  ],
  [Blockchain.APECHAIN]: [],
  [Blockchain.BERACHAIN]: [],
  [Blockchain.MONAD_TESTNET]: [],
  [Blockchain.BSC]: [],
  [Blockchain.ABSTRACT]: [],
};
