/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Page Imports
import { Landing } from './pages/Landing';
import { Authentication } from './pages/Authentication';
import { Dashboard } from './pages/Dashboard';
import { CodingList } from './pages/CodingList';
import { CodingWorkspace } from './components/CodingWorkspace';
import { AptitudeHome } from './pages/AptitudeHome';
import { CompanyPrep } from './pages/CompanyPrep';
import { MockInterview } from './pages/MockInterview';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { Hackathons } from './pages/Hackathons';
import { AdminDashboard } from './pages/AdminDashboard';

// Custom Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-[#0b0f19] text-slate-100 min-h-screen font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
          {/* Main Navigation bar */}
          <Navbar />

          {/* Centralized viewport screens router */}
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Authentication />} />
              <Route path="/register" element={<Authentication />} />

              {/* Protected Student / Admin Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/practice" 
                element={
                  <ProtectedRoute>
                    <CodingList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/coding/:id" 
                element={
                  <ProtectedRoute>
                    <CodingWorkspace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/aptitude" 
                element={
                  <ProtectedRoute>
                    <AptitudeHome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/company-prep" 
                element={
                  <ProtectedRoute>
                    <CompanyPrep />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mock-interview" 
                element={
                  <ProtectedRoute>
                    <MockInterview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume" 
                element={
                  <ProtectedRoute>
                    <ResumeAnalyzer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contests" 
                element={
                  <ProtectedRoute>
                    <Hackathons />
                  </ProtectedRoute>
                } 
              />

              {/* Admin-exclusive Protected dashboard */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Default fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Global platform footer section */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
