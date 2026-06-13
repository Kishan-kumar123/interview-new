/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, HelpCircle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0f19] border-t border-slate-900 text-slate-400 py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1.5 rounded-md">
                <Terminal className="h-4 w-4 text-slate-900 stroke-[2.5]" />
              </div>
              <span className="font-sans font-bold text-base tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                InterviewAce
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              The premium, full-scale, AI-Powered software interview preparatory environment. Build coding intuition, train in timed logic tests, and hold stateful simulations with our AI Mock Coaching engine.
            </p>
            <div className="text-xs text-slate-600 font-mono">
              v1.2.0-stable | UTC 2026
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/practice" className="hover:text-amber-500 transition-colors">Coding Practice</Link></li>
              <li><Link to="/mock-interview" className="hover:text-amber-500 transition-colors">AI Mock Coaching</Link></li>
              <li><Link to="/aptitude" className="hover:text-amber-500 transition-colors">Aptitude MCQs</Link></li>
              <li><Link to="/resume" className="hover:text-amber-500 transition-colors">Resume ATS Score</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Security & Guidelines</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5">
                <Shield className="h-3 w-3 text-emerald-500" />
                <span className="text-slate-500">Node JS Sandbox Compiled</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Heart className="h-3 w-3 text-red-500" />
                <span className="text-slate-500">Gemini Powered Feedback</span>
              </li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-amber-500 transition-colors">Terms of Protocol</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Technical Partners</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Proudly leveraging the Google Gemini-3.5 models via the modern TypeScript `@google/genai` API SDK to parse solutions, reconstruct resumes, and conduct stateful interviews.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
          <p>© 2026 InterviewAce. All rights reserved. Crafted for Kishan Barnwal and global software engineers.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="flex items-center space-x-1">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Support Desk</span>
            </span>
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
