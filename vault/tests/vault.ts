import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";

describe("vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  // const connection = provider.connection;
   const commitment: Commitment = "confirmed";
 
   const connection = new Connection("https://turbine-solanad-4cde.devnet.rpcpool.com/168dd64f-ce5e-4e19-a836-f6482ad6b396", commitment); 
 

  const program = anchor.workspace.vault as Program<Vault>;

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

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
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
