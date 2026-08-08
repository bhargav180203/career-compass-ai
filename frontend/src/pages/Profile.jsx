// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PersonalInfoSection from '../components/profile/PersonalInfoSection';
import EducationSection from '../components/profile/EducationSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import SkillsSection from '../components/profile/SkillsSection';
import CertificationsSection from '../components/profile/CertificationsSection';
import CareerPreferencesSection from '../components/profile/CareerPreferencesSection';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'certifications', label: 'Certifications', icon: '📜' },
    { id: 'preferences', label: 'Career Preferences', icon: '🎯' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-indigo-100">Build your professional profile</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{profile?.completeness || 0}%</div>
              <div className="text-sm text-indigo-100">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completeness Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                  style={{ width: `${profile?.completeness || 0}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {profile?.completeness < 100 ? 'Keep going!' : 'Complete! 🎉'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-indigo-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'personal' && (
          <PersonalInfoSection profile={profile} onUpdate={fetchProfile} />
        )}
        {activeTab === 'education' && (
          <EducationSection profile={profile} onUpdate={fetchProfile} />
        )}
        {activeTab === 'experience' && (
          <ExperienceSection profile={profile} onUpdate={fetchProfile} />
        )}
        {activeTab === 'skills' && (
          <SkillsSection profile={profile} onUpdate={fetchProfile} />
        )}
        {activeTab === 'certifications' && (
          <CertificationsSection profile={profile} onUpdate={fetchProfile} />
        )}
        {activeTab === 'preferences' && (
          <CareerPreferencesSection profile={profile} onUpdate={fetchProfile} />
        )}
      </div>
    </div>
  );
};

export default Profile;