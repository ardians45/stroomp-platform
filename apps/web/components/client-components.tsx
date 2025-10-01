'use client';

import React from 'react';
import { WebSocketProvider } from '@/contexts/websocketContext';
import NotificationCenter from '@/components/notification-center';

export default function ClientComponents() {
  // Only render on client side
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <WebSocketProvider>
      <NotificationCenter />
    </WebSocketProvider>
  );
}