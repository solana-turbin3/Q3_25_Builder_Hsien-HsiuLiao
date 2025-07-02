import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../../../Turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed"; // type Commitment = "processed" | "confirmed" | "finalized"
/* Johnny Monteiro
1:13 PM
you have 3 types of commitment
processed, confirmed and finalized
processed , seen by a node but not confirmed
confirmed, majority by validators
finalized, fully finalized and irreverisible */
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log("Mint address: ", mint); //or ${mint.tobase58()}
        /*    yarn spl_init
                yarn run v1.22.22
                $ ts - node./ cluster1 / spl_init.ts
                Mint address: PublicKey[PublicKey(6jocG9wDorGF2Y18T7UrhFvJmYN9e36tfkd83VsuXW4V)] {
                _bn: <BN: 55418744cac2ab1c5ec66e3d4c5ed6c35ffd27029d4ffaf60c2bc80c465f4e0e >
  }
                Done in 3.71s. */
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
