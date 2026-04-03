"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  email_verified: boolean;
  title?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  promptLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      console.warn('Unauthorized access detected. Logging out.');
      if (token || user) {
        toast.error('Session expired. Please login again.');
        // Optionally trigger promptLogin after a brief delay
        setTimeout(() => {
           if (typeof window !== 'undefined' && (window as any).openAuthModal) {
             (window as any).openAuthModal();
           }
        }, 800);
      }
      logout();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth_unauthorized', handleUnauthorized);
      return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
    }
  }, []);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((currentUser) => {
      if (currentUser) {
        // Only update if there are actual changes to prevent unnecessary re-renders
        const hasChanges = Object.keys(updatedUser).some(
          (key) => currentUser[key as keyof User] !== updatedUser[key as keyof User]
        );

        if (!hasChanges) {
          return currentUser;
        }

        const newUser = { ...currentUser, ...updatedUser };
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(newUser));
        }
        return newUser;
      }
      return currentUser;
    });
  }, []);

  const promptLogin = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).openAuthModal) {
      (window as any).openAuthModal();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
        promptLogin,
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

