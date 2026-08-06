import React, { useState, useEffect , useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const ResumeList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchResumes = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/resume`, { headers });
      setResumes(data.resumes || []);
    } catch {
      setError('Failed to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const { data } = await axios.post(
        `${API}/resume`,
        { name: 'My Resume', template: 'modern', autoPopulate: true },
        { headers }
      );
      navigate(`/resume/${data.resume._id}`);
    } catch {
      setError('Failed to create resume. Please try again.');
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/resume/${id}`, { headers });
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError('Failed to delete resume.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(`${API}/resume/${id}/default`, {}, { headers });
      setResumes((prev) =>
        prev.map((r) => ({ ...r, isDefault: r._id === id }))
      );
    } catch {
      setError('Failed to update default resume.');
    }
  };

  const templateColors = {
    modern: 'from-indigo-500 to-purple-500',
    classic: 'from-blue-500 to-cyan-500',
    minimal: 'from-gray-400 to-gray-600',
    professional: 'from-slate-600 to-slate-800',
  };

  const templateIcon = {
    modern: '✦',
    classic: '◈',
    minimal: '◻',
    professional: '▣',
  };

  const atsColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  const atsBg = (score) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
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

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Resumes 📝</h1>
            <p className="text-indigo-100 text-lg">
              Create, manage, and export your professional resumes with AI assistance.
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:shadow-lg transition disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
          >
            {creating ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating...
              </>
            ) : (
              <>+ New Resume</>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading your resumes...</p>
            </div>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📄</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No resumes yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Create your first resume. We'll auto-fill it from your profile so you can get started in seconds.
            </p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-60"
            >
              {creating ? 'Creating...' : 'Create My First Resume →'}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create new card */}
            <div
              onClick={handleCreate}
              className="bg-white rounded-2xl shadow-md border-2 border-dashed border-indigo-200 p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:shadow-lg transition group min-h-[220px]"
            >
              <div className="w-14 h-14 bg-indigo-50 group-hover:bg-indigo-100 rounded-full flex items-center justify-center mb-4 transition">
                <span className="text-3xl text-indigo-400">+</span>
              </div>
              <p className="text-indigo-600 font-semibold">Create New Resume</p>
              <p className="text-gray-400 text-sm mt-1">Auto-filled from your profile</p>
            </div>

            {/* Resume cards */}
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Template colour strip */}
                <div
                  className={`h-2 bg-gradient-to-r ${templateColors[resume.template] || templateColors.modern}`}
                />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${templateColors[resume.template] || templateColors.modern} flex items-center justify-center text-white text-lg`}
                      >
                        {templateIcon[resume.template] || '✦'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{resume.name}</h3>
                        <p className="text-xs text-gray-400 capitalize">{resume.template} template</p>
                      </div>
                    </div>
                    {resume.isDefault && (
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  {/* ATS Score */}
                  <div className={`${atsBg(resume.atsScore)} rounded-lg px-4 py-3 mb-4`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-600">ATS Score</span>
                      <span className={`text-sm font-bold ${atsColor(resume.atsScore)}`}>
                        {resume.atsScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          resume.atsScore >= 75
                            ? 'from-green-400 to-green-600'
                            : resume.atsScore >= 50
                            ? 'from-yellow-400 to-yellow-600'
                            : 'from-red-400 to-red-600'
                        }`}
                        style={{ width: `${resume.atsScore}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-5">
                    Updated {new Date(resume.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => navigate(`/resume/${resume._id}`)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-md transition"
                    >
                      Edit
                    </button>
                    {!resume.isDefault && (
                      <button
                        onClick={() => handleSetDefault(resume._id)}
                        className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(resume._id)}
                      disabled={deletingId === resume._id}
                      className="bg-red-50 text-red-500 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {deletingId === resume._id ? '...' : '🗑'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to dashboard */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 font-semibold hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeList;