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
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


import { assert } from "chai";

import wallet from "../../Turbin3-wallet.json";
import { min } from "bn.js";

describe("anchor-escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const connection = provider.connection;
  const commitment: Commitment = "confirmed";

  //const connection = new Connection("https://api.devnet.solana.com");

  const signerkp = Keypair.fromSecretKey(new Uint8Array(wallet));

  let makerAtaA;
  let vault;
  
  const program = anchor.workspace.anchorEscrow as Program<AnchorEscrow>;

  // Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

const token_decimals = 1_000_000;

const seed = new anchor.BN(123);
const receive = new anchor.BN(1000);
const deposit = new anchor.BN(500);

const escrow = PublicKey.findProgramAddressSync(
  [Buffer.from("escrow"), signerkp.publicKey.toBuffer(), new Uint8Array(seed.toArray('le', 4))],
  program.programId
)[0];



  before(async () => {
    const mintA = await createMint(connection, signerkp, signerkp.publicKey, null, 6);

    const umiMint = publicKey(mintA)

    try {
         let accounts: CreateMetadataAccountV3InstructionAccounts = {
             mint: umiMint, 
             mintAuthority: signer
         }
 
         let data: DataV2Args = {
             name: "Can we ship it?",
             symbol: "CWSI",
             uri: "http://www.arweave.net/12345",
             sellerFeeBasisPoints: 3,
             creators: null,
             collection: null,
             uses: null
 
         }
 
         let args: CreateMetadataAccountV3InstructionArgs = {
             data,
             isMutable: true,
             collectionDetails: null
 
         }
 
         let tx = createMetadataAccountV3(
             umi,
             {
                 ...accounts,
                 ...args
             }
         )
 
         let result = await tx.sendAndConfirm(umi);
         console.log(bs58.encode(result.signature));
         /* 
         https://explorer.solana.com/tx/3jgT2kTzAy43r7fLwUnQjerVwwZxt2FQyo3VN1xuyfFGjEuQe4fzp9MC6Y5pXNhJZEYYXArMWPCDRh7ik8YUmYoK?cluster=devnet
 
         the following shows token metadata
         https://explorer.solana.com/address/6jocG9wDorGF2Y18T7UrhFvJmYN9e36tfkd83VsuXW4V/metadata?cluster=devnet
         */
     } catch(e) {
         console.error(`Oops, something went wrong: ${e}`)
     }

    makerAtaA = await getOrCreateAssociatedTokenAccount(
            connection,
            signerkp,
            mintA, 
            signerkp.publicKey
        );

         //   Mint to ATA
         const mintTx = await mintTo(
          connection,
          signerkp,
          mintA,
          makerAtaA,
          signerkp,
          token_decimals
      )
        vault = await getOrCreateAssociatedTokenAccount(
          connection,
          signerkp,
          mintA, 
        escrow
      );

 });

  it("Is initialized!", async () => {
    // Add your test here.
   

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
