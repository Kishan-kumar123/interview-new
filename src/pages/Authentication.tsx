/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { ShieldCheck, Mail, Lock, User, Terminal, ArrowRight, Sparkles } from 'lucide-react';

export const Authentication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const isRegisterPage = location.pathname === '/register';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // password
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password || (isRegisterPage && !name)) {
      setError('Please fill in all required inputs.');
      setLoading(false);
      return;
    }

    try {
      if (isRegisterPage) {
        await register(name, email, role);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authorization failed. Please double check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background radial blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl relative z-10 select-none">
        
        {/* Header Icon & Title */}
        <div className="text-center">
          <div className="inline-flex bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-2xl shadow-inner mb-4">
            <Terminal className="h-6 w-6 text-slate-900 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {isRegisterPage ? 'Create your Account' : 'Sign in to Platform'}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            {isRegisterPage 
              ? 'Join InterviewAce to start coding, compiling, and testing.' 
              : 'Unlock stateful mock simulations and visual dashboards.'}
          </p>
        </div>

        {/* Error notification block */}
        {error && (
          <div className="bg-red-950/40 border border-red-800/80 text-red-300 p-3.5 rounded-xl text-xs flex items-center space-x-2">
            <div className="h-1.5 w-1.5 bg-red-500 rounded-full shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isRegisterPage && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Security Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {isRegisterPage && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                      role === 'student'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Student Applicant
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                      role === 'admin'
                        ? 'bg-red-500/10 border-red-500 text-red-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Platform Admin
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer scale-100 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isRegisterPage ? 'Complete Sign Up' : 'Authenticate Session'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 text-center mt-6">
          <p className="text-xs text-slate-400">
            {isRegisterPage ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-amber-500 hover:underline font-semibold">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                First time on the platform?{' '}
                <Link to="/register" className="text-amber-500 hover:underline font-semibold">
                  Register Now
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Informational guide */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 mt-4 text-[10px] text-slate-500 leading-relaxed">
          <div className="flex items-center space-x-1 mb-1 font-semibold text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Developer Sandbox credentials:</span>
          </div>
          • Admin: <span className="text-slate-300 font-mono">admin@interviewace.com</span> (passwd: admin)<br />
          • Student: <span className="text-slate-300 font-mono">student@interviewace.com</span> (passwd: student)
        </div>

      </div>
    </div>
  );
};
