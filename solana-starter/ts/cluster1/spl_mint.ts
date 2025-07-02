import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../../../Turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("6jocG9wDorGF2Y18T7UrhFvJmYN9e36tfkd83VsuXW4V");
//const destination = new PublicKey("DcwsdNovKybMa7VMALj3VD8syjahNrrMzDWthmFoCULa");

(async () => {
    try {
      //  Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint, 
            keypair.publicKey
        )
        console.log(`Your ata is: ${ata.address.toBase58()}`);
//Your ata is: 2deGUsxQzc1sfFjZTW9MrUCT695Ju2XLcfwGEBsRRjZU
     //   Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair,
            token_decimals*100n
        )
        console.log(`Your mint txid: ${mintTx}`);
        //Your mint txid: 23vD9vKdmDMdWo6nVUDt1Mkd455fCTSGYmmM4konfRiVfeZCQrR6322sLivb8nMFZJeKyEBLuUTBFu4iP3SjfWAv
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
