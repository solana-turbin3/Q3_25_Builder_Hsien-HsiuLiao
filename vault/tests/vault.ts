import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";
import {
  Commitment,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Connection
} from "@solana/web3.js";

import { assert } from "chai";

import wallet from "../../Turbin3-wallet.json";


describe("vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

 //  const connection = provider.connection;
  const commitment: Commitment = "confirmed";

  const connection = new Connection("https://api.devnet.solana.com");

  //  const connection = new Connection("https://turbine-solanad-4cde.devnet.rpcpool.com/168dd64f-ce5e-4e19-a836-f6482ad6b396", commitment); 
 //  const connection = new Connection("https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a", commitment);


  const program = anchor.workspace.vault as Program<Vault>;

  const pubkey = new PublicKey("Coop1aAuEqbN3Pm9TzohXvS3kM4zpp3pJZ9D4M2uWXH2");
  const signerkp = Keypair.fromSecretKey(new Uint8Array(wallet));

  let user = Keypair.generate();
  console.log(`user: ${user.publicKey} `);
  console.log("test");

  // let vaultState;
  // let vault;

  const vaultState = PublicKey.findProgramAddressSync(
    [Buffer.from("state"), pubkey.toBuffer()],
    program.programId
  )[0];

  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultState.toBuffer()],
    program.programId
  )[0];

  //helpers
  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  /* before(async () => {

  }); */


  it("Is initialized!", async () => {

    // Airdrop some SOL to the user for testing
   /*  try {
      // We're going to claim 2 devnet SOL tokens
      const txhash = await connection.requestAirdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
      console.log(`Airdrop Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
      const balance = await connection.getBalance(user.publicKey);
      console.log(`Balance for user: ${user.publicKey} ${balance / LAMPORTS_PER_SOL} SOL`);
    } catch (e) {
      console.error(`Oops, something went wrong: ${e}`)
    } */

    // const tx = await connection.requestAirdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
    // await connection.confirmTransaction(tx);
   
    const balance = await connection.getBalance(pubkey);
    console.log(`Balance for user: ${pubkey} ${balance / LAMPORTS_PER_SOL} SOL`);


    /* const tx = await program.methods.initialize().accountsPartial({
      vaultUser: pubkey// user.publicKey,
      //  vaultState,
      //  vault,
      //   systemProgram: SystemProgram.programId,
    })
      .signers([signerkp])
      .rpc()
      .then(confirm)
      .then(log); 

    console.log("Your transaction signature", tx);
    */
    // Fetch the vault state to check if bumps are stored
     const vaultStateUpdated = await program.account.vaultState.fetch(vaultState);
     assert.ok(vaultStateUpdated.vaultBump !== undefined);
     assert.ok(vaultStateUpdated.vaultstateBump !== undefined);
  });

  it("should store bumps in vault_state", async () => {

    //console.log("Your transaction signature", tx);
  });

  it("should make a deposit", async () => {

    //console.log("Your transaction signature", tx);
  });

  it("should withdraw", async () => {

    //console.log("Your transaction signature", tx);
  });

  it("should close the vault and vault_state accounts", async () => {

    //console.log("Your transaction signature", tx);
  });
});
