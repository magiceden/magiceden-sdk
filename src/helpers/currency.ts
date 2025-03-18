import { Currencies } from '../constants/currencies';
import { Blockchain } from '../types/chains/general';
import { Currency } from '../types/currency';

export function getCurrencyForChain(chain: Blockchain): Currency {
  switch (chain) {
    case Blockchain.SOLANA:
      return Currencies.SOL;
    case Blockchain.BITCOIN:
      return Currencies.BTC;
    case Blockchain.ETHEREUM:
      return Currencies.ETH;
    case Blockchain.POLYGON:
      return Currencies.POL;
    case Blockchain.BASE:
      return Currencies.ETH;
    case Blockchain.SEI:
      return Currencies.SEI;
    case Blockchain.ARBITRUM:
      return Currencies.ETH;
    case Blockchain.APECHAIN:
      return Currencies.APE;
    case Blockchain.BERACHAIN:
      return Currencies.BERA;
    case Blockchain.MONAD:
      return Currencies.MON;
    case Blockchain.MONAD_TESTNET:
      return Currencies.MON;
    case Blockchain.AVALANCHE:
      return Currencies.AVAX;
    case Blockchain.BSC:
      return Currencies.BNB;
    case Blockchain.ABSTRACT:
      return Currencies.ETH;
    case Blockchain.HYPERLIQUID:
      return Currencies.HYPE;
  }
}
