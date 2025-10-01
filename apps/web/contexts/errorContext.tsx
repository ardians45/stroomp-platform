'use client';

// contexts/errorContext.tsx

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { StroompError } from '../utils/errorHandler';

interface ErrorContextType {
  errors: StroompError[];
  addError: (error: StroompError) => void;
  clearError: (index: number) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<StroompError[]>([]);

  const addError = (error: StroompError) => {
    setErrors(prev => [...prev, error]);
  };

  const clearError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  // Auto-clear errors after 10 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <ErrorContext.Provider value={{ errors, addError, clearError, clearAllErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};