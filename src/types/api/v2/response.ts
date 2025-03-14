import { BlockhashWithExpiryBlockHeight } from "@solana/web3.js";

/**
 * Buffer interface
 */
interface Buffer {
  type: 'Buffer';
  data: number[];
}

/**
 * Instruction response interface
 */
export interface SolanaInstructionsResponse {
  tx: Buffer;
  txSigned?: Buffer;
  v0?: {
    tx: Buffer;
    txSigned?: Buffer;
  };
  blockhashData?: BlockhashWithExpiryBlockHeight;
}
