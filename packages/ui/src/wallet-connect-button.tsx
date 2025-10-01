"use client";

import { ReactNode } from "react";

interface WalletConnectButtonProps {
  children: ReactNode;
  className?: string;
  onConnect: () => void;
  isConnected: boolean;
  walletAddress?: string;
}

export const WalletConnectButton = ({ 
  children, 
  className = "", 
  onConnect, 
  isConnected, 
  walletAddress 
}: WalletConnectButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        isConnected 
          ? "bg-gray-700 text-white" 
          : "bg-purple-600 hover:bg-purple-700 text-white"
      } ${className}`}
      onClick={onConnect}
    >
      {isConnected && walletAddress 
        ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` 
        : children}
    </button>
  );
};