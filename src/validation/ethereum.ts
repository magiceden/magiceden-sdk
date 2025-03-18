import { EvmChainId } from "../types/chains/evm";

/**
 * Type guard for checking if a string starts with the 0x prefix used in hex strings.
 *
 * @param str
 * @returns True if the string starts with 0x
 */
export function isHexPrefixedString(str: unknown): str is `0x${string}` {
  return typeof str === 'string' && str.startsWith('0x');
}

/**
 * Type guard for checking if a value is a valid EVM chain ID.
 *
 * @param chainId
 * @returns True if the value is a valid EVM chain ID
 */
export function isEvmChainId(chainId: unknown): chainId is EvmChainId {
  return typeof chainId === 'number' && Object.values(EvmChainId).includes(chainId as EvmChainId);
}