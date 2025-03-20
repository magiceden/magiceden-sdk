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
import { DEFAULT_ORDER_KIND, DEFAULT_ORDERBOOK } from '../../constants/evm';

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
        params: params.params.map((param) => ({
          token: param.token,
          weiPrice: param.price,
          orderbook: DEFAULT_ORDERBOOK,
          orderKind: DEFAULT_ORDER_KIND,
          ...(param.expiry ? { expirationTime: param.expiry.toString() } : {}),
        })),
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
        params: params.params.map((param) => ({
          token: param.token,
          weiPrice: param.price,
          ...(param.expiry ? { expirationTime: param.expiry.toString() } : {}),
          ...(param.quantity ? { quantity: param.quantity } : {}),
          ...(param.automatedRoyalties !== undefined ? { automatedRoyalties: param.automatedRoyalties } : {}),
          ...(param.royaltyBps ? { royaltyBps: param.royaltyBps } : {}),
          ...(param.currency ? { currency: param.currency } : {}),
        })),
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

    /**
     * Maps generic take item offer parameters to Ethereum-specific API request
     */
    takeItemOfferRequest: (taker: `0x${string}`, params: EvmTakeItemOfferParams): V3SellRequest => {
      return {
        taker,
        chain: params.chain,
        items: params.items.map((item) => ({
          token: item.token,
          ...(item.quantity ? { quantity: item.quantity } : {}),
          ...(item.orderId ? { orderId: item.orderId } : {}),
        })),
      };
    },

    /**
     * Maps generic buy parameters to Ethereum-specific API request
     */
    buyRequest: (taker: `0x${string}`, params: EvmBuyParams): V3BuyRequest => {
      return {
        taker,
        chain: params.chain,
        currency: params.currency,
        currencyChainId: params.currencyChainId,
        items: params.items.map((item) => ({
          ...(item.token ? { token: item.token } : {}),
          ...(item.collection ? { collection: item.collection } : {}),
          ...(item.quantity ? { quantity: item.quantity } : {}),
          ...(item.orderId ? { orderId: item.orderId } : {}),
        })),
      };
    },

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
