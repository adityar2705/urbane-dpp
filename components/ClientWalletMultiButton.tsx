'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function ClientWalletMultiButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="wallet-adapter-button">Loading...</button>; // Placeholder to match server render
  }

  return <WalletMultiButton />;
}