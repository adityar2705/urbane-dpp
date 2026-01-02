'use client';

import { supabase } from '@/lib/supabase';

export default function SignOutButton() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      Sign Out
    </button>
  );
}