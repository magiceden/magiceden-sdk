export interface SolanaTransactionParams {
  feePayer: string;
  transactions: EncodedSolanaTransaction[];
}

export interface EncodedSolanaTransaction {
  transaction: string; // base64 encoded transaction
  signers: string[];
}
