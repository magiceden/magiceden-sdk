export type SplTokenAddress = string;

/**
 * The number of decimals in an amount represented using the lowest possible unit.
 */
export type AmountDecimals = number;

export type Amount<
  I extends SplTokenAddress = SplTokenAddress,
  D extends AmountDecimals = AmountDecimals,
> = {
  /** The amount in its lower possible unit such that it does not contain decimals. */
  rawAmount: bigint;
  /** The identifier of the amount. */
  address: I;
  /** The number of decimals in the amount. */
  decimals: D;
};

export type SplAmount = Amount<string, number> & {
  /** Token symbol of the SPL token (for display purposes) */
  symbol?: string;
};
