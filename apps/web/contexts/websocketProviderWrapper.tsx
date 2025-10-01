'use client';

import React, { ReactNode } from 'react';
import { WebSocketProvider as ActualWebSocketProvider } from './websocketContext';

interface WebSocketProviderWrapperProps {
  children: ReactNode;
  streamId?: string;
}

export const WebSocketProviderWrapper: React.FC<WebSocketProviderWrapperProps> = ({ children, streamId = 'global' }) => {
  // Only render the WebSocket provider on the client side
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  return (
    <ActualWebSocketProvider streamId={streamId}>
      {children}
    </ActualWebSocketProvider>
  );
};