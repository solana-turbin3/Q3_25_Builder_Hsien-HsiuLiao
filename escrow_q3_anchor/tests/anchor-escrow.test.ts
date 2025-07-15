import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorEscrow } from "../target/types/anchor_escrow";
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

describe("anchor-escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const connection = provider.connection;
  const commitment: Commitment = "confirmed";

  //const connection = new Connection("https://api.devnet.solana.com");

  const signerkp = Keypair.fromSecretKey(new Uint8Array(wallet));

  const program = anchor.workspace.anchorEscrow as Program<AnchorEscrow>;

  it("Is initialized!", async () => {
    // Add your test here.
    const seed = new anchor.BN(123);
    const receive = new anchor.BN(1000);
    const deposit = new anchor.BN(500);

    const tx = await program.methods
    .make(seed, receive ,deposit ).accountsPartial({
      maker: signerkp.publicKey, 
     // mintA,
   //   mintB,
      makerAtaA,
    //  escrow,
      vault,
    //  associatedTokenProgram,
   //   tokenProgram,
   //   systemProgram
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
