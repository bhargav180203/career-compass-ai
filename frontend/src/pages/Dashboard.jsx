import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecommendedCareers from '../components/RecommendedCareers';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"
                style={{ display: user?.profilePicture ? 'none' : 'flex' }}
              >
                <span className="text-indigo-600 font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-indigo-100 text-lg">
            Ready to continue your career journey?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => navigate('/assessment/start')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Take Assessment</h3>
            <p className="text-gray-600">Discover your perfect career path</p>
          </div>

          <div
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Profile</h3>
            <p className="text-gray-600">Complete your professional profile</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  style={{ width: `${user?.profileCompleteness || 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-indigo-600">
                {user?.profileCompleteness || 0}%
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate('/careers')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Career Library</h3>
            <p className="text-gray-600">Browse 100+ career paths</p>
          </div>

          <div
            onClick={() => navigate('/jobs')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Browse Jobs</h3>
            <p className="text-gray-600">Find opportunities that match your goals</p>
          </div>

          <div
            onClick={() => navigate('/resume')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Build Resume</h3>
            <p className="text-gray-600">Create a professional resume with AI</p>
          </div>
          <div
            onClick={() => navigate('/learning')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Learning Paths</h3>
            <p className="text-gray-600">AI-generated roadmaps to reach your goals</p>
          </div>
        </div>

        <div className="mb-8">
          <RecommendedCareers />
        </div>
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600 font-semibold">Full Name:</span>
              <span className="text-gray-800">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600 font-semibold">Email:</span>
              <span className="text-gray-800">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600 font-semibold">Account Type:</span>
              <span className="text-gray-800 capitalize">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600 font-semibold">Login Method:</span>
              <span className="text-gray-800 capitalize">
                {user?.googleId ? '🔗 Google Account' : '📧 Email & Password'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 font-semibold">Profile Completeness:</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    style={{ width: `${user?.profileCompleteness || 20}%` }}
                  ></div>
                </div>
                <span className="text-gray-800 font-semibold">{user?.profileCompleteness || 20}%</span>
              </div>
            </div>
          </div>
          <button className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Complete Your Profile →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;