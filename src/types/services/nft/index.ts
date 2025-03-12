import { SupportedChain } from '../../chain';
import { ChainTransactionType } from '../../../wallet';
import { EvmCreateLaunchpadParams, SolanaCreateLaunchpadParams } from './createLaunchpad';
import { EvmUpdateLaunchpadParams, SolanaUpdateLaunchpadParams } from './updateLaunchpad';
import { EvmMintParams, SolanaMintParams } from './mint';
import { EvmListParams, SolanaListParams } from './list';
import { EvmCancelListingParams, SolanaCancelListingParams } from './cancelListing';
import { EvmMakeItemOfferParams, SolanaMakeItemOfferParams } from './makeItemOffer';
import { EvmTakeItemOfferParams, SolanaTakeItemOfferParams } from './takeItemOffer';
import { EvmCancelItemOfferParams, SolanaCancelItemOfferParams } from './cancelItemOffer';
import { EvmTransferParams, SolanaTransferParams } from './transfer';


export * from './createLaunchpad';
export * from './updateLaunchpad';
export * from './mint';
export * from './list';
export * from './cancelListing';
export * from './makeItemOffer';
export * from './takeItemOffer';
export * from './cancelItemOffer';
export * from './transfer';


/**
 * Chain-specific parameter types mapping
 * Maps each chain to its specific parameter types for each method
 */
export interface ChainParamTypes {
  solana: {
    createLaunchpad: SolanaCreateLaunchpadParams;
    updateLaunchpad: SolanaUpdateLaunchpadParams;
    mint: SolanaMintParams;
    list: SolanaListParams;
    cancelListing: SolanaCancelListingParams;
    makeItemOffer: SolanaMakeItemOfferParams;
    cancelItemOffer: SolanaCancelItemOfferParams;
    takeItemOffer: SolanaTakeItemOfferParams;
    transfer: SolanaTransferParams;
  };
  evm: {
    createLaunchpad: EvmCreateLaunchpadParams;
    updateLaunchpad: EvmUpdateLaunchpadParams;
    mint: EvmMintParams;
    list: EvmListParams;
    cancelListing: EvmCancelListingParams;
    makeItemOffer: EvmMakeItemOfferParams;
    cancelItemOffer: EvmCancelItemOfferParams;
    takeItemOffer: EvmTakeItemOfferParams;
    transfer: EvmTransferParams;
  };
}

/**
 * Helper type to get the parameter type for a specific method and chain
 */
export type ChainMethodParams<
  C extends SupportedChain,
  M extends keyof ChainParamTypes[C]
> = ChainParamTypes[C][M];
