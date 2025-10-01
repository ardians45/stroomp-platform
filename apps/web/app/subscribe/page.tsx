'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import SubscriptionComponent from '@/components/subscription';
import RewardsComponent from '@/components/rewards';

export default function SubscriptionPage() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'subscribe' | 'rewards'>('subscribe');

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <div className="header-content">
          <h1>Subscription & Rewards</h1>
          <div className="wallet-info">
            {connected ? (
              <div className="connected-indicator">
                <span className="status-dot"></span>
                <span>Connected</span>
              </div>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'subscribe' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscribe')}
          >
            Subscribe
          </button>
          <button 
            className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            Rewards
          </button>
        </div>
      </div>

      <div className="content-container">
        {activeTab === 'subscribe' && (
          <SubscriptionComponent 
            streamerName="GamingChamp" 
            streamerWalletAddress="GamingPro123..."
            onSubscribe={(tierId, duration) => {
              console.log(`Subscribed to tier ${tierId} for ${duration} months`);
              alert(`Successfully subscribed to tier ${tierId} for ${duration} months!`);
            }}
          />
        )}
        
        {activeTab === 'rewards' && (
          <RewardsComponent 
            streamerName="GamingChamp"
            onClaimReward={(rewardId) => {
              console.log(`Claimed reward ${rewardId}`);
              alert(`Successfully claimed reward!`);
            }}
          />
        )}
      </div>

      <style jsx>{`
        .subscription-page {
          background-color: var(--color-background-main);
          min-height: 100vh;
          padding-bottom: var(--spacing-xxxxl);
        }
        
        .subscription-header {
          background: var(--color-background-tertiary);
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-content h1 {
          margin: 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-xxl);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .wallet-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .connected-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(40, 167, 69, 0.1);
          border: 1px solid var(--color-success);
          border-radius: var(--border-radius-full);
          color: var(--color-success);
          font-size: var(--font-size-sm);
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--color-success);
          border-radius: var(--border-radius-full);
        }
        
        .tabs-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }
        
        .tabs {
          display: flex;
          background: var(--color-background-tertiary);
          border-radius: var(--border-radius-full);
          padding: var(--spacing-xs);
          border: 1px solid var(--color-border);
        }
        
        .tab {
          flex: 1;
          padding: var(--spacing-md) 0;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
          border-radius: var(--border-radius-full);
          transition: var(--transition-fast);
        }
        
        .tab:hover {
          color: var(--color-text-primary);
        }
        
        .tab.active {
          background: var(--color-brand-primary);
          color: #000;
        }
        
        .content-container {
          max-width: 1200px;
          margin: var(--spacing-xl) auto;
          padding: 0 var(--spacing-lg);
          background: var(--color-background-secondary);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: var(--spacing-lg);
          }
          
          .tabs {
            flex-direction: column;
          }
          
          .tab {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}