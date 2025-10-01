'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type Reward = {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
};

type RewardClaim = {
  id: string;
  rewardId: string;
  timestamp: Date;
};

type RewardsComponentProps = {
  streamerName: string;
  onClaimReward?: (rewardId: string) => void;
};

const MOCK_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    name: 'Exclusive Emote',
    description: 'Get your own custom emote for the chat',
    pointsRequired: 500,
    imageUrl: '/emote.png'
  },
  {
    id: 'reward-2',
    name: 'Streamer Shoutout',
    description: 'Get mentioned by the streamer during a stream',
    pointsRequired: 1000,
    imageUrl: '/shoutout.png'
  },
  {
    id: 'reward-3',
    name: 'NFT Collectible',
    description: 'Limited edition streamer NFT',
    pointsRequired: 2500,
    imageUrl: '/nft.png'
  },
  {
    id: 'reward-4',
    name: 'Private Q&A Session',
    description: 'Schedule a private session with the streamer',
    pointsRequired: 5000,
    imageUrl: '/qa.png'
  }
];

export default function RewardsComponent({ 
  streamerName, 
  onClaimReward
}: RewardsComponentProps) {
  const { connected } = useWallet();
  const [userPoints, setUserPoints] = useState<number>(1250);
  const [claimedRewards, setClaimedRewards] = useState<string[]>(['reward-1']);
  const [isLoading, setIsLoading] = useState(false);

  const availableRewards = MOCK_REWARDS.filter(reward => 
    !claimedRewards.includes(reward.id) && reward.pointsRequired <= userPoints
  );
  
  const claimableRewards = MOCK_REWARDS.filter(reward => 
    !claimedRewards.includes(reward.id) && reward.pointsRequired <= userPoints
  );
  
  const notUnlockableRewards = MOCK_REWARDS.filter(reward => 
    !claimedRewards.includes(reward.id) && reward.pointsRequired > userPoints
  );

  const handleClaimReward = async (rewardId: string) => {
    if (!connected) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would claim the reward via Solana
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setClaimedRewards(prev => [...prev, rewardId]);
      const reward = MOCK_REWARDS.find(r => r.id === rewardId);
      if (reward) {
        setUserPoints(prev => prev - reward.pointsRequired);
      }
      
      if (onClaimReward) {
        onClaimReward(rewardId);
      }
    } catch (error) {
      console.error('Claiming reward failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rewards-component">
      <div className="rewards-header">
        <h2>Rewards for {streamerName}</h2>
        <div className="points-balance">
          <span className="points-label">Your Points:</span>
          <span className="points-value">{userPoints}</span>
        </div>
      </div>
      
      {claimableRewards.length > 0 && (
        <div className="rewards-section">
          <h3>Available Rewards</h3>
          <div className="rewards-grid">
            {claimableRewards.map((reward) => (
              <div key={reward.id} className="reward-card">
                <div className="reward-image">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={reward.name} />
                  ) : (
                    <div className="default-reward-icon">🎁</div>
                  )}
                </div>
                
                <div className="reward-info">
                  <h4>{reward.name}</h4>
                  <p className="reward-description">{reward.description}</p>
                  <div className="reward-points">
                    <span className="points-amount">{reward.pointsRequired}</span>
                    <span className="points-label">points</span>
                  </div>
                </div>
                
                <button 
                  className="claim-btn"
                  onClick={() => handleClaimReward(reward.id)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Claiming...' : 'Claim Reward'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {notUnlockableRewards.length > 0 && (
        <div className="rewards-section">
          <h3>Locked Rewards</h3>
          <div className="rewards-grid">
            {notUnlockableRewards.map((reward) => (
              <div key={reward.id} className="reward-card locked">
                <div className="reward-image">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={reward.name} />
                  ) : (
                    <div className="default-reward-icon">🎁</div>
                  )}
                </div>
                
                <div className="reward-info">
                  <h4>{reward.name}</h4>
                  <p className="reward-description">{reward.description}</p>
                  <div className="reward-points">
                    <span className="points-amount">{reward.pointsRequired}</span>
                    <span className="points-label">points</span>
                  </div>
                  <div className="points-needed">
                    {userPoints < reward.pointsRequired 
                      ? `${reward.pointsRequired - userPoints} more points needed` 
                      : 'Claimed'}
                  </div>
                </div>
                
                <button 
                  className="claim-btn disabled"
                  disabled={true}
                >
                  {userPoints < reward.pointsRequired 
                    ? 'Not Enough Points' 
                    : 'Claimed'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {claimedRewards.length > 0 && (
        <div className="rewards-section">
          <h3>Claimed Rewards</h3>
          <div className="rewards-grid">
            {MOCK_REWARDS.filter(r => claimedRewards.includes(r.id)).map((reward) => (
              <div key={reward.id} className="reward-card claimed">
                <div className="reward-image">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={reward.name} />
                  ) : (
                    <div className="default-reward-icon">🎁</div>
                  )}
                </div>
                
                <div className="reward-info">
                  <h4>{reward.name}</h4>
                  <p className="reward-description">{reward.description}</p>
                  <div className="reward-points">
                    <span className="points-amount">{reward.pointsRequired}</span>
                    <span className="points-label">points</span>
                  </div>
                </div>
                
                <button 
                  className="claim-btn claimed"
                  disabled={true}
                >
                  Claimed
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!connected && (
        <div className="connect-prompt">
          <p>Connect your wallet to claim rewards</p>
        </div>
      )}
      
      <style jsx>{`
        .rewards-component {
          padding: var(--spacing-xl);
        }
        
        .rewards-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }
        
        .rewards-header h2 {
          margin: 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-xxl);
        }
        
        .points-balance {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: var(--color-background-tertiary);
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--border-radius-full);
          border: 1px solid var(--color-border);
        }
        
        .points-label {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
        
        .points-value {
          color: var(--color-brand-primary);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
        }
        
        .rewards-section {
          margin-bottom: var(--spacing-xl);
        }
        
        .rewards-section h3 {
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-xl);
        }
        
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .reward-card {
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .reward-card.locked {
          opacity: 0.7;
        }
        
        .reward-card.claimed {
          border-color: var(--color-brand-primary);
          opacity: 0.9;
        }
        
        .reward-image {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-background-tertiary);
        }
        
        .reward-image img {
          max-width: 80%;
          max-height: 80%;
          object-fit: contain;
        }
        
        .default-reward-icon {
          font-size: 2rem;
        }
        
        .reward-info {
          padding: var(--spacing-lg);
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .reward-info h4 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
        }
        
        .reward-description {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          flex: 1;
        }
        
        .reward-points {
          display: flex;
          align-items: baseline;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }
        
        .points-amount {
          color: var(--color-brand-primary);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
        }
        
        .points-label {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
        
        .points-needed {
          color: var(--color-warning);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }
        
        .claim-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          transition: var(--transition-fast);
          margin-top: auto;
        }
        
        .claim-btn:hover:not(:disabled, .claimed) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .claim-btn.disabled {
          background: var(--color-background-tertiary);
          color: var(--color-text-tertiary);
          cursor: not-allowed;
        }
        
        .claim-btn.claimed {
          background: var(--color-success);
          color: white;
          cursor: default;
        }
        
        .connect-prompt {
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--color-background-tertiary);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }
        
        @media (max-width: 768px) {
          .rewards-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .points-balance {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}