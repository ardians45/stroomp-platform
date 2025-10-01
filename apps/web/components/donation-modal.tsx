'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

type DonationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipient: PublicKey;
  streamerName: string;
  onDonationSuccess?: (txSignature: string, amount: number) => void;
};

export default function DonationModal({ 
  isOpen, 
  onClose, 
  recipient, 
  streamerName,
  onDonationSuccess
}: DonationModalProps) {
  const { connected, publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState(0.1);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDonation = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > 10) {
      setError('Maximum donation amount is 10 SOL for demo purposes');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        'confirmed'
      );

      // Create a donation transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Success
      if (onDonationSuccess) {
        onDonationSuccess(signature, amount);
      }
      
      // Reset and close
      setAmount(0.1);
      setMessage('');
      onClose();
    } catch (err: any) {
      console.error('Donation failed:', err);
      setError(err.message || 'Donation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="donation-modal-overlay" onClick={onClose}>
      <div className="donation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Support {streamerName}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <div className="donation-amount-section">
            <label htmlFor="donation-amount">Amount (SOL)</label>
            <div className="amount-input-container">
              <input
                id="donation-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="amount-input"
                placeholder="0.1"
                disabled={isProcessing}
              />
              <span className="currency-label">SOL</span>
            </div>
            
            <div className="quick-amounts">
              {[0.1, 0.5, 1.0, 2.0, 5.0].map((amt) => (
                <button
                  key={amt}
                  className={`quick-amount ${amount === amt ? 'active' : ''}`}
                  onClick={() => setAmount(amt)}
                  disabled={isProcessing}
                >
                  {amt} SOL
                </button>
              ))}
            </div>
          </div>
          
          <div className="donation-message-section">
            <label htmlFor="donation-message">Message (optional)</label>
            <textarea
              id="donation-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
              placeholder="Send a message with your donation..."
              rows={3}
              disabled={isProcessing}
            />
          </div>
          
          {connected ? (
            <div className="donation-action">
              <div className="donation-summary">
                <p>Donating <strong>{amount} SOL</strong> to <strong>{streamerName}</strong></p>
              </div>
              <button 
                className="donate-btn" 
                onClick={handleDonation}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Donate ${amount} SOL`}
              </button>
            </div>
          ) : (
            <div className="wallet-required">
              <p>Please connect your wallet to make a donation</p>
              <WalletMultiButton />
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <style jsx>{`
          .donation-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal);
            backdrop-filter: blur(4px);
          }
          
          .donation-modal {
            background: var(--color-background-secondary);
            border-radius: var(--border-radius-xl);
            width: 90%;
            max-width: 500px;
            box-shadow: var(--shadow-xl);
            overflow: hidden;
            animation: modalSlideIn 0.3s ease-out;
          }
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .modal-header {
            padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
            border-bottom: 1px solid var(--color-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .modal-header h2 {
            margin: 0;
            color: var(--color-text-primary);
            font-size: var(--font-size-xl);
          }
          
          .close-btn {
            background: none;
            border: none;
            color: var(--color-text-secondary);
            font-size: var(--font-size-xl);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--border-radius-full);
            transition: var(--transition-fast);
          }
          
          .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--color-text-primary);
          }
          
          .modal-content {
            padding: var(--spacing-xl);
          }
          
          .donation-amount-section,
          .donation-message-section {
            margin-bottom: var(--spacing-xl);
          }
          
          label {
            display: block;
            color: var(--color-text-secondary);
            font-size: var(--font-size-sm);
            margin-bottom: var(--spacing-sm);
          }
          
          .amount-input-container {
            position: relative;
          }
          
          .amount-input {
            width: 100%;
            padding: var(--spacing-lg) var(--spacing-xxl) var(--spacing-lg) var(--spacing-lg);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-md);
            color: var(--color-text-primary);
            font-size: var(--font-size-lg);
          }
          
          .currency-label {
            position: absolute;
            right: var(--spacing-md);
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-tertiary);
            font-size: var(--font-size-md);
          }
          
          .quick-amounts {
            display: flex;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-sm);
            flex-wrap: wrap;
          }
          
          .quick-amount {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--border-radius-full);
            font-size: var(--font-size-sm);
            cursor: pointer;
            transition: var(--transition-fast);
          }
          
          .quick-amount:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--color-text-primary);
          }
          
          .quick-amount.active {
            background: var(--color-brand-primary);
            color: #000;
            border-color: var(--color-brand-primary);
          }
          
          .message-input {
            width: 100%;
            padding: var(--spacing-md);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-md);
            color: var(--color-text-primary);
            font-family: var(--font-family-primary);
          }
          
          .donation-action {
            margin-top: var(--spacing-lg);
          }
          
          .donation-summary {
            margin-bottom: var(--spacing-md);
            padding: var(--spacing-md);
            background: rgba(255, 215, 0, 0.05);
            border-radius: var(--border-radius-md);
            border-left: 3px solid var(--color-brand-primary);
          }
          
          .donation-summary p {
            margin: 0;
            color: var(--color-text-primary);
            font-size: var(--font-size-md);
          }
          
          .donate-btn {
            width: 100%;
            background: var(--color-brand-primary);
            color: #000;
            border: none;
            padding: var(--spacing-lg);
            border-radius: var(--border-radius-full);
            font-weight: var(--font-weight-bold);
            font-size: var(--font-size-lg);
            cursor: pointer;
            transition: var(--transition-fast);
          }
          
          .donate-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
          
          .donate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .wallet-required {
            text-align: center;
            padding: var(--spacing-xl);
          }
          
          .wallet-required p {
            margin-bottom: var(--spacing-lg);
            color: var(--color-text-secondary);
          }
          
          .error-message {
            margin-top: var(--spacing-md);
            padding: var(--spacing-md);
            background: rgba(255, 23, 68, 0.1);
            border: 1px solid var(--color-error);
            border-radius: var(--border-radius-md);
            color: var(--color-error);
            text-align: center;
          }
        `}</style>
      </div>
    </div>
  );
}