// frontend/src/components/profile/CareerPreferencesSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CareerPreferencesSection = ({ profile, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    desiredRoles: [],
    desiredIndustries: [],
    desiredLocations: [],
    jobType: [],
    expectedSalary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    availableToStart: '',
    willingToRelocate: false
  });

  const [inputValues, setInputValues] = useState({
    role: '',
    industry: '',
    location: ''
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const availabilityOptions = [
    'Immediately',
    'Within 2 weeks',
    'Within 1 month',
    '1-3 months',
    'More than 3 months'
  ];

  useEffect(() => {
    if (profile?.careerPreferences) {
      setFormData({
        desiredRoles: profile.careerPreferences.desiredRoles || [],
        desiredIndustries: profile.careerPreferences.desiredIndustries || [],
        desiredLocations: profile.careerPreferences.desiredLocations || [],
        jobType: profile.careerPreferences.jobType || [],
        expectedSalary: {
          min: profile.careerPreferences.expectedSalary?.min || '',
          max: profile.careerPreferences.expectedSalary?.max || '',
          currency: profile.careerPreferences.expectedSalary?.currency || 'USD'
        },
        availableToStart: profile.careerPreferences.availableToStart || '',
        willingToRelocate: profile.careerPreferences.willingToRelocate || false
      });
    }
  }, [profile]);

  const handleAddItem = (field, value) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      });
      setInputValues({ ...inputValues, [field]: '' });
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleJobTypeToggle = (type) => {
    setFormData({
      ...formData,
      jobType: formData.jobType.includes(type)
        ? formData.jobType.filter(t => t !== type)
        : [...formData.jobType, type]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/profile/career-preferences',
        { careerPreferences: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditing(false);
      onUpdate();
      alert('Career preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update career preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Career Preferences</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Desired Roles */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Desired Job Roles
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputValues.role}
                onChange={(e) => setInputValues({ ...inputValues, role: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('desiredRoles', inputValues.role))}
                placeholder="e.g., Software Engineer, Product Manager"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddItem('desiredRoles', inputValues.role)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.desiredRoles.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('desiredRoles', index)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Desired Industries */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Desired Industries
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputValues.industry}
                onChange={(e) => setInputValues({ ...inputValues, industry: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('desiredIndustries', inputValues.industry))}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddItem('desiredIndustries', inputValues.industry)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.desiredIndustries.map((industry, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('desiredIndustries', index)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Desired Locations */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Work Locations
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputValues.location}
                onChange={(e) => setInputValues({ ...inputValues, location: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('desiredLocations', inputValues.location))}
                placeholder="e.g., New York, Remote, San Francisco"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddItem('desiredLocations', inputValues.location)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.desiredLocations.map((location, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                >
                  📍 {location}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('desiredLocations', index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Job Type Preferences
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {jobTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleJobTypeToggle(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    formData.jobType.includes(type)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formData.jobType.includes(type) && '✓ '}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Expected Salary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Expected Salary Range (Annual)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={formData.expectedSalary.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    expectedSalary: { ...formData.expectedSalary, min: e.target.value }
                  })}
                  placeholder="Minimum (e.g., 50000)"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={formData.expectedSalary.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    expectedSalary: { ...formData.expectedSalary, max: e.target.value }
                  })}
                  placeholder="Maximum (e.g., 80000)"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Available to Start
            </label>
            <select
              value={formData.availableToStart}
              onChange={(e) => setFormData({ ...formData, availableToStart: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select availability</option>
              {availabilityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Willing to Relocate */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="relocate"
              checked={formData.willingToRelocate}
              onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="relocate" className="ml-2 text-sm font-semibold text-gray-700">
              I am willing to relocate for the right opportunity
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* View Mode */}
          {formData.desiredRoles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Desired Roles</h3>
              <div className="flex flex-wrap gap-2">
                {formData.desiredRoles.map((role, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.desiredIndustries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Desired Industries</h3>
              <div className="flex flex-wrap gap-2">
                {formData.desiredIndustries.map((industry, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.desiredLocations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Preferred Locations</h3>
              <div className="flex flex-wrap gap-2">
                {formData.desiredLocations.map((location, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    📍 {location}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.jobType.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Job Type Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {formData.jobType.map((type, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(formData.expectedSalary.min || formData.expectedSalary.max) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Expected Salary Range</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  ${parseInt(formData.expectedSalary.min || 0).toLocaleString()} - ${parseInt(formData.expectedSalary.max || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Annual ({formData.expectedSalary.currency})</p>
              </div>
            </div>
          )}

          {formData.availableToStart && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Available to Start</h3>
              <p className="text-gray-900">{formData.availableToStart}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Relocation</h3>
            <p className="text-gray-900">
              {formData.willingToRelocate ? '✅ Willing to relocate' : '❌ Not willing to relocate'}
            </p>
          </div>

          {!formData.desiredRoles.length && !formData.desiredIndustries.length && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-lg mb-2">No career preferences set</p>
              <p className="text-sm">Add your career preferences to help us match you with the right opportunities</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerPreferencesSection;