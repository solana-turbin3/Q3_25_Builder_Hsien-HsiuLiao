import wallet from "../../../Turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("6jocG9wDorGF2Y18T7UrhFvJmYN9e36tfkd83VsuXW4V")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
     //   Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint, 
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
})();
