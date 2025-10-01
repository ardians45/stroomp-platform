'use client';

import { Stream, StreamStatus } from '@stroomp/shared-types';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import MainContent from '@/components/main-content';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

export default function Home() {
  const { liveStreams, loading, error, fetchLiveStreams } = useApi();
  const [featuredStream, setFeaturedStream] = useState<Stream | null>(null);

  useEffect(() => {
    // Fetch live streams when component mounts
    fetchLiveStreams();
  }, [fetchLiveStreams]);

  // Set the featured stream to the one with the most viewers if available
  useEffect(() => {
    if (liveStreams.length > 0) {
      const highestViewedStream = [...liveStreams].sort((a, b) => b.viewers - a.viewers)[0];
      setFeaturedStream(highestViewedStream);
    }
  }, [liveStreams]);

  if (loading) {
    return (
      <div className="home-page">
        <Sidebar />
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading streams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <Sidebar />
        <Header />
        <div className="error-container">
          <h2>Error Loading Streams</h2>
          <p>{error}</p>
          <button onClick={fetchLiveStreams} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Sidebar />
      <Header />
      <MainContent 
        featuredStream={featuredStream || {
          id: '0',
          title: 'No streams available',
          description: 'Check back later for new streams',
          category: 'ALL',
          status: StreamStatus.ENDED,
          streamer: {
            id: '0',
            walletAddress: '',
            username: 'No Streamer',
            profileImageUrl: ''
          },
          viewers: 0,
          startTime: new Date()
        }} 
        streams={liveStreams.filter(stream => stream.id !== featuredStream?.id) || []} 
      />
      
      <style jsx global>{`
        .home-page {
          position: relative;
          min-height: 100vh;
          background-color: var(--color-background-main); /* #18181b */
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: var(--color-text-primary);
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid var(--color-brand-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-lg);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: var(--color-text-primary);
          text-align: center;
          padding: var(--spacing-xl);
        }
        
        .error-container h2 {
          color: var(--color-error);
          margin-bottom: var(--spacing-md);
        }
        
        .retry-btn {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-md) var(--spacing-xl);
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
}
