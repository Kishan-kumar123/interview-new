/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { InterviewQuestion, CodingQuestion } from '../types';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  ChevronRight, 
  HelpCircle, 
  Tag, 
  Terminal, 
  FolderLock,
  PlusCircle,
  Cpu,
  Bookmark
} from 'lucide-react';

export const CompanyPrep: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [codingQuestions, setCodingQuestions] = useState<CodingQuestion[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [search, setSearch] = useState('');
  const [activeFAQId, setActiveFAQId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerateDynamicQuestions = async () => {
    setGenerating(true);
    setGenerationError(null);
    try {
      const res = await api.generatePrepQuestions(selectedCompany);
      if (res && Array.isArray(res.questions)) {
        // Prepend the new questions to our main state list
        setQuestions(prev => [...res.questions, ...prev]);
        // Automatically open the first newly generated question
        if (res.questions.length > 0) {
          setActiveFAQId(res.questions[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError("Failed to generate custom dynamic questions. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const intRes = await api.getInterviewQuestions();
        setQuestions(intRes.questions);

        const codRes = await api.getCodingQuestions();
        setCodingQuestions(codRes.questions);
      } catch (e) {
        console.error("Failed to fetch employer Q&A database:", e);
      }
    };
    loadData();
  }, []);

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Adobe', 'Flipkart', 'Walmart', 'Infosys', 'TCS', 'Wipro', 'Accenture'
  ];

  // Filtering QA FAQs
  const filteredFAQs = questions.filter(q => {
    const belongsToCompany = q.companies?.includes(selectedCompany);
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) || 
                          q.answer.toLowerCase().includes(search.toLowerCase());
    return belongsToCompany && matchesSearch;
  });

  // Filtering algorithmic coding problems linked to this company
  // We mock links: for Arrays category -> assign to Google/Microsoft; DP -> Amazon, etc.
  const filteredCodingQuestions = codingQuestions.filter(q => {
    if (selectedCompany === 'Google') return q.category === 'Arrays' || q.category === 'Stack';
    if (selectedCompany === 'Microsoft') return q.category === 'Linked List' || q.category === 'Stack';
    if (selectedCompany === 'Amazon') return q.category === 'Dynamic Programming' || q.category === 'Arrays';
    return q.difficulty === 'Easy' || q.difficulty === 'Medium';
  });

  const toggleFAQ = (id: string) => {
    if (activeFAQId === id) {
      setActiveFAQId(null);
    } else {
      setActiveFAQId(id);
    }
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Banner */}
        <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
          
          <div className="space-y-1 relative z-10">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Employer Specific Interview Vault</h1>
            <p className="text-xs text-slate-400">Target architectural patterns, exact coding queries, and FAQ experiences from top engineering teams.</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-xs font-semibold shrink-0">
            <Briefcase className="h-4 w-4 text-amber-500" />
            <span>Structured for Corporate Sprints</span>
          </div>
        </div>

        {/* Company Carousel Filter selectors */}
        <div className="flex flex-wrap gap-2 pb-2">
          {companies.map(comp => (
            <button
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedCompany === comp
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>

        {/* Two-Column split representing FAQs on left, coding puzzles on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* FAQ database questions (Left col) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-amber-500" />
                  <span>Frequently Solicited Questions FAQs</span>
                </h2>

                {/* Sub search input */}
                <div className="relative max-w-xs w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Search className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Q&As keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic AI Question Generator Panel */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 p-5 rounded-xl space-y-3 relative overflow-hidden select-none">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 animate-spin text-amber-500" style={{ animationDuration: '3s' }} /> Live AI Engine
                    </span>
                    <h3 className="text-xs font-bold text-white">Generate Custom Questions for {selectedCompany}</h3>
                    <p className="text-[10px] text-slate-400">Instantiate completely fresh, dynamic technical and structural questions customized matching {selectedCompany}'s hiring profile.</p>
                  </div>
                  <button
                    onClick={handleGenerateDynamicQuestions}
                    disabled={generating}
                    className="self-start sm:self-center p-2 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-extrabold text-[11px] rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer shrink-0 select-none"
                  >
                    {generating ? (
                      <>
                        <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>Generate Qs</span>
                      </>
                    )}
                  </button>
                </div>
                {generationError && (
                  <p className="text-[10px] font-medium text-red-400">{generationError}</p>
                )}
              </div>

              {filteredFAQs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => {
                    const isOpen = activeFAQId === faq.id;
                    return (
                      <div 
                        key={faq.id} 
                        className="bg-slate-900/30 border border-slate-850/80 rounded-xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full text-left p-4 flex items-center justify-between font-bold text-xs md:text-sm text-slate-200 hover:text-white cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <span className={`text-[10px] uppercase font-bold text-slate-500 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md`}>
                            {isOpen ? 'Close' : 'View Key'}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="p-4 bg-[#070b13] border-t border-slate-855 text-xs text-slate-400 leading-relaxed font-sans space-y-2">
                            <p>{faq.answer}</p>
                            <div className="flex items-center space-x-1.5 text-[10px] text-slate-600 font-semibold pt-2 border-t border-slate-850/40">
                              <Tag className="h-3.5 w-3.5" />
                              <span>Verified Category: {faq.category}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-950/20 border border-dashed border-slate-850 rounded-xl text-slate-500">
                  <FolderLock className="h-8 w-8 mx-auto mb-2 opacity-55" />
                  <p className="text-xs font-bold">No custom corporate Q&A tags loaded yet.</p>
                  <p className="text-[10px] mt-1">Select another employer list or look at global categories.</p>
                </div>
              )}

            </div>
          </div>

          {/* Connected Coding Problems list (Right col) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6">
              
              <div className="flex items-center space-x-2 mb-6">
                <Terminal className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-bold text-white">Target Algorithmic Queries ({filteredCodingQuestions.length})</h2>
              </div>

              {filteredCodingQuestions.length > 0 ? (
                <div className="space-y-4">
                  {filteredCodingQuestions.map((q) => (
                    <div 
                      key={q.id} 
                      className="bg-slate-900/30 border border-slate-850 rounded-xl p-4 flex items-center justify-between hover:border-slate-800 transition-all"
                    >
                      <div className="space-y-1">
                        <Link to={`/coding/${q.id}`} className="text-xs font-bold text-slate-200 hover:text-amber-500 block truncate max-w-[180px]">
                          {q.title}
                        </Link>
                        <span className="text-[10px] text-slate-500 block">Category: {q.category}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                          q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {q.difficulty}
                        </span>
                        <Link 
                          to={`/coding/${q.id}`}
                          className="p-1 px-2.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-[10px] rounded-lg text-slate-300 transition-all flex items-center space-x-0.5"
                        >
                          <span>Solve</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No exact match challenges. See our Practice panel lists instead.</p>
              )}

              {/* Directly prompt AI Coach CTA */}
              <div className="mt-8 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start space-x-3 select-none">
                <Cpu className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-amber-400">Trigger Custom Simulation Session</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Have an upcoming session scheduled with {selectedCompany}? Instantiate an active mock dialogue customized for this firm!
                  </p>
                  <Link 
                    to="/mock-interview"
                    className="mt-3 inline-flex bg-amber-500 text-slate-950 font-extrabold text-[10px] py-1 px-2.5 rounded-md hover:brightness-115 transition-all"
                  >
                    Instantiate Now
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export type CompanyPrepType = any;
