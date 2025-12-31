'use client';

import { useState } from 'react';
import { createMerkleTree, createCollection, createUmiInstance } from '@/lib/metaplex';
import { mintProductPassport } from '@/lib/mint-cnft';
import { generateQRCode } from '@/lib/qr-code';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/ClientWalletMultiButton';

export default function MintPage() {
  const wallet = useWallet();
  const [merkleTree, setMerkleTree] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [nftAddress, setNftAddress] = useState('');

  // Step 1: Create the Collection NFT
  const handleCreateCollection = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }
    setLoading(true);
    try {
      const umi = createUmiInstance(wallet);
      const collection = await createCollection(umi);
      setCollectionAddress(collection.toString());
      alert('Collection NFT created!');
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection');
    }
    setLoading(false);
  };

  // Step 2: Create the Merkle Tree
  const handleCreateTree = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }
    setLoading(true);
    try {
      const umi = createUmiInstance(wallet);
      const tree = await createMerkleTree(umi);
      setMerkleTree(tree.toString());
      alert('Merkle Tree created! (This can take 30-60 seconds)');
    } catch (error) {
      console.error('Error creating tree:', error);
      alert('Failed to create tree');
    }
    setLoading(false);
  };

  // Step 3: Mint the Compressed NFT
  const handleMint = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }
    if (!merkleTree || !productName || !collectionAddress) return;
    setLoading(true);
    try {
      const umi = createUmiInstance(wallet);
      const nft = await mintProductPassport(umi, merkleTree, collectionAddress, {
        name: productName,
        description: 'Urbane Product Passport',
        image: 'https://placeholder.com/300',
        attributes: [
          { trait_type: 'Material', value: '100% Cotton' },
          { trait_type: 'Origin', value: 'India' },
        ],
      });
      
      const nftAddr = nft.toString();
      setNftAddress(nftAddr);
      setSignature('Check wallet or explorer for recent transaction');
      
      // Generate QR Code
      const qr = await generateQRCode(nftAddr);
      setQrCode(qr);
      
      alert('Product Passport Minted Successfully!');
    } catch (error) {
      console.error('Error minting:', error);
      alert('Minting failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Urbane Mint Dashboard</h1>
          <ClientWalletMultiButton />
        </div>
        
        <div className="space-y-6">
          
          {/* Step 1: Collection */}
          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">Step 1: Create Collection</h2>
            <button
              onClick={handleCreateCollection}
              disabled={loading || !!collectionAddress || !wallet.publicKey}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 w-full"
            >
              {collectionAddress ? 'Collection Created' : 'Create Collection NFT'}
            </button>
            {collectionAddress && (
              <p className="mt-2 text-xs text-gray-500 font-mono">Collection: {collectionAddress}</p>
            )}
          </div>

          {/* Step 2: Tree */}
          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">Step 2: Create Storage (Tree)</h2>
            <button
              onClick={handleCreateTree}
              disabled={loading || !!merkleTree || !wallet.publicKey}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 w-full"
            >
              {merkleTree ? 'Tree Created' : 'Create Merkle Tree'}
            </button>
            {merkleTree && (
              <p className="mt-2 text-xs text-gray-500 font-mono">Tree: {merkleTree}</p>
            )}
          </div>
          
          {/* Step 3: Mint */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Step 3: Mint Passport</h2>
            <input
              type="text"
              placeholder="Product Name (e.g. Urbane Shirt #001)"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-3 border rounded mb-4"
              disabled={!merkleTree || !collectionAddress || !wallet.publicKey}
            />
            
            <button
              onClick={handleMint}
              disabled={loading || !merkleTree || !productName || !collectionAddress || !wallet.publicKey}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 w-full font-bold"
            >
              Mint Product Passport
            </button>
          </div>
          
          {signature && (
            <div className="p-4 bg-green-50 text-green-800 rounded border border-green-200 mt-4">
              <p className="font-bold">Success!</p>
              <p className="text-sm mt-1">{signature}</p>
              {nftAddress && (
                <p className="text-xs mt-2 font-mono break-all">NFT Address: {nftAddress}</p>
              )}
              
              {qrCode && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">QR Code:</p>
                  <img src={qrCode} alt="QR Code" className="border rounded" />
                  <p className="text-sm mt-2 text-gray-600">
                    Scan this to view product passport
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}