import {Connection, Keypair, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";

//connect to devnet
export const connection = new Connection(
  'https://api.devnet.solana.com',
  'confirmed'
);

//helper to get balance
export async function getBalance(publicKey : PublicKey): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}

//helper to airdrop (devnet only)
export async function airdrop(publicKey: PublicKey, amount: number) {
  const signature = await connection.requestAirdrop(
    publicKey,
    amount * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
  return signature;
}
