import { SupportedChain } from "./chains";

/**
 * Signature response
 */
export interface SignatureResponse {
  signature: string;
  status: 'success' | 'failed';
  error?: string;
}

/**
 * Ethereum signature request
 */
export type EvmSignatureRequest = {
  domain: any;
  types: any;
  message: any;
  primaryType: string;
  postData?: {
    endpoint: string;
    method: string;
    body: any;
  };
}

/**
 * Solana signature request
 */
export type SolanaSignatureRequest = {
  message: Uint8Array | string;
  display?: 'utf8' | 'hex';
  postData?: {
    endpoint: string;
    method: string;
    body: any;
  };
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
