import { paths } from '@reservoir0x/reservoir-sdk';
import { EvmBlockchain } from '../../chains/evm';

export interface V3EVMRequest {
  chain: EvmBlockchain;
}

type PlaceBidBody = NonNullable<paths['/execute/bid/v5']['post']['parameters']['body']['body']>;
export interface V3PlaceBidRequest extends V3EVMRequest {
  maker: string;
  params: Required<PlaceBidBody>['params'];
}

type ListTokenBody = NonNullable<paths['/execute/list/v5']['post']['parameters']['body']['body']>;
export interface V3ListRequest extends V3EVMRequest {
  maker: string;
  params: Required<ListTokenBody>['params'];
}

type BuyTokenBody = NonNullable<paths['/execute/buy/v7']['post']['parameters']['body']['body']>;
type BuyTokenOptions = Partial<Omit<BuyTokenBody, 'source' | 'items'>>;
export interface V3BuyRequest extends V3EVMRequest {
  taker: string;
  items: Required<BuyTokenBody>['items'];
  options?: BuyTokenOptions;
}

type SellTokenBody = NonNullable<paths['/execute/sell/v7']['post']['parameters']['body']['body']>;
type SellTokenOptions = Partial<Omit<SellTokenBody, 'items'>>;
export interface V3SellRequest extends V3EVMRequest {
  taker: string;
  items: Required<SellTokenBody>['items'];
  options?: SellTokenOptions;
}

type CancelOrderBody = paths['/execute/cancel/v3']['post']['parameters']['body'];
type CancelOrderOptions = Omit<NonNullable<CancelOrderBody['body']>, 'orderIds'>;
export interface V3CancelOrderRequest extends V3EVMRequest {
  orderIds: string[];
  options?: CancelOrderOptions;
}

type TransferTokenBody = NonNullable<
  paths['/execute/transfer/v1']['post']['parameters']['body']['body']
>;
export interface V3TransferRequest extends V3EVMRequest {
  to: `0x${string}`;
  from: `0x${string}`;
  items: Required<TransferTokenBody>['items'];
}

export interface V3SubmitSignedOrderRequest extends V3EVMRequest {
  signature: string;
  data: any;
}
