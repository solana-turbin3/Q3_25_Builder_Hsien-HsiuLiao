import wallet from "../../../Turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
//const umi = createUmi('https://api.devnet.solana.com');
const umi = createUmi('https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e');

// load keypair from wallet
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

// Instantiate the Irys uploader
umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://gateway.irys.xyz/47aj9Yj6EVf2cjUYfNUrsVgnTWZ9ehf15d2kf1mJ8w1d"
        const metadata = {
            name: "Andre Hat",
            symbol: "AND",
            description: "The man of many hats",
            image,
            attributes: [
                {trait_type: 'condition', value: 'new'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://gateway.irys.xyz/47aj9Yj6EVf2cjUYfNUrsVgnTWZ9ehf15d2kf1mJ8w1d"
                    },
                ]
            },
            creators: []
        };

        // Upload the metadata to the Irys database and print out the URI
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri); 

    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
