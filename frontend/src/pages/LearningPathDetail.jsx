import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const platformColors = {
  Coursera: 'bg-blue-100 text-blue-700',
  Udemy: 'bg-purple-100 text-purple-700',
  YouTube: 'bg-red-100 text-red-700',
  edX: 'bg-indigo-100 text-indigo-700',
  freeCodeCamp: 'bg-green-100 text-green-700',
  MDN: 'bg-orange-100 text-orange-700',
  Documentation: 'bg-gray-100 text-gray-700',
  Blog: 'bg-yellow-100 text-yellow-700',
  Other: 'bg-gray-100 text-gray-600',
};

const platformIcons = {
  Coursera: '🎓',
  Udemy: '🎯',
  YouTube: '▶️',
  edX: '📚',
  freeCodeCamp: '💻',
  MDN: '📖',
  Documentation: '📄',
  Blog: '✍️',
  Other: '🔗',
};

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

const LearningPathDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTopic, setUpdatingTopic] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPath = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/learning/${id}`, { headers });
      setPath(data.path);
    } catch {
      setError('Failed to load learning path.');
    } finally {
      setLoading(false);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchPath(); }, [fetchPath]);

  const handleToggleTopic = async (phaseIndex, topicIndex, currentStatus) => {
    const key = `${phaseIndex}-${topicIndex}`;
    setUpdatingTopic(key);
    try {
      const { data } = await axios.put(
        `${API}/learning/${id}/progress`,
        { phaseIndex, topicIndex, isCompleted: !currentStatus },
        { headers }
      );

      setPath((prev) => {
        const updated = { ...prev };
        updated.phases = prev.phases.map((phase, pi) => {
          if (pi !== phaseIndex) return phase;
          return {
            ...phase,
            topics: phase.topics.map((topic, ti) => {
              if (ti !== topicIndex) return topic;
              return { ...topic, isCompleted: !currentStatus, completedAt: !currentStatus ? new Date() : null };
            }),
          };
        });
        updated.progressPercentage = data.progressPercentage;
        updated.completedTopics = data.completedTopics;
        updated.totalTopics = data.totalTopics;
        updated.isCompleted = data.isCompleted;
        return updated;
      });
    } catch {
      setError('Failed to update progress.');
    } finally {
      setUpdatingTopic(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Learning path not found.'}</p>
          <button onClick={() => navigate('/learning')} className="text-indigo-600 underline">Back to Learning Paths</button>
        </div>
      </div>
    );
  }

  const phaseProgress = (phase) => {
    const total = phase.topics.length;
    const done = phase.topics.filter((t) => t.isCompleted).length;
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
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
              <button onClick={() => navigate('/learning')} className="text-indigo-600 font-semibold text-sm hover:underline">← All Paths</button>
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

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {path.generatedFrom === 'assessment' ? '📊 From Assessment' : '✏️ Manual'}
                </span>
                {path.isCompleted && (
                  <span className="bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full">🎉 Completed!</span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{path.targetRole}</h1>
              <p className="text-indigo-100 mb-4">{path.description}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">⏱ {path.totalDuration}</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">📊 {path.difficulty}</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">{path.phases.length} phases</span>
              </div>
            </div>

            {/* Overall Progress Circle */}
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${path.progressPercentage}, 100`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{path.progressPercentage}%</span>
                  <span className="text-xs opacity-80">Done</span>
                </div>
              </div>
              <p className="text-xs mt-2 opacity-80">{path.completedTopics}/{path.totalTopics} topics</p>
            </div>
          </div>
        </div>

        {/* Skill Gap */}
        {(path.missingSkills?.length > 0 || path.currentSkills?.length > 0) && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Skill Gap Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {path.currentSkills?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2">✓ Your Current Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {path.currentSkills.map((skill, i) => (
                      <span key={i} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {path.missingSkills?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-2">✗ Skills to Develop</p>
                  <div className="flex flex-wrap gap-2">
                    {path.missingSkills.map((skill, i) => (
                      <span key={i} className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full border border-red-200">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phases */}
        <div className="space-y-4">
          {path.phases.map((phase, phaseIndex) => {
            const prog = phaseProgress(phase);
            const isExpanded = expandedPhase === phaseIndex;

            return (
              <div key={phaseIndex} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Phase Header */}
                <div
                  className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition"
                  onClick={() => setExpandedPhase(isExpanded ? -1 : phaseIndex)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      prog.pct === 100 ? 'bg-green-500' : prog.pct > 0 ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}>
                      {prog.pct === 100 ? '✓' : phaseIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg">{phase.title}</h3>
                      <p className="text-gray-500 text-sm">{phase.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${prog.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{prog.done}/{prog.total}</span>
                        {phase.duration && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">⏱ {phase.duration}</span>}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 ml-4">{isExpanded ? '▲' : '▼'}</span>
                </div>

                {/* Topics */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {phase.topics.map((topic, topicIndex) => {
                      const key = `${phaseIndex}-${topicIndex}`;
                      const isUpdating = updatingTopic === key;

                      return (
                        <div key={topicIndex} className={`p-6 border-b border-gray-50 last:border-b-0 ${topic.isCompleted ? 'bg-green-50' : ''}`}>
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <button
                              onClick={() => handleToggleTopic(phaseIndex, topicIndex, topic.isCompleted)}
                              disabled={isUpdating}
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                                topic.isCompleted
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-indigo-400'
                              } disabled:opacity-50`}
                            >
                              {isUpdating ? (
                                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              ) : topic.isCompleted ? '✓' : ''}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                                <h4 className={`font-semibold text-base ${topic.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {topic.title}
                                </h4>
                                <div className="flex gap-2 flex-shrink-0">
                                  {topic.difficulty && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${difficultyColors[topic.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                                      {topic.difficulty}
                                    </span>
                                  )}
                                  {topic.estimatedTime && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">⏱ {topic.estimatedTime}</span>
                                  )}
                                </div>
                              </div>

                              {topic.description && (
                                <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                              )}

                              {/* Resources */}
                              {topic.resources?.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Resources</p>
                                  {topic.resources.map((resource, ri) => (
                                    <a
                                      key={ri}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-xl px-4 py-3 transition group"
                                    >
                                      <span className="text-lg flex-shrink-0">{platformIcons[resource.platform] || '🔗'}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 truncate">{resource.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${platformColors[resource.platform] || 'bg-gray-100 text-gray-600'}`}>
                                            {resource.platform}
                                          </span>
                                          {resource.duration && <span className="text-xs text-gray-400">⏱ {resource.duration}</span>}
                                          <span className={`text-xs px-2 py-0.5 rounded-full ${resource.isFree ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {resource.isFree ? 'Free' : 'Paid'}
                                          </span>
                                        </div>
                                      </div>
                                      <span className="text-gray-400 group-hover:text-indigo-500 flex-shrink-0">→</span>
                                    </a>
                                  ))}
                                </div>
                              )}

                              {topic.isCompleted && topic.completedAt && (
                                <p className="text-xs text-green-600 mt-2">
                                  ✓ Completed on {new Date(topic.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Banner */}
        {path.isCompleted && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center mt-8">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-green-100 mb-6">You've completed the {path.targetRole} learning path. You're ready to take on the job market!</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => navigate('/jobs')} className="bg-white text-green-700 font-bold px-6 py-2.5 rounded-xl hover:shadow-lg transition">
                Search Jobs →
              </button>
              <button onClick={() => navigate('/resume')} className="bg-white bg-opacity-20 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-opacity-30 transition">
                Update Resume →
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/learning')} className="text-indigo-600 font-semibold hover:underline">← Back to All Paths</button>
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetail;