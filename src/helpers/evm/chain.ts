import { EvmBlockchain, EvmChainId } from '../../types/chains/evm';
import { Blockchain } from '../../types/chains';

/**
 * Get the EVM blockchain from a chain ID
 *
 * @param chainId
 * @returns The EVM blockchain
 */
export function getEvmChainFromId(chainId: EvmChainId): EvmBlockchain {
  switch (chainId) {
    case EvmChainId.ETHEREUM:
      return Blockchain.ETHEREUM;
    case EvmChainId.POLYGON:
      return Blockchain.POLYGON;
    case EvmChainId.BASE:
      return Blockchain.BASE;
    case EvmChainId.SEI:
      return Blockchain.SEI;
    case EvmChainId.ARBITRUM:
      return Blockchain.ARBITRUM;
    case EvmChainId.APECHAIN:
      return Blockchain.APECHAIN;
    case EvmChainId.BERACHAIN:
      return Blockchain.BERACHAIN;
    case EvmChainId.MONAD_TESTNET:
      return Blockchain.MONAD_TESTNET;
    case EvmChainId.BSC:
      return Blockchain.BSC;
    case EvmChainId.ABSTRACT:
      return Blockchain.ABSTRACT;
  }
}

export function getEvmChainIdFromBlockchain(chainName: EvmBlockchain): EvmChainId {
  switch (chainName) {
    case Blockchain.ETHEREUM:
      return EvmChainId.ETHEREUM;
    case Blockchain.POLYGON:
      return EvmChainId.POLYGON;
    case Blockchain.BASE:
      return EvmChainId.BASE;
    case Blockchain.SEI:
      return EvmChainId.SEI;
    case Blockchain.ARBITRUM:
      return EvmChainId.ARBITRUM;
    case Blockchain.APECHAIN:
      return EvmChainId.APECHAIN;
    case Blockchain.BERACHAIN:
      return EvmChainId.BERACHAIN;
    case Blockchain.MONAD_TESTNET:
      return EvmChainId.MONAD_TESTNET;
    case Blockchain.BSC:
      return EvmChainId.BSC;
    case Blockchain.ABSTRACT:
      return EvmChainId.ABSTRACT;
  }
}
