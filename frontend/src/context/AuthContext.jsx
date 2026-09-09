import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosInstance.js';

const DEMO_ADMIN = {
  _id: 'usr_admin_101',
  name: 'Maya Patel',
  email: 'maya.patel@fleetops.io',
  role: 'admin',
  phone: '+1 (555) 019-2834',
  status: 'active',
};

const DEMO_DRIVER = {
  _id: 'usr_drv_201',
  name: 'Aleks Novak',
  email: 'aleks.novak@fleetops.io',
  role: 'driver',
  phone: '+1 (555) 012-9847',
  status: 'active',
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fleetops_user');
    return saved ? JSON.parse(saved) : DEMO_ADMIN;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        if (res.data && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('fleetops_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        // Fallback to local user
      }
    };
    checkAuth();
  }, []);

  const login = async (email, role = 'admin') => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('fleetops_user', JSON.stringify(res.data.user));
        setLoading(false);
        return;
      }
    } catch (err) {
      // Backend not running yet — fallback demo login
    }
    const loggedUser = email.toLowerCase().includes('driver') || role === 'driver'
      ? DEMO_DRIVER
      : DEMO_ADMIN;
    setUser(loggedUser);
    localStorage.setItem('fleetops_user', JSON.stringify(loggedUser));
    setLoading(false);
  };

  const loginAsDemoAdmin = () => {
    setUser(DEMO_ADMIN);
    localStorage.setItem('fleetops_user', JSON.stringify(DEMO_ADMIN));
  };

  const loginAsDemoDriver = () => {
    setUser(DEMO_DRIVER);
    localStorage.setItem('fleetops_user', JSON.stringify(DEMO_DRIVER));
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      // Ignore network errors for mock logout
    }
    setUser(null);
    localStorage.removeItem('fleetops_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemoAdmin, loginAsDemoDriver, logout }}>
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
