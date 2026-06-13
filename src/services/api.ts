/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserObject } from '../components/AuthContext'; // we will create this

const getHeaders = () => {
  const token = localStorage.getItem('interviewace_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  register: async (payload: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch('/api/auth/profile', {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Unauthenticated');
    return res.json();
  },

  updateProfile: async (payload: any) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Coding Practice List
  getCodingQuestions: async () => {
    const res = await fetch('/api/coding');
    if (!res.ok) throw new Error('Failed to load coding questions');
    return res.json();
  },

  getCodingQuestionById: async (id: string) => {
    const res = await fetch(`/api/coding/${id}`);
    if (!res.ok) throw new Error('Failed to load coding question');
    return res.json();
  },

  // Admin coding question creation
  createCodingQuestion: async (payload: any) => {
    const res = await fetch('/api/admin/coding', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create coding question');
    }
    return res.json();
  },

  deleteCodingQuestion: async (id: string) => {
    const res = await fetch(`/api/admin/coding/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete coding question');
    return res.json();
  },

  // Code Execution Engine
  executeCode: async (payload: { code: string; questionId: string; language: string; isSubmit: boolean }) => {
    const res = await fetch('/api/compiler/execute', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Execution failed');
    }
    return res.json();
  },

  submitCode: async (payload: { questionId: string; allPassed: boolean }) => {
    const res = await fetch('/api/compiler/submit', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Submission failed');
    }
    return res.json();
  },

  // Aptitude
  getAptitudeQuestions: async () => {
    const res = await fetch('/api/aptitude', {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load aptitude questions');
    return res.json();
  },

  generateDynamicAptitudeQuestions: async (category: string, count: number = 5) => {
    const res = await fetch('/api/ai/aptitude/generate-quiz', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ category, count })
    });
    if (!res.ok) throw new Error('Failed to generate dynamic aptitude questions');
    return res.json();
  },

  submitAptitudeScore: async (payload: { score: number; totalQuestions: number }) => {
    const res = await fetch('/api/aptitude/submit', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit aptitude score');
    return res.json();
  },

  createAptitudeQuestion: async (payload: any) => {
    const res = await fetch('/api/admin/aptitude', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create aptitude question');
    }
    return res.json();
  },

  deleteAptitudeQuestion: async (id: string) => {
    const res = await fetch(`/api/admin/aptitude/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete aptitude question');
    return res.json();
  },

  // Interview Questions Q&A Module
  getInterviewQuestions: async () => {
    const res = await fetch('/api/interviews/questions');
    if (!res.ok) throw new Error('Failed to load interview questions');
    return res.json();
  },

  generatePrepQuestions: async (company: string) => {
    const res = await fetch('/api/ai/generate-prep-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ company })
    });
    if (!res.ok) throw new Error('Failed to generate dynamic interview questions');
    return res.json();
  },

  createInterviewQuestion: async (payload: any) => {
    const res = await fetch('/api/admin/interviews/questions', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create interview questions');
    }
    return res.json();
  },

  deleteInterviewQuestion: async (id: string) => {
    const res = await fetch(`/api/admin/interviews/questions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete interview question');
    return res.json();
  },

  // Contests and Hackathons
  getContests: async () => {
    const res = await fetch('/api/contests');
    if (!res.ok) throw new Error('Failed to load contests');
    return res.json();
  },

  getHackathons: async () => {
    const res = await fetch('/api/hackathons');
    if (!res.ok) throw new Error('Failed to load hackathons');
    return res.json();
  },

  joinHackathon: async (id: string, teamName: string) => {
    const res = await fetch(`/api/hackathons/${id}/join`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ teamName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to join hackathon');
    }
    return res.json();
  },

  submitHackathon: async (id: string, teamName: string, submissionCode: string) => {
    const res = await fetch(`/api/hackathons/${id}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ teamName, submissionCode })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit hackathon build.');
    }
    return res.json();
  },

  createContest: async (payload: any) => {
    const res = await fetch('/api/admin/contests', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create contest');
    return res.json();
  },

  createHackathon: async (payload: any) => {
    const res = await fetch('/api/admin/hackathons', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create hackathon');
    return res.json();
  },

  // Users (Admin Only)
  getAdminUsers: async () => {
    const res = await fetch('/api/admin/users', {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load platform users');
    return res.json();
  },

  deleteAdminUser: async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  // Certificates list
  getAdminCertificates: async () => {
    const res = await fetch('/api/admin/certificates', {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load certificates database');
    return res.json();
  },

  approveCertificate: async (id: string, status: 'Approved' | 'Pending') => {
    const res = await fetch(`/api/admin/certificates/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update certificate');
    return res.json();
  },

  deleteCertificate: async (id: string) => {
    const res = await fetch(`/api/admin/certificates/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete certificate');
    return res.json();
  },

  // AI Actions (Gemini Proxy Calls)
  explainCode: async (payload: { questionTitle: string; questionDescription: string; code: string; language: string }) => {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate AI explanation');
    return res.json();
  },

  analyzeResume: async (payload: { resumeText?: string; targetRole?: string; fileData?: { mimeType: string; data: string; name: string } }) => {
    const res = await fetch('/api/ai/analyze-resume', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to run intelligence resume parsing');
    return res.json();
  },

  simulateInterviewTurn: async (payload: { messages: any[]; interviewType: string; codingQuestionContext?: string }) => {
    const res = await fetch('/api/ai/interview', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Interview simulation pipeline failed');
    return res.json();
  },

  awardInterviewCertificate: async (payload: { overallScore: number; interviewType: string }) => {
    const res = await fetch('/api/ai/interview/award-certification', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to award mock interview certificate');
    return res.json();
  },

  registerHackathonEvent: async (payload: { id: string; type: 'contest' | 'hackathon' }) => {
    if (payload.type === 'hackathon') {
      const joinRes = await fetch(`/api/hackathons/${payload.id}/join`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ teamName: 'Solo Team' })
      });
      if (!joinRes.ok) throw new Error('Failed to join hackathon');
      const joinData = await joinRes.json();
      
      // Load current profile so the global stats (streaks, xp) stays fully synchronized
      const profileRes = await fetch('/api/auth/profile', {
        headers: getHeaders()
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        return { success: true, updatedUser: profileData.user };
      }
      return { success: true };
    } else {
      // For standard Contests, we successfully mock join
      return { success: true };
    }
  },

  getLeaderboard: async () => {
    const res = await fetch('/api/leaderboard', {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load leaderboard');
    return res.json();
  },

  claimStreakBonus: async () => {
    const res = await fetch('/api/auth/claim-streak', {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to claim daily reward.');
    }
    return res.json();
  },

  submitHackathonAI: async (payload: { hackathonId: string; teamName: string; projectTitle: string; submissionCode: string }) => {
    const res = await fetch('/api/hackathons/submit-ai', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Hackathon submission failed');
    }
    return res.json();
  }
};
