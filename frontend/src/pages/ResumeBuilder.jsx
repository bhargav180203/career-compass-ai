import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ResumePreview from './ResumePreview';

const API = process.env.REACT_APP_API_URL;

// ─── Section Tab Config ────────────────────────────────────────────────────────
const SECTION_TABS = [
    { key: 'personalInfo', label: 'Personal', icon: '👤' },
    { key: 'summary', label: 'Summary', icon: '📝' },
    { key: 'experience', label: 'Experience', icon: '💼' },
    { key: 'education', label: 'Education', icon: '🎓' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'certifications', label: 'Certs', icon: '🏆' },
    { key: 'projects', label: 'Projects', icon: '🚀' },
];

const TEMPLATES = ['modern', 'classic', 'minimal', 'professional'];

const ResumeBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [resume, setResume] = useState(null);
    const [activeTab, setActiveTab] = useState('personalInfo');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [atsTips, setAtsTips] = useState([]);
    const [showAtsTips, setShowAtsTips] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Auto-save debounce ref
    const saveTimer = useRef(null);

    const fetchResume = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API}/resume/${id}`, { headers });
            setResume(data.resume);
        } catch {
            setError('Failed to load resume.');
        } finally {
            setLoading(false);
        }
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchResume();
    }, [fetchResume]);

    // ─── Field Updaters ──────────────────────────────────────────────────────────

    const updateField = (path, value) => {
        setResume((prev) => {
            const updated = { ...prev };
            const keys = path.split('.');
            let obj = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                obj[keys[i]] = { ...obj[keys[i]] };
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return updated;
        });
        scheduleSave();
    };

    const updateArrayItem = (arrayKey, index, field, value) => {
        setResume((prev) => {
            const arr = [...(prev[arrayKey] || [])];
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, [arrayKey]: arr };
        });
        scheduleSave();
    };

    const addArrayItem = (arrayKey, template) => {
        setResume((prev) => ({
            ...prev,
            [arrayKey]: [...(prev[arrayKey] || []), template],
        }));
        scheduleSave();
    };

    const removeArrayItem = (arrayKey, index) => {
        setResume((prev) => ({
            ...prev,
            [arrayKey]: prev[arrayKey].filter((_, i) => i !== index),
        }));
        scheduleSave();
    };

    // ─── Auto-save ───────────────────────────────────────────────────────────────

    const scheduleSave = () => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveResume(), 1500);
    };

    const saveResume = async (showMsg = false) => {
        if (!resume) return;
        setSaving(true);
        try {
            await axios.put(`${API}/resume/${id}`, resume, { headers });
            if (showMsg) {
                setSaveMsg('Saved successfully!');
                setTimeout(() => setSaveMsg(''), 3000);
            }
        } catch {
            setError('Auto-save failed. Please save manually.');
        } finally {
            setSaving(false);
        }
    };

    // ─── AI Enhance ─────────────────────────────────────────────────────────────

    const handleAiEnhance = async (section, itemId = null) => {
        setAiLoading(true);
        setError('');
        try {
            const { data } = await axios.post(
                `${API}/resume/${id}/ai-enhance`,
                { section, itemId },
                { headers }
            );
            if (section === 'summary') {
                setResume((prev) => ({
                    ...prev,
                    summary: { content: data.enhanced, aiEnhanced: true },
                    atsScore: data.atsScore,
                }));
            } else if (section === 'experience' && itemId) {
                setResume((prev) => ({
                    ...prev,
                    experience: prev.experience.map((e) =>
                        e._id === itemId ? { ...e, description: data.enhanced, aiEnhanced: true } : e
                    ),
                    atsScore: data.atsScore,
                }));
            } else if (section === 'project' && itemId) {
                setResume((prev) => ({
                    ...prev,
                    projects: prev.projects.map((p) =>
                        p._id === itemId ? { ...p, description: data.enhanced, aiEnhanced: true } : p
                    ),
                    atsScore: data.atsScore,
                }));
            }
            setSaveMsg('AI enhancement applied!');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch {
            setError('AI enhancement failed. Please try again.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleFetchAtsTips = async () => {
        try {
            const { data } = await axios.get(`${API}/resume/${id}/ats-tips`, { headers });
            setAtsTips(data.tips || []);
            setShowAtsTips(true);
        } catch {
            setError('Failed to fetch ATS tips.');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading resume builder...</p>
                </div>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'Resume not found.'}</p>
                    <button onClick={() => navigate('/resume')} className="text-indigo-600 underline">
                        Back to Resumes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Nav */}
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => navigate('/resume')}
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">C</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    CareerCompass AI
                                </span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <input
                                value={resume.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="text-gray-800 font-semibold bg-transparent border-b border-transparent hover:border-indigo-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            {saving && <span className="text-xs text-gray-400">Saving...</span>}
                            {saveMsg && <span className="text-xs text-green-600 font-medium">{saveMsg}</span>}

                            {/* Template Switcher */}
                            <select
                                value={resume.template}
                                onChange={(e) => updateField('template', e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            >
                                {TEMPLATES.map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
                            >
                                {showPreview ? 'Hide Preview' : 'Preview'}
                            </button>
                            <button
                                onClick={handleFetchAtsTips}
                                className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-100 transition"
                            >
                                ATS Tips
                            </button>
                            <button
                                onClick={handlePrint}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:shadow-md transition"
                            >
                                Export PDF
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {error && (
                <div className="bg-red-50 border-b border-red-200 text-red-700 px-6 py-2 text-sm">
                    {error}
                </div>
            )}

            {/* ATS Tips Drawer */}
            {showAtsTips && (
                <div className="bg-white border-b shadow-sm px-6 py-4">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-gray-800">ATS Optimization Tips</h3>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${resume.atsScore >= 75
                                    ? 'bg-green-100 text-green-700'
                                    : resume.atsScore >= 50
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-600'
                                    }`}>
                                    Score: {resume.atsScore}%
                                </span>
                            </div>
                            <button onClick={() => setShowAtsTips(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {atsTips.map((tip, i) => (
                                <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${tip.type === 'error' ? 'bg-red-50 text-red-700'
                                    : tip.type === 'warning' ? 'bg-yellow-50 text-yellow-700'
                                        : tip.type === 'success' ? 'bg-green-50 text-green-700'
                                            : 'bg-blue-50 text-blue-700'
                                    }`}>
                                    <span className="mt-0.5 flex-shrink-0">
                                        {tip.type === 'error' ? '✗' : tip.type === 'warning' ? '⚠' : tip.type === 'success' ? '✓' : 'ℹ'}
                                    </span>
                                    {tip.message}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={`container mx-auto px-6 py-8 ${showPreview ? 'grid grid-cols-2 gap-6 items-start' : ''}`}>
                {/* ── Editor Panel ──────────────────────────────────────────────────── */}
                <div>
                    {/* Section Tabs */}
                    <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
                        <div className="flex overflow-x-auto">
                            {SECTION_TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-semibold transition border-b-2 ${activeTab === tab.key
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        {activeTab === 'personalInfo' && (
                            <PersonalInfoTab resume={resume} updateField={updateField} />
                        )}
                        {activeTab === 'summary' && (
                            <SummaryTab
                                resume={resume}
                                updateField={updateField}
                                onAiEnhance={() => handleAiEnhance('summary')}
                                aiLoading={aiLoading}
                            />
                        )}
                        {activeTab === 'experience' && (
                            <ExperienceTab
                                resume={resume}
                                updateArrayItem={updateArrayItem}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                                onAiEnhance={handleAiEnhance}
                                aiLoading={aiLoading}
                            />
                        )}
                        {activeTab === 'education' && (
                            <EducationTab
                                resume={resume}
                                updateArrayItem={updateArrayItem}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                            />
                        )}
                        {activeTab === 'skills' && (
                            <SkillsTab
                                resume={resume}
                                updateArrayItem={updateArrayItem}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                            />
                        )}
                        {activeTab === 'certifications' && (
                            <CertificationsTab
                                resume={resume}
                                updateArrayItem={updateArrayItem}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                            />
                        )}
                        {activeTab === 'projects' && (
                            <ProjectsTab
                                resume={resume}
                                updateArrayItem={updateArrayItem}
                                addArrayItem={addArrayItem}
                                removeArrayItem={removeArrayItem}
                                onAiEnhance={handleAiEnhance}
                                aiLoading={aiLoading}
                            />
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            onClick={() => navigate('/resume')}
                            className="text-gray-600 px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                        >
                            ← All Resumes
                        </button>
                        <button
                            onClick={() => saveResume(true)}
                            disabled={saving}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Save Now'}
                        </button>
                    </div>
                </div>

                {/* ── Preview Panel ─────────────────────────────────────────────────── */}
                {showPreview && (
                    <div className="sticky top-20">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-600">Live Preview</span>
                                <span className="text-xs text-gray-400 capitalize">{resume.template} template</span>
                            </div>
                            <div className="overflow-y-auto max-h-[80vh] p-4">
                                <div id="resume-print-area">
                                    <ResumePreview resume={resume} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Print styles */}
            <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          * { visibility: hidden; }
          #resume-print-area, #resume-print-area * { visibility: visible; }
          #resume-print-area {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
          }
          #resume-print-area > div {
            transform: none !important;
            width: 100% !important;
          }
          /* Hide browser header/footer (date, title, URL) */
          html {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
        </div>
    );
};

// ─── Section Sub-components ────────────────────────────────────────────────────

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

const PersonalInfoTab = ({ resume, updateField }) => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
            {[
                { label: 'Full Name', key: 'fullName', placeholder: 'Jane Doe' },
                { label: 'Email', key: 'email', placeholder: 'jane@example.com' },
                { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
                { label: 'Location', key: 'location', placeholder: 'Mumbai, India' },
                { label: 'LinkedIn', key: 'linkedin', placeholder: 'linkedin.com/in/janedoe' },
                { label: 'GitHub', key: 'github', placeholder: 'github.com/janedoe' },
                { label: 'Portfolio', key: 'portfolio', placeholder: 'janedoe.com' },
                { label: 'Website', key: 'website', placeholder: 'yoursite.com' },
            ].map(({ label, key, placeholder }) => (
                <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input
                        className={inputCls}
                        placeholder={placeholder}
                        value={resume.personalInfo?.[key] || ''}
                        onChange={(e) => updateField(`personalInfo.${key}`, e.target.value)}
                    />
                </div>
            ))}
        </div>
    </div>
);

const SummaryTab = ({ resume, updateField, onAiEnhance, aiLoading }) => (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Professional Summary</h2>
            <button
                onClick={onAiEnhance}
                disabled={aiLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition disabled:opacity-60"
            >
                {aiLoading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Enhancing...</>
                ) : (
                    <>✨ AI Enhance</>
                )}
            </button>
        </div>
        {resume.summary?.aiEnhanced && (
            <div className="bg-indigo-50 text-indigo-700 text-xs px-3 py-2 rounded-lg mb-3 flex items-center gap-2">
                ✨ This summary was enhanced by AI
            </div>
        )}
        <label className={labelCls}>Summary (3–5 sentences recommended)</label>
        <textarea
            rows={6}
            className={inputCls}
            placeholder="A results-driven software engineer with 3+ years of experience..."
            value={resume.summary?.content || ''}
            onChange={(e) => updateField('summary.content', e.target.value)}
        />
        <p className="text-xs text-gray-400 mt-2">{(resume.summary?.content || '').length}/1000 characters</p>
    </div>
);

const ExperienceTab = ({ resume, updateArrayItem, addArrayItem, removeArrayItem, onAiEnhance, aiLoading }) => {
    const blank = {
        company: '', position: '', location: '', startDate: '', endDate: '',
        currentlyWorking: false, description: '', achievements: [],
    };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                <button
                    onClick={() => addArrayItem('experience', blank)}
                    className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
                >
                    + Add Experience
                </button>
            </div>
            {(!resume.experience || resume.experience.length === 0) && (
                <p className="text-gray-400 text-center py-10">No experience added yet. Click "Add Experience" to start.</p>
            )}
            {(resume.experience || []).map((exp, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 mb-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-indigo-600">Experience #{i + 1}</span>
                        <div className="flex gap-2">
                            {exp._id && (
                                <button
                                    onClick={() => onAiEnhance('experience', exp._id)}
                                    disabled={aiLoading}
                                    className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-lg hover:shadow-sm transition disabled:opacity-50"
                                >
                                    ✨ AI Enhance
                                </button>
                            )}
                            <button
                                onClick={() => removeArrayItem('experience', i)}
                                className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                    {exp.aiEnhanced && (
                        <div className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-lg mb-3">✨ AI Enhanced</div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className={labelCls}>Company</label>
                            <input className={inputCls} value={exp.company || ''} placeholder="Google" onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Position</label>
                            <input className={inputCls} value={exp.position || ''} placeholder="Software Engineer" onChange={(e) => updateArrayItem('experience', i, 'position', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Location</label>
                            <input className={inputCls} value={exp.location || ''} placeholder="Bangalore, India" onChange={(e) => updateArrayItem('experience', i, 'location', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Start Date</label>
                            <input type="month" className={inputCls} value={exp.startDate ? exp.startDate.slice(0, 7) : ''} onChange={(e) => updateArrayItem('experience', i, 'startDate', e.target.value)} />
                        </div>
                        {!exp.currentlyWorking && (
                            <div>
                                <label className={labelCls}>End Date</label>
                                <input type="month" className={inputCls} value={exp.endDate ? exp.endDate.slice(0, 7) : ''} onChange={(e) => updateArrayItem('experience', i, 'endDate', e.target.value)} />
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id={`cw-${i}`} checked={exp.currentlyWorking || false} onChange={(e) => updateArrayItem('experience', i, 'currentlyWorking', e.target.checked)} className="w-4 h-4 text-indigo-600" />
                            <label htmlFor={`cw-${i}`} className="text-sm text-gray-600">Currently working here</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className={labelCls}>Description</label>
                        <textarea rows={3} className={inputCls} placeholder="Describe your role and impact..." value={exp.description || ''} onChange={(e) => updateArrayItem('experience', i, 'description', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Key Achievements (one per line)</label>
                        <textarea
                            rows={3}
                            className={inputCls}
                            placeholder="Reduced load time by 40%&#10;Led a team of 5 engineers"
                            value={(exp.achievements || []).join('\n')}
                            onChange={(e) => updateArrayItem('experience', i, 'achievements', e.target.value.split('\n').filter(Boolean))}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const EducationTab = ({ resume, updateArrayItem, addArrayItem, removeArrayItem }) => {
    const blank = {
        institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '',
        currentlyStudying: false, grade: '', description: '',
    };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Education</h2>
                <button onClick={() => addArrayItem('education', blank)} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition">+ Add Education</button>
            </div>
            {(!resume.education || resume.education.length === 0) && (
                <p className="text-gray-400 text-center py-10">No education added yet.</p>
            )}
            {(resume.education || []).map((edu, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 mb-4 bg-gray-50">
                    <div className="flex justify-between mb-4">
                        <span className="text-sm font-bold text-indigo-600">Education #{i + 1}</span>
                        <button onClick={() => removeArrayItem('education', i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className={labelCls}>Institution</label>
                            <input className={inputCls} value={edu.institution || ''} placeholder="IIT Bombay" onChange={(e) => updateArrayItem('education', i, 'institution', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Degree</label>
                            <input className={inputCls} value={edu.degree || ''} placeholder="B.Tech" onChange={(e) => updateArrayItem('education', i, 'degree', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Field of Study</label>
                            <input className={inputCls} value={edu.fieldOfStudy || ''} placeholder="Computer Science" onChange={(e) => updateArrayItem('education', i, 'fieldOfStudy', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Grade / GPA</label>
                            <input className={inputCls} value={edu.grade || ''} placeholder="9.1 CGPA" onChange={(e) => updateArrayItem('education', i, 'grade', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Start Date</label>
                            <input type="month" className={inputCls} value={edu.startDate ? edu.startDate.slice(0, 7) : ''} onChange={(e) => updateArrayItem('education', i, 'startDate', e.target.value)} />
                        </div>
                        {!edu.currentlyStudying && (
                            <div>
                                <label className={labelCls}>End Date</label>
                                <input type="month" className={inputCls} value={edu.endDate ? edu.endDate.slice(0, 7) : ''} onChange={(e) => updateArrayItem('education', i, 'endDate', e.target.value)} />
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id={`cs-${i}`} checked={edu.currentlyStudying || false} onChange={(e) => updateArrayItem('education', i, 'currentlyStudying', e.target.checked)} className="w-4 h-4 text-indigo-600" />
                            <label htmlFor={`cs-${i}`} className="text-sm text-gray-600">Currently studying</label>
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Description (optional)</label>
                        <textarea rows={2} className={inputCls} value={edu.description || ''} onChange={(e) => updateArrayItem('education', i, 'description', e.target.value)} />
                    </div>
                </div>
            ))}
        </div>
    );
};

const SkillsTab = ({ resume, updateArrayItem, addArrayItem, removeArrayItem }) => {
    const [newSkill, setNewSkill] = useState('');
    const addSkill = () => {
        if (!newSkill.trim()) return;
        addArrayItem('skills', { name: newSkill.trim(), category: 'Technical', proficiency: 'Intermediate' });
        setNewSkill('');
    };
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Skills</h2>
            <div className="flex gap-2 mb-6">
                <input
                    className={`${inputCls} flex-1`}
                    placeholder="Add a skill (e.g. React.js)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Add</button>
            </div>
            {(!resume.skills || resume.skills.length === 0) && (
                <p className="text-gray-400 text-center py-6">No skills added yet.</p>
            )}
            <div className="space-y-3">
                {(resume.skills || []).map((skill, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                        <input
                            className="flex-1 bg-transparent border-b border-gray-200 focus:outline-none text-sm text-gray-800"
                            value={skill.name || ''}
                            onChange={(e) => updateArrayItem('skills', i, 'name', e.target.value)}
                        />
                        <select
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none"
                            value={skill.category || 'Technical'}
                            onChange={(e) => updateArrayItem('skills', i, 'category', e.target.value)}
                        >
                            {['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'].map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none"
                            value={skill.proficiency || 'Intermediate'}
                            onChange={(e) => updateArrayItem('skills', i, 'proficiency', e.target.value)}
                        >
                            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <button onClick={() => removeArrayItem('skills', i)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CertificationsTab = ({ resume, updateArrayItem, addArrayItem, removeArrayItem }) => {
    const blank = { name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Certifications</h2>
                <button onClick={() => addArrayItem('certifications', blank)} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition">+ Add Certification</button>
            </div>
            {(!resume.certifications || resume.certifications.length === 0) && (
                <p className="text-gray-400 text-center py-10">No certifications added yet.</p>
            )}
            {(resume.certifications || []).map((cert, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 mb-4 bg-gray-50">
                    <div className="flex justify-between mb-4">
                        <span className="text-sm font-bold text-indigo-600">Certification #{i + 1}</span>
                        <button onClick={() => removeArrayItem('certifications', i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Certification Name</label>
                            <input className={inputCls} value={cert.name || ''} placeholder="AWS Solutions Architect" onChange={(e) => updateArrayItem('certifications', i, 'name', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Issuing Organization</label>
                            <input className={inputCls} value={cert.issuingOrganization || ''} placeholder="Amazon Web Services" onChange={(e) => updateArrayItem('certifications', i, 'issuingOrganization', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Issue Date</label>
                            <input type="month" className={inputCls} value={cert.issueDate ? cert.issueDate.slice(0, 7) : ''} onChange={(e) => updateArrayItem('certifications', i, 'issueDate', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Expiry Date (optional)</label>
                            <input type="month" className={inputCls} value={cert.expiryDate ? cert.expiryDate.slice(0, 7) : ''} onChange={(e) => updateArrayItem('certifications', i, 'expiryDate', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Credential ID</label>
                            <input className={inputCls} value={cert.credentialId || ''} placeholder="ABC-123-XYZ" onChange={(e) => updateArrayItem('certifications', i, 'credentialId', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Credential URL</label>
                            <input className={inputCls} value={cert.credentialUrl || ''} placeholder="https://..." onChange={(e) => updateArrayItem('certifications', i, 'credentialUrl', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ProjectsTab = ({ resume, updateArrayItem, addArrayItem, removeArrayItem, onAiEnhance, aiLoading }) => {
    const blank = { name: '', description: '', technologies: [], url: '', startDate: '', endDate: '' };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                <button onClick={() => addArrayItem('projects', blank)} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition">+ Add Project</button>
            </div>
            {(!resume.projects || resume.projects.length === 0) && (
                <p className="text-gray-400 text-center py-10">No projects added yet.</p>
            )}
            {(resume.projects || []).map((proj, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 mb-4 bg-gray-50">
                    <div className="flex justify-between mb-4">
                        <span className="text-sm font-bold text-indigo-600">Project #{i + 1}</span>
                        <div className="flex gap-2">
                            {proj._id && (
                                <button onClick={() => onAiEnhance('project', proj._id)} disabled={aiLoading} className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-lg disabled:opacity-50">✨ AI Enhance</button>
                            )}
                            <button onClick={() => removeArrayItem('projects', i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className={labelCls}>Project Name</label>
                            <input className={inputCls} value={proj.name || ''} placeholder="CareerCompass AI" onChange={(e) => updateArrayItem('projects', i, 'name', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Project URL</label>
                            <input className={inputCls} value={proj.url || ''} placeholder="https://github.com/..." onChange={(e) => updateArrayItem('projects', i, 'url', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Technologies (comma separated)</label>
                            <input
                                className={inputCls}
                                defaultValue={(proj.technologies || []).join(', ')}
                                placeholder="React, Node.js, MongoDB"
                                onBlur={(e) => updateArrayItem('projects', i, 'technologies', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea rows={3} className={inputCls} value={proj.description || ''} placeholder="Describe what this project does and your role..." onChange={(e) => updateArrayItem('projects', i, 'description', e.target.value)} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResumeBuilder;