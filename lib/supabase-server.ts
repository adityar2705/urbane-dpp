import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('Supabase URL:', supabaseUrl ? 'set' : 'not set');
console.log('Supabase Service Role Key:', supabaseServiceRoleKey ? 'set' : 'not set');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

// For backward compatibility, export a supabase instance, but note it's deprecated
// export const supabase = await createClient();

//database types -> to be expanded later
export type Brand = {
  id: string;
  email: string;
  company_name: string;
  wallet_address?: string;
  created_at: string;
};

export type Product = {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  material: string;
  origin: string;
  nft_address?: string;
  created_at: string;
};