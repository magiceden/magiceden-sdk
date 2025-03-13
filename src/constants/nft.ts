export const MIN_ALLOWLIST_SIZE = 2;
export const MAX_ALLOWLIST_SIZE = 2500;
export const MIN_ROYALTY_BPS = 0;
export const MAX_ROYALTY_BPS = 1_000; // 10%

export const MIN_SUPPLY = 1;
export const MAX_SUPPLY = 2 ** 64 - 1; // 2^64 - 1 is the max uint256 value

// Note: we treat a wallet limit of 0 as unlimited mints per wallet
export const MIN_WALLET_LIMIT = 0;
export const MAX_WALLET_LIMIT = 1000;

export const SOL_MAX_NAME_LENGTH = 25;
