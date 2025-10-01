'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type SubscriptionTier = {
  id: string;
  name: string;
  price: number; // in SOL
  benefits: string[];
  color: string;
};

type SubscriptionComponentProps = {
  streamerName: string;
  streamerWalletAddress: string;
  onSubscribe?: (tierId: string, duration: number) => void;
};

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'tier-1',
    name: 'Supporter',
    price: 1.0,
    benefits: [
      'Special badge in chat',
      'Exclusive emotes',
      'Subscriber-only chat room',
    ],
    color: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
  },
  {
    id: 'tier-2',
    name: 'Enthusiast',
    price: 5.0,
    benefits: [
      'All Supporter benefits',
      'Private Discord access',
      'Monthly NFT rewards',
      'Early access to streams',
    ],
    color: 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)'
  },
  {
    id: 'tier-3',
    name: 'Fanatic',
    price: 10.0,
    benefits: [
      'All Enthusiast benefits',
      'Personal shoutouts',
      'Custom emotes with your name',
      'Exclusive content',
      'Priority support',
    ],
    color: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
  }
];

export default function SubscriptionComponent({ 
  streamerName, 
  streamerWalletAddress,
  onSubscribe
}: SubscriptionComponentProps) {
  const { connected } = useWallet();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(1); // in months
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!connected || !selectedTier) return;
    
    setIsProcessing(true);
    try {
      // In a real implementation, this would create a subscription transaction on Solana
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSubscribe) {
        onSubscribe(selectedTier, duration);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="subscription-component">
      <div className="subscription-header">
        <h2>Subscribe to {streamerName}</h2>
        <p>Support your favorite streamer and get exclusive benefits!</p>
      </div>
      
      <div className="tiers-container">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <div 
            key={tier.id} 
            className={`tier-card ${selectedTier === tier.id ? 'selected' : ''}`}
            style={{ border: `2px solid ${tier.color}` }}
            onClick={() => setSelectedTier(tier.id)}
          >
            <div className="tier-header" style={{ background: tier.color }}>
              <h3>{tier.name}</h3>
              <div className="price">
                <span className="amount">{tier.price}</span>
                <span className="currency">SOL</span>
              </div>
            </div>
            
            <div className="tier-details">
              <ul className="benefits-list">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="benefit-item">
                    <span className="checkmark">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              
              <div className="duration-selector">
                <label>Duration (months)</label>
                <div className="duration-options">
                  {[1, 3, 6, 12].map((months) => (
                    <button
                      key={months}
                      className={`duration-btn ${duration === months ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDuration(months);
                      }}
                    >
                      {months === 12 ? 'Annual' : `${months}M`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="subscription-actions">
        {!connected ? (
          <div className="connect-prompt">
            <p>Connect your wallet to subscribe</p>
          </div>
        ) : (
          <button 
            className="subscribe-btn"
            onClick={handleSubscribe}
            disabled={!selectedTier || isProcessing}
          >
            {isProcessing 
              ? 'Processing...' 
              : selectedTier 
                ? `Subscribe to ${SUBSCRIPTION_TIERS.find(t => t.id === selectedTier)?.name} - ${SUBSCRIPTION_TIERS.find(t => t.id === selectedTier)?.price * duration} SOL for ${duration} ${duration === 1 ? 'month' : 'months'}`
                : 'Select a tier to subscribe'}
          </button>
        )}
      </div>
      
      <style jsx>{`
        .subscription-component {
          padding: var(--spacing-xl);
        }
        
        .subscription-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .subscription-header h2 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-xxl);
        }
        
        .subscription-header p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-md);
        }
        
        .tiers-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }
        
        .tier-card {
          border: 2px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition-fast);
          background: var(--color-background-secondary);
        }
        
        .tier-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        
        .tier-card.selected {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
        }
        
        .tier-header {
          padding: var(--spacing-xl);
          color: white;
          text-align: center;
        }
        
        .tier-header h3 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
        }
        
        .price {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: var(--spacing-xs);
        }
        
        .amount {
          font-size: var(--font-size-xxxl);
          font-weight: var(--font-weight-bold);
        }
        
        .currency {
          font-size: var(--font-size-lg);
          opacity: 0.9;
        }
        
        .tier-details {
          padding: var(--spacing-xl);
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0 0 var(--spacing-xl) 0;
        }
        
        .benefit-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) 0;
          color: var(--color-text-primary);
          border-bottom: 1px solid var(--color-border);
        }
        
        .benefit-item:last-child {
          border-bottom: none;
        }
        
        .checkmark {
          color: var(--color-brand-primary);
          font-weight: var(--font-weight-bold);
        }
        
        .duration-selector {
          margin-top: var(--spacing-lg);
        }
        
        .duration-selector label {
          display: block;
          margin-bottom: var(--spacing-sm);
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        
        .duration-options {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .duration-btn {
          flex: 1;
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-full);
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: var(--font-size-sm);
          transition: var(--transition-fast);
        }
        
        .duration-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .duration-btn.active {
          background: var(--color-brand-primary);
          color: #000;
          border-color: var(--color-brand-primary);
        }
        
        .subscription-actions {
          display: flex;
          justify-content: center;
          margin-top: var(--spacing-xl);
        }
        
        .connect-prompt {
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--color-background-tertiary);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }
        
        .subscribe-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-lg) var(--spacing-xl);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
          cursor: pointer;
          width: 100%;
          max-width: 400px;
          transition: var(--transition-fast);
        }
        
        .subscribe-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .subscribe-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}