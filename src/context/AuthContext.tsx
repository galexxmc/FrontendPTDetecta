// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

import type { User, LoginRequest, RegisterRequest } from '../types';
import * as authService from '../services/authService';

// 1. DEFINE THE JWT PAYLOAD STRUCTURE (Type Safety)
interface JwtPayload {
  email: string;
  nombre_completo: string;
  role: string;
  exp?: number; // Expiration time (optional standard claim)
  iat?: number; // Issued at (optional standard claim)
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const processToken = useCallback((token: string) => {
    try {
      // 2. USE THE INTERFACE INSTEAD OF 'any'
      const decoded = jwtDecode<JwtPayload>(token);
      
      const userData: User = {
        email: decoded.email,
        nombreCompleto: decoded.nombre_completo,
        rol: decoded.role || 'User'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      authService.setSession(token);
    } catch (error) {
      console.error("Token inválido", error);
      authService.removeSession();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      if (token) {
        processToken(token);
      }
      setIsLoading(false);
    };
    initAuth();
  }, [processToken]);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    processToken(response.token);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    processToken(response.token);
  };

  const logout = () => {
    authService.removeSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};