'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the wallet connection component with no SSR
const WalletConnectionNoSSR = dynamic(
  () => import('./wallet-connection'),
  { 
    ssr: false,
    loading: () => (
      <button className="connect-wallet-btn-loading">
        Loading...
      </button>
    )
  }
);

export default function WalletConnectionWrapper() {
  const [mounted, setMounted] = useState(false);

  // Ensure this only renders on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="wallet-connection-placeholder">
        <button className="connect-wallet-btn-placeholder">
          Loading...
        </button>
      </div>
    );
  }

  return <WalletConnectionNoSSR />;
}