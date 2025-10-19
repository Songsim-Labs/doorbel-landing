'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api-client';
import { AdminUser, LoginRequest } from '@/types/admin';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const isAuthenticated = !!user;
  
  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = Cookies.get('adminAccessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const response = await apiClient.getProfile();
      if (response.success && response.data.type === 'admin') {
        setUser(response.data);
      } else {
        // Not an admin, clear tokens
        Cookies.remove('adminAccessToken');
        Cookies.remove('adminRefreshToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('adminAccessToken');
      Cookies.remove('adminRefreshToken');
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (credentials: LoginRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await apiClient.login(credentials);
      
      if (response.success) {
        const { user, tokens } = response.data;
        
        // Store tokens in cookies
        Cookies.set('adminAccessToken', tokens.accessToken, {
          expires: new Date(tokens.accessTokenExpiresAt),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        
        Cookies.set('adminRefreshToken', tokens.refreshToken, {
          expires: new Date(tokens.refreshTokenExpiresAt),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        
        setUser(user);
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    Cookies.remove('adminAccessToken');
    Cookies.remove('adminRefreshToken');
    setUser(null);
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

