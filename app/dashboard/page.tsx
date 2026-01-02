import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getUser, getBrand } from '@/lib/auth';
import { Product } from '@/lib/supabase-server';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const brand = await getBrand(user.id);

  const supabase = await createClient();

  //fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Welcome, {brand.company_name}</h2>
          <p className="text-gray-600 mt-1">Manage your digital product passports</p>
        </div>
        <Link
          href="/dashboard/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Create Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Your Products</h3>
        </div>

        {products && products.length > 0 ? (
          <div className="divide-y">
            {(products as Product[]).map((product: Product) => (
              <div key={product.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.material} • {product.origin}</p>
                  {product.nft_address && (
                    <p className="text-xs text-green-600 mt-1">✓ Minted</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {product.nft_address ? (
                    <Link
                      href={`/product/${product.nft_address}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Passport
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/mint/${product.id}`}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Mint NFT
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>No products yet. Create your first product passport!</p>
          </div>
        )}
      </div>
    </div>
  );
}