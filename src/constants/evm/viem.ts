import { EvmChainId } from '../../types/chains/evm';

// TODO(apechain): Remove this after viem is updated
export const APECHAIN_VIEM_DEFINITION = {
  id: EvmChainId.APECHAIN,
  name: 'ApeChain',
  nativeCurrency: { name: 'ApeCoin', symbol: 'APE', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://apechain.calderachain.xyz/http'],
    },
  },
};

// TODO(berachain): Remove this after viem is updated
export const BERACHAIN_VIEM_DEFINITION = {
  id: EvmChainId.BERACHAIN,
  name: 'Berachain',
  nativeCurrency: { name: 'Bera', symbol: 'BERA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.berachain.com'],
    },
  },
};

// TODO(monad): Remove this after viem is updated
export const MONAD_TESTNET_VIEM_DEFINITION = {
  id: EvmChainId.MONAD_TESTNET,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Mon', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: {
      http: [''],
    },
  },
};

// TODO(abstract): Remove this after viem is updated
export const ABSTRACT_VIEM_DEFINITION = {
  id: EvmChainId.ABSTRACT,
  name: 'Abstract',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.mainnet.abs.xyz'],
    },
  },
};
