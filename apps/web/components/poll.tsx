'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  timeRemaining?: number; // in seconds
};

type PollComponentProps = {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
};

export default function PollComponent({ poll, onVote }: PollComponentProps) {
  const { connected } = useWallet();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (!connected || !selectedOption || !poll.isActive) return;
    
    if (onVote) {
      onVote(poll.id, selectedOption);
    }
    
    // Reset selection after voting
    setSelectedOption(null);
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  return (
    <div className="poll-container">
      <div className="poll-header">
        <h3 className="poll-question">{poll.question}</h3>
        {!poll.isActive && <span className="poll-status">Poll ended</span>}
      </div>
      
      <div className="poll-options">
        {poll.options.map((option) => {
          const percentage = getPercentage(option.votes);
          return (
            <div 
              key={option.id} 
              className={`poll-option ${selectedOption === option.id ? 'selected' : ''} ${!poll.isActive ? 'locked' : ''}`}
              onClick={() => poll.isActive && connected && setSelectedOption(option.id)}
            >
              <div className="option-content">
                <div className="option-label">
                  <input
                    type="radio"
                    name={`poll-${poll.id}`}
                    checked={selectedOption === option.id}
                    onChange={() => {}}
                    disabled={!poll.isActive || !connected}
                    className="option-radio"
                  />
                  <span className="option-text">{option.text}</span>
                </div>
                
                {poll.isActive ? (
                  <span className="option-vote-btn">Vote</span>
                ) : (
                  <span className="option-result">{percentage}% ({option.votes})</span>
                )}
              </div>
              
              {!poll.isActive && (
                <div className="option-bar">
                  <div 
                    className="option-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {poll.isActive && connected && (
        <div className="poll-actions">
          <div className="selected-info">
            {selectedOption 
              ? `Selected: ${poll.options.find(o => o.id === selectedOption)?.text}` 
              : 'Select an option to vote'}
          </div>
          <button 
            className="vote-btn" 
            onClick={handleVote}
            disabled={!selectedOption}
          >
            Vote
          </button>
        </div>
      )}
      
      {!connected && poll.isActive && (
        <div className="connect-wallet-prompt">
          Connect wallet to vote
        </div>
      )}
      
      <style jsx>{`
        .poll-container {
          background: var(--color-background-tertiary);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--color-border);
        }
        
        .poll-header {
          margin-bottom: var(--spacing-md);
        }
        
        .poll-question {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
        }
        
        .poll-status {
          background: var(--color-brand-primary);
          color: #000;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
        }
        
        .poll-options {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .poll-option {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          cursor: ${poll.isActive ? 'pointer' : 'default'};
          transition: var(--transition-fast);
          position: relative;
          overflow: hidden;
        }
        
        .poll-option:hover:not(.locked) {
          border-color: var(--color-brand-primary);
          background: rgba(255, 215, 0, 0.05);
        }
        
        .poll-option.selected {
          border-color: var(--color-brand-primary);
          background: rgba(255, 215, 0, 0.1);
        }
        
        .poll-option.locked {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .option-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
          position: relative;
        }
        
        .option-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex: 1;
        }
        
        .option-radio {
          width: 16px;
          height: 16px;
        }
        
        .option-text {
          color: var(--color-text-primary);
          font-size: var(--font-size-md);
        }
        
        .option-vote-btn {
          background: var(--color-brand-primary);
          color: #000;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
        }
        
        .option-result {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
        }
        
        .option-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }
        
        .option-fill {
          height: 100%;
          background: var(--color-brand-primary);
          transition: width 0.5s ease;
        }
        
        .poll-actions {
          margin-top: var(--spacing-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .selected-info {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        
        .vote-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .vote-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .vote-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .connect-wallet-prompt {
          text-align: center;
          padding: var(--spacing-md);
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  );
}