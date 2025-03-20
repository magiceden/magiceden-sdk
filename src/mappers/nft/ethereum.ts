import {
  EvmListParams,
  EvmCancelListingParams,
  EvmMakeItemOfferParams,
  EvmCancelItemOfferParams,
  EvmTakeItemOfferParams,
  EvmBuyParams,
  EvmTransferParams,
  EvmMintParams,
  EvmUpdateLaunchpadParams,
  EvmCreateLaunchpadParams,
  EvmPublishLaunchpadParams,
} from '../../types/services/nft';
import {
  V4CreateLaunchpadRequest,
  V4UpdateLaunchpadRequest,
  V4MintRequest,
  V4PublishLaunchpadRequest,
} from '../../types/api';
import {
  V3BuyRequest,
  V3CancelOrderRequest,
  V3ListRequest,
  V3PlaceBidRequest,
  V3SellRequest,
  V3TransferRequest,
} from '../../types/api/v3';

/**
 * Ethereum NFT Service Mappers
 * Provides mapping functions from service parameters to API requests
 */
export const EvmApiMappers = {
  v3: {
    /**
     * Maps generic list parameters to Ethereum-specific API request
     */
    listRequest: (maker: `0x${string}`, params: EvmListParams): V3ListRequest => {
      return {
        maker,
        chain: params.chain,
        params: [
          {
            token: params.token,
            weiPrice: params.price,
            orderbook: 'reservoir',
            orderKind: 'payment-processor-v2',
            ...(params.expiry ? { expirationTime: params.expiry.toString() } : {}),
          },
        ],
      };
    },

    // /**
    //  * Maps generic cancel listing parameters to Ethereum-specific API request
    //  */
    // cancelListingRequest: (params: EvmCancelListingParams): V3CancelOrderRequest => {
    //   // TODO: Implement Ethereum-specific mapping
    //   return {
    //     // Map params to Ethereum API request format
    //   };
    // },

    /**
     * Maps generic make item offer parameters to Ethereum-specific API request
     */
    makeItemOfferRequest: (
      maker: `0x${string}`,
      params: EvmMakeItemOfferParams,
    ): V3PlaceBidRequest => {
      return {
        maker,
        chain: params.chain,
        params: [{
          token: params.token,
          weiPrice: params.price,
          ...(params.expiry ? { expirationTime: params.expiry.toString() } : {}),
          ...(params.quantity ? { quantity: params.quantity } : {}),
          ...(params.automatedRoyalties !== undefined ? { automatedRoyalties: params.automatedRoyalties } : {}),
          ...(params.royaltyBps ? { royaltyBps: params.royaltyBps } : {}),
          ...(params.excludeFlaggedTokens !== undefined ? { excludeFlaggedTokens: params.excludeFlaggedTokens } : {}),
          ...(params.currency ? { currency: params.currency } : {}),
          ...(params.checkMakerOutstandingBalance !== undefined ? { checkMakerOutstandingBalance: params.checkMakerOutstandingBalance } : {}),
        }],
      };
    },

    // /**
    //  * Maps generic cancel item offer parameters to Ethereum-specific API request
    //  */
    // cancelItemOfferRequest: (params: EvmCancelItemOfferParams): V3CancelOrderRequest => {
    //   // TODO: Implement Ethereum-specific mapping
    //   return {
    //     // Map params to Ethereum API request format
    //   };
    // },

    // /**
    //  * Maps generic take item offer parameters to Ethereum-specific API request
    //  */
    // takeItemOfferRequest: (params: EvmTakeItemOfferParams): V3SellRequest => {
    //   // TODO: Implement Ethereum-specific mapping
    //   return {
    //     // Map params to Ethereum API request format
    //   };
    // },

    // /**
    //  * Maps generic buy parameters to Ethereum-specific API request
    //  */
    // buyRequest: (params: EvmBuyParams): V3BuyRequest => {
    //   // TODO: Implement Ethereum-specific mapping
    //   return {
    //     // Map params to Ethereum API request format
    //   };
    // },

    // /**
    //  * Maps generic transfer parameters to Ethereum-specific API request
    //  */
    // transferRequest: (params: EvmTransferParams): V3TransferRequest => {
    //   // TODO: Implement Ethereum-specific mapping
    //   return {
    //     // Map params to Ethereum API request format
    //   };
    // },
  },

  v4: {
    /**
     * Maps EVM publish launchpad parameters to V4 publish launchpad request
     */
    publishLaunchpadRequest: (params: EvmPublishLaunchpadParams): V4PublishLaunchpadRequest => ({
      ...params,
    }),

    /**
     * Maps EVM create launchpad parameters to V4 create launchpad request
     */
    createLaunchpadRequest: (params: EvmCreateLaunchpadParams): V4CreateLaunchpadRequest => ({
      // All variables have the same name
      ...params,
    }),

    /**
     * Maps EVM update launchpad parameters to V4 update launchpad request
     */
    updateLaunchpadRequest: (params: EvmUpdateLaunchpadParams): V4UpdateLaunchpadRequest => ({
      ...params,
    }),

    /**
     * Maps EVM mint parameters to V4 mint request
     */
    mintRequest: (params: EvmMintParams): V4MintRequest => ({
      ...params,
    }),
  },
};
