import { EvmBlockchain, SupportedChain } from '../../chains';
import { EvmCreateLaunchpadParams, SolanaCreateLaunchpadParams } from './createLaunchpad';
import { EvmUpdateLaunchpadParams, SolanaUpdateLaunchpadParams } from './updateLaunchpad';
import { EvmMintParams, SolanaMintParams } from './mint';
import { EvmListParams, SolanaListParams } from './list';
import { EvmCancelListingParams, SolanaCancelListingParams } from './cancelListing';
import { EvmMakeItemOfferParams, SolanaMakeItemOfferParams } from './makeItemOffer';
import { EvmTakeItemOfferParams, SolanaTakeItemOfferParams } from './takeItemOffer';
import { EvmCancelItemOfferParams, SolanaCancelItemOfferParams } from './cancelItemOffer';
import { EvmTransferParams, SolanaTransferParams } from './transfer';
import { EvmBuyParams, SolanaBuyParams } from './buy';
import { EvmPublishLaunchpadParams, SolanaPublishLaunchpadParams } from './publishLaunchpad';

export * from './createLaunchpad';
export * from './updateLaunchpad';
export * from './mint';
export * from './list';
export * from './cancelListing';
export * from './makeItemOffer';
export * from './takeItemOffer';
export * from './cancelItemOffer';
export * from './transfer';
export * from './buy';
export * from './shared';
export * from './publishLaunchpad';

/**
 * EVM chain-specific parameter types mapping
 * Maps each EVM chain to its specific parameter types for each method
 */
export interface EvmChainParams<T> {
  chain: EvmBlockchain;
  params: T;
}

/**
 * Chain-specific parameter types mapping
 * Maps each chain to its specific parameter types for each method
 */
export interface ChainParamTypes {
  solana: {
    publishLaunchpad: SolanaPublishLaunchpadParams;
    createLaunchpad: SolanaCreateLaunchpadParams;
    updateLaunchpad: SolanaUpdateLaunchpadParams;
    mint: SolanaMintParams;
    list: SolanaListParams;
    cancelListing: SolanaCancelListingParams;
    makeItemOffer: SolanaMakeItemOfferParams;
    cancelItemOffer: SolanaCancelItemOfferParams;
    takeItemOffer: SolanaTakeItemOfferParams;
    transfer: SolanaTransferParams;
    buy: SolanaBuyParams;
  };
  evm: {
    publishLaunchpad: EvmPublishLaunchpadParams;
    createLaunchpad: EvmCreateLaunchpadParams;
    updateLaunchpad: EvmUpdateLaunchpadParams;
    mint: EvmChainParams<EvmMintParams[]>;
    list: EvmChainParams<EvmListParams[]>;
    cancelListing: EvmChainParams<EvmCancelListingParams[]>;
    makeItemOffer: EvmChainParams<EvmMakeItemOfferParams[]>;
    cancelItemOffer: EvmChainParams<EvmCancelItemOfferParams[]>;
    takeItemOffer: EvmChainParams<EvmTakeItemOfferParams[]>;
    transfer: EvmChainParams<EvmTransferParams[]>;
    buy: EvmChainParams<EvmBuyParams[]>;
  };
}

/**
 * Helper type to get the parameter type for a specific method and chain
 */
export type ChainMethodParams<
  C extends SupportedChain,
  M extends keyof ChainParamTypes[C]
> = ChainParamTypes[C][M];
