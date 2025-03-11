/**
 * Transaction response interface
 */
export interface TransactionResponse {
  /**
   * Transaction ID or signature
   */
  txId: string;

  /**
   * Transaction signature (Solana-specific)
   */
  signature?: string;

  /**
   * Transaction hash (EVM-specific)
   */
  hash?: string;

  /**
   * Transaction status
   */
  status?: 'pending' | 'confirmed' | 'failed';

  /**
   * Block number (if confirmed)
   */
  blockNumber?: number;

  /**
   * Error message (if failed)
   */
  error?: string;

  /**
   * Transaction logs
   */
  logs?: string[];
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
  };
}
