import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Client-side Supabase URL:', supabaseUrl);
console.log('Client-side Supabase Anon Key starts with:', supabaseAnonKey.substring(0, 10) + '...');

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

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
  description: string;
  material: string;
  origin: string;
  carbon_footprint?: string;
  water_usage?: string;
  supplier_name?: string;
  factory_location?: string;
  cost?: string;
  nft_address?: string;
  qr_code?: string;
  created_at: string;
};