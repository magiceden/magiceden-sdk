import { SupportedChain } from "./chains";

/**
 * Signature response
 */
export interface SignatureResponse {
  signature: string;
  status: 'success' | 'failed';
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Ethereum signature request
 */
export type EvmSignatureRequest = {
  api: 'v3' | 'v4';
  chainId: number;
  domain: any;
  types: any;
  message: any;
  primaryType: string;
  post?: any;
}

/**
 * Solana signature request
 */
export type SolanaSignatureRequest = {
  api: 'v2' | 'v4';
  message: Uint8Array | string;
  display?: 'utf8' | 'hex'; 
}

/**
 * Define signature data types for each chain
 */
export type ChainSignatureType = {
  evm: EvmSignatureRequest;
  solana: SolanaSignatureRequest;
};

/**
 * Helper type to get the signature type for a specific chain
 */
export type ChainSignature<C extends SupportedChain> = ChainSignatureType[C];
