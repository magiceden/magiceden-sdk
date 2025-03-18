import { EvmBlockchain, EvmChainId } from '../../types/chains/evm';
import { Blockchain } from '../../types/chains';
import { Chain } from 'viem';
import { ABSTRACT_VIEM_DEFINITION } from '../../constants/evm/viem';
import { APECHAIN_VIEM_DEFINITION, MONAD_TESTNET_VIEM_DEFINITION, MONAD_VIEM_DEFINITION, BERACHAIN_VIEM_DEFINITION } from '../../constants/evm/viem';
import { base, arbitrum, sei, mainnet, polygon, bsc, avalanche } from 'viem/chains';

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
    case EvmChainId.MONAD:
      return Blockchain.MONAD;
    case EvmChainId.MONAD_TESTNET:
      return Blockchain.MONAD_TESTNET;
    case EvmChainId.AVALANCHE:
      return Blockchain.AVALANCHE;
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
    case Blockchain.MONAD:
      return EvmChainId.MONAD;
    case Blockchain.MONAD_TESTNET:
      return EvmChainId.MONAD_TESTNET;
    case Blockchain.AVALANCHE:
      return EvmChainId.AVALANCHE;
    case Blockchain.BSC:
      return EvmChainId.BSC;
    case Blockchain.ABSTRACT:
      return EvmChainId.ABSTRACT;
  }
}

const EVM_CHAIN_TO_VIEM: Record<EvmBlockchain, Chain> = {
  ethereum: mainnet,
  polygon: polygon,
  base: base,
  sei: sei,
  arbitrum: arbitrum,
  apechain: APECHAIN_VIEM_DEFINITION,
  berachain: BERACHAIN_VIEM_DEFINITION,
  monad: MONAD_VIEM_DEFINITION,
  'monad-testnet': MONAD_TESTNET_VIEM_DEFINITION,
  avalanche: avalanche,
  bsc: bsc,
  abstract: ABSTRACT_VIEM_DEFINITION,
};

export const EVM_VIEM_CHAINS = Object.values(EVM_CHAIN_TO_VIEM);

export const getEvmViemChain = (chain: EvmBlockchain): Chain => {
  return EVM_CHAIN_TO_VIEM[chain];
};