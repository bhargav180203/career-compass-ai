// frontend/src/components/profile/ExperienceSection.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ExperienceSection = ({ profile, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  });
  const [achievementInput, setAchievementInput] = useState('');

  const employmentTypes = ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Self-employed'];

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
    setAchievementInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (exp) => {
    setFormData({
      company: exp.company,
      position: exp.position,
      employmentType: exp.employmentType,
      location: exp.location || '',
      startDate: exp.startDate.split('T')[0],
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      current: exp.current,
      description: exp.description || '',
      achievements: exp.achievements || []
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achievementInput.trim()]
      });
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (index) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingId
  ? `${process.env.REACT_APP_API_URL}/profile/experience/${editingId}`
  : `${process.env.REACT_APP_API_URL}/profile/experience`;
      
      const method = editingId ? 'put' : 'post';
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      resetForm();
      onUpdate();
      alert(editingId ? 'Experience updated!' : 'Experience added!');
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/profile/experience/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      alert('Experience deleted successfully');
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Experience'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Job Title"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employment Type *
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                >
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State/Country"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="current" className="ml-2 text-sm text-gray-700">
                I currently work here
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                maxLength="1000"
                placeholder="Describe your role, responsibilities, and accomplishments..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Achievements
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                  placeholder="Add an achievement (press Enter)"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.achievements.length > 0 && (
                <ul className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span className="flex-1 text-gray-700">{achievement}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Experience'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Experience List */}
        <div className="space-y-4">
          {profile?.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp) => (
              <div key={exp._id} className="border-2 border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-indigo-600 font-semibold">{exp.company}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2">
                      <span className="px-2 py-1 bg-gray-100 rounded">{exp.employmentType}</span>
                      {exp.location && <span>📍 {exp.location}</span>}
                      <span>
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 mt-3">{exp.description}</p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Key Achievements:</p>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-indigo-600">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No work experience added yet</p>
              <p className="text-sm">Add your professional experience to strengthen your profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;