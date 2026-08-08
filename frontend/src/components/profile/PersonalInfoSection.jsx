// frontend/src/components/profile/PersonalInfoSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalInfoSection = ({ profile, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    dateOfBirth: '',
    gender: '',
    location: {
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    bio: '',
    website: '',
    linkedIn: '',
    github: '',
    portfolio: ''
  });

  useEffect(() => {
    if (profile?.personalInfo) {
      setFormData({
        phone: profile.personalInfo.phone || '',
        dateOfBirth: profile.personalInfo.dateOfBirth ? profile.personalInfo.dateOfBirth.split('T')[0] : '',
        gender: profile.personalInfo.gender || '',
        location: {
          city: profile.personalInfo.location?.city || '',
          state: profile.personalInfo.location?.state || '',
          country: profile.personalInfo.location?.country || '',
          zipCode: profile.personalInfo.location?.zipCode || ''
        },
        bio: profile.personalInfo.bio || '',
        website: profile.personalInfo.website || '',
        linkedIn: profile.personalInfo.linkedIn || '',
        github: profile.personalInfo.github || '',
        portfolio: profile.personalInfo.portfolio || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/profile/personal-info`,
        { personalInfo: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEditing(false);
      onUpdate();
      
      // Show success message
      alert('Personal information updated successfully!');
    } catch (error) {
      console.error('Error updating personal info:', error);
      alert('Failed to update personal information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="State/Province"
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="Country"
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio <span className="text-gray-500 font-normal">(Max 500 characters)</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
            <div className="space-y-4">
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Personal Website"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="LinkedIn Profile URL"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="GitHub Profile URL"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="Portfolio URL"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* View Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Phone</p>
              <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Date of Birth</p>
              <p className="text-gray-900">
                {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Gender</p>
              <p className="text-gray-900">{formData.gender || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Location</p>
              <p className="text-gray-900">
                {[formData.location.city, formData.location.state, formData.location.country]
                  .filter(Boolean)
                  .join(', ') || 'Not provided'}
              </p>
            </div>
          </div>

          {formData.bio && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Bio</p>
              <p className="text-gray-900 leading-relaxed">{formData.bio}</p>
            </div>
          )}

          {(formData.website || formData.linkedIn || formData.github || formData.portfolio) && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Links</p>
              <div className="flex flex-wrap gap-3">
                {formData.website && (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    🌐 Website
                  </a>
                )}
                {formData.linkedIn && (
                  <a
                    href={formData.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    💼 LinkedIn
                  </a>
                )}
                {formData.github && (
                  <a
                    href={formData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    🐙 GitHub
                  </a>
                )}
                {formData.portfolio && (
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    🎨 Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;