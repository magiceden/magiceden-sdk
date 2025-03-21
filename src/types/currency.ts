import { z } from 'zod';

export const Currency = z.object({
  symbol: z.string(),
  unit: z.string(),
  decimals: z.number(),
  displayName: z.string(),
  address: z.string().optional(),
});
export type Currency = z.infer<typeof Currency>;
