/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import mongoose, { Schema as MongoSchema } from 'mongoose';
import { SEED_CODING_QUESTIONS, SEED_APTITUDE_QUESTIONS, SEED_INTERVIEW_QUESTIONS } from './seedData.js';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Define Mongoose Schema specifications for authentic MERN capabilities
const UserMongoSchema = new MongoSchema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  profileImage: { type: String, default: '' },
  xpPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: String,
  rank: { type: Number, default: 0 },
  solvedQuestionIds: [String],
  bookmarkedQuestionIds: [String],
  aptitudeScore: { type: Number, default: 0 },
  interviewScore: { type: Number, default: 0 },
  hackathonsCount: { type: Number, default: 0 },
  badges: [String],
  achievements: [{
    id: String,
    title: String,
    description: String,
    unlockedAt: String
  }],
  targetRole: String,
  preferredSkills: [String]
});

const CodingQuestionMongoSchema = new MongoSchema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true },
  constraints: [String],
  hints: [String],
  testCases: [{
    input: String,
    output: String,
    isSecret: Boolean
  }],
  starterCode: MongoSchema.Types.Mixed,
  editorial: String,
  companies: [String]
});

const AptitudeQuestionMongoSchema = new MongoSchema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  category: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
  explanation: { type: String, required: true }
});

const InterviewQuestionMongoSchema = new MongoSchema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
  companies: [String]
});

const ContestMongoSchema = new MongoSchema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  problems: [String]
});

const HackathonMongoSchema = new MongoSchema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  teams: [{
    teamName: String,
    members: [String],
    submission: String,
    score: Number
  }]
});

const CertificateMongoSchema = new MongoSchema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ['contest', 'aptitude', 'interview', 'coding_streak'], required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
  issuedAt: { type: String, required: true }
});

// Construct Mongoose compiled models
const UserModel = mongoose.models.User || mongoose.model('User', UserMongoSchema);
const CodingQuestionModel = mongoose.models.CodingQuestion || mongoose.model('CodingQuestion', CodingQuestionMongoSchema);
const AptitudeQuestionModel = mongoose.models.AptitudeQuestion || mongoose.model('AptitudeQuestion', AptitudeQuestionMongoSchema);
const InterviewQuestionModel = mongoose.models.InterviewQuestion || mongoose.model('InterviewQuestion', InterviewQuestionMongoSchema);
const ContestModel = mongoose.models.Contest || mongoose.model('Contest', ContestMongoSchema);
const HackathonModel = mongoose.models.Hackathon || mongoose.model('Hackathon', HackathonMongoSchema);
const CertificateModel = mongoose.models.Certificate || mongoose.model('Certificate', CertificateMongoSchema);

const DEFAULT_CONTESTS = [
  {
    id: "contest-1",
    title: "Weekly Code Challenge",
    description: "Compete globally to solve 3 algorithmic problems in 90 minutes. Earn XP and ranks!",
    startDate: new Date(Date.now() - 3600000).toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
    durationMinutes: 90,
    problems: ["two-sum", "valid-parentheses", "coin-change"]
  },
  {
    id: "contest-2",
    title: "Bi-Weekly Speed Run",
    description: "Crack the fastest coding challenges and test your micro optimizations.",
    startDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    durationMinutes: 60,
    problems: ["reverse-linked-list", "two-sum"]
  }
];

const DEFAULT_HACKATHONS = [
  {
    id: "hack-1",
    title: "EcoSmart AI Hackathon",
    description: "Build green technological solutions utilizing Gemini API model chains to analyze energy consumption. Finalists present live to senior tech executives. Earn certification!",
    teams: [
      { teamName: "CarbonCoders", members: ["Kishan Barnwal", "Alice Smith"], submission: "AI-based tracking of household and corporate carbon footprints.", score: 92 },
      { teamName: "GreenGrid", members: ["Bob Johnson", "David Miller"], submission: "Energy load balancing grid simulator.", score: 88 }
    ]
  },
  {
    id: "hack-2",
    title: "Global FinTech Innovation Hackathon",
    description: "Design robust, accessible payment tools with state-of-the-art security, clean analytical interfaces, and smart prediction models.",
    teams: []
  }
];

let dbState = {
  users: [],
  codingQuestions: [],
  aptitudeQuestions: [],
  interviewQuestions: [],
  contests: [],
  hackathons: [],
  certificates: []
};

