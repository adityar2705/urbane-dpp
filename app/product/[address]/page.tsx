'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const params = useParams();
  const address = params.address as string;
  
  const [loading, setLoading] = useState(true);
  
  //we shall show mock data right now
  const mockData = {
    name: 'Organic Cotton T-Shirt',
    brand: 'Demo Brand',
    materials: [
      { name: 'Organic Cotton', percentage: 100 }
    ],
    origin: 'Made in India',
    carbon: '2.5 kg CO2',
    water: '2,700 liters',
    care: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach'
    ],
    recyclable: true,
  };
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">{mockData.name}</h1>
          <p className="text-gray-600">{mockData.brand}</p>
        </div>
        
        {/* Materials */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Materials</h2>
          <div className="space-y-2">
            {mockData.materials.map((material, i) => (
              <div key={i} className="flex justify-between">
                <span>{material.name}</span>
                <span className="font-semibold">{material.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Origin */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Origin</h2>
          <p>{mockData.origin}</p>
        </div>
        
        {/* Environmental Impact */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Carbon Footprint</p>
            <p className="text-xl font-bold">{mockData.carbon}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Water Usage</p>
            <p className="text-xl font-bold">{mockData.water}</p>
          </div>
        </div>
        
        {/* Care Instructions */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Care Instructions</h2>
          <ul className="list-disc list-inside space-y-1">
            {mockData.care.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ul>
        </div>
        
        {/* Recyclability */}
        <div className={`p-4 rounded ${mockData.recyclable ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="font-semibold">
            {mockData.recyclable ? '♻️ Recyclable' : '⚠️ Not Recyclable'}
          </p>
        </div>
        
        {/* Verification */}
        <div className="border-t pt-4 text-sm text-gray-500">
          <p>NFT Address: {address.slice(0, 10)}...{address.slice(-10)}</p>
          <p className="mt-1">Verified on Solana Blockchain</p>
        </div>
      </div>
    </div>
  );
}