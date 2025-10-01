"use client";

import { ReactNode } from "react";

interface StreamCardProps {
  title: string;
  streamer: string;
  viewerCount: number;
  isLive: boolean;
  thumbnailUrl?: string;
  category?: string;
  onClick?: () => void;
}

export const StreamCard = ({ 
  title, 
  streamer, 
  viewerCount, 
  isLive, 
  thumbnailUrl, 
  category,
  onClick 
}: StreamCardProps) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      <div className="relative">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No thumbnail</span>
          </div>
        )}
        {isLive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            LIVE
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
        <p className="text-gray-400 text-sm truncate">{streamer}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-400 text-sm">{viewerCount} viewers</span>
          {category && (
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
              {category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};