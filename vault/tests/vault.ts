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

describe("vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  // const connection = provider.connection;
   const commitment: Commitment = "confirmed";
 
   const connection = new Connection("https://turbine-solanad-4cde.devnet.rpcpool.com/168dd64f-ce5e-4e19-a836-f6482ad6b396", commitment); 
 

  const program = anchor.workspace.vault as Program<Vault>;

  let user = Keypair.generate();
 // let vaultState;
 // let vault;

  const vaultState = PublicKey.findProgramAddressSync(
    [Buffer.from("state"), user.publicKey.toBuffer()],
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

  before(async () => {
    // Airdrop some SOL to the user for testing
    const tx = await connection.requestAirdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(tx);
    const balance = await connection.getBalance(user.publicKey);
    console.log(`Balance for user: ${user.publicKey} ${balance / LAMPORTS_PER_SOL} SOL`);

  });



  it("Is initialized!", async () => {
    const balance = await connection.getBalance(user.publicKey);
    console.log(`Balance for user: ${user.publicKey} ${balance / LAMPORTS_PER_SOL} SOL`);
    
   const tx = await program.methods.initialize().accountsStrict({
      user: user.publicKey,
      vaultState: vaultState,
      vault: vault,
      systemProgram: SystemProgram.programId,
    }).signers([user]).rpc();
    
    console.log("Your transaction signature", tx);
    // Fetch the vault state to check if bumps are stored
   /*  vaultState = await program.account.vaultState.fetch(vaultState.publicKey);
    assert.ok(vaultState.vault_bump !== undefined);
    assert.ok(vaultState.vaultstate_bump !== undefined); */
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
