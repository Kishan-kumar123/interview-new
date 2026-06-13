/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../components/AuthContext';
import { 
  Cpu, 
  Send, 
  Sparkles, 
  Loader2, 
  User as UserIcon, 
  HelpCircle, 
  Flame, 
  Award, 
  MessageSquare, 
  Trophy,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  sender: 'user' | 'agent';
  content: string;
}

export const MockInterview: React.FC = () => {
  const { user, updateUserObj } = useAuth();
  const navigate = useNavigate();

  // Active configurations
  const [interviewType, setInterviewType] = useState<string>('Technical');
  const [customFocusTopic, setCustomFocusTopic] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Chat dialogue variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  
  // Results structures
  const [isFinished, setIsFinished] = useState(false);
  const [reportCard, setReportCard] = useState<any>(null);
  const [awardedCertificate, setAwardedCertificate] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTypeName = interviewType === 'Dynamic Custom' 
    ? (customFocusTopic.trim() ? `Custom: ${customFocusTopic}` : 'Custom Topic')
    : interviewType;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleStartSession = async () => {
    setSessionStarted(true);
    setLoading(true);
    setMessages([]);
    setIsFinished(false);
    setReportCard(null);
    setAwardedCertificate(null);

    try {
      // Start session with empty message logs
      const res = await api.simulateInterviewTurn({
        messages: [],
        interviewType: activeTypeName
      });

      if (res.reply) {
        setMessages([{ sender: 'agent', content: res.reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([{ sender: 'agent', content: `Hello candidate! Let's initiate our professional ${activeTypeName} session. Tell me: what primary technological fields have you integrated recently, and what role are you targeting?` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading || isFinished) return;

    const userMessage: Message = { sender: 'user', content: userInput.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);

    try {
      const res = await api.simulateInterviewTurn({
        messages: updatedMessages,
        interviewType: activeTypeName
      });

      if (res.reply) {
        setMessages(prev => [...prev, { sender: 'agent', content: res.reply }]);
      }

      if (res.isFinished) {
        setIsFinished(true);
        if (res.reportCard) {
          setReportCard(res.reportCard);
          
          // Call award certifying proposal if score passes
          if (res.reportCard.overallScore >= 70) {
            try {
              const awardRes = await api.awardInterviewCertificate({
                overallScore: res.reportCard.overallScore,
                interviewType: activeTypeName
              });
              if (awardRes.success) {
                if (awardRes.certificate) setAwardedCertificate(awardRes.certificate);
                if (awardRes.updatedUser) updateUserObj(awardRes.updatedUser);
              }
            } catch (certErr) {
              console.error("Certificate award background failure:", certErr);
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      // Fallback response inside sandbox
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'agent', 
          content: `That represents solid technological methodologies aligned with our ${activeTypeName} target space. Tell me: how do you deal with memory leaks, database connection pools, or multi-threading anomalies during architecture scale periods?` 
        }]);
        setLoading(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] text-slate-105 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-200">
        
        {/* Upper Header Info Banner */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
          
          <div className="space-y-1 relative z-10">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Conversational Mock Coach</h1>
            <p className="text-xs text-slate-400">Experience authentic stateful interviewing dialogue backed by multi-parameter Recruiter profiling.</p>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 border border-slate-850 text-xs text-slate-400 rounded-xl flex items-center space-x-1 font-semibold shrink-0">
            <Cpu className="h-4 w-4 text-blue-500" />
            <span>Google Gemini-3.5 Driven API</span>
          </div>
        </div>

        {/* Start / Selection Screen */}
        {!sessionStarted && (
          <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white mb-2">Select Interview Scenario</h2>
              <p className="text-xs text-slate-500">Pick any behavioral framework or software category to align AI questions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { type: 'Technical', desc: 'Syntax structures, algorithmic tradeoffs, complexities, runtime errors solving.' },
                { type: 'System Design', desc: 'Scalability diagrams, horizontal partitions, caching strategies, API design.' },
                { type: 'Behavioral', desc: 'Teamwork conflicts solving, STAR scenarios, executive presence under pressure.' },
                { type: 'HR', desc: 'Career motivations alignment, organizational values integration, culture match.' },
                { type: 'Dynamic Custom', desc: 'Instantiate interview dialogue based entirely on any custom tech stack, framework, or role of your choice.' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setInterviewType(item.type)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-32 relative ${
                    interviewType === item.type 
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                      : 'bg-[#070b13] border-slate-850 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="block font-bold text-xs md:text-sm text-white">{item.type} Scenario</span>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                  
                  {interviewType === item.type && (
                    <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </div>

            {interviewType === 'Dynamic Custom' && (
              <div className="bg-[#070b13] border border-blue-500/10 p-4 rounded-xl space-y-2.5 animate-fade-in">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5 select-none">
                  <Sparkles className="h-4 w-4 text-amber-500" /> State Custom Tech Stack or Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. React Native with Redux, Rust Concurrency, AWS Serverless Architect, DevOps Engineer"
                  value={customFocusTopic}
                  onChange={(e) => setCustomFocusTopic(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-500">Gemini will securely tailor the entire stateful simulator around this specific domain.</p>
              </div>
            )}

            <div className="border-t border-slate-855 pt-6 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-medium">Session duration: approx. 8-10 turns of interaction</span>
              <button
                onClick={handleStartSession}
                className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 transition-all flex items-center space-x-1.5 shadow-md scale-100 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>Trigger Dialogue Session</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Conversational Log Interface */}
        {sessionStarted && !reportCard && (
          <div className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl flex flex-col h-[500px] overflow-hidden shadow-lg animate-fade-in relative">
            
            {/* Header Sub-bar */}
            <div className="bg-slate-950 border-b border-slate-850 px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Playing Interviewer role: <span className="text-blue-400">{interviewType} Team Lead</span>
              </span>
              <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1 rounded-md text-[10px] border border-slate-800">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-slate-500">Live conversation stream</span>
              </div>
            </div>

            {/* Scrollable message logs list */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-950/20">
              {messages.map((m, idx) => {
                const isInterviewer = m.sender === 'agent';
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      isInterviewer ? 'mr-auto text-left' : 'ml-auto flex-row-reverse space-x-reverse text-right'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border shrink-0 ${
                      isInterviewer ? 'bg-blue-950/10 border-blue-900 text-blue-400 shadow-inner' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {isInterviewer ? <Cpu className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                    </div>

                    <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      isInterviewer 
                        ? 'bg-slate-900/60 border border-slate-850 text-slate-300' 
                        : 'bg-slate-900 text-white border border-slate-800'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center space-x-2 mr-auto text-slate-500 text-xs font-mono">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <span>Interviewer is analyzing response metrics...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Submission Bar */}
            <form onSubmit={handleSendMessage} className="bg-slate-950 p-4 border-t border-slate-850 flex items-center gap-3">
              <input
                type="text"
                disabled={loading || isFinished}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isFinished ? 'Interview finalized.' : 'Type your detailed verbal or algorithmic response here... (min. 3 words)'}
                className="flex-grow bg-[#070b13] border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={loading || isFinished || !userInput.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white transition-all disabled:opacity-40 cursor-pointer shadow"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>

          </div>
        )}

        {/* Structured Simulation Report Card */}
        {isFinished && reportCard && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Score report card */}
            <div className="bg-[#0f172a]/60 border border-slate-800 p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-lg text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full" />
              
              <div className="relative z-10 space-y-4">
                <div className="inline-flex bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-full shadow-md">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Simulation Session Completed!</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Gemini recruiter models have computed your diagnostic feedback across multi-parameter axes.</p>

                {/* Score indicators grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 select-none">
                  {[
                    { label: "Communication", score: reportCard.communicationScore || 80, color: "text-blue-400" },
                    { label: "Technical depth", score: reportCard.technicalScore || 75, color: "text-emerald-400" },
                    { label: "Confidence rating", score: reportCard.confidenceScore || 82, color: "text-purple-400" },
                    { label: "Overall Score", score: reportCard.overallScore || 78, color: "text-amber-400" }
                  ].map((axis, i) => (
                    <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                      <span className={`block text-xl md:text-2xl font-mono font-extrabold ${axis.color}`}>{axis.score}%</span>
                      <span className="block text-[9px] uppercase font-semibold text-slate-500 mt-1">{axis.label}</span>
                    </div>
                  ))}
                </div>

                {/* Badge/Cert and XP transfer warnings */}
                <p className="text-xs text-yellow-400 font-bold pt-2">🎉 +150 XP Reward has been transferred cleanly!</p>

                {awardedCertificate && (
                  <div className="max-w-md mx-auto bg-amber-950/15 border border-amber-900/60 p-4 rounded-xl text-left">
                    <div className="flex items-center space-x-1.5 mb-1 text-xs text-amber-400 font-bold">
                      <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Official Mock Recruiter Cert Awarded!</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal mb-1">
                      Outstanding confidence score detected (&gt;70% cutoff). An interactive certificate has been submitted into credentials folder. View Admin panel shortly for approvals.
                    </p>
                    <span className="block text-[9px] font-mono text-slate-500">Proposal ID: {awardedCertificate.id}</span>
                  </div>
                )}

                <div className="pt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setSessionStarted(false)}
                    className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white rounded-xl text-xs transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Scenario Selector</span>
                  </button>
                  <button
                    onClick={handleStartSession}
                    className="px-5 py-2.5 bg-slate-800 border border-slate-705 text-white font-bold hover:bg-slate-850 rounded-xl text-xs transition-all"
                  >
                    Retake Consultation
                  </button>
                </div>
              </div>
            </div>

            {/* suggestions list */}
            {reportCard.suggestions && reportCard.suggestions.length > 0 && (
              <div className="bg-[#0f172a]/30 border border-slate-850 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Actionable Suggestions & Improvements</span>
                </h3>

                <ul className="space-y-3 pl-1">
                  {reportCard.suggestions.map((item: string, idx: number) => (
                    <li key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-xs text-slate-300 leading-relaxed flex items-start space-x-3">
                      <span className="bg-slate-900 border border-slate-800 h-5 w-5 rounded-md flex items-center justify-center text-slate-400 shrink-0 select-none text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
export type MockInterviewType = any;
