import wallet from "../../../Turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
//const umi = createUmi('https://api.devnet.solana.com');
const umi = createUmi('https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e');

const imagePath = "andre.png";



let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({address: "https://devnet.irys.xyz/"}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        //2. Convert image to generic file.
        //3. Upload image

        const image = await readFile("./" + imagePath); // put the file in the ts directory
        const file = createGenericFile(image, imagePath, {
          contentType: "image/jpg",
        });
        const [myUri] = await umi.uploader.upload([file]);
        console.log("Your image URI: ", myUri);
//Your image URI:  https://gateway.irys.xyz/47aj9Yj6EVf2cjUYfNUrsVgnTWZ9ehf15d2kf1mJ8w1d
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
