import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorLoudness } from "../target/types/anchor_loudness";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  Commitment,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Connection
} from "@solana/web3.js";
import * as sb from "@switchboard-xyz/on-demand";
import { assert } from "chai";

import wallet from "../../Turbin3-wallet.json";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

describe("anchor-loudness", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const connection = provider.connection;


  const program = anchor.workspace.anchorLoudness as Program<AnchorLoudness>;

  //helpers
  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const confirmTx = async (signature: string) => {
    const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
    await anchor.getProvider().connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      commitment
    )
  }

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  const commitment: Commitment = "confirmed";

  // get or find accounts

  const admin = Keypair.fromSecretKey(new Uint8Array(wallet)); //("Coop1aAuEqbN3Pm9TzohXvS3kM4zpp3pJZ9D4M2uWXH2");

  const user = Keypair.fromSecretKey(new Uint8Array(wallet)); //("Coop1aAuEqbN3Pm9TzohXvS3kM4zpp3pJZ9D4M2uWXH2");

  const config = PublicKey.findProgramAddressSync(
    [Buffer.from("loudness_config")],
    program.programId
  )[0];

  const rewardsMint = PublicKey.findProgramAddressSync(
    [Buffer.from("rewards"), config.toBuffer()],
    program.programId
  )[0];


  const userAccount = PublicKey.findProgramAddressSync(
    [Buffer.from("user"), user.publicKey.toBuffer()],
    program.programId
  )[0];

  const venueName = "Madison Sqaure Garden";

  const venue = PublicKey.findProgramAddressSync(
    [config.toBuffer(), Buffer.from(venueName, 'utf8')],
    program.programId
  )[0];

  const submission = PublicKey.findProgramAddressSync(
    [venue.toBuffer(), user.publicKey.toBuffer()],
    program.programId
  )[0];


  //airdrop
  xit("Airdrop", async () => {
    await anchor.getProvider().connection.requestAirdrop(admin.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
      .then(confirmTx);
  });

  it("Initialize Config Account", async () => {
    const tx = await program.methods.initializeConfig()
      .accountsPartial({
        admin: admin.publicKey,
        config,
        rewardsMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([admin])
      .rpc()
      .then(confirm)
      .then(log);

    console.log("\nConfig Account Initialized!");
    console.log("Your transaction signature", tx);
  });

  it("Get admin account", async () => {
    const fetchProgramConfigAccount = await program.account.config.fetch(config);

    console.log("\nThe admin is ", fetchProgramConfigAccount.admin.toBase58());
   
    assert.equal(fetchProgramConfigAccount.admin.toBase58(), admin.publicKey.toBase58());
  });

  it("Initialize User Account", async () => {
    const tx = await program.methods.initializeUser()
      .accountsPartial({
        user: user.publicKey,
        userAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc()
      .then(confirm)
      .then(log);

    console.log("\nUser Account Initialized!");
    console.log("Your transaction signature", tx);
  });

  it("Get sound level", async () => {
    const loudnessProgram = anchor.workspace.anchorLoudness as Program<AnchorLoudness>;

    const feed = new PublicKey("6JgUWRNpHJFYP3qCzHzzjCTnMCrZ9hb1RLGUuZrMt8eB");

   // const { keypair, connection, program } = await sb.AnchorUtils.loadEnv();

   // const feedAccountInfo = await connection.getAccountInfo(feed);
   // console.log("feedAccountInfo", feedAccountInfo.data.toString());
    

   // const sbProgram = program;

    //const feedAccount = new sb.PullFeed(sbProgram!, feed);

    //await feedAccount.preHeatLuts();


/* 
    const [pullIx, responses, _ok, luts] = await feedAccount.fetchUpdateIx({
      numSignatures: 3,
    });
 */

    const tx = await loudnessProgram.methods.getSoundLevel()
      .accountsPartial({
        feed: feed,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc()
      .then(confirm)
      .then(log);

    console.log("\nFeed submitted!");
    console.log("Your transaction signature", tx);
  });

  it("Create Submission", async () => {
    const tx = await program.methods.createSubmission(
      venueName,
      {
        soundLevel: 75,
        timestamp: new anchor.BN(Math.floor(Date.now() / 1000)),
        seatNumber: 101,
        userRating: 5,
      }
    ).accountsPartial({
        user: user.publicKey,
        config,
        userAccount,
        venue,
        submission,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc()
      .then(confirm)
      .then(log);

    console.log("\nUser creates submission!");
    console.log("Your transaction signature", tx);
  });

  it("Close User Account", async () => {
    const tx = await program.methods.closeUser()
      .accountsPartial({
        user: user.publicKey,
        userAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc()
      .then(confirm)
      .then(log);

    console.log("\nUser Account Closed!");
    console.log("Your transaction signature", tx);
  });

  it("Close Config Account", async () => {
    console.log("Config account owner:", (await program.provider.connection.getAccountInfo(config))?.owner.toBase58());
    console.log("Rewards mint owner:", (await program.provider.connection.getAccountInfo(rewardsMint))?.owner.toBase58());
    const tx = await program.methods.closeConfig()
      .accountsPartial({
        admin: admin.publicKey,
        config,
      //  rewardsMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([admin])
      .rpc()
      .then(confirm)
      .then(log);

    console.log("\nConfig Account Closed!");
    console.log("Your transaction signature", tx);
  });

});
