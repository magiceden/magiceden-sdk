import { z } from 'zod';
import { Blockchain } from './general';

export const ChainAsset = z.object({
  chain: z.nativeEnum(Blockchain),
  assetId: z.string().describe('Asset identifier'),
});
