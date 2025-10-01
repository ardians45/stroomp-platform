'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the notification center component with no SSR
const NotificationCenterNoSSR = dynamic(
  () => import('./notification-center-original'),
  { 
    ssr: false,
    loading: () => <div className="notification-center-placeholder" />
  }
);

export default function NotificationCenterWrapper() {
  // Only render on client side
  if (typeof window === 'undefined') {
    return <div className="notification-center-placeholder" />;
  }

  return <NotificationCenterNoSSR />;
}