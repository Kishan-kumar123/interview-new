/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AptitudeQuestion } from '../types';
import { useAuth } from '../components/AuthContext';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  Award,
  BookMarked,
  Hourglass,
  ArrowRight,
  ListRestart
} from 'lucide-react';

export const AptitudeHome: React.FC = () => {
  const { user, updateUserObj } = useAuth();
  
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<AptitudeQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quizSize, setQuizSize] = useState<number>(5);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  
  // Quiz running states
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // XP tracker
  const [sessionXPGained, setSessionXPGained] = useState(0);
  const [awardedCertificate, setAwardedCertificate] = useState<any>(null);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.getAptitudeQuestions();
        setQuestions(res.questions);
      } catch (err) {
        console.error("Failed to load aptitude questions database:", err);
      }
    };
    fetchQuestions();
  }, []);

  // Timer Countdown Logic
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;
    if (timeLeft <= 0) {
      handleForceSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, quizSubmitted]);

  const categories = ['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Time & Work', 'Probability', 'Profit & Loss'];

  const filteredQuestions = questions.filter(q => selectedCategory === 'All' || q.category === selectedCategory);

  const handleStartQuiz = async () => {
    setGeneratingQuiz(true);
    setGenError(null);
    try {
      const res = await api.generateDynamicAptitudeQuestions(selectedCategory, quizSize);
      if (res && Array.isArray(res.questions) && res.questions.length > 0) {
        setActiveQuestions(res.questions);
        setQuizStarted(true);
        setQuizSubmitted(false);
        setActiveQuestionIdx(0);
        setUserAnswers({});
        setTimeLeft(125 * res.questions.length); // ~2 minutes per question
        setAwardedCertificate(null);
      } else {
        throw new Error("No questions retrieved.");
      }
    } catch (err: any) {
      console.error(err);
      setGenError("Unable to instantiate custom questions. Retrying with fallback...");
      // Soft-fallback directly to client's filtered questions
      if (filteredQuestions.length > 0) {
        const fallbackList = [...filteredQuestions].sort(() => 0.5 - Math.random()).slice(0, quizSize);
        setActiveQuestions(fallbackList);
        setQuizStarted(true);
        setQuizSubmitted(false);
        setActiveQuestionIdx(0);
        setUserAnswers({});
        setTimeLeft(120 * fallbackList.length);
        setAwardedCertificate(null);
      } else {
        setGenError("Failed to start. Please check network connection and try again.");
      }
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (option: string) => {
    const currentQuestion = activeQuestions[activeQuestionIdx];
    if (!currentQuestion) return;
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: option
    });
  };

  const calculateScore = () => {
    let score = 0;
    activeQuestions.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const handleForceSubmit = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    const score = calculateScore();
    try {
      const res = await api.submitAptitudeScore({
        score,
        totalQuestions: activeQuestions.length
      });
      if (res.success) {
        setSessionXPGained(res.xpGained);
        if (res.certificate) {
          setAwardedCertificate(res.certificate);
        }
        if (res.updatedUser) {
          updateUserObj(res.updatedUser);
        }
      }
    } catch (err) {
      console.error("Aptitude score collection error:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Upper Banner Block */}
        {!quizStarted && (
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            
            <div className="space-y-1 relative z-10">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Timed Aptitude & Logical Testing</h1>
              <p className="text-xs text-slate-400">Expand quantitative speed, profit equations, permutation math, and logical induction puzzles.</p>
            </div>

            <div className="bg-slate-950 px-4 py-2 border border-slate-855 text-xs text-slate-400 rounded-xl flex items-center space-x-1 font-semibold shrink-0">
              <Award className="h-4 w-4 text-emerald-500" />
              <span>Score &gt;80% for official Certification</span>
            </div>
          </div>
        )}

        {/* Categories selector block before start */}
        {!quizStarted && (
          <div className="space-y-6">
            <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
                <BookMarked className="h-4 w-4 text-emerald-500" />
                <span>Choose Your Category</span>
              </h2>

              <div className="flex flex-wrap gap-2.5 bg-slate-950/20 p-3 rounded-xl border border-slate-900">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <h2 className="text-sm font-bold text-slate-200 mt-6 mb-4 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>Choose Quiz Length (Number of Questions)</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[5, 10, 15, 20].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setQuizSize(size)}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      quizSize === size
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold shadow-md shadow-emerald-500/5'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{size} Qs</span>
                    <span className="text-[10px] text-slate-500 select-none">
                      {size === 5 && 'Fast Setup'}
                      {size === 10 && 'Standard'}
                      {size === 15 && 'Comprehensive'}
                      {size === 20 && 'Marathon'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 border-t border-slate-850/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-slate-500">
                  ⚡ Mode: <span className="text-emerald-400 font-bold font-mono">Dynamic AI Generator</span> • {quizSize} custom challenges for <span className="text-slate-350">{selectedCategory}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {genError && (
                    <span className="text-[10px] text-red-400 font-medium">{genError}</span>
                  )}

                  <button
                    onClick={handleStartQuiz}
                    disabled={generatingQuiz}
                    className="px-6 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center space-x-1.5 shadow-md disabled:opacity-45 cursor-pointer"
                  >
                    {generatingQuiz ? (
                      <>
                        <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>Begin Quiz</span>
                        <Hourglass className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timed Active Quiz UI */}
        {quizStarted && !quizSubmitted && activeQuestions.length > 0 && (
          <div className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
            {/* Header with progress and timer */}
            <div className="bg-[#070b13] border-b border-slate-850 py-3.5 px-6 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Question <span className="text-white font-bold">{activeQuestionIdx + 1}</span> of {activeQuestions.length}
              </span>
              
              <div className="flex items-center space-x-2 font-mono text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-amber-500">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question description */}
            <div className="p-6 space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850">
                <p className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wide">{activeQuestions[activeQuestionIdx]?.category || selectedCategory}</p>
                <div className="text-sm md:text-base font-bold text-white leading-relaxed">
                  {activeQuestions[activeQuestionIdx]?.question}
                </div>
              </div>

              {/* MCQ Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuestions[activeQuestionIdx]?.options.map((opt, idx) => {
                  const isSelected = userAnswers[activeQuestions[activeQuestionIdx]?.id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      className={`text-left p-4 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700 hover:bg-slate-900/30'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-700 bg-[#070b13]'
                      }`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Navigation controls */}
              <div className="border-t border-slate-855/50 pt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setActiveQuestionIdx(prev => Math.max(0, prev - 1))}
                  disabled={activeQuestionIdx === 0}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40 rounded-xl text-xs text-slate-400 hover:text-white transition-all flex items-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {activeQuestionIdx < activeQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-400 hover:text-white transition-all flex items-center space-x-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:brightness-110 flex items-center space-x-1"
                  >
                    <span>Submit Exam</span>
                    <Hourglass className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Finished / Result Screen */}
        {quizSubmitted && activeQuestions.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            {/* Score Overview and Badge award report card */}
            <div className="bg-[#0f172a]/60 border border-slate-800 p-8 rounded-2xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="inline-flex bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-full mb-4 shadow-md">
                  <CheckCircle2 className="h-8 w-8 text-slate-950 fill-slate-950/20" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Quiz Completed Successfully</h2>
                <p className="text-xs text-slate-400 mt-1">We have computed your answers against database parameters.</p>

                {/* Score numbers */}
                <div className="flex justify-center items-baseline space-x-2 mt-8 select-none">
                  <span className="text-5xl font-extrabold text-white">{calculateScore()}</span>
                  <span className="text-xl text-slate-500">/ {activeQuestions.length} Correct</span>
                </div>

                <div className="max-w-xs mx-auto mt-4 bg-slate-900 border border-slate-850 rounded-xl py-2 px-4 text-xs flex justify-between font-semibold text-slate-400">
                  <span>Score Percentage:</span>
                  <span className="text-emerald-400">{Math.round((calculateScore() / activeQuestions.length) * 100)}%</span>
                </div>

                {/* Congratulations Badge or Cert notification */}
                {sessionXPGained > 0 && (
                  <p className="text-xs text-yellow-400 font-bold mt-4">
                    🎉 +{sessionXPGained} XP points transferred to user stats!
                  </p>
                )}

                {awardedCertificate && (
                  <div className="max-w-md mx-auto mt-6 bg-amber-950/15 border border-amber-900/60 p-4 rounded-xl text-left">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <Award className="h-5 w-5 text-amber-500 shrink-0 animate-bounce" />
                      <span className="font-extrabold text-xs text-amber-400">Official Certification Proposed!</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal mb-1">
                      Outstanding performance detected (&gt;80% accuracy). A certificate proposal has been injected into our Admin queues for endorsement.
                    </p>
                    <span className="block text-[9px] font-mono text-slate-500">Cert name: {awardedCertificate.title}</span>
                  </div>
                )}

                <div className="pt-6 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuizStarted(false)}
                    className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 font-bold hover:text-white rounded-xl transition-all"
                  >
                    Return to Categories
                  </button>
                  <button
                    type="button"
                    onClick={handleStartQuiz}
                    className="px-5 py-2.5 bg-slate-800 border border-slate-705 text-xs text-slate-100 font-bold hover:text-white rounded-xl transition-all flex items-center space-x-1"
                  >
                    <ListRestart className="h-4 w-4" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Explanations Review Sheet */}
            <div className="bg-[#0f172a]/30 border border-slate-850 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                <span>Review Explanations Walkthroughs</span>
              </h3>

              <div className="space-y-6 divide-y divide-slate-850">
                {activeQuestions.map((q, idx) => {
                  const isCorrect = userAnswers[q.id] === q.answer;
                  return (
                    <div key={q.id} className={`pt-6 first:pt-0 space-y-3`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Question {idx + 1}</span>
                          <p className="text-xs md:text-sm font-bold text-slate-200 leading-relaxed">{q.question}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                          isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {isCorrect ? 'Passed' : 'Mismatch'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-slate-400">
                          Your choice: <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400'}>{userAnswers[q.id] || 'Skipped'}</span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-slate-400">
                          Correct key: <span className="text-emerald-400 font-extrabold">{q.answer}</span>
                        </div>
                      </div>

                      <div className="bg-[#05080f] p-4 rounded-xl border border-slate-855 text-xs text-slate-400 space-y-1.5 leading-relaxed">
                        <span className="block font-bold text-slate-350">Step-by-Step Walkthrough:</span>
                        <p className="text-[11px] text-slate-500 whitespace-pre-line">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
