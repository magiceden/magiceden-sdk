import { Blockchain } from '../../chain';
import { TokenProtocolType } from '../../protocol';

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

export interface V4UpdateLaunchpadRequest {
  collection: string;
  owner: string;
  chain: Blockchain;
  protocol: TokenProtocolType;
  social?: {
    discordUrl?: string;
    externalUrl?: string;
    telegramUrl?: string;
    twitterUsername?: string;
  };
  name?: string;
  imageUrl?: string;
  description?: string;
  royaltyBps?: number;
  royaltyRecipients?: {
    address: string;
    share: number;
  }[];
  payoutRecipient?: string;
  nftMetadataUrl?: string;
  mintStages?: any;
  tokenImageUrl?: string;
  tokenId?: number;
  // Solana-specific fields
  candyMachineId?: string;
  symbol?: string;
  newSymbol?: string;
  externalLink?: string;
  authorization?: {
    signature: string;
    signer: string;
    timestamp: string;
  };
  // EVM-specific fields
  message?: string;
  signature?: string;
}

export interface V4PublishLaunchpadRequest {}

export interface V4MintRequest {
  chain: Blockchain;
  collectionId: string;
  wallet: string;
  nftAmount: number;
  stageId?: string;
  kind: string; // MintStageKind
  // EVM-specific fields
  protocol?: string; // EvmProtocolType
  tokenId?: number;
  // Solana-specific fields
  candyMachineId?: string;
  symbol?: string;
  payer?: string;
  recipient?: string;
}
