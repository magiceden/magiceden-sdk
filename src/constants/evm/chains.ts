import { EvmChainId } from "../../types/chains/evm";

import { Currencies } from "../currencies";

export namespace Ethereum {
  export const SHORT_NAME = 'eth';
  export const CHAIN_NAME = 'ethereum';
  export const DISPLAY_NAME = 'Ethereum';
  export const CHAIN_ID = EvmChainId.ETHEREUM;
  export const CURRENCY = Currencies.ETH;
  export const EXPLORER_URL = 'https://etherscan.io';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace Polygon {
  export const SHORT_NAME = 'polygon';
  export const CHAIN_NAME = 'polygon';
  export const DISPLAY_NAME = 'Polygon';
  export const CHAIN_ID = EvmChainId.POLYGON;
  export const CURRENCY = Currencies.MATIC;
  export const EXPLORER_URL = 'https://polygonscan.com';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace Base {
  export const SHORT_NAME = 'base';
  export const CHAIN_NAME = 'base';
  export const DISPLAY_NAME = 'Base';
  export const CHAIN_ID = EvmChainId.BASE;
  export const CURRENCY = Currencies.ETH;
  export const EXPLORER_URL = 'https://basescan.org';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace Sei {
  export const SHORT_NAME = 'sei';
  export const CHAIN_NAME = 'sei';
  export const DISPLAY_NAME = 'Sei';
  export const CHAIN_ID = EvmChainId.SEI;
  export const CURRENCY = Currencies.SEI;
  export const EXPLORER_URL = 'https://www.seiscan.app';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/accounts/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace Arbitrum {
  export const SHORT_NAME = 'arb';
  export const CHAIN_NAME = 'arbitrum';
  export const DISPLAY_NAME = 'Arbitrum';
  export const CHAIN_ID = EvmChainId.ARBITRUM;
  export const CURRENCY = Currencies.ETH;
  export const EXPLORER_URL = 'https://arbiscan.io';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace ApeChain {
  export const SHORT_NAME = 'apechain';
  export const CHAIN_NAME = 'apechain';
  export const DISPLAY_NAME = 'ApeChain';
  export const CHAIN_ID = EvmChainId.APECHAIN;
  export const CURRENCY = Currencies.APE;
  export const EXPLORER_URL = 'https://apescan.io';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace Berachain {
  export const SHORT_NAME = 'bera';
  export const CHAIN_NAME = 'berachain';
  export const DISPLAY_NAME = 'Berachain';
  export const CHAIN_ID = EvmChainId.BERACHAIN;
  export const CURRENCY = Currencies.BERA;
  export const EXPLORER_URL = 'https://berascan.com';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace MonadTestnet {
  export const SHORT_NAME = 'monad';
  export const CHAIN_NAME = 'monad-testnet';
  export const DISPLAY_NAME = 'Monad Testnet';
  export const CHAIN_ID = EvmChainId.MONAD_TESTNET;
  export const CURRENCY = Currencies.MON;
  export const EXPLORER_URL = 'https://testnet.monadexplorer.com';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace Bsc {
  export const SHORT_NAME = 'bsc';
  export const CHAIN_NAME = 'bsc';
  export const DISPLAY_NAME = 'BNB Chain';
  export const CHAIN_ID = EvmChainId.BSC;
  export const CURRENCY = Currencies.BNB;
  export const EXPLORER_URL = 'https://bscscan.com';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}

export namespace Abstract {
  export const SHORT_NAME = 'abs';
  export const CHAIN_NAME = 'abstract';
  export const DISPLAY_NAME = 'Abstract';
  export const CHAIN_ID = EvmChainId.ABSTRACT;
  export const CURRENCY = Currencies.ETH;
  export const EXPLORER_URL = 'https://abscan.org';
  export const EXPLORER_PREFIX = `${EXPLORER_URL}/address/`;
  export const EXPLORER_TX_PREFIX = `${EXPLORER_URL}/tx/`;
}
