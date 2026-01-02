'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createMerkleTree, createCollection, createUmiInstance } from '@/lib/metaplex';
import { mintProductPassport } from '@/lib/mint-cnft';
import { generateQRCode } from '@/lib/qr-code';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/ClientWalletMultiButton';

export default function MintProductPage() {
  const params = useParams();
  const router = useRouter();
  const wallet = useWallet();
  const productId = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);

  const [merkleTree, setMerkleTree] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      alert('Product not found');
      router.push('/dashboard');
      return;
    }

    setProduct(data);
    setLoading(false);
  };

  const handleCreateCollection = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }
    setMinting(true);
    try {
      const umi = createUmiInstance(wallet);
      const collection = await createCollection(umi);
      setCollectionAddress(collection.toString());
      alert('Collection created!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create collection');
    }
    setMinting(false);
  };

  const handleCreateTree = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }
    setMinting(true);
    try {
      const umi = createUmiInstance(wallet);
      const tree = await createMerkleTree(umi);
      setMerkleTree(tree.toString());
      alert('Merkle Tree created!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create tree');
    }
    setMinting(false);
  };

  const handleMint = async () => {
    if (!wallet.publicKey || !merkleTree || !collectionAddress || !product) return;

    setMinting(true);
    try {
      const umi = createUmiInstance(wallet);

      // Mint NFT with product data
      const nft = await mintProductPassport(umi, merkleTree, collectionAddress, {
        name: product.name,
        description: product.description || 'Urbane Digital Product Passport',
        image: 'https://placeholder.com/300',
        attributes: [
          { trait_type: 'Material', value: product.material },
          { trait_type: 'Origin', value: product.origin },
          { trait_type: 'Carbon Footprint', value: product.carbon_footprint || 'N/A' },
          { trait_type: 'Water Usage', value: product.water_usage || 'N/A' },
        ],
      });

      const nftAddr = nft.toString();
      setNftAddress(nftAddr);

      // Generate QR code
      const qr = await generateQRCode(nftAddr);
      setQrCode(qr);

      // Update product in database
      await supabase
        .from('products')
        .update({
          nft_address: nftAddr,
          qr_code: qr,
        })
        .eq('id', productId);

      alert('Product passport minted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Minting failed');
    }
    setMinting(false);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mint Product Passport</h2>
          <ClientWalletMultiButton />
        </div>

        {/* Product Info */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.material} • {product.origin}</p>
        </div>

        {/* Minting Steps */}
        <div className="space-y-4">
          <div>
            <button
              onClick={handleCreateCollection}
              disabled={minting || !!collectionAddress || !wallet.publicKey}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {collectionAddress ? '✓ Collection Created' : '1. Create Collection'}
            </button>
            {collectionAddress && (
              <p className="text-xs text-gray-500 mt-1 font-mono truncate">{collectionAddress}</p>
            )}
          </div>

          <div>
            <button
              onClick={handleCreateTree}
              disabled={minting || !!merkleTree || !wallet.publicKey}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {merkleTree ? '✓ Tree Created' : '2. Create Merkle Tree'}
            </button>
            {merkleTree && (
              <p className="text-xs text-gray-500 mt-1 font-mono truncate">{merkleTree}</p>
            )}
          </div>

          <div>
            <button
              onClick={handleMint}
              disabled={minting || !merkleTree || !collectionAddress || !wallet.publicKey}
              className="w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-bold"
            >
              3. Mint NFT Passport
            </button>
          </div>
        </div>

        {/* Success */}
        {nftAddress && qrCode && (
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <p className="font-bold text-green-800 mb-4">✓ Success! Product Passport Minted</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">NFT Address:</p>
                <p className="text-xs font-mono break-all text-gray-700">{nftAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">QR Code:</p>
                <img src={qrCode} alt="QR Code" className="w-48 border rounded" />
                <p className="text-xs text-gray-600 mt-2">Print this on your product tag</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}