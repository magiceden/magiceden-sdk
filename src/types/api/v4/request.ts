import { z } from 'zod';
import { Blockchain } from '../../chains';
import { TokenProtocolType } from '../../protocol';

interface SocialAccountDetails {
  discordUrl?: string;
  externalUrl?: string;
  telegramUrl?: string;
  twitterUsername?: string;
}

export interface V4CreateLaunchpadRequest {
  chain: Blockchain;
  protocol: TokenProtocolType;
  creator: string;
  social?: SocialAccountDetails;
  name: string;
  symbol: string;
  tokenImageUrl?: string;
  imageUrl?: string;
  description?: string;
  royaltyBps: number;
  royaltyRecipients: {
    address: string;
    share: number;
  }[];
  payoutRecipient: string;
  nftMetadataUrl?: string;
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
  collectionId: string;
  owner: string;
  chain: Blockchain;
  protocol: TokenProtocolType;
  social?: SocialAccountDetails;
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
  payer?: string;
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

export interface V4PublishLaunchpadRequest {
  chain: Blockchain;
  candyMachineId?: string;
  symbol?: string;
  authorization?: {
    signature: string;
    signer: string;
    timestamp: string;
  };
}

export interface V4MintRequest {
  collectionId: string;
  wallet: {
    chain: string;
    address: string;
  };
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
