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
import { Account, ASSOCIATED_TOKEN_PROGRAM_ID, createMint, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';


import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


import { assert } from "chai";

//import wallet from "../../Turbin3-wallet.json";
import { min } from "bn.js";
import { randomBytes } from "crypto";

describe("anchor-escrow", () => {

  // Helper function to confirm a transaction
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
  const confirmTxs = async (signatures: string[]) => {
    await Promise.all(signatures.map(confirmTx))
  }

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const commitment: Commitment = "confirmed";

  const connection = provider.connection;

  //const signerkp = Keypair.fromSecretKey(new Uint8Array(wallet));


  const program = anchor.workspace.anchorEscrow as Program<AnchorEscrow>;

 

  const token_decimals = 1_000_000;

  const seed = new anchor.BN(randomBytes(8));
  const receive = new anchor.BN(1000);
  const deposit = new anchor.BN(500);



  const [maker, taker] =
    [new Keypair(), new Keypair(), new Keypair(), new Keypair(),];

  /* const [makerAtaA, makerAtaB, takerAtaA, takerAtaB] = [maker, taker]
    .map((a) =>
      [mintA, mintB].map((m) =>
        getAssociatedTokenAddressSync(m.publicKey, a.publicKey, false, TOKEN_PROGRAM_ID)
      )
    )
    .flat(); */

  let makerAtaA: Account;
  let mintA: PublicKey;
  let mintB: PublicKey;

  let vault: PublicKey;


  const escrow = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), maker.publicKey.toBuffer(), seed.toArrayLike(Buffer, "le", 8)],// seed.toBuffer("le", 8)
    program.programId
  )[0];



  it("before", async () => {

    await Promise.all([maker, taker].map(async (k) => {


      return await anchor.getProvider().connection.requestAirdrop(k.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    })).then(confirmTxs);



    mintA = await createMint(connection, maker, maker.publicKey, null, 6);
    console.log("mintA", mintA);
    mintB = await createMint(connection, taker, taker.publicKey, null, 6);


    vault = getAssociatedTokenAddressSync(
      mintA,
      escrow,
      true
    );

    makerAtaA = await getOrCreateAssociatedTokenAccount(
      connection,
      maker,
      mintA,
      maker.publicKey,

    )



    //   Mint to ATA
    const mintTx = await mintTo(
      connection,
      maker,
      mintA,
      makerAtaA.address,
      maker.publicKey,
      10000000
    )


  });

  it("Is initialized!", async () => {

    const tx = await program.methods
      .make(seed, receive, deposit).accountsPartial({
        maker: maker.publicKey,
        mintA: mintA,
        mintB: mintB,
        makerAtaA: makerAtaA.address,
        escrow,
        vault,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      })
      .signers([maker])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
