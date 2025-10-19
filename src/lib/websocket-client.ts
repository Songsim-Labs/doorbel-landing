import { io, Socket } from 'socket.io-client';
import { config } from './config';
import Cookies from 'js-cookie';

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }
    
    const token = Cookies.get('adminAccessToken');
    
    this.socket = io(config.wsUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
    });
    
    this.setupEventListeners();
    
    return this.socket;
  }
  
  private setupEventListeners() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Join admin room for admin-specific events
      this.socket?.emit('join_room', 'admin');
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });
    
    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ WebSocket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  // Listen to specific events
  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on(event, callback);
  }
  
  // Remove event listener
  off(event: string, callback?: (...args: unknown[]) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }
  
  // Emit events
  emit(event: string, ...args: unknown[]) {
    this.socket?.emit(event, ...args);
  }
  
  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WebSocketClient();

