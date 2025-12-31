import { 
  mintToCollectionV1,
} from '@metaplex-foundation/mpl-bubblegum';
import { 
  publicKey as umiPublicKey
} from '@metaplex-foundation/umi';

//function to mint the product passport
export async function mintProductPassport(
    umi: any,
    merkleTree: string, 
    collectionAddress: string, //required to identify the collection
    productData: {
        name: string;
        description: string;
        image: string;
        attributes: Array<{ trait_type: string; value: string }>;
    }
) {
    //simplified metadata
    const metadata = {
        name: productData.name.substring(0, 32), // Limit name to 32 characters for cNFT
        description: productData.description,
        image: productData.image,
        attributes: productData.attributes,
    };

    // Use a short placeholder URI instead of data URI to avoid length limits
    const uri = "https://example.com/metadata.json"; // TODO: Upload metadata to IPFS/Arweave

    const result = await mintToCollectionV1(umi, {
        leafOwner: umi.identity.publicKey, // <--- FIXED: Mints to the current user (you)
        merkleTree: umiPublicKey(merkleTree),
        collectionMint: umiPublicKey(collectionAddress), // <--- ADDED: The Collection NFT address
        metadata: {
            name: metadata.name,
            uri,
            sellerFeeBasisPoints: 0, // <--- FIXED: Must be a number (0 = 0%)
            collection: { key: umiPublicKey(collectionAddress), verified: false }, // <--- FIXED: Must match collectionMint
            creators: [],
        }
    }).sendAndConfirm(umi);

    return result.signature;
}