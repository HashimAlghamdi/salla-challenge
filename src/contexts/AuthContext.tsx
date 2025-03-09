'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { authService } from '@/services/auth.service';
import { setAuthToken, getAuthToken, removeAuthToken } from '@/app/utils/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { fetchCart, resetCart } = useCart();

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });

    // Set token in both localStorage and cookies
    setAuthToken(data.token);
    setIsLoggedIn(true);

    // Fetch cart after successful login
    await fetchCart();
  };

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    resetCart();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
