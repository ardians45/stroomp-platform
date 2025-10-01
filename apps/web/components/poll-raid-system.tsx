'use client';

import { useState } from 'react';
import { Stream } from '@stroomp/shared-types';
import PollComponent from '@/components/poll';
import RaidComponent from '@/components/raid';

type PollRaidSystemProps = {
  stream: Stream;
  currentViewers: number;
};

// Mock data for demonstration
const mockPoll: { id: string; question: string; options: any[]; isActive: boolean } = {
  id: 'poll-1',
  question: 'Where should we go next?',
  options: [
    { id: 'a', text: 'Play new game', votes: 42 },
    { id: 'b', text: 'Take a break', votes: 31 },
    { id: 'c', text: 'Do a giveaway', votes: 57 },
  ],
  isActive: true
};

export default function PollRaidSystem({ stream, currentViewers }: PollRaidSystemProps) {
  const [poll, setPoll] = useState(mockPoll);
  const [activeTab, setActiveTab] = useState<'poll' | 'raid'>('poll');

  const handleVote = (pollId: string, optionId: string) => {
    // In a real app, this would send the vote to the backend
    setPoll(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));
  };

  const handleRaid = (targetStreamId: string) => {
    // In a real app, this would redirect viewers to the target stream
    console.log(`Initiating raid to stream: ${targetStreamId}`);
    alert(`Raid initiated to stream: ${targetStreamId}`);
  };

  return (
    <div className="poll-raid-system">
      <div className="system-header">
        <h3>Interactive Features</h3>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'poll' ? 'active' : ''}`}
            onClick={() => setActiveTab('poll')}
          >
            Poll
          </button>
          <button 
            className={`tab ${activeTab === 'raid' ? 'active' : ''}`}
            onClick={() => setActiveTab('raid')}
          >
            Raid
          </button>
        </div>
      </div>
      
      <div className="system-content">
        {activeTab === 'poll' ? (
          <PollComponent 
            poll={poll} 
            onVote={handleVote} 
          />
        ) : (
          <RaidComponent 
            streamerName={stream.streamer.username}
            onRaid={handleRaid}
          />
        )}
      </div>
      
      <style jsx>{`
        .poll-raid-system {
          background: var(--color-background-tertiary);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--color-border);
          margin-top: var(--spacing-xl);
        }
        
        .system-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }
        
        .system-header h3 {
          margin: 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
        }
        
        .tabs {
          display: flex;
          gap: var(--spacing-xs);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius-full);
          padding: var(--spacing-xs);
        }
        
        .tab {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-full);
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          transition: var(--transition-fast);
        }
        
        .tab:hover {
          color: var(--color-text-primary);
        }
        
        .tab.active {
          background: var(--color-brand-primary);
          color: #000;
        }
        
        .system-content {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}