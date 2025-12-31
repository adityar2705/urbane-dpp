'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getBalance, airdrop } from '@/lib/solana';

export default function TestPage() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const pubkey = new PublicKey(address);
      const bal = await getBalance(pubkey);
      setBalance(bal);
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid address');
    }
    setLoading(false);
  };

  const requestAirdrop = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const pubkey = new PublicKey(address);
      await airdrop(pubkey, 1);
      await checkBalance();
      alert('Airdrop successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('Airdrop failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Solana Connection Test</h1>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Solana address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border rounded"
          />
          
          <div className="flex gap-4">
            <button
              onClick={checkBalance}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Check Balance
            </button>
            
            <button
              onClick={requestAirdrop}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Request Airdrop (1 SOL)
            </button>
          </div>
          
          {balance !== null && (
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-lg">Balance: <strong>{balance} SOL</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}