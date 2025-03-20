import { SupportedChain } from "./chains";

/**
 * Signature response
 */
export interface SignatureResponse {
  signature: string;
}

/**
 * Define signature data types for each chain
 */
export type ChainSignatureType = {
  evm: {
    domain: any;
    types: any;
    message: any;
    primaryType: string;
    postData?: {
      endpoint: string;
      method: string;
      body: any;
    };
  };
  solana: {
    message: Uint8Array | string;
    display?: 'utf8' | 'hex';
    postData?: {
      endpoint: string;
      method: string;
      body: any;
    };
  };
};

/**
 * Helper type to get the signature type for a specific chain
 */
export type ChainSignature<C extends SupportedChain> = ChainSignatureType[C];
