'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components that require client-side execution
const NotificationCenterNoSSR = dynamic(
  () => import('./notification-center'),
  { 
    ssr: false,
    loading: () => <div style={{ display: 'none' }} />
  }
);

// WebSocketProvider still needs to be handled correctly in the layout
export default function ClientUIProvider() {
  return <NotificationCenterNoSSR />;
}