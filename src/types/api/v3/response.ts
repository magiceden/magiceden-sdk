import { Execute, paths } from '@reservoir0x/reservoir-sdk';

export type V3ExecuteResponse = Execute;
export type V3OrderResponse = paths['/order/v4']['post']['responses']['200']['schema'];
