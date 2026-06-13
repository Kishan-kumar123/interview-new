/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Contest, Hackathon } from '../types';
import { useAuth } from '../components/AuthContext';
import { 
  Trophy, 
  Clock, 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Code,
  Sparkles,
  Zap,
  Check,
  RotateCcw,
  BookOpen,
  Terminal,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hackathons: React.FC = () => {
  const { user, updateUserObj } = useAuth();
  const navigate = useNavigate();

  const [contests, setContests] = useState<Contest[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'arena' | 'leaderboard'>('arena');
  
  // Hackathon submissions and reports
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [submissionCode, setSubmissionCode] = useState('');
  const [reports, setReports] = useState<{ [key: string]: any }>({});
  
  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Load arena data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const cRes = await api.getContests();
        setContests(cRes.contests);

        const hRes = await api.getHackathons();
        setHackathons(hRes.hackathons);
      } catch (e) {
        console.error("Failed to load contests/hackathons catalogs:", e);
      }
    };
    loadData();
  }, [user, navigate]);

  // Load leaderboard when tab switches
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await api.getLeaderboard();
      setLeaderboard(res.leaderboard);
      if (res.currentUser) {
        updateUserObj(res.currentUser);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard data:", e);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleRegisterEvent = async (id: string, type: 'contest' | 'hackathon') => {
    try {
      const res = await api.registerHackathonEvent({ id, type });
      if (res.success) {
        setRegisteredEvents([...registeredEvents, id]);
        setFeedback({
          ...feedback,
          [id]: 'Successfully registered! Scroll below to access team deliverables.'
        });
        if (res.updatedUser) {
          updateUserObj(res.updatedUser);
        }
      }
    } catch (err: any) {
      setFeedback({
        ...feedback,
        [id]: err.message || 'Registration timeout. Please retry.'
      });
    }
  };

  // Handle live AI submissions
  const handleAISubmission = async (hackathonId: string) => {
    if (!submissionCode.trim()) {
      alert("Submission draft or spec script cannot be empty!");
      return;
    }
    setSubmittingId(hackathonId);
    try {
      const res = await api.submitHackathonAI({
        hackathonId,
        teamName: "Solo Ace Team",
        projectTitle: projectTitle || "Optimal Energy Grid System",
        submissionCode
      });
      if (res.success) {
        setReports({
          ...reports,
          [hackathonId]: res.report
        });
        setFeedback({
          ...feedback,
          [hackathonId]: "Milestone Graded Successfully! AI evaluation loaded. You earned +60 XP!"
        });
        if (res.user) {
          updateUserObj(res.user);
        }
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit project.");
    } finally {
      setSubmittingId(null);
    }
  };

  // Pre-configured contest problems that exist in our practice catalog
  const getContestProblems = (contestId: string) => {
    if (contestId === 'ct-1') {
      return [
        { id: 'two-sum', title: 'Two Sum Pairs', difficulty: 'Easy', points: 25 },
        { id: 'valid-parentheses', title: 'Valid Parentheses Stack', difficulty: 'Easy', points: 25 },
        { id: 'coin-change', title: 'Coin Change Optimizer', difficulty: 'Medium', points: 50 }
      ];
    }
    return [
      { id: 'two-sum', title: 'Matrix Pivot Search', difficulty: 'Easy', points: 25 },
      { id: 'coin-change', title: 'Path Compression Trees', difficulty: 'Medium', points: 50 }
    ];
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in text-slate-200">
        
        {/* Banner with Navigation Tab option */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
          
          <div className="space-y-1 relative z-10">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Interactive Contests & Leaderboards</h1>
            <p className="text-xs text-slate-400">Join elite global hackathons, complete active coding modules, and challenge live rankings.</p>
          </div>

          <div className="flex border border-slate-800 bg-slate-950 p-1.5 rounded-xl shrink-0 space-x-1">
            <button
              onClick={() => setActiveTab('arena')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'arena'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Arena Contests
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Leaderboard rankings
            </button>
          </div>
        </div>

        {activeTab === 'arena' ? (
          <>
            {/* Algorithmic Contests Tab */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-orange-500 fill-orange-550/10 animate-pulse" />
                  <span>Algorithmic Speedruns & Active Contests</span>
                </h2>
                <span className="text-[10px] font-mono font-medium text-slate-500">Live Server Updates</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((c) => {
                  const isRegistered = registeredEvents.includes(c.id);
                  const problems = getContestProblems(c.id);
                  return (
                    <div 
                      key={c.id} 
                      className={`bg-[#0f172a]/70 border transition-all rounded-2xl flex flex-col justify-between relative overflow-hidden ${
                        isRegistered ? 'border-purple-900 bg-[#0f172a]/90 shadow-xl' : 'border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      {isRegistered && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-800 to-amber-700 h-1 px-4 text-center font-bold text-[8px] uppercase tracking-wider text-white">
                          Active Contest Participant
                        </div>
                      )}

                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Contest Sprint</span>
                          <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                            {c.questionsCount || 3} Tasks
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-100">{c.title}</h3>
                        
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Solve dynamic programming trees, array subsets, and optimize execution boundaries. Maximize your score and leap up the leaderboard ranks.
                        </p>

                        <div className="space-y-2 text-[11px] text-slate-500 border-t border-slate-900 pt-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3.5 w-3.5 text-slate-500" />
                            <span>Duration: {c.durationMinutes || 90} Minutes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>Date: {c.startingAt || 'Weekly Sunday'}</span>
                          </div>
                        </div>

                        {/* Interactive dynamic section to OPEN IDE WORKSPACE */}
                        {isRegistered && (
                          <div className="border-t border-slate-850 pt-4 mt-4 space-y-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono flex items-center space-x-1">
                                <Code className="h-3 w-3" />
                                <span>Code Playground Tasks</span>
                              </span>
                              <span className="text-[9px] text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded uppercase">Ongoing</span>
                            </div>
                            <div className="space-y-1.5">
                              {problems.map((pb) => {
                                const isSolved = user?.solvedQuestionIds?.includes(pb.id);
                                return (
                                  <div key={pb.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-850 text-xs gap-2">
                                    <div className="flex items-center space-x-2 min-w-0">
                                      {isSolved ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                      ) : (
                                        <div className="h-3.5 w-3.5 border border-amber-500/30 rounded-full shrink-0 animate-pulse bg-amber-500/10" />
                                      )}
                                      <span className="truncate font-semibold text-slate-200">{pb.title}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0">
                                      <span className={`text-[9px] px-1 rounded font-mono ${
                                        pb.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-400/5' : 'text-amber-400 bg-amber-400/5'
                                      }`}>{pb.difficulty}</span>
                                      <button
                                        onClick={() => navigate(`/coding/${pb.id}`)}
                                        className="bg-purple-950 hover:bg-purple-900 text-[10px] px-2 py-1 rounded text-purple-300 font-bold cursor-pointer hover:scale-105 transition-all text-nowrap"
                                      >
                                        Code Practice &rarr;
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6 pt-2 border-t border-slate-900">
                        {feedback[c.id] && (
                          <span className="text-[10px] text-emerald-400 font-semibold block mb-3 leading-normal font-mono">{feedback[c.id]}</span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRegisterEvent(c.id, 'contest')}
                          disabled={isRegistered}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                            isRegistered 
                              ? 'bg-slate-950 border border-slate-850 text-slate-500' 
                              : 'bg-slate-800 hover:bg-purple-600 hover:text-white border border-slate-705 text-slate-300'
                          }`}
                        >
                          {isRegistered ? 'Enrolled - Active coding above' : 'Register Contest Slot'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collaborative Hackathons Tab */}
            <div className="space-y-6 pt-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Stateful Collaborative Hackathons</span>
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {hackathons.map((h) => {
                  const isRegistered = registeredEvents.includes(h.id);
                  const hasReport = !!reports[h.id];
                  return (
                    <div 
                      key={h.id} 
                      className={`bg-slate-900/10 border p-6 rounded-2xl flex flex-col gap-6 transition-all ${
                        isRegistered ? 'border-blue-900/60 bg-blue-950/5' : 'border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4 md:max-w-[70%]">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Team Hackathon</span>
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded select-none">
                              Prize Pool: {h.prizePool || '$1,500'}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-white">{h.title}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Develop functional optimization scripts or server endpoints, and submit them directly below. Our automated AI reviewer critiques your code syntax complexity and awards you 60 XP instantly!
                          </p>

                          <div className="flex space-x-4 text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                            <span className="flex items-center space-x-1.5">
                              <Users className="h-3.5 w-3.5 text-slate-500" />
                              <span>Registrations: {h.participantsCount || 42} candidates active</span>
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col justify-end md:items-end w-full md:w-auto">
                          {feedback[h.id] && !hasReport && (
                            <span className="text-[10px] text-emerald-400 font-semibold block mb-3 leading-normal text-left md:text-right max-w-sm">{feedback[h.id]}</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRegisterEvent(h.id, 'hackathon')}
                            disabled={isRegistered}
                            className={`w-full py-2.5 px-6 rounded-xl text-xs font-bold tracking-tight text-center transition-all cursor-pointer ${
                              isRegistered 
                                ? 'bg-slate-950 border border-indigo-950 text-indigo-400/80 font-mono tracking-wider' 
                                : 'bg-[#1e1b4b] hover:bg-blue-600 hover:text-white border border-blue-900/50 text-blue-400'
                            }`}
                          >
                            {isRegistered ? 'Enrolled - Submit below' : 'Join Hackathon'}
                          </button>
                        </div>
                      </div>

                      {/* Stateful Workspace & Submission Form */}
                      {isRegistered && (
                        <div className="border-t border-slate-850 pt-5 mt-2 space-y-4 animate-slide-up">
                          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-850 space-y-4">
                            <div className="flex items-center space-x-2 text-blue-400">
                              <Brain className="h-4.5 w-4.5" />
                              <h4 className="text-xs font-bold uppercase tracking-wider">AI Sandbox Deliverables Workspace</h4>
                            </div>

                            <p className="text-xs text-slate-400">
                              Paste your core deliverable code block or algorithm solution in the editor below. The AI Software Architect parses constraints, calculates metrics, and grades your project for immediate accreditation.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold text-slate-400">Project Prototype Title</label>
                                <input 
                                  value={projectTitle}
                                  onChange={(e) => setProjectTitle(e.target.value)}
                                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 outline-none focus:border-blue-700"
                                  placeholder="e.g. Smart Load Balancing Core Nodes"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold text-slate-400">Associated Team Code</label>
                                <input 
                                  disabled
                                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-xs text-slate-500 font-mono"
                                  value="Solo Ace Team (Active User)"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-slate-400">Deliverable Script / Code Prototype (JavaScript/TypeScript/Rust)</label>
                              <textarea
                                value={submissionCode}
                                onChange={(e) => setSubmissionCode(e.target.value)}
                                rows={8}
                                className="w-full bg-[#080d1a] border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 outline-none focus:border-blue-700 leading-normal"
                                placeholder={`export default function optimalBalancer(demands, capacities) {
  // Write or paste your candidate hackathon code here...
  let sum = 0;
  for (let i = 0; i < demands.length; i++) {
    sum += Math.max(0, demands[i] - capacities[i]);
  }
  return sum;
}`}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <button
                                onClick={() => {
                                  setProjectTitle('');
                                  setSubmissionCode('');
                                }}
                                className="flex items-center space-x-1.5 text-slate-500 hover:text-white text-xs transition"
                              >
                                <RotateCcw className="h-3 w-3" />
                                <span>Reset Workspace</span>
                              </button>
                              
                              <button
                                onClick={() => handleAISubmission(h.id)}
                                disabled={submittingId === h.id}
                                className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow disabled:opacity-40"
                              >
                                {submittingId === h.id ? (
                                  <span>Evaluating Code...</span>
                                ) : (
                                  <>
                                    <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                                    <span>Submit Code & Evaluate Demo</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Dynamic evaluation analysis report */}
                          {reports[h.id] && (
                            <div className="bg-slate-950 border border-blue-950 p-6 rounded-2xl space-y-4 animate-fade-in relative">
                              <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded-full px-3 py-1 font-mono font-bold text-xs flex items-center space-x-1">
                                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                                <span>Score: {reports[h.id].score}/100</span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold tracking-widest font-mono">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Milestone Certified</span>
                                </div>
                                <h4 className="text-sm font-extrabold text-white">Project: {reports[h.id].projectTitle}</h4>
                              </div>

                              <div className="text-xs text-slate-300 leading-relaxed font-normal bg-blue-950/20 p-3.5 rounded-xl border border-blue-900/30">
                                {reports[h.id].evaluation}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="bg-emerald-950/10 border border-emerald-950/30 p-4 rounded-xl space-y-2">
                                  <span className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">Architectural Strengths</span>
                                  <ul className="space-y-1.5">
                                    {(reports[h.id].strengths || []).map((s: string, idx: number) => (
                                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{s}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-amber-950/10 border border-amber-950/30 p-4 rounded-xl space-y-2">
                                  <span className="block text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">Areas For Optimization</span>
                                  <ul className="space-y-1.5">
                                    {(reports[h.id].improvements || []).map((im: string, idx: number) => (
                                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                                        <ArrowRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                        <span>{im}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Competitive Live Leaderboard Tab */
          <div className="bg-[#0f172a]/70 border border-slate-850 rounded-2xl p-6 sm:p-8 shadow-xl relative animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Trophy className="h-5.5 w-5.5 text-amber-400" />
                  <span>National Competitive Leaderboard</span>
                </h2>
                <p className="text-xs text-slate-400">Live candidate rankings of InterviewAce candidates sorted by points.</p>
              </div>

              <button
                type="button"
                onClick={fetchLeaderboard}
                disabled={loadingLeaderboard}
                className="bg-slate-900 border border-slate-800 text-xs px-4 py-2 font-semibold hover:border-slate-700 transition rounded-xl text-slate-300 flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span>Synchronize Board</span>
              </button>
            </div>

            {loadingLeaderboard ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-mono font-bold uppercase tracking-wider">Retrieving cloud rankings database...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase text-[10px] tracking-wider font-mono">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate Code Name</th>
                      <th className="py-3 px-4 text-center">Active Streak</th>
                      <th className="py-3 px-4">Badges & Credentials</th>
                      <th className="py-3 px-4 text-right">Aptitude</th>
                      <th className="py-3 px-4 text-right">Interview</th>
                      <th className="py-3 px-4 text-right">Global XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 font-normal">
                    {leaderboard.map((player) => {
                      const isMe = player.id === user?.id;
                      return (
                        <tr 
                          key={player.id}
                          className={`hover:bg-slate-900/30 transition-all ${
                            isMe ? 'bg-amber-500/5 text-amber-300 font-bold border-l-2 border-l-amber-500 ring-1 ring-amber-550/10' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-extrabold">
                            {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              {player.profileImage ? (
                                <img 
                                  src={player.profileImage} 
                                  referrerPolicy="no-referrer"
                                  className="h-7 w-7 rounded-full border border-slate-850 object-cover" 
                                  alt="avatar"
                                />
                              ) : (
                                <div className="h-7 w-7 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-400 uppercase text-[10px] border border-slate-700">
                                  {player.name ? player.name[0] : 'U'}
                                </div>
                              )}
                              <div>
                                <span className="block font-medium text-white text-xs">{player.name}</span>
                                <span className="block text-[9px] text-slate-500">{player.email || 'Interview candidate'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center space-x-1 text-orange-500 bg-orange-550/5 border border-orange-550/10 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                              <Flame className="h-3 w-3 fill-orange-500 shrink-0" />
                              <span>{player.streak || 1}d streak</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(player.badges || ["Fast Starter"]).map((b: string, index: number) => (
                                <span 
                                  key={index} 
                                  className="text-[9px] font-bold text-slate-400 bg-slate-850 border border-slate-800 px-2 py-0.5 rounded-md"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                            {player.aptitudeScore || 75}%
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                            {player.interviewScore || 80}%
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono">
                            <span className="font-extrabold text-amber-400">{player.xpPoints || 50} XP</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl leading-relaxed text-slate-500 text-[10px] text-center">
              Streaks and ranks solve positions are evaluated across candidates hourly. Compile code and clear speedrun tasks to guarantee your rank ascent.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export type HackathonsType = any;
