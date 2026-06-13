/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../components/AuthContext';
import { 
  FileSearch, 
  Sparkles, 
  Cpu, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Bookmark, 
  Gauge, 
  ArrowRight,
  Info,
  Upload,
  FileText,
  Trash2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResumeAnalyzer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // File Upload Modes
  const [uploadMode, setUploadMode] = useState('paste');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setErrorMessage(null);
    
    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result;
      const base64Data = resultStr.split(',')[1] || resultStr;
      setFileBase64(base64Data);

      // If text based file, read it explicitly too as fallback/text container
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const textReader = new FileReader();
        textReader.onload = () => {
          setResumeText(textReader.result);
        };
        textReader.readAsText(file);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the uploaded document.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileBase64(null);
    setResumeText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyzeResume = async (e) => {
    e.preventDefault();
    if (uploadMode === 'paste' && !resumeText.trim()) return;
    if (uploadMode === 'file' && !selectedFile) {
      setErrorMessage("Please browse or drop a copy of your resume first.");
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    setReport(null);

    try {
      let payload = { targetRole };
      if (uploadMode === 'file' && selectedFile && fileBase64) {
        payload.fileData = {
          name: selectedFile.name,
          mimeType: selectedFile.type || "application/pdf",
          data: fileBase64
        };
        if (resumeText) payload.resumeText = resumeText;
      } else {
        payload.resumeText = resumeText.trim();
      }

      const res = await api.analyzeResume(payload);

      if (res.success && res.report) {
        setReport(res.report);
      } else {
        setErrorMessage(res.error || "Failed to audit resume details.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Endpoint connection timeout during audit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] text-slate-101 min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 select-none font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-200">
        
        {/* Banner header element */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
          
          <div className="space-y-1 relative z-10">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">ATS Resume Auditor & Analyzer</h1>
            <p className="text-xs text-slate-400">Match resume keywords against standard recruiter filter heuristics. Secure immediate corrections guidelines.</p>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 border border-slate-850 text-xs text-slate-400 rounded-xl flex items-center space-x-1 font-semibold shrink-0">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Keyword Gaps Audit</span>
          </div>
        </div>

        {/* Input pasting layout when no report exists */}
        {!report && (
          <div className="bg-slate-900/10 border border-slate-850 rounded-2xl p-6">
            <form onSubmit={handleAnalyzeResume} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Role Description</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-950 border border-slate-850 text-xs text-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
                  >
                    <option value="Full Stack Engineer">Full Stack Engineer</option>
                    <option value="Frontend Specialist">Frontend Specialist (React/Vite)</option>
                    <option value="Backend Developer">Backend Developer (NodeJS/Mongoose)</option>
                    <option value="Data Structures Coach">Data Structures Coach & Teacher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Parsing Evaluation Method</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 border border-slate-850 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUploadMode('paste')}
                      className={`py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        uploadMode === 'paste' 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Paste Text Segment
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        uploadMode === 'file' 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Upload Resume File
                    </button>
                  </div>
                </div>
              </div>

              {uploadMode === 'paste' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Paste Resume Text Segment</label>
                  <textarea
                    required
                    rows={10}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste details of your education, projects, technical skills list, work history, and libraries experience here..."
                    className="block w-full p-4 bg-slate-950 border border-slate-850 text-xs text-slate-200 placeholder-slate-650 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-slate-400">Upload Professional Copy (PDF, TXT, Word, etc.)</label>
                  
                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 min-h-[220px] ${
                        dragOver 
                          ? 'border-amber-500 bg-amber-500/5' 
                          : 'border-slate-855 bg-slate-955/40 hover:border-slate-700'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                        className="hidden" 
                        accept=".pdf,.txt,.doc,.docx,.rtf"
                      />
                      <div className="bg-slate-900 duration-200 p-4 rounded-full border border-slate-850 text-amber-500">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">Drag & drop your resume document here</p>
                        <p className="text-[10px] text-slate-500">or click to browse local files from your storage</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-600 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-900">
                        PDF, DOCX, TXT UP TO 10MB
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white truncate max-w-md">{selectedFile.name}</p>
                          <span className="block text-[10px] text-slate-500 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Document'}</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={removeFile}
                        className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-red-400 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-955/40 border border-red-800 text-red-301 p-4 rounded-xl text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="pt-4 border-t border-slate-855/65 flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center space-x-1.5">
                  <Info className="h-4 w-4 text-amber-500" />
                  <span>Resume data stays entirely sandboxed.</span>
                </span>

                <button
                  type="submit"
                  disabled={loading || (uploadMode === 'paste' ? !resumeText.trim() : !selectedFile)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold hover:from-amber-400 hover:to-orange-500 flex items-center space-x-1.5 shadow-md disabled:opacity-40 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-955" />
                      <span>Parsing keywords...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit For Analysis</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Audit Report card layouts populated */}
        {report && (
          <div className="space-y-8 animate-fade-in">
            {/* Aggregate ATS index block card */}
            <div className="bg-[#0f172a]/60 border border-slate-800 p-8 rounded-2xl relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-amber-500/5 blur-3xl rounded-full" />
              
              <div className="text-center md:text-left space-y-2 relative z-10">
                <h2 className="text-xl font-extrabold text-white">Analysis Complete</h2>
                <p className="text-xs text-slate-400">Target Role Match: <span className="text-amber-500 font-bold">{targetRole}</span></p>
                <div className="pt-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    report.atsScore >= 75 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {report.atsScore >= 75 ? 'Excellent ATS Index Match' : 'Keyword Gaps Reported'}
                  </span>
                </div>
              </div>

              {/* Large Ring representing ATS rating */}
              <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col justify-center items-center shadow-inner shrink-0 w-44">
                <Gauge className="h-8 w-8 text-amber-500 mb-2" />
                <span className="text-4xl font-extrabold text-white font-mono">{report.atsScore || 70}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1">ATS Score</span>
              </div>
            </div>

            {/* Keyword detected vs metrics differences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Detected keywords */}
              <div className="bg-slate-900/10 border border-slate-850 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle className="h-4.5 w-4.5" />
                  <span>Detected Industry Keywords ({report.detectedKeywords?.length || 0})</span>
                </h3>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {report.detectedKeywords && report.detectedKeywords.map((tag, idx) => (
                    <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold py-1 px-2.5 rounded-lg select-all">
                      {tag}
                    </span>
                  ))}
                  {(!report.detectedKeywords || report.detectedKeywords.length === 0) && (
                    <span className="text-xs text-slate-500 italic">No target technical keywords detected.</span>
                  )}
                </div>
              </div>

              {/* Missing keywords */}
              <div className="bg-slate-900/10 border border-slate-850 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center space-x-1.5 text-red-400">
                  <XCircle className="h-4.5 w-4.5" />
                  <span>Missing Critical Keywords ({report.missingKeywords?.length || 0})</span>
                </h3>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {report.missingKeywords && report.missingKeywords.map((tag, idx) => (
                    <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold py-1 px-2.5 rounded-lg select-all">
                      {tag}
                    </span>
                  ))}
                  {(!report.missingKeywords || report.missingKeywords.length === 0) && (
                    <span className="text-xs text-emerald-400 font-semibold italic">Perfect! Zero missing critical tags.</span>
                  )}
                </div>
              </div>

            </div>

            {/* Recommendations improvements block */}
            {report.recommendations && report.recommendations.length > 0 && (
              <div className="bg-slate-900/10 border border-slate-850 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                  <span>Actionable Content Corrections Recommendations</span>
                </h3>

                <div className="space-y-4 pt-2">
                  {report.recommendations.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-350 leading-relaxed flex items-start space-x-3">
                      <span className="bg-slate-900 border border-slate-800 text-slate-500 h-5 w-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-4 select-none">
              <button
                onClick={() => { setReport(null); setResumeText(''); }}
                className="px-6 py-2.5 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all"
              >
                Reset & Analyse Another Resume
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
