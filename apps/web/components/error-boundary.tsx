'use client';

// components/error-boundary.tsx

import React, { Component, ReactNode } from 'react';
import { ErrorBoundaryState, getErrorBoundaryState } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: any) => void;
}

class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return getErrorBoundaryState(error);
  }

  componentDidCatch(error: Error, info: any): void {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Return fallback UI if specified, otherwise default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="error-reload-btn"
          >
            Reload Page
          </button>
          
          <style jsx>{`
            .error-boundary {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: var(--spacing-xl);
              text-align: center;
              background: var(--color-background-secondary);
              border-radius: var(--border-radius-lg);
              margin: var(--spacing-xl);
            }
            
            .error-boundary h2 {
              color: var(--color-error);
              margin-bottom: var(--spacing-md);
            }
            
            .error-boundary p {
              color: var(--color-text-secondary);
              margin-bottom: var(--spacing-lg);
            }
            
            .error-reload-btn {
              background: var(--color-brand-primary);
              color: #000;
              border: none;
              padding: var(--spacing-md) var(--spacing-lg);
              border-radius: var(--border-radius-full);
              font-weight: var(--font-weight-bold);
              cursor: pointer;
              transition: var(--transition-fast);
            }
            
            .error-reload-btn:hover {
              transform: translateY(-2px);
              box-shadow: var(--shadow-md);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;