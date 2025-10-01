import { Stream, StreamStatus } from '@stroomp/shared-types';

type FeaturedStreamCardProps = {
  stream: Stream;
};

export function FeaturedStreamCard({ stream }: FeaturedStreamCardProps) {
  return (
    <div className="featured-card">
      <div className="featured-image-container">
        <div className="featured-image" />
        {stream.status === StreamStatus.LIVE && (
          <div className="live-badge-container">
            <div className="live-badge">LIVE</div>
            <div className="live-pulse" />
          </div>
        )}
        <div className="gradient-overlay" />
      </div>
      
      <div className="featured-content">
        <div className="featured-info">
          <h1 className="featured-title">{stream.title}</h1>
          
          <div className="featured-streamer-info">
            <div className="streamer-avatar">
              <div className="streamer-initials">{stream.streamer.username.charAt(0)}</div>
            </div>
            <div>
              <div className="streamer-name">{stream.streamer.username}</div>
              <div className="viewer-count">
                <span className="viewer-icon">●</span>
                {stream.viewers?.toLocaleString()} viewers
              </div>
            </div>
          </div>
        </div>
        
        <button className="watch-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M5 12L10 7M5 12L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Watch Now</span>
        </button>
      </div>

      <style jsx>{`
        .featured-card {
          position: relative;
          border-radius: var(--border-radius-xl);
          overflow: hidden;
          background: var(--color-background-card);
          box-shadow: var(--shadow-lg);
          height: 400px;
          transition: var(--transition-normal);
          cursor: pointer;
        }

        .featured-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-2xl);
        }

        .featured-image-container {
          position: relative;
          height: 100%;
          overflow: hidden;
        }

        .featured-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-normal);
        }

        .featured-card:hover .featured-image {
          transform: scale(1.05);
        }

        .gradient-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to top, var(--color-background-main) 0%, transparent 100%);
          z-index: 1;
        }

        .live-badge-container {
          position: absolute;
          top: var(--spacing-lg);
          left: var(--spacing-lg);
          z-index: 2;
        }

        .live-badge {
          position: relative;
          background-color: var(--color-brand-primary);
          color: #000;
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-sm);
          text-transform: uppercase;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          backdrop-filter: blur(4px);
        }

        .live-pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: var(--border-radius-full);
          background-color: var(--color-brand-primary);
          opacity: 0.5;
          animation: pulse 1.5s infinite;
          z-index: 1;
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

        .featured-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--spacing-xxxxl) var(--spacing-xl) var(--spacing-xl);
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 40%;
        }

        .featured-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .featured-title {
          font-size: var(--font-size-xxxxl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .featured-streamer-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .streamer-avatar {
          width: 56px;
          height: 56px;
          border-radius: var(--border-radius-full);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 3px solid var(--color-background-main);
        }

        .streamer-initials {
          color: #000;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-xl);
        }

        .streamer-name {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .viewer-count {
          font-size: var(--font-size-md);
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .viewer-icon {
          color: var(--color-success);
          font-size: var(--font-size-sm);
        }

        .watch-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          background: var(--gradient-primary);
          color: #000;
          border: none;
          border-radius: var(--border-radius-full);
          padding: var(--spacing-lg) var(--spacing-xl);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          transition: var(--transition-normal);
          width: fit-content;
          margin-top: var(--spacing-md);
          box-shadow: var(--shadow-md);
        }

        .watch-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .watch-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}