/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../components/AuthContext';
import { 
  Users, 
  Terminal, 
  Award, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  CheckCircle,
  Clock, 
  ShieldAlert,
  Loader2,
  ListPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lists state
  const [users, setUsers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Question form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDiff, setNewDiff] = useState('Easy');
  const [newCat, setNewCat] = useState('Arrays');
  const [hintsText, setHintsText] = useState('');
  
  // Custom Starter Codes
  const [starterJS, setStarterJS] = useState('function solve(arr) {\n  // your code\n}');
  
  // Custom Test Cases
  const [testInput1, setTestInput1] = useState('1 2 3');
  const [testOutput1, setTestOutput1] = useState('6');
  const [testInput2, setTestInput2] = useState('4 4 1');
  const [testOutput2, setTestOutput2] = useState('9');

  const [formFeedback, setFormFeedback] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        const uRes = await api.getAdminUsers();
        setUsers(uRes.users);

        const qRes = await api.getCodingQuestions();
        setQuestions(qRes.questions);

        const cRes = await api.getAdminCertificates();
        setCertificates(cRes.certificates);
      } catch (e) {
        console.error("Admin dashboard synchronization error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, navigate]);

  const handleDeleteUser = async (id: string) => {
    if (id === user?.id) {
      alert("Cannot delete current logged-in core administration certificate.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this user registration?");
    if (!confirmDelete) return;

    try {
      const res = await api.deleteAdminUser(id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleEndorseCertificate = async (id: string) => {
    try {
      const res = await api.approveCertificate(id, 'Approved');
      if (res.success) {
        // Update certificate status locally
        setCertificates(certificates.map(cert => {
          if (cert.id === id) {
            return { ...cert, status: 'approved', endorsedBy: user?.name };
          }
          return cert;
        }));
      }
    } catch (err) {
      console.error("Endorsement verification failure:", err);
    }
  };

  const handleCreateCodingQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback('');

    if (!newTitle || !newDesc || !testInput1 || !testOutput1) {
      setFormFeedback('Please fill in title, description and at least one test case.');
      return;
    }

    try {
      const payload: any = {
        title: newTitle,
        description: newDesc,
        difficulty: newDiff,
        category: newCat,
        hints: hintsText ? hintsText.split('\n') : [],
        testCases: [
          { input: testInput1, output: testOutput1 },
          { input: testInput2, output: testOutput2 }
        ],
        starterCode: {
          javascript: starterJS,
          python: `def solve(arr):\n    # your code\n    pass`
        },
        constraints: ['Memory execution: <1s', 'Auxiliary space: O(1)']
      };

      const res = await api.createCodingQuestion(payload);
      if (res.success) {
        setQuestions([...questions, res.question]);
        setFormFeedback('Algorithmic problem successfully added to compilers database!');
        
        // Reset inputs
        setNewTitle('');
        setNewDesc('');
        setHintsText('');
        setTestInput1('1 2 3');
        setTestOutput1('6');
        setTestInput2('4 4 1');
        setTestOutput2('9');
      }
    } catch (err: any) {
      setFormFeedback(err.message || 'Error occurred while saving question payloads.');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-[#0b0f19] text-slate-105 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 select-none text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Banner */}
        <div className="bg-red-950/20 border border-red-950/50 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/5 blur-3xl rounded-full" />
          
          <div className="space-y-1 relative z-10">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <ShieldAlert className="h-6 w-6 text-red-500" />
              <span>Platform Administration console</span>
            </h1>
            <p className="text-xs text-slate-400">Configure core algorithms repositories, delete mock candidates register, and endorse credentials proposals.</p>
          </div>

          <span className="bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1 text-xs font-bold rounded-full">
            Security Clearance Level: Administrator
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-500 font-mono flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            <span>Synchronizing admin panel databases...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Module Panel: Manage Users & Endorsement certificate cards */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Manage Users */}
              <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 shadow-sm space-y-6">
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-red-400" />
                  <span>Registered Candidates Profiles ({users.length})</span>
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-850 text-xs">
                    <thead>
                      <tr className="bg-[#070b13] text-slate-400 font-semibold text-left">
                        <th className="px-4 py-3">Applicant Name</th>
                        <th className="px-4 py-3">Credentials</th>
                        <th className="px-4 py-3">Metrics</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {users.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-950/40">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-bold text-white block">{usr.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-mono">{usr.role}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-400">{usr.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                            XP: <span className="text-amber-500 font-bold">{usr.xpPoints || 0}</span> | Solves: <span className="text-white font-bold">{usr.solvedQuestionIds?.length || 0}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(usr.id)}
                              className="p-1 px-2.5 bg-red-950/20 border border-red-900 text-red-400 hover:bg-red-900 hover:text-white rounded-lg transition-all text-[10px] font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Endorse Certs */}
              <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6 shadow-sm space-y-6">
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Award className="h-5 w-5 text-red-400" />
                  <span>Endorse Credentials Proposals ({certificates.length})</span>
                </h2>

                <div className="space-y-4">
                  {certificates.map((cert) => {
                    const isApproved = cert.status === 'approved';
                    return (
                      <div 
                        key={cert.id} 
                        className="bg-[#070b13] p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-100">{cert.title}</span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded font-mono ${
                              isApproved ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-500'
                            }`}>
                              {cert.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Candidate name: <span className="text-slate-350 font-bold">{cert.username}</span> | Score percentage achieved: <span className="text-white font-bold">{cert.scorePercentage}%</span>
                          </p>
                          <span className="block text-[8px] text-slate-650 font-mono">Issued At: {new Date(cert.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="shrink-0">
                          {isApproved ? (
                            <div className="flex items-center space-x-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Endorsed Securely</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleEndorseCertificate(cert.id)}
                              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] rounded-lg shadow cursor-pointer transition-all flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Endorse Cert</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {certificates.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No cert proposals currently queued in administration buffers.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Form: Configure New Algorithmic Coding Questions (Right col) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6">
                
                <h2 className="text-sm font-bold text-white flex items-center space-x-2 mb-6">
                  <ListPlus className="h-5 w-5 text-red-400" />
                  <span>Configure Algorithmic Problem</span>
                </h2>

                <form onSubmit={handleCreateCodingQuestion} className="space-y-4">
                  {formFeedback && (
                    <div className="bg-[#070b13] border border-slate-850 p-3 rounded-xl text-xs font-bold leading-relaxed text-amber-500">
                      {formFeedback}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Problem Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Reverse Array Subsets"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-950 border border-slate-850 text-xs text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                      <select
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        className="block w-full px-3 py-2 bg-slate-950 border border-slate-850 text-xs text-slate-300 rounded-lg focus:outline-none"
                      >
                        <option value="Arrays">Arrays</option>
                        <option value="Strings">Strings</option>
                        <option value="Linked List">Linked List</option>
                        <option value="Stack">Stack</option>
                        <option value="Dynamic Programming">Dynamic Programming</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Difficulty</label>
                      <select
                        value={newDiff}
                        onChange={(e) => setNewDiff(e.target.value)}
                        className="block w-full px-3 py-2 bg-slate-950 border border-slate-850 text-xs text-slate-300 rounded-lg focus:outline-none"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Given integers subset arr, output calculation constraints parameters..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="block w-full p-2.5 bg-slate-950 border border-slate-850 text-xs text-slate-200 rounded-lg focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hints (one per line)</label>
                    <textarea
                      rows={2}
                      placeholder="Hint 1: Use direct pointer arithmetic&#10;Hint 2: Subsets mapping loop"
                      value={hintsText}
                      onChange={(e) => setHintsText(e.target.value)}
                      className="block w-full p-2 bg-slate-950 border border-slate-850 text-xs text-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  {/* Test Cases Panel */}
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Sandboxed Test Cases</span>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-slate-500">Case 1 Input:</label>
                        <input
                          type="text"
                          required
                          value={testInput1}
                          onChange={(e) => setTestInput1(e.target.value)}
                          className="block w-full mt-1 bg-slate-900 border border-slate-800 p-1 rounded font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500">Case 1 Output:</label>
                        <input
                          type="text"
                          required
                          value={testOutput1}
                          onChange={(e) => setTestOutput1(e.target.value)}
                          className="block w-full mt-1 bg-slate-900 border border-slate-800 p-1 rounded font-mono text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-slate-500">Case 2 Input:</label>
                        <input
                          type="text"
                          value={testInput2}
                          onChange={(e) => setTestInput2(e.target.value)}
                          className="block w-full mt-1 bg-slate-900 border border-slate-800 p-1 rounded font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500">Case 2 Output:</label>
                        <input
                          type="text"
                          value={testOutput2}
                          onChange={(e) => setTestOutput2(e.target.value)}
                          className="block w-full mt-1 bg-slate-900 border border-slate-800 p-1 rounded font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-1 hover:brightness-110"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Challenges Endpoint</span>
                  </button>

                </form>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export type AdminDashboardType = any;
