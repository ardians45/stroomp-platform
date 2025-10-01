'use client';

import { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { UserIcon } from './icons';

// Define types for our user data
type WalletUserData = {
  walletAddress: string;
  balance: number;
  username?: string;
};

export default function WalletConnection() {
  const { connected, publicKey, connect, disconnect } = useWallet();
  const [userData, setUserData] = useState<WalletUserData | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  // Fetch wallet balance
  const fetchBalance = async (pubKey: PublicKey) => {
    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
      const balance = await connection.getBalance(pubKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (err) {
      console.error('Error fetching balance:', err);
      return 0;
    }
  };

  // Update user data when wallet connects/disconnects
  useEffect(() => {
    const updateUserData = async () => {
      if (connected && publicKey) {
        setIsLoading(true);
        try {
          const balance = await fetchBalance(publicKey);
          const walletData: WalletUserData = {
            walletAddress: publicKey.toString(),
            balance: balance,
            username: `User_${publicKey.toString().substring(0, 8)}`
          };
          setUserData(walletData);
          setBalance(balance);
        } catch (err) {
          console.error('Error updating user data:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUserData(null);
        setBalance(0);
      }
    };

    updateUserData();
  }, [connected, publicKey]);

  // Render connection button or user info
  return (
    <div className="wallet-connection">
      {connected && userData ? (
        <div className="connected-wallet">
          <div className="wallet-info">
            <div className="wallet-avatar">
              <UserIcon />
            </div>
            <div className="wallet-details">
              <div className="wallet-username">{userData.username}</div>
              <div className="wallet-address">{formatWalletAddress(userData.walletAddress)}</div>
              <div className="wallet-balance">
                <span className="balance-label">Balance:</span>
                <span className="balance-amount">{balance.toFixed(4)} SOL</span>
              </div>
            </div>
          </div>
          <button 
            className="disconnect-btn" 
            onClick={disconnect}
            disabled={isLoading}
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      ) : (
        <div className="disconnected-wallet">
          <WalletMultiButton className="connect-wallet-btn" />
        </div>
      )}

      <style jsx>{`
        .wallet-connection {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .connected-wallet {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }

        .wallet-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .wallet-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--border-radius-full);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .wallet-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .wallet-username {
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
        }

        .wallet-address {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
        }

        .wallet-balance {
          display: flex;
          gap: var(--spacing-xs);
        }

        .balance-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
        }

        .balance-amount {
          font-size: var(--font-size-xs);
          color: var(--color-brand-primary);
          font-weight: var(--font-weight-medium);
        }

        .disconnect-btn {
          background: transparent;
          border: 1px solid var(--color-error);
          color: var(--color-error);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-full);
          cursor: pointer;
          font-weight: var(--font-weight-medium);
          font-size: var(--font-size-sm);
          transition: var(--transition-fast);
        }

        .disconnect-btn:hover {
          background: rgba(255, 23, 68, 0.1);
        }

        .disconnect-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .disconnected-wallet {
          display: flex;
          align-items: center;
        }

        .connect-wallet-btn {
          background: var(--color-brand-primary) !important;
          color: #000 !important;
          border: none !important;
          padding: var(--spacing-sm) var(--spacing-md) !important;
          border-radius: var(--border-radius-full) !important;
          font-weight: var(--font-weight-bold) !important;
          cursor: pointer;
          transition: var(--transition-fast) !important;
        }

        .connect-wallet-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: var(--shadow-md) !important;
        }

        @media (max-width: 768px) {
          .wallet-connection {
            display: none; /* Hide wallet info on mobile, show in user dropdown */
          }
        }
      `}</style>
    </div>
  );
}