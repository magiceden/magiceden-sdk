import { Blockchain } from '../../types';
import { EvmBlockchain } from '../../types/chains/evm';

export interface ReservoirConfig {
  apiHost: string;
  routePrefix: string;
}

export const RESERVOIR_CONFIGS: Record<EvmBlockchain, ReservoirConfig> = {
  [Blockchain.ETHEREUM]: {
    apiHost: 'https://api.reservoir.tools',
    routePrefix: 'ethereum',
  },
  [Blockchain.POLYGON]: {
    apiHost: 'https://api-polygon.reservoir.tools',
    routePrefix: 'polygon',
  },
  [Blockchain.BASE]: {
    apiHost: 'https://api-base.reservoir.tools',
    routePrefix: 'base',
  },
  [Blockchain.SEI]: {
    apiHost: 'https://api-sei.reservoir.tools',
    routePrefix: 'sei',
  },
  [Blockchain.ARBITRUM]: {
    apiHost: 'https://api-arbitrum.reservoir.tools',
    routePrefix: 'arbitrum',
  },
  [Blockchain.APECHAIN]: {
    apiHost: 'https://api-apechain.reservoir.tools',
    routePrefix: 'apechain',
  },
  [Blockchain.BERACHAIN]: {
    apiHost: 'https://api-berachain.reservoir.tools',
    routePrefix: 'berachain',
  },
  [Blockchain.MONAD]: {
    apiHost: 'https://api-monad.reservoir.tools',
    routePrefix: 'monad',
  },
  [Blockchain.MONAD_TESTNET]: {
    apiHost: 'https://api-monad-testnet.reservoir.tools',
    routePrefix: 'monad-testnet',
  },
  [Blockchain.AVALANCHE]: {
    apiHost: 'https://api-avalanche.reservoir.tools',
    routePrefix: 'avalanche',
  },
  [Blockchain.BSC]: {
    apiHost: 'https://api-bsc.reservoir.tools',
    routePrefix: 'bsc',
  },
  [Blockchain.ABSTRACT]: {
    apiHost: 'https://api-abstract.reservoir.tools',
    routePrefix: 'abstract',
  },
};
