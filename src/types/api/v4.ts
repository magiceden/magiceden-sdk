import { Blockchain } from "../chain";
import { TokenProtocolType } from "../protocol";

export interface SolanaTransactionParams {
  feePayer: string;
  transactions: EncodedSolanaTransaction[];
}

export interface EncodedSolanaTransaction {
  transaction: string; // base64 encoded transaction
  signers: string[];
}

export interface V4CreateLaunchpadRequest {
  chain: Blockchain;
  protocol: TokenProtocolType;
  creator: string;
  social?: {
    discordUrl?: string;
    externalUrl?: string;
    telegramUrl?: string;
    twitterUsername?: string;
  };
  name: string;
  symbol: string;
  imageUrl?: string;
  description?: string;
  royaltyBps: number;
  royaltyRecipients: {
    address: string;
    share: number;
  }[];
  payoutRecipient: string;
  nftMetadataUrl?: string;
  tokenImageUrl?: string;
  mintStages: any;
  // Solana-specific fields
  accounts?: {
    collectionAccount: string;
    configAccount: string;
    orderInfoAccount: string;
  };
  isOpenEdition?: boolean;
}

export interface V4UpdateLaunchpadRequest {}

export interface V4PublishLaunchpadRequest {}

export interface V4MintRequest {}