// Default seed records
const defaultAdmin = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@interviewace.com",
  role: "admin",
  xpPoints: 1000,
  streak: 15,
  rank: 1,
  solvedQuestionIds: [],
  bookmarkedQuestionIds: [],
  aptitudeScore: 90,
  interviewScore: 85,
  hackathonsCount: 2,
  badges: ["Admin Core", "Pillar of Ace"],
  achievements: []
};

const defaultStudent = {
  id: "student-1",
  name: "Kishan Barnwal",
  email: "student@interviewace.com",
  role: "student",
  profileImage: "",
  xpPoints: 340,
  streak: 4,
  rank: 24,
  solvedQuestionIds: ["two-sum"],
  bookmarkedQuestionIds: [],
  aptitudeScore: 78,
  interviewScore: 80,
  hackathonsCount: 1,
  badges: ["Fast Starter", "Aptitude Pro"],
  achievements: [
    { id: "ach-1", title: "Hello Ace", description: "Successfully signed up and setup profile.", unlockedAt: new Date().toISOString() },
    { id: "ach-2", title: "First Blood", description: "Solve your first coding question successfully.", unlockedAt: new Date().toISOString() }
  ]
};

let mongooseConnected = false;

// Connect Mongoose and load database
async function initDB() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Load baseline local seeds first
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      dbState = JSON.parse(data);
    } catch (e) {
      dbState = getBaseSeeds();
    }
  } else {
    dbState = getBaseSeeds();
  }

  // Try connecting to MongoDB if MONGODB_URI is provided or use default localhost / 127.0.0.1
  let mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/interviewace";
  if (mongoURI) {
    console.log(`Connecting to MongoDB: ${mongoURI}`);
    let connected = false;
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
      mongooseConnected = true;
      connected = true;
      console.log("MongoDB MERN backend successfully connected!");
    } catch (mongoErr) {
      console.warn(`Primary MongoDB connection failed: ${mongoErr.message}`);
      
      // Dynamic fallback between 127.0.0.1 and localhost
      let fallbackURI = null;
      if (mongoURI.includes("localhost")) {
        fallbackURI = mongoURI.replace("localhost", "127.0.0.1");
      } else if (mongoURI.includes("127.0.0.1")) {
        fallbackURI = mongoURI.replace("127.0.0.1", "localhost");
      }
      
      if (fallbackURI) {
        console.log(`Attempting dynamic host resolution fallback connection to: ${fallbackURI}`);
        try {
          await mongoose.connect(fallbackURI, { serverSelectionTimeoutMS: 2000 });
          mongoURI = fallbackURI;
          mongooseConnected = true;
          connected = true;
          console.log("MongoDB MERN backend successfully connected via dynamic fallback link!");
        } catch (fallbackErr) {
          console.warn("Fallback MongoDB host-swap connection also failed:", fallbackErr.message);
        }
      }
    }

    if (connected) {
      try {
        // Sync local seeds to Mongo collections if empty
        const userCount = await UserModel.countDocuments();
        if (userCount === 0) {
          console.log("MongoDB is blank; inserting baseline MERN seed collections...");
          await UserModel.insertMany(dbState.users);
          await CodingQuestionModel.insertMany(dbState.codingQuestions);
          await AptitudeQuestionModel.insertMany(dbState.aptitudeQuestions);
          await InterviewQuestionModel.insertMany(dbState.interviewQuestions);
          await ContestModel.insertMany(dbState.contests);
          await HackathonModel.insertMany(dbState.hackathons);
          await CertificateModel.insertMany(dbState.certificates);
        } else {
          // Load actual database state from MongoDB
          console.log("Synchronization state parsing from dynamic MongoDB records...");
          dbState.users = await UserModel.find().lean();
          dbState.codingQuestions = await CodingQuestionModel.find().lean();
          dbState.aptitudeQuestions = await AptitudeQuestionModel.find().lean();
          dbState.interviewQuestions = await InterviewQuestionModel.find().lean();
          dbState.contests = await ContestModel.find().lean();
          dbState.hackathons = await HackathonModel.find().lean();
          dbState.certificates = await CertificateModel.find().lean();
        }
      } catch (syncErr) {
        console.error("Failed to sync records with MongoDB after connection:", syncErr);
        // Fall back to JSON-loaded database state
      }
    }
  }

  // Final merge to pull local seeds that aren't loaded
  let modified = false;
  for (const q of SEED_CODING_QUESTIONS) {
    if (!dbState.codingQuestions.some(existing => existing.id === q.id)) {
      dbState.codingQuestions.push(q);
      modified = true;
      if (mongooseConnected) {
        CodingQuestionModel.create(q).catch(err => console.error(err));
      }
    }
  }
  for (const a of SEED_APTITUDE_QUESTIONS) {
    if (!dbState.aptitudeQuestions.some(existing => existing.id === a.id)) {
      dbState.aptitudeQuestions.push(a);
      modified = true;
      if (mongooseConnected) {
        AptitudeQuestionModel.create(a).catch(err => console.error(err));
      }
    }
  }
  for (const i of SEED_INTERVIEW_QUESTIONS) {
    if (!dbState.interviewQuestions.some(existing => existing.id === i.id)) {
      dbState.interviewQuestions.push(i);
      modified = true;
      if (mongooseConnected) {
        InterviewQuestionModel.create(i).catch(err => console.error(err));
      }
    }
  }

  if (modified) {
    saveLocalDB();
  }
}

