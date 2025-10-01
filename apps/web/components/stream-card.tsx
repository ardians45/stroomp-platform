import { Stream, StreamStatus } from '@stroomp/shared-types';

type StreamCardProps = {
  stream: Stream;
};

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <div className="stream-card">
      <div className="thumbnail-container">
        <div className="thumbnail" />
        {stream.status === StreamStatus.LIVE && (
          <div className="live-badge-container">
            <div className="live-badge">LIVE</div>
            <div className="live-pulse" />
          </div>
        )}
        <div className="thumbnail-overlay" />
      </div>
      
      <div className="card-content">
        <div className="streamer-info">
          <div className="streamer-avatar">
            <div className="streamer-initials">{stream.streamer.username.charAt(0)}</div>
          </div>
          <div className="streamer-details">
            <div className="streamer-name">{stream.streamer.username}</div>
            <div className="title">{stream.title}</div>
            <div className="viewer-count">
              <span className="viewer-icon">●</span>
              {stream.viewers?.toLocaleString()} viewers
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stream-card {
          background: var(--color-background-card);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: var(--transition-normal);
          cursor: pointer;
          box-shadow: var(--shadow-md);
          position: relative;
          height: 100%;
        }

        .stream-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .thumbnail-container {
          position: relative;
          aspect-ratio: 16 / 9;
          width: 100%;
          overflow: hidden;
        }

        .thumbnail {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%);
          transition: var(--transition-normal);
        }

        .stream-card:hover .thumbnail {
          transform: scale(1.05);
        }

        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 30%);
          opacity: 0;
          transition: var(--transition-normal);
        }

        .stream-card:hover .thumbnail-overlay {
          opacity: 1;
        }

        .live-badge-container {
          position: absolute;
          top: var(--spacing-md);
          left: var(--spacing-md);
          z-index: 2;
        }

        .live-badge {
          position: relative;
          background-color: var(--color-brand-primary);
          color: #000;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-xs);
          text-transform: uppercase;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: var(--spacing-xxs);
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

        .card-content {
          padding: var(--spacing-lg);
        }

        .streamer-info {
          display: flex;
          gap: var(--spacing-md);
        }

        .streamer-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--border-radius-full);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid var(--color-background-main);
        }

        .streamer-initials {
          color: #000;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-md);
        }

        .streamer-details {
          flex: 1;
        }

        .streamer-name {
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-xs);
          font-size: var(--font-size-md);
        }

        .title {
          color: var(--color-text-primary);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--spacing-xs);
          font-size: var(--font-size-lg);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .viewer-count {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .viewer-icon {
          color: var(--color-success);
          font-size: var(--font-size-xs);
        }
      `}</style>
    </div>
  );
}