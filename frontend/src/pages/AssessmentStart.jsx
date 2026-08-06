import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AssessmentStart = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/assessment/start',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate('/assessment/questions', {
        state: { assessmentId: response.data.assessmentId },
      });
    } catch (error) {
      console.error('Start assessment error:', error);
      alert('Failed to start assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CareerCompass AI
              </span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center animate-pulse">
                <span className="text-5xl">🎯</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Career Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your perfect career path with our AI-powered comprehensive assessment
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⏱️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">15 Minutes</h3>
              <p className="text-gray-600">Complete the assessment at your own pace</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">4 Dimensions</h3>
              <p className="text-gray-600">Personality, Interests, Skills & Work Style</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Get personalized career recommendations</p>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What You'll Discover:</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-indigo-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Your Personality Type</h3>
                  <p className="text-gray-600">Understand your unique personality and how it relates to careers</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Top Career Matches</h3>
                  <p className="text-gray-600">AI-powered recommendations tailored to your profile</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Your Strengths</h3>
                  <p className="text-gray-600">Identify your key strengths and how to leverage them</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-yellow-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Development Areas</h3>
                  <p className="text-gray-600">Skills to focus on for your desired career path</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Actionable Next Steps</h3>
                  <p className="text-gray-600">Clear roadmap to start your career journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Before You Start:
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Find a quiet place where you can focus for 15 minutes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Answer honestly - there are no right or wrong answers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Trust your first instinct - don't overthink</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your responses are private and secure</span>
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStart}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </span>
              ) : (
                'Start Assessment →'
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">Free • No credit card required • Takes ~15 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentStart;