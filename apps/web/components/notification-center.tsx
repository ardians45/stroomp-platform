'use client';

// components/notification-center.tsx

import React, { useEffect } from 'react';
import { useError } from '../contexts/errorContext';
import { useWebSocket } from '../contexts/websocketContext';
import { StroompError } from '../utils/errorHandler';

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'donation';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
}

const NotificationItem: React.FC<{ 
  notification: Notification; 
  onDismiss: () => void 
}> = ({ notification, onDismiss }) => {
  const getNotificationColor = () => {
    switch (notification.type) {
      case 'success': return 'var(--color-success)';
      case 'error': return 'var(--color-error)';
      case 'warning': return 'var(--color-warning)';
      case 'donation': return 'var(--color-brand-primary)';
      case 'info': return 'var(--color-brand-primary)';
      default: return 'var(--color-text-primary)';
    }
  };

  return (
    <div className="notification-item" style={{ borderLeftColor: getNotificationColor() }}>
      <div className="notification-content">
        <span className="notification-message">{notification.message}</span>
        <button className="notification-dismiss" onClick={onDismiss}>✕</button>
      </div>
      <style jsx>{`
        .notification-item {
          display: flex;
          align-items: center;
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
          background: var(--color-background-tertiary);
          border-radius: var(--border-radius-md);
          border-left: 4px solid;
          box-shadow: var(--shadow-md);
          animation: slideIn 0.3s ease-out;
          overflow: hidden;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .notification-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }
        
        .notification-message {
          flex: 1;
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);
        }
        
        .notification-dismiss {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--border-radius-full);
          margin-left: var(--spacing-md);
          transition: var(--transition-fast);
        }
        
        .notification-dismiss:hover {
          color: var(--color-text-primary);
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

const convertErrorToNotification = (error: StroompError): Notification => {
  return {
    id: `error-${Date.now()}-${Math.random()}`,
    type: 'error',
    message: error.message,
    timestamp: new Date()
  };
};

const convertDonationToNotification = (donation: any): Notification => {
  return {
    id: `donation-${donation.id}`,
    type: 'donation',
    message: `${donation.from.substring(0, 6)}... donated ${donation.amount} SOL${donation.message ? `: ${donation.message}` : ''}`,
    timestamp: new Date(donation.timestamp)
  };
};

const NotificationCenter: React.FC = () => {
  const { errors, clearError } = useError();
  const { donations } = useWebSocket();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  // Convert errors to notifications
  useEffect(() => {
    if (errors.length > 0) {
      const newNotifications = errors.map(convertErrorToNotification);
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  }, [errors]);

  // Convert donations to notifications
  useEffect(() => {
    if (donations.length > 0) {
      // Get the latest donation (last in the array)
      const latestDonation = donations[donations.length - 1];
      const donationNotification = convertDonationToNotification(latestDonation);
      
      // Add to notifications (at the beginning of the list)
      setNotifications(prev => [donationNotification, ...prev]);
    }
  }, [donations]);

  const dismissNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
    // Also clear from error context if it was an error
    if (index < errors.length) {
      clearError(index);
    }
  };

  return (
    <div className="notification-center">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => dismissNotification(index)}
        />
      ))}
      <style jsx>{`
        .notification-center {
          position: fixed;
          top: var(--spacing-xl);
          right: var(--spacing-xl);
          z-index: var(--z-tooltip);
          max-width: 350px;
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .notification-center {
            left: var(--spacing-md);
            right: var(--spacing-md);
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;