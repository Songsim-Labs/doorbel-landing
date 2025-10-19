'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { wsClient } from '@/lib/websocket-client';
import { useAuth } from './AuthContext';

type EventCallback = (...args: unknown[]) => void;

interface WebSocketContextType {
  isConnected: boolean;
  on: (event: string, callback: EventCallback) => void;
  off: (event: string, callback?: EventCallback) => void;
  emit: (event: string, ...args: unknown[]) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      const socket = wsClient.connect();
      
      socket.on('connect', () => {
        setIsConnected(true);
      });
      
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
      
      return () => {
        wsClient.disconnect();
        setIsConnected(false);
      };
    }
  }, [isAuthenticated]);
  
  const on = (event: string, callback: EventCallback) => {
    wsClient.on(event, callback);
  };
  
  const off = (event: string, callback?: EventCallback) => {
    wsClient.off(event, callback);
  };
  
  const emit = (event: string, ...args: unknown[]) => {
    wsClient.emit(event, ...args);
  };
  
  return (
    <WebSocketContext.Provider value={{ isConnected, on, off, emit }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

