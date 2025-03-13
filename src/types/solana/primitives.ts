import { z } from 'zod';

const solanaAddressRegExp = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export const zSolanaAddress = z.string().regex(solanaAddressRegExp);

const SYMBOL_REGEX = /^[a-zA-Z0-9_]+$/;
const isValidSolanaSymbol = (symbol: string): boolean => {
  return SYMBOL_REGEX.test(symbol);
};

export const SolanaSymbol = z.string().refine(isValidSolanaSymbol, {
  message: 'Symbol must be alphanumeric and can only contain underscores',
});
