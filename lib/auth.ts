import { createClient } from './supabase-server';

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getBrand(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}