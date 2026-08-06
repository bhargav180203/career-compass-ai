// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import CareerLibrary from './pages/CareerLibrary';
import CareerDetail from './pages/CareerDetail';
import AssessmentStart from './pages/AssessmentStart';
import AssessmentQuestions from './pages/AssessmentQuestions';
import AssessmentResults from './pages/AssessmentResults';
import Profile from './pages/Profile';
import ResumeList from './pages/ResumeList';
import ResumeBuilder from './pages/ResumeBuilder';
import JobSearch from './pages/JobSearch';
import SavedJobs from './pages/SavedJobs';
import LearningPathList from './pages/LearningPathList';
import LearningPathDetail from './pages/LearningPathDetail';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/resume" element={
          <ProtectedRoute>
            <ResumeList />
          </ProtectedRoute>
        } />
        <Route path="/resume/:id" element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        } />

        <Route path="/jobs" element={
          <ProtectedRoute>
            <JobSearch />
          </ProtectedRoute>
        } />
        <Route path="/jobs/saved" element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        } />
        <Route path="/learning" element={
          <ProtectedRoute>
            <LearningPathList />
          </ProtectedRoute>
        } />
        <Route path="/learning/:id" element={
          <ProtectedRoute>
            <LearningPathDetail />
          </ProtectedRoute>
        } />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/assessment/start"
          element={
            <ProtectedRoute>
              <AssessmentStart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/questions"
          element={
            <ProtectedRoute>
              <AssessmentQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/results"
          element={
            <ProtectedRoute>
              <AssessmentResults />
            </ProtectedRoute>
          }
        />
        <Route path="/careers" element={<CareerLibrary />} />
        <Route path="/careers/:slug" element={<CareerDetail />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;