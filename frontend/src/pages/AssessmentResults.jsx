import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { results, aiAnalysis } = location.state || {};

  useEffect(() => {
    if (!results || !aiAnalysis) {
      navigate('/dashboard');
    }
  }, [results, aiAnalysis, navigate]);

  if (!results || !aiAnalysis) return null;

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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-5xl">🎉</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Here's your personalized career analysis
            </p>
          </div>

          {/* Personality Type Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 mb-2">Your Personality Type</p>
                <h2 className="text-5xl font-bold mb-3">{results.personalityType}</h2>
                <p className="text-xl text-indigo-100">{results.personalityDescription}</p>
              </div>
              <div className="text-8xl">🧠</div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-3xl mr-3">🤖</span>
              AI Career Analysis
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {aiAnalysis.summary}
            </p>
          </div>

          {/* Top Career Recommendations */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              🎯 Top Career Recommendations
            </h3>
            <div className="space-y-4">
              {aiAnalysis.careerRecommendations?.map((career, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-800">{career.careerTitle}</h4>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {career.matchPercentage}% Match
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{career.reason}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Salary Range</p>
                      <p className="font-semibold text-gray-800">{career.salaryRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Growth Potential</p>
                      <p className="font-semibold text-gray-800">{career.growthPotential}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {career.requiredSkills?.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Strengths */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">💪</span>
                Your Strengths
              </h3>
              <div className="space-y-3">
                {results.strengths?.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas to Improve */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">📈</span>
                Areas to Develop
              </h3>
              <div className="space-y-3">
                {results.areasToImprove?.map((area, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <span className="text-yellow-600 font-bold text-sm">→</span>
                    </div>
                    <p className="text-gray-700">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interests & Skills */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Dominant Interests */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                💡 Your Top Interests
              </h3>
              <div className="space-y-3">
                {results.dominantInterests?.map((interest, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg"
                  >
                    <p className="font-semibold text-gray-800">{interest}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Skills */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                ⚡ Your Top Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.topSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">🚀</span>
              Your Next Steps
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {aiAnalysis.nextSteps?.map((step, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              📄 Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;