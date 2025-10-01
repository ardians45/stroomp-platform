// __tests__/donationModal.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublicKey } from '@solana/web3.js';
import DonationModal from '../components/donation-modal';

// Mock the Solana wallet adapter hooks
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    connected: true,
    publicKey: new PublicKey('testPublicKey123456789'),
    sendTransaction: jest.fn(),
  }),
}));

// Mock the wallet adapter UI
jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Connect Wallet</button>,
}));

// Mock Solana web3
jest.mock('@solana/web3.js', () => ({
  Connection: jest.fn().mockImplementation(() => ({
    getLatestBlockhash: jest.fn().mockResolvedValue({
      blockhash: 'testBlockhash',
    }),
    confirmTransaction: jest.fn().mockResolvedValue({
      value: { err: null },
    }),
  })),
  PublicKey: jest.fn().mockImplementation((value) => ({
    toString: () => value,
  })),
  SystemProgram: {
    transfer: jest.fn(),
  }),
  Transaction: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockReturnThis(),
    recentBlockhash: null,
    feePayer: null,
  })),
  LAMPORTS_PER_SOL: 1000000000,
}));

describe('DonationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDonationSuccess = jest.fn();
  const mockRecipient = new PublicKey('recipientPublicKey987654321');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the donation modal when open', () => {
    render(
      <DonationModal 
        isOpen={true} 
        onClose={mockOnClose} 
        recipient={mockRecipient}
        streamerName="TestStreamer"
        onDonationSuccess={mockOnDonationSuccess}
      />
    );

    expect(screen.getByText('Support TestStreamer')).toBeInTheDocument();
    expect(screen.getByText('Amount (SOL)')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <DonationModal 
        isOpen={false} 
        onClose={mockOnClose} 
        recipient={mockRecipient}
        streamerName="TestStreamer"
        onDonationSuccess={mockOnDonationSuccess}
      />
    );

    expect(screen.queryByText('Support TestStreamer')).not.toBeInTheDocument();
  });

  it('updates amount when input value changes', () => {
    render(
      <DonationModal 
        isOpen={true} 
        onClose={mockOnClose} 
        recipient={mockRecipient}
        streamerName="TestStreamer"
        onDonationSuccess={mockOnDonationSuccess}
      />
    );

    const amountInput = screen.getByLabelText('Amount (SOL)') as HTMLInputElement;
    fireEvent.change(amountInput, { target: { value: '2.5' } });
    
    expect(amountInput.value).toBe('2.5');
  });

  it('calls onDonationSuccess when donation is successful', async () => {
    const mockSendTransaction = jest.fn().mockResolvedValue('testSignature');
    jest.mocked(require('@solana/wallet-adapter-react').useWallet).mockReturnValue({
      connected: true,
      publicKey: new PublicKey('testPublicKey123456789'),
      sendTransaction: mockSendTransaction,
    } as any);

    render(
      <DonationModal 
        isOpen={true} 
        onClose={mockOnClose} 
        recipient={mockRecipient}
        streamerName="TestStreamer"
        onDonationSuccess={mockOnDonationSuccess}
      />
    );

    // Change amount to 1 SOL
    const amountInput = screen.getByLabelText('Amount (SOL)') as HTMLInputElement;
    fireEvent.change(amountInput, { target: { value: '1' } });
    
    // Click donate button
    const donateButton = screen.getByText('Donate 1 SOL');
    fireEvent.click(donateButton);

    await waitFor(() => {
      expect(mockOnDonationSuccess).toHaveBeenCalledWith('testSignature', 1);
    });
  });
});