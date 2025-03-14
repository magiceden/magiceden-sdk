import { z } from 'zod';
import { zEVMAddress } from '../../../evm/primitives';
import { Blockchain, ZodEvmBlockchain } from '../../../chain';
import { zSolanaAddress } from '../../../solana/primitives';

/**
 * Base transaction step schema
 */
export const BaseTransactionStep = z.object({
  id: z.string().describe('Unique identifier for the transaction step'),
  description: z.string().optional().describe('Human-readable description of the step'),
});

/**
 * EVM transaction parameters
 */
export const EvmTransactionParams = z.object({
  from: zEVMAddress.describe('Sender address'),
  to: zEVMAddress.describe('Recipient address'),
  value: z.string().optional().describe('Transaction value in wei'),
  data: z
    .string()
    .regex(/^0x[a-fA-F0-9]*$/)
    .optional()
    .describe('Transaction data'),
  chainId: z.number().int().optional().describe('Chain ID'),
  gas: z.string().optional().describe('Gas limit'),
});

/**
 * EVM transaction step
 */
export const EvmTransactionStep = BaseTransactionStep.extend({
  chain: ZodEvmBlockchain.describe('Blockchain'),
  method: z.literal('eth_sendTransaction').describe('Transaction method'),
  params: EvmTransactionParams.describe('Transaction parameters'),
});

/**
 * Solana transaction parameters
 */
export const SolanaTransactionParams = z.object({
  feePayer: zSolanaAddress.describe('Fee payer address'),
  transactions: z
    .array(
      z.object({
        transaction: z.string().describe('Base64 encoded transaction'),
        signerPubkeys: z.array(zSolanaAddress).optional().describe('Public keys of required signers'),
      }),
    )
    .describe('Array of transactions'),
});

/**
 * Base Solana transaction step
 */
export const BaseSolanaTransactionStep = BaseTransactionStep.extend({
  chain: z.literal(Blockchain.SOLANA).describe('Blockchain'),
  method: z.string().describe('Transaction method'),
  params: SolanaTransactionParams.describe('Transaction parameters'),
});

/**
 * Solana sign and send transaction step
 */
export const SolanaSignAndSendStep = BaseSolanaTransactionStep.extend({
  method: z.literal('signAllAndSendTransactions').describe('Transaction method'),
});

/**
 * Solana submit parameters
 */
export const SolanaSubmitParams = z.object({
  payload: z.record(z.string(), z.any()).describe('POST body payload'),
  endpoint: z.string().describe('Endpoint to make the POST request to'),
});

/**
 * Solana submit transaction step
 */
export const SolanaSubmitStep = BaseSolanaTransactionStep.extend({
  method: z.literal('Post').describe('Transaction method'),
  params: SolanaSubmitParams.describe('Submit parameters'),
});

/**
 * Union of all Solana transaction steps
 */
export const SolanaTransactionStep = z.union([SolanaSignAndSendStep, SolanaSubmitStep]);

/**
 * Union of all transaction steps
 */
export const TransactionStep = z.union([EvmTransactionStep, SolanaTransactionStep]);
export type TransactionStep = z.infer<typeof TransactionStep>;
