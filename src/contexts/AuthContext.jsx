import React, { createContext, useContext, useState, useEffect } from 'react';
import { userDB } from '../utils/indexedDB';
import { mockAPI } from '../api/stubs';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      
      if (token && userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Try local authentication first (offline support)
      const users = await userDB.getAll();
      const localUser = users.find(
        u => u.username === username && u.password === password
      );

      if (localUser) {
        const userData = {
          id: localUser.id,
          username: localUser.username,
          role: localUser.role,
          name: localUser.name,
        };
        
        const token = `local_token_${localUser.id}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }

      // If online, try API authentication
      if (navigator.onLine) {
        const response = await mockAPI.login(username, password);
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          return { success: true };
        }
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
