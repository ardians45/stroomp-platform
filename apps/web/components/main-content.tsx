'use client';

import { Stream } from '@stroomp/shared-types';
import { StreamCard } from './stream-card';
import { FeaturedStreamCard } from './featured-stream-card';

type MainContentProps = {
  featuredStream: Stream;
  streams: Stream[];
};

export default function MainContent({ featuredStream, streams }: MainContentProps) {
  return (
    <main className="main-content">
      <div className="container">
        <section className="featured-section">
          <div className="section-header">
            <h1 className="section-title">Featured Stream</h1>
          </div>
          <FeaturedStreamCard stream={featuredStream} />
        </section>

        <section className="streams-section">
          <div className="section-header">
            <h2 className="section-title">Popular Streams</h2>
            <div className="section-controls">
              <button className="filter-btn">All Categories</button>
              <button className="sort-btn">Sort by: Popular</button>
            </div>
          </div>
          <div className="stream-grid">
            {streams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .main-content {
          background-color: var(--color-background-main); /* #18181b */
          min-height: 100vh;
          padding-bottom: var(--spacing-xxxxl);
          padding-top: var(--spacing-xl);
        }

        @media (min-width: 769px) {
          .main-content {
            margin-left: 80px; /* Account for sidebar width */
            padding-top: var(--spacing-xl);
          }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 var(--spacing-md);
          }
        }

        .featured-section {
          margin-bottom: var(--spacing-xxxxl);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }

        .section-title {
          font-size: var(--font-size-xxxxl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-controls {
          display: flex;
          gap: var(--spacing-md);
        }

        .filter-btn, .sort-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius-full);
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .filter-btn:hover, .sort-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text-primary);
          border-color: var(--color-brand-primary);
        }

        .streams-section {
          padding: 0;
        }

        .stream-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-xl);
        }

        @media (max-width: 1200px) {
          .stream-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .stream-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stream-grid {
            grid-template-columns: 1fr;
          }
          .main-content {
            margin-left: 0;
            padding-top: calc(var(--spacing-xl) + 60px); /* Account for mobile header height */
          }
          .container {
            padding: 0 var(--spacing-md);
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-lg);
          }
          .section-controls {
            width: 100%;
            justify-content: space-between;
          }
          .section-title {
            font-size: var(--font-size-xxxl);
          }
        }

        @media (max-width: 480px) {
          .section-controls {
            flex-direction: column;
          }
          .filter-btn, .sort-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}