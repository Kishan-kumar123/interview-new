/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, role?: 'student' | 'admin') => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateBookmarks: (id: string, isBookmark: boolean) => Promise<void>;
  updateUserObj: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('interviewace_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const activeToken = localStorage.getItem('interviewace_token');
      if (activeToken) {
        setToken(activeToken);
        const data = await api.getProfile();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn("Unauthenticated or expired session structure:", e);
      localStorage.removeItem('interviewace_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('interviewace_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, role: 'student' | 'admin' = 'student'): Promise<User> => {
    setLoading(true);
    try {
      // Using email as placeholder password on simple platform initialization or standard default password "password" 
      const data = await api.register({ name, email, password: "password", role });
      localStorage.setItem('interviewace_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('interviewace_token');
    setToken(null);
    setUser(null);
  };

  const updateBookmarks = async (id: string, isBookmark: boolean) => {
    if (!user) return;
    try {
      const payload = isBookmark ? { bookmarkedQuestionId: id } : { removeBookmarkId: id };
      const res = await api.updateProfile(payload);
      setUser(res.user);
    } catch (err) {
      console.error("Bookmark update failed:", err);
    }
  };

  const updateUserObj = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      token,
      login,
      register,
      logout,
      refreshUser,
      updateBookmarks,
      updateUserObj
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be styled within an AuthProvider stack wrapper');
  }
  return context;
};
export type UserObject = User;
