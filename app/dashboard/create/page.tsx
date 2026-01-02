'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Public data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [origin, setOrigin] = useState('');
  const [carbonFootprint, setCarbonFootprint] = useState('');
  const [waterUsage, setWaterUsage] = useState('');

  // Private data (will be encrypted later)
  const [supplierName, setSupplierName] = useState('');
  const [factoryLocation, setFactoryLocation] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert({
          brand_id: user.id,
          name,
          description,
          material,
          origin,
          carbon_footprint: carbonFootprint,
          water_usage: waterUsage,
          supplier_name: supplierName,
          factory_location: factoryLocation,
          cost,
        })
        .select()
        .single();

      if (error) throw error;

      alert('Product saved! Next step: mint NFT');
      router.push('/dashboard');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Create Product Passport</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Public Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-green-700">
            📢 Public Information (Visible to consumers)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Organic Cotton T-Shirt"
                className="w-full p-3 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the product"
                className="w-full p-3 border rounded"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Material Composition *</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  required
                  placeholder="e.g., 100% Organic Cotton"
                  className="w-full p-3 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country of Origin *</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                  placeholder="e.g., India"
                  className="w-full p-3 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Carbon Footprint</label>
                <input
                  type="text"
                  value={carbonFootprint}
                  onChange={(e) => setCarbonFootprint(e.target.value)}
                  placeholder="e.g., 2.5 kg CO2"
                  className="w-full p-3 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Water Usage</label>
                <input
                  type="text"
                  value={waterUsage}
                  onChange={(e) => setWaterUsage(e.target.value)}
                  placeholder="e.g., 2,700 liters"
                  className="w-full p-3 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Private Information */}
        <div className="bg-white p-6 rounded-lg shadow border-2 border-amber-200">
          <h3 className="text-lg font-semibold mb-4 text-amber-700">
            🔒 Private Information (Only visible to you and authorized parties)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Supplier Name</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g., ABC Textiles Pvt Ltd"
                className="w-full p-3 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Factory Location</label>
              <input
                type="text"
                value={factoryLocation}
                onChange={(e) => setFactoryLocation(e.target.value)}
                placeholder="e.g., Tirupur, Tamil Nadu"
                className="w-full p-3 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Unit Cost</label>
              <input
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="e.g., $5.20"
                className="w-full p-3 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}