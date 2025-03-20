import { EvmBlockchain } from '../../types/chains/evm';
import { Blockchain } from '../../types/chains/general';

export const ETH_DECIMALS = 18;
export const USDC_DECIMALS = 6;

export namespace Contracts {
  export const WRAPPED_POLYGON = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
  export const BINANCE_STAKED_ETH = '0x0000000000a39bb272e79075ade125fd351887ac';

  export const USDC_ETH = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  export const USDC_POLYGON = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359';
  export const USDC_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
  export const USDC_ARB = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
  export const USDC_AVAX = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';
  export const USDC_BSC = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
  export const USDC_ABSTRACT = '0x84a71ccd554cc1b02749b35d22f684cc8ec987e1';
  export const USDC_BERACHAIN = '0x549943e04f40284185054145c6e4e9568c1d3241';
  export const USDC_MONAD = '0xf817257fed379853cde0fa4f97ab987181b1e5ea';
  export const USDC_MONAD_TESTNET = '0xf817257fed379853cde0fa4f97ab987181b1e5ea';

  export const BRIDGED_USDC_POLYGON = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
  export const BRIDGED_USDC_BASE = '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca';

  export const WETH_ETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  export const WETH_POLYGON = '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619';
  export const WETH_BASE = '0x4200000000000000000000000000000000000006';
  export const WETH_ARB = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
  export const WETH_AVAX = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
  export const WETH_ABSTRACT = '0x3439153eb7af838ad19d56e1571fbd09333c2809';
  export const WETH_MONAD = '0xb5a30b0fdc5ea94a52fdc42e3e9760cb8449fb37'; // TODO(monad): update when mainnet launches

  export const PRIME_ETH = '0xb23d80f5fefcddaa212212f028021b41ded428cf';
  export const PRIME_BASE = '0xfa980ced6895ac314e7de34ef1bfae90a5add21b';
  export const WANDER_BASE = '0xef0fd52e65ddcdc201e2055a94d2abff6ff10a7a';
  export const GOD_ETH = '0xb5130f4767ab0acc579f25a76e8f9e977cb3f948';
  export const GOD_BASE = '0xb5130f4767ab0acc579f25a76e8f9e977cb3f948';

  export const APE_COIN_ETH = '0x4d224452801aced8b2f0aebe155379bb5d594381';
  export const MEME_COIN_ETH = '0xb131f4a55907b10d1f0a50d8ab8fa09ec342cd74';
  export const PORTAL_COIN_ETH = '0x1bbe973bef3a977fc51cbed703e8ffdefe001fed';
  export const MOCA_COIN_ETH = '0xf944e35f95e819e752f3ccb5faf40957d311e8c5';

  export const SAND_POLYGON = '0xbbba073c31bf03b8acf7c28ef0738decf3695683';
  export const GONE_POLYGON = '0x162539172b53e9a93b7d98fb6c41682de558a320';

  export const G3_ARB = '0xc24a365a870821eb83fd216c9596edd89479d8d7';

  export const WAPE_APE = '0x48b62137edfa95a428d35c09e44256a739f6b557';

  export const WSEI_SEI = '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7';

  export const WBNB_BNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';

  export const WBERA_BERA = '0x6969696969696969696969696969696969696969';

  export const HONEY_BERA = '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce';

  export const WMON_MON = '0x760afe86e5de5fa0ee542fc7b7b713e1c5425701';
  export const WMON_MON_TESTNET = '0x760afe86e5de5fa0ee542fc7b7b713e1c5425701';
}

// Set value to `null` if USDC is not available on the chain.
export const USDC_CONTRACTS: Record<EvmBlockchain, `0x${string}` | null> = {
  [Blockchain.ETHEREUM]: Contracts.USDC_ETH,
  [Blockchain.POLYGON]: Contracts.USDC_POLYGON,
  [Blockchain.BASE]: Contracts.USDC_BASE,
  [Blockchain.SEI]: null,
  [Blockchain.ARBITRUM]: Contracts.USDC_ARB,
  [Blockchain.APECHAIN]: null,
  [Blockchain.BERACHAIN]: Contracts.USDC_BERACHAIN,
  [Blockchain.MONAD_TESTNET]: Contracts.USDC_MONAD,
  [Blockchain.BSC]: Contracts.USDC_BSC,
  [Blockchain.ABSTRACT]: Contracts.USDC_ABSTRACT,
};
// Set value to `null` if WETh is not available on the chain.
export const WETH_CONTRACTS: Record<EvmBlockchain, `0x${string}` | null> = {
  [Blockchain.ETHEREUM]: Contracts.WETH_ETH,
  [Blockchain.POLYGON]: Contracts.WETH_POLYGON,
  [Blockchain.BASE]: Contracts.WETH_BASE,
  [Blockchain.SEI]: null,
  [Blockchain.ARBITRUM]: Contracts.WETH_ARB,
  [Blockchain.APECHAIN]: null,
  [Blockchain.BERACHAIN]: null,
  [Blockchain.MONAD_TESTNET]: Contracts.WETH_MONAD,
  [Blockchain.BSC]: null,
  [Blockchain.ABSTRACT]: Contracts.WETH_ABSTRACT,
};
