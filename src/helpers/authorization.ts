import { ChainTransaction } from '../types';
import { WalletProvider } from '../wallet';

/**
 * Generate a signed authorization payload for Solana operations
 * @param wallet The wallet to sign with
 * @param candyMachineId The candy machine ID
 * @returns Authorization payload with signer, signature and timestamp
 */
export async function createSolanaLaunchpadAuthorizationPayload(
  wallet: WalletProvider<ChainTransaction<'solana'>>,
  candyMachineId: string,
): Promise<{
  signer: string;
  signature: string;
  timestamp: string;
}> {
  const timestamp = Date.now().toString();
  const message = `Signing as authority for ${candyMachineId} at ${timestamp}`;
  const signature = await wallet.signMessage(message);

  return {
    signer: wallet.getAddress(),
    signature,
    timestamp,
  };
}

/**
 * Generate a signed message for EVM operations
 * @param wallet The wallet to sign with
 * @param message The message to sign
 * @returns The signature
 */
export async function createEvmLaunchpadAuthorizationPayload(wallet: WalletProvider<ChainTransaction<'evm'>>): Promise<{
  owner: `0x${string}`;
  message: string;
  signature: string;
}> {
  const timestamp = Date.now();
  const message = `Please sign this message to prove ownership of the NFT collection - ${timestamp}`;
  const signature = await wallet.signMessage(message);

  return {
    owner: wallet.getAddress() as `0x${string}`,
    message,
    signature,
  };
}
