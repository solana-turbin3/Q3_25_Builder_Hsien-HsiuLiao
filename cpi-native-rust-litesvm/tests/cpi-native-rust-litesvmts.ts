import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CpiNativeRustLitesvmts } from "../target/types/cpi_native_rust_litesvmts";

describe("cpi-native-rust-litesvmts", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.cpiNativeRustLitesvmts as Program<CpiNativeRustLitesvmts>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
