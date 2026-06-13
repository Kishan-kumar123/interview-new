/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Terminal, 
  Cpu, 
  BookOpen, 
  FileCheck, 
  Trophy, 
  ChevronRight, 
  Flame, 
  ArrowRight,
  ShieldCheck, 
  Zap,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: Terminal,
      title: 'Sleek Code Playground',
      description: 'An expansive algorithmic workspace similar to LeetCode with support for multiple languages, runtime output evaluation, and complexity analytics.',
      color: 'from-amber-500 to-orange-500',
      action: '/practice'
    },
    {
      icon: Cpu,
      title: 'Stateful AI Interivewer',
      description: 'Engage with our responsive conversational simulation trained to conduct technical, system design, HR, and behavioral engineering interviews.',
      color: 'from-blue-500 to-indigo-500',
      action: '/mock-interview'
    },
    {
      icon: BookOpen,
      title: 'Timed Aptitude Quizzes',
      description: 'Dozens of handcoded logical reasoning, time & work, quantitative math, and permutation MCQs with instant step-by-step solutions.',
      color: 'from-emerald-500 to-teal-500',
      action: '/aptitude'
    },
    {
      icon: FileCheck,
      title: 'ATS Resume Auditor',
      description: 'Paste your details to obtain instant ATS scores, keywords gaps reports, and explicit corrective recommendations compiled by recruiter models.',
      color: 'from-pink-500 to-rose-500',
      action: '/resume'
    },
    {
      icon: Trophy,
      title: 'Contests & Hackathons',
      description: 'Participate in team-based collaborative hackathons and weekly algorithmic speedruns. Secure certificates and global rankings.',
      color: 'from-purple-500 to-violet-500',
      action: '/contests'
    },
    {
      icon: Briefcase,
      title: 'Top-Tier Company Prep',
      description: 'Browse interactive interview questions and FAQs explicitly mapped to tech employers like Google, Amazon, Microsoft, and Walmart.',
      color: 'from-sky-500 to-cyan-500',
      action: '/practice'
    }
  ];

  const stats = [
    { value: "48,202+", label: "Total Challenges Solved" },
    { value: "14,350+", label: "AI Mock Sessions Completed" },
    { value: "1,240+", label: "Daily Active Students" },
    { value: "98.7%", label: "ATS Improvement Index" }
  ];

  const testimonials = [
    {
      quote: "InterviewAce helped me structure my behavioral answers. The real-time comments on my JavaScript execution made standard dry mock-runs obsolete.",
      author: "Aditya Verma",
      role: "Software Engineer, Google",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    },
    {
      quote: "The timed aptitude suite and company specific filters are incredibly comprehensive. I went from 60% standard confidence to multiple offers.",
      author: "Sneha Reddy",
      role: "Associate Architect, Microsoft",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
    }
  ];

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 border-b border-slate-900/40">
        {/* Background mesh glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-8 animate-fade-in text-xs font-semibold hover:border-amber-500/30 transition-all cursor-default text-amber-500/90">
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span>AI-Driven Software Interview Companion Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto">
            Crack Your Dream Job with <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Adaptive AI Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The multi-module simulator covering coding compiling sandboxes, dynamic aptitude timers, company interview trackers, and stateful AI-guided conversational mock interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-orange-500 hover:shadow-lg rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border border-amber-300/10 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to={user ? "/mock-interview" : "/login"}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:text-white rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>Try Mock Interview</span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-6 text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Full-Stack Auth Verified</span>
            </span>
            <span className="h-3 w-px bg-slate-800" />
            <span className="flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Real-Time Code Validation</span>
            </span>
          </div>
        </div>
      </section>

      {/* Stats Block */}
      <section className="bg-slate-950 py-12 border-y border-slate-900 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Structured Professional Preparation Pathways
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need in a single integrated development hub. Zero fragmented browser tabs, 100% active evaluation modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/60 transition-all flex flex-col h-full hover:shadow-lg relative group overflow-hidden"
              >
                {/* Accent gradient line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity from-amber-500 to-orange-500" />

                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feat.color} bg-opacity-10 text-white shadow-inner`}>
                    <Icon className="h-5 w-5 text-slate-200" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 leading-tight group-hover:text-amber-400 transition-colors">
                    {feat.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-grow">
                  {feat.description}
                </p>

                <div className="pt-4 border-t border-slate-800/40 mt-auto flex items-center justify-between">
                  <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors font-medium">Learn more</span>
                  <Link 
                    to={user ? feat.action : "/login"}
                    className="p-1 px-2.5 bg-slate-800 text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 font-semibold rounded-md transition-all text-xs flex items-center space-x-1"
                  >
                    <span>Launch</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-950/60 py-24 border-t border-slate-900 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Validated by Successful Engineers
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Discover how developers used InterviewAce to transform technical capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl shadow-sm flex flex-col justify-between"
              >
                <p className="text-xs.sm text-slate-300 italic leading-relaxed mb-6">
                  "{test.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <img referrerPolicy="no-referrer" src={test.image} alt={test.author} className="h-10 w-10 rounded-full border border-slate-800 object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{test.author}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
