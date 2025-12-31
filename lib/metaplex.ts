import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  createTree,
  mplBubblegum 
} from '@metaplex-foundation/mpl-bubblegum';
import { 
  generateSigner,
  percentAmount,
  publicKey as umiPublicKey
} from '@metaplex-foundation/umi';
import { 
  createNft, 
  fetchDigitalAsset, 
  mplTokenMetadata 
} from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

//create Umi instance with wallet adapter
export function createUmiInstance(walletAdapter: any) {
  return createUmi('https://api.devnet.solana.com')
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(walletAdapterIdentity(walletAdapter));
}

//create a new Merkle Tree for compressed NFTs
export async function createMerkleTree(umi: any){
    const merkleTree = generateSigner(umi);

    const builder = await createTree(umi, {
        merkleTree,
        maxDepth: 14, //can hold 16,384 NFTs
        maxBufferSize: 64,
    });
  
    await builder.sendAndConfirm(umi);
  
    return merkleTree.publicKey;
}

//helper function to create collection
export async function createCollection(umi: any) {
  const collectionMint = generateSigner(umi);

  await createNft(umi, {
    mint: collectionMint,
    name: "Urbane Collection",
    uri: "https://example.com/collection.json", // Replace with real JSON later
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
  }).sendAndConfirm(umi);

  return collectionMint.publicKey;
}