function getBaseSeeds() {
  return {
    users: [defaultAdmin, defaultStudent],
    codingQuestions: [...SEED_CODING_QUESTIONS],
    aptitudeQuestions: [...SEED_APTITUDE_QUESTIONS],
    interviewQuestions: [...SEED_INTERVIEW_QUESTIONS],
    contests: DEFAULT_CONTESTS,
    hackathons: DEFAULT_HACKATHONS,
    certificates: [
      { id: "cert-1", userId: "student-1", userName: "Kishan Barnwal", type: "coding_streak", title: "4-Day Coding Streak Master", status: "Approved", issuedAt: new Date().toISOString() }
    ]
  };
}

function saveLocalDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (e) {
    console.error("Local JSON database save anomaly:", e);
  }
}

// Call initDB synchronously to queue background loading
initDB().catch(err => console.error("Database boot sequence failed:", err));

// Dynamic write-through API utilities
export const db = {
  reset: async () => {
    dbState = getBaseSeeds();
    saveLocalDB();
    if (mongooseConnected) {
      try {
        await UserModel.deleteMany({});
        await CodingQuestionModel.deleteMany({});
        await AptitudeQuestionModel.deleteMany({});
        await InterviewQuestionModel.deleteMany({});
        await ContestModel.deleteMany({});
        await HackathonModel.deleteMany({});
        await CertificateModel.deleteMany({});

        await UserModel.insertMany(dbState.users);
        await CodingQuestionModel.insertMany(dbState.codingQuestions);
        await AptitudeQuestionModel.insertMany(dbState.aptitudeQuestions);
        await InterviewQuestionModel.insertMany(dbState.interviewQuestions);
        await ContestModel.insertMany(dbState.contests);
        await HackathonModel.insertMany(dbState.hackathons);
        await CertificateModel.insertMany(dbState.certificates);
      } catch (err) {
        console.error("MERN Reset operation failed:", err);
      }
    }
  },

  // USERS
  getUsers: () => dbState.users,
  getUserById: (id) => dbState.users.find(u => u.id === id),
  getUserByEmail: (email) => dbState.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (user) => {
    dbState.users.push(user);
    saveLocalDB();
    if (mongooseConnected) {
      UserModel.create(user).catch(err => console.error("Mongo insertUser failure:", err));
    }
    return user;
  },
  updateUser: (id, updates) => {
    const idx = dbState.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      dbState.users[idx] = { ...dbState.users[idx], ...updates };
      saveLocalDB();
      if (mongooseConnected) {
        UserModel.updateOne({ id }, { $set: updates }).catch(err => console.error("Mongo updateUser failure:", err));
      }
      return dbState.users[idx];
    }
    return null;
  },
  deleteUser: (id) => {
    dbState.users = dbState.users.filter(u => u.id !== id);
    saveLocalDB();
    if (mongooseConnected) {
      UserModel.deleteOne({ id }).catch(err => console.error("Mongo deleteUser failure:", err));
    }
  },

  // CODING QUESTIONS
  getCodingQuestions: () => dbState.codingQuestions,
  getCodingQuestionById: (id) => dbState.codingQuestions.find(q => q.id === id),
  createCodingQuestion: (q) => {
    dbState.codingQuestions.push(q);
    saveLocalDB();
    if (mongooseConnected) {
      CodingQuestionModel.create(q).catch(err => console.error("Mongo createCodingQuestion failure:", err));
    }
    return q;
  },
  updateCodingQuestion: (id, updates) => {
    const idx = dbState.codingQuestions.findIndex(q => q.id === id);
    if (idx !== -1) {
      dbState.codingQuestions[idx] = { ...dbState.codingQuestions[idx], ...updates };
      saveLocalDB();
      if (mongooseConnected) {
        CodingQuestionModel.updateOne({ id }, { $set: updates }).catch(err => console.error("Mongo updateCodingQuestion failure:", err));
      }
      return dbState.codingQuestions[idx];
    }
    return null;
  },
  deleteCodingQuestion: (id) => {
    dbState.codingQuestions = dbState.codingQuestions.filter(q => q.id !== id);
    saveLocalDB();
    if (mongooseConnected) {
      CodingQuestionModel.deleteOne({ id }).catch(err => console.error("Mongo deleteCodingQuestion failure:", err));
    }
  },

  // APTITUDE QUESTIONS
  getAptitudeQuestions: () => dbState.aptitudeQuestions,
  getAptitudeQuestionById: (id) => dbState.aptitudeQuestions.find(q => q.id === id),
  createAptitudeQuestion: (q) => {
    dbState.aptitudeQuestions.push(q);
    saveLocalDB();
    if (mongooseConnected) {
      AptitudeQuestionModel.create(q).catch(err => console.error("Mongo createAptitudeQuestion failure:", err));
    }
    return q;
  },
  deleteAptitudeQuestion: (id) => {
    dbState.aptitudeQuestions = dbState.aptitudeQuestions.filter(q => q.id !== id);
    saveLocalDB();
    if (mongooseConnected) {
      AptitudeQuestionModel.deleteOne({ id }).catch(err => console.error("Mongo deleteAptitudeQuestion failure:", err));
    }
  },

  // INTERVIEW QUESTIONS
  getInterviewQuestions: () => dbState.interviewQuestions,
  createInterviewQuestion: (q) => {
    dbState.interviewQuestions.push(q);
    saveLocalDB();
    if (mongooseConnected) {
      InterviewQuestionModel.create(q).catch(err => console.error("Mongo createInterviewQuestion failure:", err));
    }
    return q;
  },
  deleteInterviewQuestion: (id) => {
    dbState.interviewQuestions = dbState.interviewQuestions.filter(q => q.id !== id);
    saveLocalDB();
    if (mongooseConnected) {
      InterviewQuestionModel.deleteOne({ id }).catch(err => console.error("Mongo deleteInterviewQuestion failure:", err));
    }
  },

  // CONTESTS
  getContests: () => dbState.contests,
  createContest: (c) => {
    dbState.contests.push(c);
    saveLocalDB();
    if (mongooseConnected) {
      ContestModel.create(c).catch(err => console.error("Mongo createContest failure:", err));
    }
    return c;
  },

  // HACKATHONS
  getHackathons: () => dbState.hackathons,
  getHackathonById: (id) => dbState.hackathons.find(h => h.id === id),
  createHackathon: (h) => {
    dbState.hackathons.push(h);
    saveLocalDB();
    if (mongooseConnected) {
      HackathonModel.create(h).catch(err => console.error("Mongo createHackathon failure:", err));
    }
    return h;
  },
  updateHackathon: (id, updates) => {
    const idx = dbState.hackathons.findIndex(h => h.id === id);
    if (idx !== -1) {
      dbState.hackathons[idx] = { ...dbState.hackathons[idx], ...updates };
      saveLocalDB();
      if (mongooseConnected) {
        HackathonModel.updateOne({ id }, { $set: updates }).catch(err => console.error("Mongo updateHackathon failure:", err));
      }
      return dbState.hackathons[idx];
    }
    return null;
  },

  // CERTIFICATES
  getCertificates: () => dbState.certificates,
  createCertificate: (cert) => {
    dbState.certificates.push(cert);
    saveLocalDB();
    if (mongooseConnected) {
      CertificateModel.create(cert).catch(err => console.error("Mongo createCertificate failure:", err));
    }
    return cert;
  },
  updateCertificate: (id, updates) => {
    const idx = dbState.certificates.findIndex(c => c.id === id);
    if (idx !== -1) {
      dbState.certificates[idx] = { ...dbState.certificates[idx], ...updates };
      saveLocalDB();
      if (mongooseConnected) {
        CertificateModel.updateOne({ id }, { $set: updates }).catch(err => console.error("Mongo updateCertificate failure:", err));
      }
      return dbState.certificates[idx];
    }
    return null;
  },
  deleteCertificate: (id) => {
    dbState.certificates = dbState.certificates.filter(c => c.id !== id);
    saveLocalDB();
    if (mongooseConnected) {
      CertificateModel.deleteOne({ id }).catch(err => console.error("Mongo deleteCertificate failure:", err));
    }
  }
};
