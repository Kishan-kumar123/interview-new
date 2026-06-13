/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('interviewace_token'));
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

  const login = async (email, password) => {
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

  const register = async (name, email, role = 'student') => {
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

  const updateBookmarks = async (id, isBookmark) => {
    if (!user) return;
    try {
      const payload = isBookmark ? { bookmarkedQuestionId: id } : { removeBookmarkId: id };
      const res = await api.updateProfile(payload);
      setUser(res.user);
    } catch (err) {
      console.error("Bookmark update failed:", err);
    }
  };

  const updateUserObj = (updatedUser) => {
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
