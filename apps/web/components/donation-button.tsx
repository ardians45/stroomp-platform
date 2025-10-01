'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import DonationModal from './donation-modal';

type DonationButtonProps = {
  recipient: PublicKey;
  streamerName: string;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  onDonationSuccess?: (txSignature: string, amount: number) => void;
};

export default function DonationButton({ 
  recipient, 
  streamerName, 
  variant = 'primary', 
  size = 'md',
  onDonationSuccess
}: DonationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const buttonClasses = [
    'donation-button',
    `donation-button--${variant}`,
    `donation-button--${size}`
  ].join(' ');

  return (
    <>
      <button className={buttonClasses} onClick={handleClick}>
        {variant === 'icon' ? (
          <span className="donation-icon">💎</span>
        ) : (
          <>
            <span className="donation-icon">💎</span>
            <span className="donation-text">Donate SOL</span>
          </>
        )}
      </button>
      
      {isModalOpen && (
        <DonationModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          recipient={recipient}
          streamerName={streamerName}
          onDonationSuccess={onDonationSuccess}
        />
      )}
      
      <style jsx>{`
        .donation-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          border: none;
          border-radius: var(--border-radius-full);
          cursor: pointer;
          font-weight: var(--font-weight-medium);
          transition: var(--transition-fast);
          text-decoration: none;
        }
        
        .donation-button--primary {
          background: var(--color-brand-primary);
          color: #000;
          padding: var(--spacing-md) var(--spacing-lg);
        }
        
        .donation-button--secondary {
          background: transparent;
          color: var(--color-brand-primary);
          border: 1px solid var(--color-brand-primary);
          padding: var(--spacing-md) var(--spacing-lg);
        }
        
        .donation-button--icon {
          background: var(--color-brand-primary);
          color: #000;
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius-full);
        }
        
        .donation-button--sm {
          font-size: var(--font-size-sm);
        }
        
        .donation-button--md {
          font-size: var(--font-size-md);
        }
        
        .donation-button--lg {
          font-size: var(--font-size-lg);
        }
        
        .donation-button--primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .donation-button--secondary:hover:not(:disabled) {
          background: rgba(255, 215, 0, 0.1);
        }
        
        .donation-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .donation-icon {
          font-size: 1.2em;
        }
        
        .donation-text {
          display: inline-block;
        }
        
        .donation-button--icon .donation-text {
          display: none;
        }
      `}</style>
    </>
  );
}