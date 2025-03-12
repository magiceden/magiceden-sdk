export interface SolanaTransactionParams {
  feePayer: string;
  transactions: EncodedSolanaTransaction[];
}

export interface EncodedSolanaTransaction {
  transaction: string; // base64 encoded transaction
  signers: string[];
}

export interface V4CreateLaunchpadRequest {}

export interface V4UpdateLaunchpadRequest {}

export interface V4PublishLaunchpadRequest {}

export interface V4MintRequest {}
