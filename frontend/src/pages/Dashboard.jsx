/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link, Link as RouterLink, useNavigate as useRouterNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { api } from '../services/api';
import { 
  Trophy, 
  Flame, 
  Terminal, 
  BookOpen, 
  Cpu, 
  Award, 
  Star, 
  CheckCircle,
  Clock, 
  ChevronRight, 
  Bookmark,
  ExternalLink,
  Sparkles,
  AwardIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Dashboard = () => {
  const { user, updateUserObj, updateBookmarks } = useAuth();
  const navigate = useRouterNavigate();
  const [questions, setQuestions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [editingImage, setEditingImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Dynamic profile customization states
  const [editingProfile, setEditingProfile] = useState(false);
  const [targetRoleInput, setTargetRoleInput] = useState(user?.targetRole || 'Full-Stack Web Architect');
  const [skillsInput, setSkillsInput] = useState((user?.preferredSkills || ['React', 'TypeScript', 'Node.js', 'System Design']).join(', '));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const qRes = await api.getCodingQuestions();
        setQuestions(qRes.questions);

        // Fetch latest profile to ensure numbers are fully synchronized
        const profile = await api.getProfile();
        if (profile.user) {
          updateUserObj(profile.user);
          if (profile.user.targetRole) setTargetRoleInput(profile.user.targetRole);
          if (profile.user.preferredSkills) {
            setSkillsInput(profile.user.preferredSkills.join(', '));
          }
        }
      } catch (e) {
        console.error("Dashboard metadata sync failure:", e);
      }
    };
    loadData();
  }, [user, navigate]);

  if (!user) return null;

  // Compute game-style dynamic leveling math
  const xp = user.xpPoints || 50;
  const userLevel = Math.floor(xp / 100) + 1;
  const currentLevelXP = xp % 100;
  const levels = ["Novice Software Engineer", "Advanced Problem Solver", "Algorithmic Specialist", "Trophy Grandmaster"];
  const rankTitle = levels[Math.min(userLevel - 1, levels.length - 1)];

  // Derive metrics
  const solvedCount = user.solvedQuestionIds?.length || 0;
  const totalQuestionsCount = questions.length || 4;
  const solvePercentage = Math.round((solvedCount / totalQuestionsCount) * 100);

  // Recommended questions (not solved yet)
  const recommendedQuestions = questions
    .filter(q => !user.solvedQuestionIds?.includes(q.id))
    .slice(0, 3);

  // Bookmarked questions
  const bookmarkedQuestions = questions.filter(q => user.bookmarkedQuestionIds?.includes(q.id));

  // Handle avatar URL updating with preset quick-selects
  const handleUpdateAvatarPreset = async (url) => {
    try {
      setProfileImage(url);
      const res = await api.updateProfile({ profileImage: url });
      updateUserObj(res.user);
      setFeedbackMsg('Visual avatar changed successfully!');
      setTimeout(() => setFeedbackMsg(''), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile({ profileImage });
      updateUserObj(res.user);
      setEditingImage(false);
      setFeedbackMsg('Custom avatar updated successfully!');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfileCustoms = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.updateProfile({
        targetRole: targetRoleInput,
        preferredSkills: skillsArray
      });
      updateUserObj(res.user);
      setEditingProfile(false);
      setFeedbackMsg('Career specs customized successfully!');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const removeBookmark = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    await updateBookmarks(id, false);
  };

  // Preset professional avatar options from Unsplash
  const presetAvatars = [
    { title: "Alex (Tech Coder)", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=facearea&facepad=2" },
    { title: "Emily (Engineering Lead)", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=facearea&facepad=2" },
    { title: "Raj (Solutions Architect)", url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=facearea&facepad=2" },
    { title: "Sophia (Data Analyst)", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=facearea&facepad=2" }
  ];

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-amber-500/5 blur-[50px] rounded-full" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-5 space-y-3 sm:space-y-0 relative z-10 w-full md:w-auto">
            {/* Avatar block with custom image overlay indicator */}
            <div className="relative group shrink-0">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 h-20 w-20 rounded-2xl p-[1.5px] flex items-center justify-center overflow-hidden shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[14px] overflow-hidden flex items-center justify-center">
                  {user.profileImage ? (
                    <img referrerPolicy="no-referrer" src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-white">{user.name.charAt(0)}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingImage(!editingImage);
                  setEditingProfile(false);
                }}
                className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-800 text-[9px] text-amber-500 px-2 py-0.5 rounded-md hover:bg-slate-850 hover:text-white cursor-pointer select-none font-bold shadow-md transition-all"
              >
                Avatar
              </button>
            </div>

            <div className="space-y-1.5 flex-grow">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">Welcome Back, {user.name}!</h1>
                <span className="text-[9px] bg-amber-500/15 border border-amber-500/25 text-amber-500 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Level {userLevel} Scholar
                </span>
              </div>
              
              {/* Dynamic Role and Skill tags representation */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">&bull;</span>
                  <span>{user.targetRole || 'Full-Stack Web Architect'}</span>
                  <button 
                    onClick={() => {
                      setEditingProfile(!editingProfile);
                      setEditingImage(false);
                    }}
                    className="text-[9px] text-slate-500 hover:text-amber-500 underline cursor-pointer"
                  >
                    Customize Specs
                  </button>
                </p>
                
                {/* Dynamically renders saved preferred skills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(user.preferredSkills || ['React', 'TypeScript', 'Node.js', 'System Design']).map((sk, index) => (
                    <span key={index} className="text-[9px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {feedbackMsg && <span className="text-[10px] text-emerald-400 mt-1 block font-mono font-medium leading-none animate-bounce">{feedbackMsg}</span>}
            </div>
          </div>

          <div className="flex items-center space-x-4 shrink-0 bg-slate-950 p-3.5 rounded-xl border border-slate-850 w-full md:w-auto justify-around">
            <div className="text-center px-3 border-r border-slate-900">
              <span className="block text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Streak</span>
              <span className="flex items-center justify-center text-lg font-bold text-orange-500 select-none">
                <Flame className="h-5 w-5 fill-orange-500 mr-1 animate-pulse" />
                {user.streak || 1}d
              </span>
            </div>
            <div className="text-center px-4 border-r border-slate-900">
              <span className="block text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Solving Rank</span>
              <span className="block text-lg font-extrabold text-white">#{user.rank || 24}</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Experience</span>
              <span className="block text-lg font-extrabold text-amber-500 select-none">{user.xpPoints || 50} XP</span>
            </div>
          </div>
        </div>

        {/* Profile Avatar Selection Block */}
        {editingImage && (
          <div className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h3 className="text-xs font-bold text-slate-200">Customize Platform Avatar</h3>
              <button onClick={() => setEditingImage(false)} className="text-xs text-slate-500 hover:text-white cursor-pointer">Close</button>
            </div>

            {/* Selection Grid for presets */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Option 1: Quick Preset Click Selection</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presetAvatars.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUpdateAvatarPreset(av.url)}
                    className="group bg-[#0b0f19] border border-slate-800 p-2 rounded-xl flex items-center space-x-2.5 hover:border-amber-500 transition-all text-left cursor-pointer"
                  >
                    <img referrerPolicy="no-referrer" src={av.url} alt="preset" className="h-7 w-7 rounded-full object-cover shrink-0 border border-slate-700 group-hover:scale-105 transition-all" />
                    <span className="text-[9px] font-bold text-slate-300 truncate">{av.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleUpdateAvatar} className="space-y-2 pt-2 border-t border-slate-900">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Option 2: Paste Custom URL</span>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/your-custom-image-address"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="flex-grow bg-[#0b0f19] border border-slate-800 text-xs text-white p-2.5 rounded-lg outline-none focus:border-amber-500"
                />
                <button type="submit" className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-amber-400 cursor-pointer transition">
                  Save Custom
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile Attributes Customization Panel */}
        {editingProfile && (
          <form onSubmit={handleUpdateProfileCustoms} className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h3 className="text-xs font-bold text-slate-200">Customize Career Preferences</h3>
              <button type="button" onClick={() => setEditingProfile(false)} className="text-xs text-slate-500 hover:text-white cursor-pointer">Close</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Target Job / Role Representation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Machine Learning Engineer"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 text-xs text-white p-2.5 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Core Skill Set (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. PyTorch, Kubernetes, Go, CUDA"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 text-xs text-white p-2.5 rounded-lg outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 px-5 text-xs font-bold rounded-lg cursor-pointer transition shadow"
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}

        {/* Game-inspired Gamer Master Progress Bar Card */}
        <div className="bg-slate-900/20 border border-slate-850 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 blur-3xl rounded-full" />
          <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1 relative z-10">
            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Platform Master Level</span>
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-1">
                <span>Tier {userLevel}: {rankTitle}</span>
                <span className="text-xs text-amber-500 font-mono">({xp} Total XP)</span>
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">{100 - currentLevelXP} XP remaining to Level {userLevel + 1}</span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full border border-slate-900 overflow-hidden p-[1px]">
            <div 
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 relative" 
              style={{ width: `${currentLevelXP}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-xs rounded-full animate-pulse" />
            </div>
          </div>

          <p className="text-[9.5px] text-slate-500 font-medium">
            💡 <span className="text-slate-400 font-bold">How to earn extra XP & Rank tiers:</span> Solve easy algorithmic tasks (+25 XP), medium problems (+50 XP), claim your consecutive daily active bonuses of +15 XP in the header popover, or construct and submit full project prototypes under Hackathons (+60 XP). Let's climb the leaderboard!
          </p>
        </div>

        {/* Statistics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Coding Progress */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Coding Practice</h3>
              <Terminal className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{solvedCount}</span>
              <span className="text-xs text-slate-500">/ {totalQuestionsCount} Solved</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                <span>Completion</span>
                <span>{solvePercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${solvePercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Aptitude Stats */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aptitude Score</h3>
              <BookOpen className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{user.aptitudeScore || 0}%</span>
              <span className="text-xs text-slate-500">Average Performance</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                <span>Goal: 80% Certification</span>
                <span>{user.aptitudeScore || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${user.aptitudeScore || 10}%` }} />
              </div>
            </div>
          </div>

          {/* Interview Coach Stats */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Interview Rating</h3>
              <Cpu className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{user.interviewScore || 0}%</span>
              <span className="text-xs text-slate-500">Evaluation Index</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                <span>Mock Success</span>
                <span>{user.interviewScore || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${user.interviewScore || 10}%` }} />
              </div>
            </div>
          </div>

          {/* Hackathons Tracker */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contest & Hacks</h3>
              <Trophy className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">{user.hackathonsCount || 0}</span>
              <span className="text-xs text-slate-500">Events Registered</span>
            </div>
            <Link 
              to="/contests" 
              className="mt-5 block text-center bg-slate-800/50 text-slate-300 hover:bg-slate-850 text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-800 hover:text-white transition-all"
            >
              Enter Contests Arena
            </Link>
          </div>

        </div>

        {/* Dynamic Activity Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Board - Recommended Tasks and Bookmarks */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recommended Questions */}
            <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-500/10 p-1.5 rounded-md">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <h2 className="text-base font-bold text-white">Recommended Questions For You</h2>
                </div>
                <RouterLink to="/practice" className="text-xs text-slate-400 hover:text-amber-500 flex items-center space-x-0.5">
                  <span>View All Questions</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </RouterLink>
              </div>

              {recommendedQuestions.length > 0 ? (
                <div className="space-y-4">
                  {recommendedQuestions.map((q) => (
                    <div 
                      key={q.id} 
                      className="bg-slate-900/30 border border-slate-850 hover:border-slate-800 p-4 rounded-xl flex items-center justify-between transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <RouterLink to={`/coding/${q.id}`} className="text-sm font-bold text-slate-100 hover:text-amber-500 transition-colors">
                            {q.title}
                          </RouterLink>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            q.difficulty === 'Easy' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                            q.difficulty === 'Medium' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                            'bg-red-500/10 border border-red-500/20 text-red-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Category: {q.category}</p>
                      </div>

                      <RouterLink 
                        to={`/coding/${q.id}`}
                        className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all flex items-center space-x-1"
                      >
                        <span>Solve</span>
                        <Terminal className="h-3.5 w-3.5" />
                      </RouterLink>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-950/20 rounded-xl border border-dashed border-slate-800">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold">Incredible! You have solved all algorithmic questions.</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Check back shortly as admins configure additional constraints.</p>
                </div>
              )}
            </div>

            {/* Saved and Bookmarked challenges */}
            <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <Bookmark className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-bold text-white">Bookmarked Challenges ({bookmarkedQuestions.length})</h2>
              </div>

              {bookmarkedQuestions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookmarkedQuestions.map((q) => (
                    <div 
                      key={q.id} 
                      className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <RouterLink to={`/coding/${q.id}`} className="text-xs font-bold text-white hover:text-amber-500 truncate max-w-[150px]">
                            {q.title}
                          </RouterLink>
                          <button 
                            onClick={(e) => removeBookmark(q.id, e)}
                            className="p-1 hover:bg-slate-800 rounded-md text-amber-500/90"
                          >
                            <Bookmark className="h-3 w-3 fill-amber-500" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">Difficulty: {q.difficulty}</span>
                      </div>
                      <RouterLink 
                        to={`/coding/${q.id}`} 
                        className="mt-4 text-[10px] font-bold text-amber-500 hover:underline flex items-center space-x-1"
                      >
                        <span>Jump into IDE</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </RouterLink>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4">No bookmarked tasks found. Click the ribbon icon inside any Coding Workspace to save problems.</p>
              )}
            </div>

          </div>

          {/* Sidebar Area - Gamification, Badges and Achievements */}
          <div className="space-y-8">
            
            {/* Badges card container */}
            <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span>Earned Badges ({user.badges?.length || 0})</span>
              </h2>

              <div className="space-y-3">
                {user.badges && user.badges.map((badge, idx) => (
                  <div key={idx} className="bg-slate-900/40 border border-slate-850 p-3 rounded-xl flex items-center space-x-3">
                    <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500 shadow-inner">
                      <Star className="h-4 w-4 fill-amber-500" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">{badge}</span>
                      <span className="block text-[10px] text-slate-500">Verified platform accomplishment</span>
                    </div>
                  </div>
                ))}
                {(!user.badges || user.badges.length === 0) && (
                  <p className="text-xs text-slate-500 italic">No badges earned. Complete tasks to unlock!</p>
                )}
              </div>
            </div>

            {/* Achievements unlocks history */}
            <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span>Recent Milestone Log</span>
              </h2>

              <div className="space-y-4">
                {user.achievements && user.achievements.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="border-l-2 border-slate-700 pl-4 space-y-1">
                    <span className="block text-xs font-bold text-slate-200">{ach.title}</span>
                    <p className="text-[10px] text-slate-500">{ach.description}</p>
                    <span className="block text-[8px] text-slate-600 font-mono">
                      {new Date(ach.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {(!user.achievements || user.achievements.length === 0) && (
                  <p className="text-xs text-slate-500 italic">No achievements unlocked yet.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
