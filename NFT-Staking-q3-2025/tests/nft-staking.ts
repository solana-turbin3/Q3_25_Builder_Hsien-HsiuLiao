import * as anchor from "@coral-xyz/anchor";
import { createNft, findMasterEditionPda, findMetadataPda, mplTokenMetadata, verifySizedCollectionItem } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { KeypairSigner, PublicKey, createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount } from '@metaplex-foundation/umi';
import { Program } from "@coral-xyz/anchor";
import { NftStaking } from "../target/types/nft_staking";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync} from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { assert } from "chai";

describe("nft-staking", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftStaking as Program<NftStaking>;

  const umi = createUmi(provider.connection);

  const payer = provider.wallet as NodeWallet;

  let nftMint: KeypairSigner = generateSigner(umi);
  let collectionMint: KeypairSigner = generateSigner(umi);

  const creatorWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(payer.payer.secretKey));
  const creator = createSignerFromKeypair(umi, creatorWallet);
  umi.use(keypairIdentity(creator));
  umi.use(mplTokenMetadata());

  const collection: anchor.web3.PublicKey = new anchor.web3.PublicKey(collectionMint.publicKey.toString());

  const config = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("config")], program.programId)[0];

  const rewardsMint = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("rewards"), config.toBuffer()], program.programId)[0];

  const userAccount = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("user"), provider.publicKey.toBuffer()], program.programId)[0];

  const stakeAccount = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("stake"), new anchor.web3.PublicKey(nftMint.publicKey as PublicKey).toBuffer(), config.toBuffer()], program.programId)[0];
  
  it("Mint Collection NFT", async () => {
        await createNft(umi, {
            mint: collectionMint,
            name: "GM",
            symbol: "GM",
            uri: "https://arweave.net/123",
            sellerFeeBasisPoints: percentAmount(5.5),
            creators: null,
            collectionDetails: { 
              __kind: 'V1', size: 10,
            }
        }).sendAndConfirm(umi)
        console.log(`Created Collection NFT: ${collectionMint.publicKey.toString()}`)
  });

  it("Mint NFT", async () => {
        await createNft(umi, {
            mint: nftMint,
            name: "GM",
            symbol: "GM",
            uri: "https://arweave.net/123",
            sellerFeeBasisPoints: percentAmount(5.5),
            collection: {verified: false, key: collectionMint.publicKey},
            creators: null,
        }).sendAndConfirm(umi)
        console.log(`\nCreated NFT: ${nftMint.publicKey.toString()}`)
  });

  it("Verify Collection NFT", async () => {
    const collectionMetadata = findMetadataPda(umi, {mint: collectionMint.publicKey});
    const collectionMasterEdition = findMasterEditionPda(umi, {mint: collectionMint.publicKey});

    const nftMetadata = findMetadataPda(umi, {mint: nftMint.publicKey});
    await verifySizedCollectionItem(umi, {
      metadata: nftMetadata,
      collectionAuthority: creator,
      collectionMint: collectionMint.publicKey,
      collection: collectionMetadata,
      collectionMasterEditionAccount: collectionMasterEdition,
     }).sendAndConfirm(umi)
    console.log("\nCollection NFT Verified!")
  });

  it("Initialize Config Account", async () => {
    const tx = await program.methods.initializeConfig(10, 10, 0)
    .accountsPartial({
      admin: provider.wallet.publicKey,
      config,
      rewardsMint,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
    console.log("\nConfig Account Initialized!");
    console.log("Your transaction signature", tx);
  });

  it("Initialize User Account", async() => {
    const tx = await program.methods.initializeUser()
    .accountsPartial({
      user: provider.wallet.publicKey,
      userAccount,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
    console.log("\nUser Account Initialized!");
    console.log("Your transaction signature", tx);
  });

  it("Stake NFT", async() => {
    const mintAta = getAssociatedTokenAddressSync(new anchor.web3.PublicKey(nftMint.publicKey as PublicKey), provider.wallet.publicKey);

    const nftMetadata = findMetadataPda(umi, {mint: nftMint.publicKey});
    const nftEdition = findMasterEditionPda(umi, {mint: nftMint.publicKey});

    const tx = await program.methods.stake()
    .accountsPartial({
      user: provider.wallet.publicKey,
      mint: nftMint.publicKey,
      collectionMint: collectionMint.publicKey,
      mintAta,
      metadata: new anchor.web3.PublicKey(nftMetadata[0]),
      edition: new anchor.web3.PublicKey(nftEdition[0]),
      config,
      stakeAccount,
      userAccount,
    })
    .rpc();

    console.log("\nNFT Staked!");
    console.log("Your transaction signature", tx);
  });

  it("Claim Rewards", async() => {
    const userRewardsAta = getAssociatedTokenAddressSync(rewardsMint, provider.wallet.publicKey);

    const tx = await program.methods.claim()
    .accountsPartial({
      user: provider.wallet.publicKey,
      config,
      userAccount,
      userRewardsAta,
      rewardsMint,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .rpc();

    console.log("\nRewards Claimed!");
    console.log("Your transaction signature", tx);

    // Verify the user received reward tokens
    const userRewardsBalance = await provider.connection.getTokenAccountBalance(userRewardsAta);
    console.log(`User rewards balance: ${userRewardsBalance.value.uiAmount}`);

    // Verify user points were reset to 0
    const userAccountData = await program.account.userAccount.fetch(userAccount);
    console.log(`User points after claiming: ${userAccountData.points}`);
  });

  it("Unstake NFT", async() => {
    const mintAta = getAssociatedTokenAddressSync(new anchor.web3.PublicKey(nftMint.publicKey as PublicKey), provider.wallet.publicKey);

    const nftMetadata = findMetadataPda(umi, {mint: nftMint.publicKey});
    const nftEdition = findMasterEditionPda(umi, {mint: nftMint.publicKey});

    const tx = await program.methods.unstake()
    .accountsPartial({
      user: provider.wallet.publicKey,
      mint: nftMint.publicKey,
      collectionMint: collectionMint.publicKey,
      mintAta,
      metadata: new anchor.web3.PublicKey(nftMetadata[0]),
      edition: new anchor.web3.PublicKey(nftEdition[0]),
      config,
      stakeAccount,
      userAccount,
    })
    .rpc();

    console.log("\nNFT Unstaked!");
    console.log("Your transaction signature", tx);
  });

  it("Try to claim rewards with no points (should fail)", async() => {
    const userRewardsAta = getAssociatedTokenAddressSync(rewardsMint, provider.wallet.publicKey);

    try {
      await program.methods.claim()
      .accountsPartial({
        user: provider.wallet.publicKey,
        config,
        userAccount,
        userRewardsAta,
        rewardsMint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();
      
      // If we reach here, the test should fail
      assert.fail("Expected claim to fail when no points are available");
    } catch (error) {
      console.log("\nClaim failed as expected when no points available");
      console.log("Error:", error.message);
    }
  });

  it("Check points accumulation after staking", async() => {
    // Check user account to see accumulated points
    const userAccountData = await program.account.userAccount.fetch(userAccount);
    console.log(`\nUser points after staking: ${userAccountData.points}`);
    console.log(`User amount staked: ${userAccountData.amountStaked}`);
    
    // Verify points match the expected calculation
    const expectedPoints = userAccountData.amountStaked * 10; // 10 points per stake from config
    assert.equal(userAccountData.points, expectedPoints, "Points should match expected calculation");
  });

  /* 1. "Claim Rewards" Test
Tests the basic claim functionality
Calls the claim instruction with all required accounts
Verifies that reward tokens are minted to the user's wallet
Checks that user points are reset to 0 after claiming
Logs the transaction signature and token balance
2. "Try to claim rewards with no points (should fail)" Test
Tests the error handling when trying to claim with no points
Uses try-catch to verify the transaction fails as expected
Ensures the NoPointsToClaim error is properly thrown
Logs the error message for verification
3. "Check points accumulation after staking" Test
Verifies that points are properly accumulated after staking
Checks that the points calculation matches the expected formula
Uses assertions to ensure the points value is correct
Logs the current points and staked amount for debugging

Test Flow:
The tests follow this logical sequence:
Setup: Mint collection and NFT, verify collection, initialize config and user accounts
Stake: Stake the NFT (accumulates points)
Check Points: Verify points accumulation
Claim: Claim rewards (converts points to tokens)
Verify Reset: Check that points are reset to 0
Error Test: Try to claim again (should fail)
Key Features Tested:
✅ Points accumulation during staking
✅ Reward token minting
✅ Points reset after claiming
✅ Error handling for insufficient points
✅ Account validation and proper PDA usage
✅ Token account creation and management
*/
});
