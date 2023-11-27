import {wallet,nft} from "../env.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet.secretKey));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = nft.image
        const metadata = {
            name: "tidvn rug",
            symbol: "TDRUG",
            description: "NFT Mint By Tidvn",
            image: image,
            attributes: [
                {trait_type: 'colour', value: 'blue'}
           ],
            properties: {
              files: [
                   {
                        type: "image/png",
                       uri: image
                   },
               ]
           },
           creators: []
       };
       const myUri = await bundlrUploader.uploadJson(metadata)
       console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();