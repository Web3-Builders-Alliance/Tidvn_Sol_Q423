import {
    Transaction,
    SystemProgram,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    PublicKey,
  } from "@solana/web3.js";
  import { wallet } from "../env.json";
  
  const from = Keypair.fromSecretKey(new Uint8Array(wallet.secretKey));
  // Define our WBA public key
  const to = new PublicKey("GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ");
  
  // const toMyDevnetPublicKey = new PublicKey("Fmk2vA5MAkUpWwsMpU6SCtVnUpG6cZV2E7cgQ86hBuHG");
  
  const connection = new Connection("https://api.devnet.solana.com");
  
  const transferToWBA = async () => {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: LAMPORTS_PER_SOL / 100,
        })
      );
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;
  
      transaction.feePayer = from.publicKey;
      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(connection, transaction, [
        from,
      ]);
      console.log(`Success! Check out your TX here:\n
      https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  
      // https://explorer.solana.com/tx/49VNchAvKcb87owUbarY4YH9YZQmsKF9J2N9rAGXPW9d4j4yhySYosAvYNY4rXrnSUvKaG6LN3vWYcaEydSrTYz4?cluster=devnet
    } catch (e) {
      console.error(`Oops, something went wrong: ${e}`);
    }
  };
  transferToWBA();
  
  
  
  
  const cleanUpDevWallet = async () => {
    try {
      const balance = await connection.getBalance(from.publicKey);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: balance,
        })
      );
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;
      transaction.feePayer = from.publicKey;
      const fee =
        (
          await connection.getFeeForMessage(
            transaction.compileMessage(),
            "confirmed"
          )
        ).value || 0;
      transaction.instructions.pop();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: balance - fee,
        })
      );
      const sign = await sendAndConfirmTransaction(connection, transaction, [
        from,
      ]);
      console.log(
        `Success! Check out your TX here: https://explorer.solana.com/tx/${sign}?cluster=devnet`
      );
    } catch (e) {
      console.error(`Oops, some thing went wrong: ${e}`);
    }
  };
  
  cleanUpDevWallet();