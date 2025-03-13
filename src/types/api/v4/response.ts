import { TransactionStep } from '../../services/nft/shared';

export interface V4TransactionResponse {
  steps: TransactionStep[];
}

export interface V4CreateLaunchpadResponse extends V4TransactionResponse {
  metadata: {
    imageUrl?: string;
    tokenImage?: string;
    metadataUrl?: string;
  };
}

export interface V4PublishLaunchpadResponse {
  success: boolean;
}

export interface V4UpdateLaunchpadResponse extends V4TransactionResponse {
  metadata: {
    imageUrl?: string;
    tokenImage?: string;
    metadataUrl?: string;
  };
}

export interface V4MintResponse extends V4TransactionResponse {}
