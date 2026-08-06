import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved', color: 'bg-blue-100 text-blue-700' },
  { value: 'applied', label: 'Applied', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'offered', label: 'Offered', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

const FILTER_TABS = [{ value: '', label: 'All' }, ...STATUS_OPTIONS];

const SavedJobs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ saved: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        axios.get(`${API}/jobs/saved`, { headers, params: { status: filterStatus } }),
        axios.get(`${API}/jobs/stats`, { headers }),
      ]);
      setJobs(jobsRes.data.jobs || []);
      setStats(statsRes.data.stats || {});
    } catch {
      setError('Failed to load saved jobs.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (jobDbId, newStatus) => {
    setUpdatingId(jobDbId);
    try {
      const { data } = await axios.put(`${API}/jobs/saved/${jobDbId}/status`, { status: newStatus }, { headers });
      setJobs((prev) => prev.map((j) => j._id === jobDbId ? data.job : j));
      // Refresh stats
      const statsRes = await axios.get(`${API}/jobs/stats`, { headers });
      setStats(statsRes.data.stats || {});
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (jobDbId) => {
    if (!window.confirm('Remove this job from your saved list?')) return;
    setDeletingId(jobDbId);
    try {
      await axios.delete(`${API}/jobs/saved/${jobDbId}`, { headers });
      setJobs((prev) => prev.filter((j) => j._id !== jobDbId));
      const statsRes = await axios.get(`${API}/jobs/stats`, { headers });
      setStats(statsRes.data.stats || {});
    } catch {
      setError('Failed to remove job.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveNotes = async (jobDbId) => {
    try {
      await axios.put(`${API}/jobs/saved/${jobDbId}/status`, { notes: noteText }, { headers });
      setJobs((prev) => prev.map((j) => j._id === jobDbId ? { ...j, notes: noteText } : j));
      setEditingNotes(null);
    } catch {
      setError('Failed to save notes.');
    }
  };

  const getStatusStyle = (status) => STATUS_OPTIONS.find((s) => s.value === status)?.color || 'bg-gray-100 text-gray-600';

  const fmtSalary = (salary) => {
    if (!salary?.min && !salary?.max) return null;
    const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n?.toLocaleString()}`;
    if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)}`;
    return salary.max ? `Up to ${fmt(salary.max)}` : `From ${fmt(salary.min)}`;
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CareerCompass AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/jobs')} className="text-indigo-600 font-semibold hover:underline text-sm">Search Jobs</button>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              ) : null}
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center" style={{ display: user?.profilePicture ? 'none' : 'flex' }}>
                <span className="text-indigo-600 font-bold">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              </div>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Saved Jobs & Tracker ⭐</h1>
          <p className="text-indigo-100 text-lg">Track your job applications from saved to offered.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-white' },
            { label: 'Saved', value: stats.saved, color: 'bg-blue-50' },
            { label: 'Applied', value: stats.applied, color: 'bg-indigo-50' },
            { label: 'Interviewing', value: stats.interviewing, color: 'bg-yellow-50' },
            { label: 'Offered', value: stats.offered, color: 'bg-green-50' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl shadow-sm p-4 text-center`}>
              <p className="text-2xl font-bold text-gray-800">{s.value || 0}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-semibold transition border-b-2 ${
                  filterStatus === tab.value
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.value === '' && stats.total > 0 && (
                  <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{stats.total}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading saved jobs...</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <span className="text-5xl mb-4 block">⭐</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No jobs here yet</h2>
            <p className="text-gray-500 mb-6">
              {filterStatus ? `No jobs with status "${filterStatus}".` : 'Save jobs from the search page to track them here.'}
            </p>
            <button onClick={() => navigate('/jobs')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
              Search Jobs →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-bold text-sm">{job.company?.charAt(0) || 'J'}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{job.title}</h3>
                        <p className="text-indigo-600 font-semibold text-sm">{job.company}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(job.status)}`}>
                        {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                      </span>
                      {job.matchScore && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          job.matchScore >= 75 ? 'bg-green-100 text-green-700'
                          : job.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-600'
                        }`}>
                          ✨ {job.matchScore}% Match
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.location && <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">📍 {job.location}</span>}
                      {fmtSalary(job.salary) && <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">💰 {fmtSalary(job.salary)}</span>}
                      {job.category && <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">{job.category}</span>}
                      {job.appliedAt && <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full">Applied: {new Date(job.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    </div>

                    {/* Notes */}
                    {editingNotes === job._id ? (
                      <div className="mt-3">
                        <textarea
                          rows={3}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          placeholder="Add notes about this application..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleSaveNotes(job._id)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">Save Notes</button>
                          <button onClick={() => setEditingNotes(null)} className="text-gray-500 px-4 py-1.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition">Cancel</button>
                        </div>
                      </div>
                    ) : job.notes ? (
                      <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                        <p className="text-xs font-semibold text-yellow-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{job.notes}</p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition">
                    Apply Now →
                  </a>

                  {/* Status Selector */}
                  <select
                    value={job.status}
                    disabled={updatingId === job._id}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => { setEditingNotes(job._id); setNoteText(job.notes || ''); }}
                    className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-100 transition"
                  >
                    📝 Notes
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deletingId === job._id}
                    className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deletingId === job._id ? '...' : '🗑 Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button onClick={() => navigate('/dashboard')} className="text-indigo-600 font-semibold hover:underline">← Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;