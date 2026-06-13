/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../components/AuthContext';
import { 
  Search, 
  Terminal, 
  CheckCircle2, 
  Plus, 
  SlidersHorizontal,
  FolderMinus,
  Sparkles
} from 'lucide-react';

export const CodingList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.getCodingQuestions();
        setQuestions(res.questions);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const categories = ['All', 'Arrays', 'Strings', 'Linked List', 'Stack', 'Dynamic Programming'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                          q.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDiff;
  });

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Upper Banner */}
        <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
          
          <div className="space-y-1 relative z-15">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Algorithmic Challenge Arena</h1>
            <p className="text-xs text-slate-400">Master fundamental algorithms, arrays structures, stack logic, and dynamic programs.</p>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center space-x-1 hover:brightness-110 shadow-lg cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Configure Questions</span>
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/10 border border-slate-850 p-4 rounded-xl">
          {/* Search */}
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search problem title, parameters or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
            />
          </div>

          {/* Difficulty */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-950 border border-slate-805 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="All">All Categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                  : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions Render Table */}
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-500 font-mono">Running compiler search configurations...</div>
        ) : filteredQuestions.length > 0 ? (
          <div className="bg-slate-900/20 border border-slate-850 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-850">
                <thead className="bg-[#0b0f19]">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty</th>
                    <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-900/5">
                  {filteredQuestions.map((q) => {
                    const isSolved = user?.solvedQuestionIds?.includes(q.id);
                    return (
                      <tr key={q.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isSolved ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-700 bg-slate-950" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/coding/${q.id}`} className="text-xs font-bold text-slate-100 hover:text-amber-500 transition-all">
                            {q.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-slate-400 font-mono">{q.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            q.difficulty === 'Easy' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                            q.difficulty === 'Medium' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                            'bg-red-500/10 border border-red-500/20 text-red-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link
                            to={`/coding/${q.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs rounded-lg text-slate-300 transition-all"
                          >
                            <span>Compile</span>
                            <Terminal className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/25 border border-slate-850 rounded-2xl">
            <FolderMinus className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold">No questions match your current search.</p>
            <p className="text-[10px] text-slate-500 mt-1">Adjust difficulties or category parameters to expand matches.</p>
          </div>
        )}

      </div>
    </div>
  );
};
