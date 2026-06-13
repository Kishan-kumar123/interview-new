/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  profileImage?: string;
  xpPoints: number;
  streak: number;
  lastActiveDate?: string;
  rank: number;
  solvedQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  aptitudeScore: number;
  interviewScore: number;
  hackathonsCount: number;
  badges: string[];
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
  }[];
  targetRole?: string;
  preferredSkills?: string[];
}

export interface CodingQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  constraints: string[];
  hints: string[];
  testCases: {
    input: string;
    output: string;
    isSecret?: boolean;
  }[];
  starterCode: {
    [key: string]: string;
  };
  editorial?: string;
}

export interface AptitudeQuestion {
  id: string;
  question: string;
  category: string;
  options: string[];
  answer: string; // The text of the correct option
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  companies: string[];
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  durationMinutes: number;
  problems: string[]; // Problem IDs
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  teams: {
    teamName: string;
    members: string[]; // User names
    submission?: string; // Submission text/URL
    score?: number;
  }[];
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  type: 'contest' | 'aptitude' | 'interview' | 'coding_streak';
  title: string;
  status: 'Pending' | 'Approved';
  issuedAt: string;
}
