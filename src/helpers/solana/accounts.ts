import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export async function getTokenAccount(walletAddress: string, mintAddress: string): Promise<string> {
  const walletPublicKey = new PublicKey(walletAddress);
  const mintPublicKey = new PublicKey(mintAddress);

  const tokenAccount = await getAssociatedTokenAddress(mintPublicKey, walletPublicKey);

  return tokenAccount.toString();
}
