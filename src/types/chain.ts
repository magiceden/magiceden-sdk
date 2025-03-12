/**
 * Chain type
 */
export enum ChainType {
  SOLANA = 'solana',
  EVM = 'evm',
}
/**
 * Type for supported chain keys
 */
export type SupportedChain = keyof typeof ChainType;
