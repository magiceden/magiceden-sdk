import { TransactionStep } from '../../services/nft/shared';

export interface V4CreateLaunchpadResponse {
  steps: TransactionStep[];
  metadata: {
    imageUrl?: string;
    tokenImage?: string;
    metadataUrl?: string;
  }
}

export interface V4PublishLaunchpadResponse {
  success: boolean;
}

export interface V4UpdateLaunchpadResponse {
  steps: TransactionStep[];
  metadata: {
    imageUrl?: string;
    tokenImage?: string;
    metadataUrl?: string;
  };
}

export interface V4MintResponse {
  steps: TransactionStep[];
}
