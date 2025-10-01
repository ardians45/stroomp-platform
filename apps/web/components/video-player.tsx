'use client';

import { useEffect, useRef, useState } from 'react';

type VideoPlayerProps = {
  streamId: string;
  streamTitle?: string;
  autoPlay?: boolean;
  posterUrl?: string;
};

export default function VideoPlayer({ 
  streamId, 
  streamTitle = 'Live Stream', 
  autoPlay = true, 
  posterUrl 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize video player
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [streamId]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // In a real implementation, this would connect to a streaming service
  // For now, we'll use a placeholder
  const streamUrl = `https://example.com/streams/${streamId}/index.m3u8`; // HLS stream

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={streamUrl}
          poster={posterUrl || `https://picsum.photos/seed/${streamId}/1280/720`}
          autoPlay={autoPlay}
          className="video-element"
          onClick={togglePlay}
        >
          Your browser does not support the video tag.
        </video>
        
        <div className="video-controls">
          <div className="control-row top-controls">
            <div className="playback-controls">
              <button className="control-btn" onClick={togglePlay}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button className="control-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            
            <div className="time-display">
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
              {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
          
          <div className="control-row bottom-controls">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="seek-bar"
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .video-player-container {
          position: relative;
          width: 100%;
          background: #000;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        
        .video-wrapper {
          position: relative;
        }
        
        .video-element {
          width: 100%;
          display: block;
          aspect-ratio: 16 / 9;
          background: #000;
        }
        
        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: var(--spacing-md);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 10;
        }
        
        .video-player-container:hover .video-controls {
          opacity: 1;
        }
        
        .control-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .top-controls {
          margin-bottom: var(--spacing-md);
        }
        
        .playback-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .control-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: var(--border-radius-full);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s ease;
        }
        
        .control-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .volume-slider {
          width: 80px;
          height: 4px;
          border-radius: var(--border-radius-full);
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
        }
        
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: var(--border-radius-full);
          background: var(--color-brand-primary);
          cursor: pointer;
        }
        
        .time-display {
          color: white;
          font-size: var(--font-size-sm);
          font-family: var(--font-family-mono);
        }
        
        .seek-bar {
          width: 100%;
          height: 4px;
          border-radius: var(--border-radius-full);
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
        }
        
        .seek-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: var(--border-radius-full);
          background: var(--color-brand-primary);
          cursor: pointer;
        }
        
        .bottom-controls {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}