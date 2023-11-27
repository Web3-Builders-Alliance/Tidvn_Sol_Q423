import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { wallet } from "../env.json";
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet.secretKey));
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    // We're going to claim 2 devnet SOL tokens
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );

    console.log(`Success! Check out your TX here: \n
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    
    
    //https://explorer.solana.com/tx/5e36ymtQVoqrS7Qma22fJox2Ffa8Mi9dvCR88dvGouFZjLDqCBJSe87t4npvUzTHD9xcrRAegdBF7z5HaBV16JiS?cluster=devnet

    
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();