import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorLoudness } from "../target/types/anchor_loudness";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync} from "@solana/spl-token";
import {
  Commitment,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Connection
} from "@solana/web3.js";

describe("anchor-loudness", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchorLoudness as Program<AnchorLoudness>;

  const config = PublicKey.findProgramAddressSync(
                            [Buffer.from("loudness_config")], 
                            program.programId)
                            [0];

  const rewardsMint = PublicKey.findProgramAddressSync(
                                 [Buffer.from("rewards"), 
                                  config.toBuffer()], 
                                  program.programId)
                                  [0];


  it("Initialize Config Account", async () => {
    const tx = await program.methods.initializeConfig()
    .accountsPartial({
      admin: provider.wallet.publicKey,
      config,
      rewardsMint,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
    console.log("\nConfig Account Initialized!");
    console.log("Your transaction signature", tx);
  });
  
});
