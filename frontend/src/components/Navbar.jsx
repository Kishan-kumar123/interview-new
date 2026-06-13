/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { 
  Terminal, 
  Flame, 
  Award, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Cpu, 
  FileCheck, 
  BookOpen, 
  ShieldAlert, 
  Trophy,
  Sparkles,
  Check
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, updateUserObj } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsDropdownOpen, setStatsDropdownOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClaimStreak = async () => {
    if (claiming) return;
    setClaiming(true);
    setClaimMessage(null);
    try {
      const res = await api.claimStreakBonus();
      if (res.success) {
        updateUserObj(res.user);
        setClaimMessage("Claimed Day Streak! 🎉 (+15 XP)");
        setTimeout(() => setClaimMessage(null), 5000);
      }
    } catch (err) {
      setClaimMessage(err.message || "Streak already claimed today!");
      setTimeout(() => setClaimMessage(null), 4000);
    } finally {
      setClaiming(false);
    }
  };

  const navLinks = [
    { name: 'Practice', path: '/practice', icon: Terminal },
    { name: 'Mock Interview', path: '/mock-interview', icon: Cpu },
    { name: 'Aptitude Tests', path: '/aptitude', icon: BookOpen },
    { name: 'Resume Analyzer', path: '/resume', icon: FileCheck },
    { name: 'Contest & Hacks', path: '/contests', icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg shadow-lg">
                <Terminal className="h-5 w-5 text-slate-900 stroke-[2.5]" />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                InterviewAce
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1 lg:space-x-3">
              {user && navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-slate-800/80 text-amber-500 border border-slate-700/50'
                        : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* User stats with interactive daily claim dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setStatsDropdownOpen(!statsDropdownOpen)}
                    className="flex items-center space-x-3 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all hover:bg-slate-850"
                  >
                    {/* Streak */}
                    <div className="flex items-center space-x-1 text-orange-500" title="Daily solved streak">
                      <Flame className="h-4 w-4 fill-orange-500 animate-pulse" />
                      <span>{user.streak || 1}d</span>
                    </div>
                    {/* XP */}
                    <div className="flex items-center space-x-1 text-amber-500" title="XP Points earned">
                      <Award className="h-4 w-4" />
                      <span>{user.xpPoints || 50} XP</span>
                    </div>
                  </button>

                  {statsDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-76 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 text-slate-100 animate-fade-in space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Dynamic Stats Engine</span>
                        <button onClick={() => setStatsDropdownOpen(false)} className="text-slate-500 hover:text-white p-0.5 rounded cursor-pointer">
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500 border border-orange-500/20">
                            <Flame className="h-4.5 w-4.5 fill-orange-500" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white">{user.streak || 1} Day Streak</span>
                            <span className="block text-[9px] text-slate-500">1 practice/day goal</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs font-bold text-amber-400">{user.xpPoints || 50} XP</span>
                        </div>
                      </div>

                      {claimMessage && (
                        <div className="bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 p-2.5 rounded-lg text-[10px] font-medium text-center font-mono leading-normal">
                          {claimMessage}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleClaimStreak}
                        disabled={claiming}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-bold hover:from-orange-400 hover:to-amber-400 transition-all cursor-pointer shadow flex items-center justify-center space-x-1.5 disabled:opacity-40"
                      >
                        {claiming ? (
                          <span className="text-[10px]">Processing claim...</span>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Claim Streak Reward (+15 XP)</span>
                          </>
                        )}
                      </button>

                      <p className="text-[9px] text-slate-600 text-center leading-normal">
                        Streaks update automatically on database sync. Solve challenges to earn daily credentials.
                      </p>
                    </div>
                  )}
                </div>

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-amber-500' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Admin Access Panel option */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900/30 transition-all`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Admin Control</span>
                  </Link>
                )}

                <div className="h-4 w-px bg-slate-800" />

                {/* User avatar and log out */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-800 h-8 w-8 rounded-full flex items-center justify-center border border-slate-700 overflow-hidden">
                      {user.profileImage ? (
                        <img referrerPolicy="no-referrer" src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium truncate max-w-[100px] text-slate-300">
                      {user.name.split(' ')[0]}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-amber-500 transition-all cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 hover:from-amber-400 hover:to-orange-500 rounded-lg shadow-md font-semibold transition-all scale-100 hover:scale-102"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-2 py-1 rounded-full text-xs">
                <span className="flex items-center space-x-0.5 text-orange-500">
                  <Flame className="h-3.5 w-3.5 fill-orange-500" />
                  <span>{user.streak || 1}d</span>
                </span>
                <span className="flex items-center space-x-0.5 text-amber-500">
                  <Award className="h-3.5 w-3.5" />
                  <span>{user.xpPoints} XP</span>
                </span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                Navigations
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-amber-500"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-amber-500"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-950/20"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Admin Control Panel</span>
                </Link>
              )}

              <div className="border-t border-slate-800 my-2 pt-2" />
              <div className="px-3 text-sm text-slate-400 mb-2 truncate">Logged in as {user.name}</div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-950/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 p-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 rounded-md font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
