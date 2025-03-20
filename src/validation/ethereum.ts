/**
 * Type guard for checking if a string starts with the 0x prefix used in hex strings.
 *
 * @param str
 * @returns True if the string starts with 0x
 */
export function isHexPrefixedString(str: unknown): str is `0x${string}` {
  return typeof str === 'string' && str.startsWith('0x');
}
