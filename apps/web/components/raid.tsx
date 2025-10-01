'use client';

import { useState } from 'react';
import { Stream } from '@stroomp/shared-types';

type RaidComponentProps = {
  streamerName: string;
  onRaid: (targetStreamId: string) => void;
};

export default function RaidComponent({ streamerName, onRaid }: RaidComponentProps) {
  const [targetStreamer, setTargetStreamer] = useState('');
  const [raidMessage, setRaidMessage] = useState(`Join me in raiding ${streamerName}!`);
  const [isLoading, setIsLoading] = useState(false);
  const [showRaidModal, setShowRaidModal] = useState(false);

  const handleRaid = async () => {
    if (!targetStreamer.trim()) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would trigger the raid functionality
      // For now we'll simulate it with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onRaid) {
        // In a real implementation, this would be the actual target stream ID
        onRaid(targetStreamer);
      }
      
      setShowRaidModal(false);
    } catch (error) {
      console.error('Raid failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="raid-btn" onClick={() => setShowRaidModal(true)}>
        🔥 Raid Streamers
      </button>
      
      {showRaidModal && (
        <div className="raid-modal-overlay" onClick={() => setShowRaidModal(false)}>
          <div className="raid-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Raid Another Streamer</h2>
              <button className="close-btn" onClick={() => setShowRaidModal(false)}>✕</button>
            </div>
            
            <div className="modal-content">
              <div className="raid-form">
                <div className="form-group">
                  <label htmlFor="target-streamer">Target Streamer</label>
                  <input
                    id="target-streamer"
                    type="text"
                    value={targetStreamer}
                    onChange={(e) => setTargetStreamer(e.target.value)}
                    placeholder="Enter streamer name or ID"
                    className="input-field"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="raid-message">Raid Message</label>
                  <textarea
                    id="raid-message"
                    value={raidMessage}
                    onChange={(e) => setRaidMessage(e.target.value)}
                    placeholder="Enter a message for the raid"
                    rows={3}
                    className="input-field"
                  />
                </div>
                
                <div className="raid-preview">
                  <p><strong>Preview:</strong> You and your viewers will be redirected to {targetStreamer}'s stream with the message: "{raidMessage}"</p>
                </div>
                
                <button 
                  className="initiate-raid-btn"
                  onClick={handleRaid}
                  disabled={isLoading || !targetStreamer.trim()}
                >
                  {isLoading ? 'Initiating Raid...' : 'Initiate Raid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .raid-btn {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: white;
          border: none;
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          transition: var(--transition-fast);
        }
        
        .raid-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .raid-modal-overlay {
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
        
        .raid-modal {
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
        
        .form-group {
          margin-bottom: var(--spacing-lg);
        }
        
        label {
          display: block;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-sm);
        }
        
        .input-field {
          width: 100%;
          padding: var(--spacing-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          color: var(--color-text-primary);
          font-family: var(--font-family-primary);
        }
        
        .raid-preview {
          margin: var(--spacing-lg) 0;
          padding: var(--spacing-md);
          background: rgba(255, 215, 0, 0.05);
          border-radius: var(--border-radius-md);
          border-left: 3px solid var(--color-brand-primary);
        }
        
        .raid-preview p {
          margin: 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);
        }
        
        .initiate-raid-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: white;
          border: none;
          padding: var(--spacing-lg);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .initiate-raid-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .initiate-raid-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}