import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;
  const { isAuthenticated, user } = useAuth();

  // Get Career Recommendation
  const getRecommendation = async () => {
    if (!userInput.trim()) {
      setError('Please describe your skills and interests');
      return;
    }

    setLoading(true);
    setError('');
    setAiResponse('');

    try {
      const response = await axios.post(`${API_URL}/ai/career-recommendation`, {
        userInput: userInput
      });

      setAiResponse(response.data.aiResponse);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
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
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-indigo-600 transition">Home</a>
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition">Features</a>
              <Link to="/careers" className="text-gray-700 hover:text-indigo-600 transition">Careers</Link>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition">How It Works</a>
              <a href="#try-now" className="text-gray-700 hover:text-indigo-600 transition">Try Now</a>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Hello, {user?.firstName}!</span>
                  <Link to="/dashboard" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Login</Link>
                  <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block mb-4">
              <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
                🚀 AI-Powered Career Guidance
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Perfect Career </span>
              Path
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Let AI analyze your skills, interests, and goals to provide personalized career recommendations.
              Make informed decisions about your professional future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"  // Change from <a href="#try-now"> to this
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center lg:justify-start">
              <div>
                <div className="text-3xl font-bold text-indigo-600">10K+</div>
                <div className="text-gray-600 text-sm">Users Guided</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">100+</div>  {/* CHANGED */}
                <div className="text-gray-600 text-sm">Career Paths</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">12</div>  {/* NEW */}
                <div className="text-gray-600 text-sm">Industries</div>  {/* NEW */}
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-600">Personalized recommendations tailored just for you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CareerCompass AI?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive career guidance powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Career Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Take our comprehensive AI-powered assessment to discover careers that match your personality, skills, and interests.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Skills Gap Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Identify the skills you need to develop and get personalized learning paths to achieve your career goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Market Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Access real-time data on salary trends, job demand, and growth projections for your target careers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resume Builder</h3>
              <p className="text-gray-600 leading-relaxed">
                Create professional, ATS-friendly resumes with AI-powered suggestions and multiple templates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Learning Resources</h3>
              <p className="text-gray-600 leading-relaxed">
                Curated courses, tutorials, and certifications to help you develop the skills needed for your dream career.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 AI Counselor</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant answers to your career questions anytime with our intelligent AI chatbot counselor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Library Section - ADD THIS */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore 100+ Career Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive career library with detailed information on salaries,
              growth outlook, required skills, and personalized recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find careers by title, skills, industry, salary range, and more with powerful filters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Information</h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive details including day-in-the-life, career paths, and required certifications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Recommendations</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete your assessment to get personalized career recommendations with match scores.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/careers"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Browse Career Library →
            </Link>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to discover your ideal career path
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Take Assessment</h3>
              <p className="text-gray-600">Complete our AI-powered career assessment</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Recommendations</h3>
              <p className="text-gray-600">Receive personalized career suggestions</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Your Journey</h3>
              <p className="text-gray-600">Follow your personalized career roadmap</p>
            </div>
          </div>
        </div>
      </section>

      {/* Try AI Demo Section */}
      <section id="try-now" className="bg-gradient-to-br from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Try Our AI Career Counselor</h2>
              <p className="text-xl text-indigo-100">
                Get instant career recommendations powered by artificial intelligence
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold mb-3 text-lg">
                  Tell us about your skills and interests:
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Example: I enjoy coding, problem-solving, and working with data. I'm interested in technology and innovation..."
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-gray-700"
                  rows="5"
                />
              </div>

              <button
                onClick={getRecommendation}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  '✨ Get AI Career Recommendations'
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-800 font-semibold">⚠️ {error}</p>
                </div>
              )}

              {/* AI Response */}
              {aiResponse && (
                <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl">
                  <div className="flex items-start">
                    <span className="text-4xl mr-4">🤖</span>
                    <div className="flex-1">
                      <p className="text-indigo-900 font-semibold mb-2 text-lg">AI Career Counselor:</p>
                      <p className="text-gray-800 leading-relaxed text-lg">{aiResponse}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have discovered their perfect career path
          </p>
          <Link
            to="/register"  // Change from <button> to this
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold">CareerCompass AI</span>
              </div>
              <p className="text-gray-400">Empowering your career decisions with AI</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareerCompass AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;