// __tests__/walletConnection.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import WalletConnection from '../components/wallet-connection';

// Mock the Solana wallet adapter hooks
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    connected: false,
    publicKey: null,
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

// Mock Solana web3
jest.mock('@solana/web3.js', () => ({
  Connection: jest.fn(),
  PublicKey: jest.fn(),
  LAMPORTS_PER_SOL: 1000000000,
}));

// Mock the wallet adapter UI
jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Connect Wallet</button>,
}));

describe('WalletConnection', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );

  it('renders the connect wallet button when not connected', () => {
    render(<WalletConnection />, { wrapper });
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows wallet info when connected', async () => {
    // Re-mock with connected state
    jest.mocked(require('@solana/wallet-adapter-react').useWallet).mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'testPublicKey123456789' },
      connect: jest.fn(),
      disconnect: jest.fn(),
    } as any);

    render(<WalletConnection />, { wrapper });
    
    // Wait for the component to update after the mock change
    await waitFor(() => {
      expect(screen.getByText('User_testP')).toBeInTheDocument();
    });
  });

  it('calls disconnect function when disconnect button is clicked', async () => {
    const mockDisconnect = jest.fn();
    
    // Re-mock with connected state and mock disconnect function
    jest.mocked(require('@solana/wallet-adapter-react').useWallet).mockReturnValue({
      connected: true,
      publicKey: { toString: () => 'testPublicKey123456789' },
      connect: jest.fn(),
      disconnect: mockDisconnect,
    } as any);

    render(<WalletConnection />, { wrapper });
    
    // Wait for component to update
    await waitFor(() => {
      const disconnectBtn = screen.getByText('Disconnect');
      fireEvent.click(disconnectBtn);
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});