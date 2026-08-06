// frontend/src/components/profile/SkillsSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkillsSection = ({ profile, onUpdate }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Technical',
    proficiency: 'Intermediate',
    yearsOfExperience: 0
  });

  const categories = ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'];
  const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    if (profile?.skills) {
      setSkills(profile.skills);
    }
  }, [profile]);

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill }]);
      setNewSkill({ name: '', category: 'Technical', proficiency: 'Intermediate', yearsOfExperience: 0 });
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/profile/skills',
        { skills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate();
      alert('Skills updated successfully!');
    } catch (error) {
      console.error('Error updating skills:', error);
      alert('Failed to update skills');
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyColor = (proficiency) => {
    const colors = {
      'Beginner': 'bg-yellow-100 text-yellow-700',
      'Intermediate': 'bg-blue-100 text-blue-700',
      'Advanced': 'bg-green-100 text-green-700',
      'Expert': 'bg-purple-100 text-purple-700'
    };
    return colors[proficiency] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technical': '💻',
      'Soft Skills': '🤝',
      'Languages': '🌐',
      'Tools': '🛠️',
      'Other': '📌'
    };
    return icons[category] || '📌';
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>

      {/* Add Skill Form */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Skill name (e.g., JavaScript, Leadership)"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={newSkill.proficiency}
            onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            {proficiencies.map(prof => (
              <option key={prof} value={prof}>{prof}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              value={newSkill.yearsOfExperience}
              onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) || 0 })}
              placeholder="Years"
              min="0"
              max="50"
              className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleAddSkill}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Skills Display - Grouped by Category */}
      {Object.keys(groupedSkills).length > 0 ? (
        <div className="space-y-6 mb-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="border-2 border-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>{getCategoryIcon(category)}</span>
                <span>{category}</span>
                <span className="text-sm font-normal text-gray-500">({categorySkills.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categorySkills.map((skill, index) => {
                  const globalIndex = skills.findIndex(s => s.name === skill.name && s.category === skill.category);
                  return (
                    <div
                      key={globalIndex}
                      className="flex items-center justify-between p-3 bg-white border-2 border-gray-100 rounded-lg hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{skill.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getProficiencyColor(skill.proficiency)}`}>
                            {skill.proficiency}
                          </span>
                          {skill.yearsOfExperience > 0 && (
                            <span className="text-xs text-gray-600">
                              {skill.yearsOfExperience}yr{skill.yearsOfExperience > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(globalIndex)}
                        className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove skill"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 mb-6">
          <div className="text-6xl mb-4">🛠️</div>
          <p className="text-lg mb-2">No skills added yet</p>
          <p className="text-sm">Start adding your skills to showcase your expertise</p>
        </div>
      )}

      {/* Save Button */}
      {skills.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
          <p className="text-sm text-gray-600">
            Total Skills: <span className="font-bold text-indigo-600">{skills.length}</span>
          </p>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save All Skills'}
          </button>
        </div>
      )}

      {/* Quick Stats */}
      {skills.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {skills.filter(s => s.proficiency === 'Expert').length}
            </div>
            <div className="text-sm text-blue-800">Expert Level</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {skills.filter(s => s.proficiency === 'Advanced').length}
            </div>
            <div className="text-sm text-green-800">Advanced</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {skills.filter(s => s.category === 'Technical').length}
            </div>
            <div className="text-sm text-yellow-800">Technical Skills</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(skills.reduce((acc, s) => acc + s.yearsOfExperience, 0) / skills.length) || 0}
            </div>
            <div className="text-sm text-purple-800">Avg. Years</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;