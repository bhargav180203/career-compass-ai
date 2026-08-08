import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'date', label: 'Most Recent' },
  { value: 'salary', label: 'Highest Salary' },
];

const JobSearch = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('India');
  const [jobType, setJobType] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [matchLoading, setMatchLoading] = useState(null);
  const [matchResults, setMatchResults] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const searchJobs = useCallback(async (newPage = 1) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const { data } = await axios.get(`${API}/jobs/search`, {
        headers,
        params: { q: query, location, job_type: jobType, sort_by: sortBy, page: newPage, results_per_page: 10 },
      });
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.count || 0);
      setPage(newPage);
    } catch {
      setError('Job search failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [query, location, jobType, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (job) => {
    setSavingId(job.jobId);
    try {
      if (job.isSaved) {
        await axios.delete(`${API}/jobs/saved/by-job-id/${job.jobId}`, { headers });
        setJobs((prev) => prev.map((j) => j.jobId === job.jobId ? { ...j, isSaved: false } : j));
      } else {
        await axios.post(`${API}/jobs/save`, job, { headers });
        setJobs((prev) => prev.map((j) => j.jobId === job.jobId ? { ...j, isSaved: true } : j));
      }
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg === 'Job already saved') {
        setJobs((prev) => prev.map((j) => j.jobId === job.jobId ? { ...j, isSaved: true } : j));
      } else {
        setError('Failed to save job. Please try again.');
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleMatchScore = async (job) => {
    setMatchLoading(job.jobId);
    try {
      const { data } = await axios.post(`${API}/jobs/match-score`, job, { headers });
      setMatchResults((prev) => ({ ...prev, [job.jobId]: data }));
    } catch {
      setError('Failed to get match score.');
    } finally {
      setMatchLoading(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const fmtSalary = (salary) => {
    if (!salary?.min && !salary?.max) return null;
    const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n?.toLocaleString()}`;
    if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)}`;
    if (salary.max) return `Up to ${fmt(salary.max)}`;
    return `From ${fmt(salary.min)}`;
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

  const scoreColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-500 bg-red-50';
  };

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
              <button onClick={() => navigate('/jobs/saved')} className="text-indigo-600 font-semibold hover:underline text-sm">Saved Jobs</button>
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
          <h1 className="text-4xl font-bold mb-2">Job Search 💼</h1>
          <p className="text-indigo-100 text-lg">Find opportunities that match your skills and career goals.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Job Title / Keywords</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. React Developer, Data Analyst..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchJobs(1)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. Mumbai, Bangalore..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchJobs(1)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => searchJobs(1)}
                disabled={loading || !query.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60"
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Job Type</label>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sort By</label>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Searching jobs...</p>
            </div>
          </div>
        ) : !hasSearched ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Search for your next opportunity</h2>
            <p className="text-gray-500 max-w-md mx-auto">Enter a job title or keyword above and hit Search to find live job listings from across India.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <span className="text-5xl mb-4 block">😕</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h2>
            <p className="text-gray-500">Try different keywords or a broader location.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm"><span className="font-bold text-gray-800">{totalCount.toLocaleString()}</span> jobs found for <span className="font-bold text-indigo-600">"{query}"</span></p>
              <p className="text-gray-400 text-sm">Page {page} of {totalPages}</p>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => {
                const match = matchResults[job.jobId];
                const isExpanded = expandedJob === job.jobId;

                return (
                  <div key={job.jobId} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-600 font-bold text-sm">{job.company?.charAt(0) || 'J'}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-lg leading-tight">{job.title}</h3>
                              <p className="text-indigo-600 font-semibold text-sm">{job.company}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.location && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">📍 {job.location}</span>
                            )}
                            {job.jobType && (
                              <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">{job.jobType.replace('_', ' ')}</span>
                            )}
                            {job.category && (
                              <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">{job.category}</span>
                            )}
                            {fmtSalary(job.salary) && (
                              <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">💰 {fmtSalary(job.salary)}</span>
                            )}
                            {job.postedAt && (
                              <span className="bg-gray-50 text-gray-500 text-xs px-3 py-1 rounded-full">🗓 {fmtDate(job.postedAt)}</span>
                            )}
                          </div>

                          {/* Description preview */}
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {job.description?.slice(0, 200)}...
                          </p>

                          {isExpanded && (
                            <p className="text-gray-600 text-sm leading-relaxed mt-2">{job.description}</p>
                          )}

                          <button
                            onClick={() => setExpandedJob(isExpanded ? null : job.jobId)}
                            className="text-indigo-500 text-xs mt-1 hover:underline"
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        </div>

                        {/* Right - Match Score */}
                        {match && (
                          <div className={`flex-shrink-0 text-center px-4 py-3 rounded-xl ${scoreColor(match.score)}`}>
                            <p className="text-2xl font-bold">{match.score}%</p>
                            <p className="text-xs font-semibold">Match</p>
                          </div>
                        )}
                      </div>

                      {/* Match Details */}
                      {match && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-700 mb-2 font-semibold">AI Analysis</p>
                          <p className="text-sm text-gray-600 mb-2 italic">"{match.verdict}"</p>
                          <div className="grid md:grid-cols-2 gap-3">
                            {match.reasons?.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-green-700 mb-1">✓ Why you match</p>
                                <ul className="space-y-1">
                                  {match.reasons.map((r, i) => <li key={i} className="text-xs text-gray-600">• {r}</li>)}
                                </ul>
                              </div>
                            )}
                            {match.missingSkills?.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-red-600 mb-1">✗ Skills to develop</p>
                                <div className="flex flex-wrap gap-1">
                                  {match.missingSkills.map((s, i) => (
                                    <span key={i} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition"
                        >
                          Apply Now →
                        </a>
                        <button
                          onClick={() => handleSave(job)}
                          disabled={savingId === job.jobId}
                          className={`px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                            job.isSaved
                              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {savingId === job.jobId ? '...' : job.isSaved ? '★ Saved' : '☆ Save'}
                        </button>
                        <button
                          onClick={() => handleMatchScore(job)}
                          disabled={matchLoading === job.jobId}
                          className="bg-purple-50 text-purple-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition disabled:opacity-50"
                        >
                          {matchLoading === job.jobId ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              Analysing...
                            </span>
                          ) : match ? '✨ Re-analyse' : '✨ AI Match'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={() => searchJobs(page - 1)}
                  disabled={page === 1 || loading}
                  className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  ← Previous
                </button>
                <span className="px-5 py-2 text-sm text-gray-500">Page {page} of {totalPages}</span>
                <button
                  onClick={() => searchJobs(page + 1)}
                  disabled={page === totalPages || loading}
                  className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-10 text-center">
          <button onClick={() => navigate('/dashboard')} className="text-indigo-600 font-semibold hover:underline">← Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;