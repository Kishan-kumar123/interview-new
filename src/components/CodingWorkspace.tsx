/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { api } from '../services/api';
import { CodingQuestion } from '../types';
import { useAuth } from './AuthContext';
import { 
  Play, 
  Send, 
  ChevronLeft, 
  Award, 
  Bookmark, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Terminal,
  Clock,
  ListRestart
} from 'lucide-react';

export const CodingWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateBookmarks, updateUserObj } = useAuth();
  
  const [question, setQuestion] = useState<CodingQuestion | null>(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  // Left Panel Tabs
  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'editorial' | 'ai'>('problem');
  
  // Compiler state variables
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compileResults, setCompileResults] = useState<any[]>([]);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);

  // Gemini state variables
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const isBookmarked = user?.bookmarkedQuestionIds?.includes(id || '');

  useEffect(() => {
    if (!id) return;
    const loadQuestion = async () => {
      try {
        const res = await api.getCodingQuestionById(id);
        setQuestion(res.question);
        
        // Load default starter code depending on language
        const starter = res.question.starterCode?.[selectedLanguage] || '// No starter code found';
        setCode(starter);
      } catch (err) {
        console.error("Could not load question details:", err);
      }
    };
    loadQuestion();
  }, [id, selectedLanguage]);

  if (!question) {
    return (
      <div className="bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)] flex items-center justify-center font-mono text-xs text-slate-500">
        Loading playground context...
      </div>
    );
  }

  const handleToggleBookmark = async () => {
    if (!id) return;
    await updateBookmarks(id, !isBookmarked);
  };

  const handleRunCode = async () => {
    if (!id || isRunning) return;
    setIsRunning(true);
    setErrorMessage(null);
    setSubmissionSuccess(null);
    setCompileResults([]);
    setConsoleLogs([]);

    try {
      const res = await api.executeCode({
        code,
        questionId: id,
        language: selectedLanguage,
        isSubmit: false
      });

      if (res.success) {
        setCompileResults(res.results);
        if (res.results[0]?.console) {
          setConsoleLogs(res.results[0].console);
        }
      } else {
        setErrorMessage(res.error || "Compilation/Syntax error occurred during sandbox evaluation.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Endpoint error during calculation.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSubmissionSuccess(null);
    setCompileResults([]);

    try {
      const execRes = await api.executeCode({
        code,
        questionId: id,
        language: selectedLanguage,
        isSubmit: true
      });

      if (execRes.success) {
        setCompileResults(execRes.results);
        const allPassed = execRes.allPassed;
        setSubmissionSuccess(allPassed);

        if (allPassed) {
          // Commit solve progress to user profiling
          const subRes = await api.submitCode({
            questionId: id,
            allPassed: true
          });
          if (subRes.success && subRes.user) {
            updateUserObj(subRes.user);
          }
        }
      } else {
        setErrorMessage(execRes.error || "Compilation error on submit.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit execution payload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchAiOverview = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setActiveTab('ai');
    try {
      const res = await api.explainCode({
        questionTitle: question.title,
        questionDescription: question.description,
        code,
        language: selectedLanguage
      });
      setAiExplanation(res.explanation);
    } catch (err: any) {
      setAiExplanation(`### Analysis Error\n\nFailed to query Gemini model. Check connectivity settings.\n\n${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const resetStarterCode = () => {
    const starter = question.starterCode?.[selectedLanguage] || '';
    setCode(starter);
  };

  return (
    <div className="bg-[#080b11] text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col font-sans select-none">
      
      {/* Playground Header Sub-bar */}
      <div className="bg-[#0f172a]/90 border-b border-slate-850 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/practice" className="p-1 px-2.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-all">
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Problem Index</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <h2 className="text-sm font-bold text-white">{question.title}</h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {question.difficulty}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={resetStarterCode}
            className="p-1.5 px-2.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-400 hover:text-white flex items-center space-x-1"
            title="Reset Starter Code"
          >
            <ListRestart className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-px bg-slate-900/60 overflow-hidden">
        
        {/* Left Informational Column */}
        <div className="lg:col-span-5 flex flex-col bg-[#0b101d] h-full overflow-hidden">
          {/* Tab Selector */}
          <div className="flex bg-[#070b13] border-b border-slate-850 text-xs select-none">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-3 font-semibold transition-all cursor-pointer border-b ${
                activeTab === 'problem' 
                  ? 'border-amber-500 text-amber-500 bg-[#0b101d]' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-4 py-3 font-semibold transition-all cursor-pointer border-b ${
                activeTab === 'hints' 
                  ? 'border-amber-500 text-amber-500 bg-[#0b101d]' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Hints
            </button>
            <button
              onClick={() => setActiveTab('editorial')}
              className={`px-4 py-3 font-semibold transition-all cursor-pointer border-b ${
                activeTab === 'editorial' 
                  ? 'border-amber-500 text-amber-500 bg-[#0b101d]' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Editorial
            </button>
            <button
              onClick={handleFetchAiOverview}
              className={`px-4 py-3 font-semibold transition-all cursor-pointer border-b hover:bg-slate-950 flex items-center space-x-1 ${
                activeTab === 'ai' 
                  ? 'border-amber-500 text-amber-500 bg-[#0b101d]' 
                  : 'border-transparent text-amber-400'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Explainer</span>
            </button>
          </div>

          {/* Description / Content Body */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 leading-relaxed text-sm">
            
            {activeTab === 'problem' && (
              <div className="space-y-6 animate-fade-in">
                {/* Statement */}
                <div className="text-slate-200">
                  <h3 className="text-sm font-bold text-white mb-2">Problem Statement</h3>
                  <div className="whitespace-pre-wrap text-xs md:text-sm">{question.description}</div>
                </div>

                {/* Constraints */}
                {question.constraints && question.constraints.length > 0 && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <h4 className="text-xs font-bold text-slate-400 mb-2">Constraints</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500 font-mono">
                      {question.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white">Examples & Scenarios</h4>
                  {question.testCases.slice(0, 2).map((tc, idx) => (
                    <div key={idx} className="bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-xs space-y-1">
                      <div className="text-slate-400 font-bold">Example {idx + 1}:</div>
                      <div className="text-slate-550"><span className="text-slate-500">Input:</span> {tc.input.replace('\n', ', ')}</div>
                      <div className="text-emerald-500"><span className="text-slate-500">Output:</span> {tc.output}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-white">Algorithmic Guidance</h3>
                {question.hints && question.hints.length > 0 ? (
                  question.hints.map((hint, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-start space-x-3">
                      <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-md text-slate-400 text-xs shrink-0 font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-400">{hint}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No hints loaded. Tap on the "AI Explainer" tab for stateful assistance!</p>
                )}
              </div>
            )}

            {activeTab === 'editorial' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-white">Official Editorial Solution</h3>
                {question.editorial ? (
                  <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>{question.editorial}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs italic">Editorial walkthrough compiling currently... Feel free to trigger AI explanations!</p>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4 animate-fade-in text-xs whitespace-pre-wrap leading-relaxed text-slate-300">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500 font-mono space-y-2">
                    <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
                    <span>Gemini is compiling analytical report...</span>
                  </div>
                ) : aiExplanation ? (
                  <div className="prose prose-invert max-w-none text-slate-200">
                    <div className="bg-[#070b13] p-4 rounded-xl border border-slate-850 leading-loose">
                      {aiExplanation}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-500 border border-dashed border-slate-850 rounded-xl">
                    <Sparkles className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="font-bold">Gemini Explainer AI Offline</p>
                    <button 
                      onClick={handleFetchAiOverview}
                      className="mt-4 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs text-slate-300 rounded-xl transition-all"
                    >
                      Execute Solution Analysis
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Editor Column */}
        <div className="lg:col-span-7 flex flex-col bg-[#070b13] h-full overflow-hidden">
          
          {/* Language Selector Subbar */}
          <div className="bg-[#0f172a] border-b border-slate-850 px-4 py-2 flex items-center justify-between text-xs select-none">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-semibold">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-950 text-xs text-amber-500 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value="javascript">JavaScript (Node v18)</option>
                <option value="python">Python 3 (Simulation)</option>
              </select>
            </div>

            <div className="bg-slate-950 border border-slate-850 text-[10px] font-semibold text-slate-500 py-1 px-2 rounded-lg font-mono">
              Auto Complete Enabled
            </div>
          </div>

          {/* Monaco Code Input Area */}
          <div className="flex-grow h-120">
            <Editor
              theme="vs-dark"
              language={selectedLanguage}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>

          {/* Status Display Log & Calculations Outputs */}
          <div className="bg-[#0b101d] border-t border-slate-850 h-56 flex flex-col overflow-hidden">
            <div className="bg-slate-950 border-b border-slate-850 px-4 py-2 text-xs flex items-center justify-between select-none">
              <div className="flex space-x-2">
                <span className="font-bold text-slate-400">Execution Output</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-500">Virtual VM ready</span>
              </div>
            </div>

            {/* Run logs context */}
            <div className="flex-grow p-4 overflow-y-auto font-mono text-[11px] leading-relaxed">
              {isRunning || isSubmitting ? (
                <div className="flex items-center justify-center h-full text-slate-500 space-x-2 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  <span>Invoking sandboxed calculation nodes...</span>
                </div>
              ) : errorMessage ? (
                <div className="text-red-400 bg-red-950/20 border border-red-900 p-3 rounded-lg leading-loose space-y-1">
                  <div className="font-bold flex items-center space-x-1.5"><XCircle className="h-4 w-4" /> <span>Sandbox Error</span></div>
                  <pre className="whitespace-pre-wrap word-break-all text-[10px]">{errorMessage}</pre>
                </div>
              ) : submissionSuccess !== null ? (
                <div className={`p-4 rounded-xl border ${
                  submissionSuccess 
                    ? 'bg-emerald-950/20 border-emerald-900/80 text-emerald-400' 
                    : 'bg-red-950/20 border-red-900/80 text-red-400'
                } space-y-2`}>
                  <div className="font-bold text-sm flex items-center space-x-1.5">
                    {submissionSuccess ? <CheckCircle2 className="h-5 w-5 fill-emerald-500/10" /> : <XCircle className="h-5 w-5" />}
                    <span>{submissionSuccess ? 'Submission Passed!' : 'Wrong Answer'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {submissionSuccess 
                      ? 'Incredible work! Your algorithmic submission successfully satisfied all evaluation criteria.' 
                      : 'Not all compile validation passed. Expand logs below or adjust logical edge parameters.'}
                  </p>
                </div>
              ) : compileResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex space-x-2 mb-2 select-none">
                    {compileResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestCaseIndex(i)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                          activeTestCaseIndex === i 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                            : 'bg-slate-950 border-slate-850 text-slate-400'
                        }`}
                      >
                        Case {i + 1} ({res.passed ? 'Passed' : 'Failed'})
                      </button>
                    ))}
                  </div>

                  {compileResults[activeTestCaseIndex] && (
                    <div className="space-y-2 bg-[#060912] p-3 rounded-lg border border-slate-850">
                      <div>
                        <span className="text-slate-500">Input:</span> {compileResults[activeTestCaseIndex].input}
                      </div>
                      <div>
                        <span className="text-slate-500">Expected:</span> <span className="text-slate-300">{compileResults[activeTestCaseIndex].expected}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Actual:</span> <span className={
                          compileResults[activeTestCaseIndex].passed ? 'text-emerald-400' : 'text-red-400'
                        }>{JSON.stringify(compileResults[activeTestCaseIndex].actual)}</span>
                      </div>
                      
                      {compileResults[activeTestCaseIndex].console && compileResults[activeTestCaseIndex].console.length > 0 && (
                        <div className="border-t border-slate-850 mt-2 pt-2">
                          <span className="text-slate-500">Console Logs:</span>
                          <pre className="text-slate-400 text-[10px] mt-1 whitespace-pre-wrap">{compileResults[activeTestCaseIndex].console.join('\n')}</pre>
                        </div>
                      )}

                      <div className="flex space-x-4 text-[10px] text-slate-600 border-t border-slate-850/50 pt-2 select-none">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Time: {compileResults[activeTestCaseIndex].executionTimeMs || '0.00'} ms</span>
                        </span>
                        <span>Memory: {compileResults[activeTestCaseIndex].memoryUsageKb || '120'} KB</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-600 text-center py-8">
                  <Terminal className="h-6 w-6 mx-auto mb-2 opacity-40" />
                  <p>Compile details, test cases outputs, execution rates, and console loops list here.</p>
                </div>
              )}
            </div>

            {/* Run & Submit action triggers */}
            <div className="bg-[#070b13] border-t border-slate-850 px-4 py-3 flex items-center justify-between select-none">
              <span className="text-[10px] text-slate-500">Press Cmd+Enter to execute solutions</span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-40"
                >
                  <Play className="h-3.5 w-3.5 fill-slate-300" />
                  <span>Run Code</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:from-amber-400 hover:to-orange-500 shadow-md transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-40 scale-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
export type CodingWorkspaceType = any;
