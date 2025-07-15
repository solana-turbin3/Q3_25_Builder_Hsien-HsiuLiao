import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Amm } from "../target/types/amm";
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';

describe("amm", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const program = anchor.workspace.amm as Program<Amm>;
  let initializer: anchor.web3.Keypair;
  let mintX: anchor.web3.Keypair;
  let mintY: anchor.web3.Keypair;
  let mintLp: anchor.web3.Keypair;
  let vaultX: anchor.web3.Keypair;
  let vaultY: anchor.web3.Keypair;
  let config: anchor.web3.Keypair;

  before(async () => {
    
});

it('Initializes the config account', async () => {
  const seed = 12345;
  const fee = 100;
  const authority = initializer.publicKey;

  // Create mints
  const mintXAccount = await Token.createMint(
      provider.connection,
      initializer,
      authority,
      null,
      6,
      TOKEN_PROGRAM_ID
  );

  const mintYAccount = await Token.createMint(
      provider.connection,
      initializer,
      authority,
      null,
      6,
      TOKEN_PROGRAM_ID
  );

  // Create associated token accounts
  const vaultXAccount = await mintXAccount.createAccount(config.publicKey);
  const vaultYAccount = await mintYAccount.createAccount(config.publicKey);

  // Initialize the config account
  const tx = await program.methods
      .initialize(seed, fee, authority)
      .accounts({
          initializer: initializer.publicKey,
          mintX: mintXAccount.publicKey,
          mintY: mintYAccount.publicKey,
          mintLp: mintLp.publicKey,
          vaultX: vaultXAccount,
          vaultY: vaultYAccount,
          config: config.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
      })
      .signers([initializer, mintLp, config])
      .rpc();

  console.log("Transaction signature", tx);

  // Fetch the config account and assert its values
  const configAccount = await program.account.config.fetch(config.publicKey);

  assert.equal(configAccount.seed.toNumber(), seed);
  assert.equal(configAccount.fee, fee);
  assert.equal(configAccount.authority.toString(), authority.toString());
  assert.equal(configAccount.mintX.toString(), mintXAccount.publicKey.toString());
  assert.equal(configAccount.mintY.toString(), mintYAccount.publicKey.toString());
  assert.isFalse(configAccount.locked);
});
});
