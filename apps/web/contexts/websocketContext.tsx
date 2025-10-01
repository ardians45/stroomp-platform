'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Donation } from '@stroomp/shared-types';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  donations: Donation[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
  streamId?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, streamId = 'global' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    // Use environment variable for WebSocket URL or default to localhost
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL 
      ? `${process.env.NEXT_PUBLIC_WS_URL.replace('http', 'ws')}/ws?streamId=${streamId}`
      : `ws://localhost:3001?streamId=${streamId}`;

    // Check if we're in a browser environment before creating WebSocket
    if (typeof window === 'undefined') {
      console.log('Not in browser environment, skipping WebSocket connection');
      return;
    }

    let websocket: WebSocket;
    
    try {
      websocket = new WebSocket(wsUrl);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      return;
    }

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);

        // Handle different message types
        switch (data.type) {
          case 'donation':
            // Add new donation to the list
            setDonations(prev => [...prev, data.data]);
            break;
          case 'global_donation':
            // Add global donation notification
            setDonations(prev => [...prev, {
              id: `global_donation_${Date.now()}`,
              from: data.data.from,
              to: data.data.to,
              amount: data.data.amount,
              message: data.data.message,
              txSignature: 'global',
              timestamp: new Date(data.data.timestamp),
              isAnonymous: false
            } as Donation]);
            break;
          case 'poll_update':
            // Handle poll updates if needed
            console.log('Poll updated:', data.data);
            break;
          case 'welcome':
            console.log('WebSocket connection established');
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setWs(websocket);

    // Cleanup function
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [streamId]);

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  const contextValue: WebSocketContextType = {
    isConnected,
    sendMessage,
    donations
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};