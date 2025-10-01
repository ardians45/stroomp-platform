'use client';

import { useState, useRef, useEffect } from 'react';
import { Stream, StreamStatus } from '@stroomp/shared-types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import VideoPlayer from '@/components/video-player';
import DonationButton from '@/components/donation-button';
import PollRaidSystem from '@/components/poll-raid-system';
import { PublicKey } from '@solana/web3.js';

// Mock stream data
const mockStream: Stream = {
  id: '1',
  title: 'Gaming with Pro Players - Live Tournament Finals',
  description: 'Watch the most exciting gaming tournament finals live',
  category: 'GAMING',
  status: StreamStatus.LIVE,
  streamer: {
    id: 's1',
    walletAddress: 'GamingPro123...',
    username: 'GamingChamp',
    profileImageUrl: ''
  },
  viewers: 12456,
  startTime: new Date()
};

export default function StreamPage() {
  const { connected } = useWallet();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, user: string, text: string, timestamp: Date}>>([
    { id: '1', user: 'Viewer1', text: 'Great stream!', timestamp: new Date() },
    { id: '2', user: 'Streamer', text: 'Thanks for joining everyone!', timestamp: new Date() },
    { id: '3', user: 'Viewer2', text: 'When does the tournament start?', timestamp: new Date() },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate video player functionality
  useEffect(() => {
    // In a real implementation, this would connect to a streaming service
    console.log('Initializing video player for stream:', mockStream.id);
    
    // Simulate video loading
    if (videoRef.current) {
      // Create a dummy video source for demonstration
      videoRef.current.poster = `https://picsum.photos/seed/${mockStream.id}/1280/720`;
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && connected) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        user: 'You', // In a real app, this would be the connected user
        text: message,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };



  return (
    <div className="stream-page">
      <div className="stream-container">
        <div className="video-section">
          <div className="video-wrapper">
            {/* In a real implementation, this would be an actual video player */}
            <VideoPlayer 
              streamId={mockStream.id} 
              streamTitle={mockStream.title}
              posterUrl={`https://picsum.photos/seed/${mockStream.id}/1280/720`}
            />
            <div className="stream-overlay">
              <div className="stream-info">
                <h1 className="stream-title">{mockStream.title}</h1>
                <div className="stream-details">
                  <span className="streamer-name">{mockStream.streamer.username}</span>
                  <span className="viewer-count">● {mockStream.viewers.toLocaleString()} viewers</span>
                  <span className="category">{mockStream.category}</span>
                </div>
              </div>
              
              <div className="stream-actions">
                <DonationButton 
                recipient={new PublicKey(mockStream.streamer.walletAddress)} 
                streamerName={mockStream.streamer.username}
                variant="primary"
                onDonationSuccess={(txSignature, amount) => {
                  // In a real app, this would update the UI with the donation
                  console.log(`Donation of ${amount} SOL successful: ${txSignature}`);
                }}
              />
              </div>
            </div>
            
            {mockStream.status === StreamStatus.LIVE && (
              <div className="live-indicator">
                <div className="live-badge">LIVE</div>
                <div className="live-pulse" />
              </div>
            )}
          </div>
        </div>
        
        <div className="chat-section">
          <div className="chat-header">
            <h3>Chat</h3>
            <div className="chat-info">
              {connected ? `Connected as ${mockStream.streamer.username}` : 'Connect wallet to chat'}
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="chat-message">
                <span className="message-username">{msg.user}:</span>
                <span className="message-text">{msg.text}</span>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={connected ? "Type a message..." : "Connect wallet to chat..."}
              disabled={!connected}
              className="chat-input"
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!connected || !message.trim()}
            >
              Send
            </button>
          </form>
          
          <PollRaidSystem 
            stream={mockStream} 
            currentViewers={mockStream.viewers} 
          />
        </div>
      </div>
      
      <style jsx>{`
        .stream-page {
          background-color: var(--color-background-main);
          min-height: 100vh;
          padding: var(--spacing-xl) var(--spacing-lg);
        }
        
        .stream-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-xl);
        }
        
        .video-section {
          position: relative;
        }
        
        .video-wrapper {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          background: var(--color-background-tertiary);
        }
        
        .video-player {
          width: 100%;
          height: 100%;
          display: block;
          background: #000;
        }
        
        .stream-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--spacing-xl);
          background: linear-gradient(to top, var(--color-background-main) 0%, transparent 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          z-index: 2;
        }
        
        .stream-info {
          flex: 1;
        }
        
        .stream-title {
          color: var(--color-text-primary);
          font-size: var(--font-size-xxl);
          font-weight: var(--font-weight-bold);
          margin: 0 0 var(--spacing-sm) 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .stream-details {
          display: flex;
          gap: var(--spacing-lg);
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        
        .viewer-count {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .category {
          background: rgba(255, 215, 0, 0.1);
          color: var(--color-brand-primary);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
        }
        
        .stream-actions {
          display: flex;
          gap: var(--spacing-md);
        }
        
        .donate-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-md) var(--spacing-xl);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          transition: var(--transition-fast);
        }
        
        .donate-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .live-indicator {
          position: absolute;
          top: var(--spacing-lg);
          left: var(--spacing-lg);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }
        
        .live-badge {
          background-color: var(--color-error);
          color: #fff;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-xs);
          z-index: 3;
          text-transform: uppercase;
        }
        
        .live-pulse {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--color-error);
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        .chat-section {
          background: var(--color-background-secondary);
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          height: fit-content;
          max-height: calc(100vh - 200px);
        }
        
        .chat-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chat-header h3 {
          margin: 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
        }
        
        .chat-info {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .chat-message {
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-md);
          background: rgba(255, 255, 255, 0.03);
        }
        
        .message-username {
          font-weight: var(--font-weight-semibold);
          color: var(--color-brand-primary);
          margin-right: var(--spacing-xs);
        }
        
        .message-text {
          color: var(--color-text-primary);
        }
        
        .chat-input-form {
          padding: var(--spacing-md);
          border-top: 1px solid var(--color-border);
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .chat-input {
          flex: 1;
          padding: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          color: var(--color-text-primary);
        }
        
        .chat-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .send-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
        }
        
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .donation-panel {
          padding: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }
        
        .donation-panel h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-md);
        }
        
        .donation-controls {
          display: flex;
          margin-bottom: var(--spacing-md);
        }
        
        .donation-input {
          flex: 1;
          padding: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-right: none;
          border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
          color: var(--color-text-primary);
        }
        
        .donation-currency {
          padding: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-border);
          border-left: none;
          border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
          color: var(--color-text-primary);
        }
        
        .donate-chat-btn {
          width: 100%;
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
        }
        
        .donate-chat-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 1024px) {
          .stream-container {
            grid-template-columns: 1fr;
          }
          
          .video-wrapper {
            border-radius: var(--border-radius-md);
          }
        }
      `}</style>
    </div>
  );
}