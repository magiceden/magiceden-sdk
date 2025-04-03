import { SupportedChain } from './chains';
import { ChainSignature, SignatureResponse } from './signatures';
import { ChainTransaction, TransactionResponse } from './transactions';

/**
 * Operation response
 */
export type OperationResponse = TransactionResponse | SignatureResponse;

/**
 * Operation type
 */
export type OperationType = 'transaction' | 'signature';

/**
 * Base operation interface
 */
export interface Operation {
  type: OperationType;
}

/**
 * Transaction operation
 * Contains data needed to execute a blockchain transaction
 */
export interface TransactionOperation<C extends SupportedChain> extends Operation {
  type: 'transaction';
  transactionData: ChainTransaction<C>;
  metadata?: Record<string, any>;
}

/**
 * Signature operation
 * Contains data needed to sign a message and potentially submit it
 */
export interface SignatureOperation<C extends SupportedChain> extends Operation {
  type: 'signature';
  signatureData: ChainSignature<C>;
  metadata?: Record<string, any>;
}

/**
 * Union type for all possible operations
 */
export type ChainOperation<C extends SupportedChain> =
  | TransactionOperation<C>
  | SignatureOperation<C>;
