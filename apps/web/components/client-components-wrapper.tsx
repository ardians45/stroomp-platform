'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client components to avoid server-side rendering issues
const ClientComponents = dynamic(
  () => import('./client-components'),
  { 
    ssr: false,
    loading: () => <div style={{ display: 'none' }} />
  }
);

export default function ClientComponentsWrapper() {
  return <ClientComponents />;
}