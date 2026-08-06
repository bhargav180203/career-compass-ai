// frontend/src/components/profile/CertificationsSection.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CertificationsSection = ({ profile, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/profile/certification',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      resetForm();
      onUpdate();
      alert('Certification added successfully!');
    } catch (error) {
      console.error('Error adding certification:', error);
      alert('Failed to add certification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/profile/certification/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      alert('Certification deleted successfully');
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('Failed to delete certification');
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Certifications & Licenses</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Certification'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuingOrganization}
                  onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Credential ID <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  placeholder="Certificate ID or License Number"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Credential URL <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Certification'}
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

        {/* Certifications List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile?.certifications && profile.certifications.length > 0 ? (
            profile.certifications.map((cert) => (
              <div
                key={cert._id}
                className={`border-2 rounded-lg p-4 transition-colors ${
                  isExpired(cert.expiryDate)
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📜</span>
                      <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    </div>
                    <p className="text-indigo-600 font-semibold text-sm">{cert.issuingOrganization}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cert._id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Delete certification"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📅</span>
                    <span>
                      Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {cert.expiryDate && (
                    <div className={`flex items-center gap-2 ${
                      isExpired(cert.expiryDate) ? 'text-red-600 font-semibold' : 'text-gray-600'
                    }`}>
                      <span>{isExpired(cert.expiryDate) ? '⚠️' : '⏰'}</span>
                      <span>
                        {isExpired(cert.expiryDate) ? 'Expired: ' : 'Expires: '}
                        {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {!cert.expiryDate && (
                    <div className="flex items-center gap-2 text-green-600">
                      <span>✓</span>
                      <span>No expiration</span>
                    </div>
                  )}

                  {cert.credentialId && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🔑</span>
                      <span className="font-mono text-xs">ID: {cert.credentialId}</span>
                    </div>
                  )}
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <span>🔗</span>
                    <span>View Credential</span>
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="md:col-span-2 text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📜</div>
              <p className="text-lg mb-2">No certifications added yet</p>
              <p className="text-sm">Add your professional certifications and licenses</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {profile?.certifications && profile.certifications.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {profile.certifications.length}
                </div>
                <div className="text-sm text-indigo-800">Total Certifications</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {profile.certifications.filter(c => !c.expiryDate || !isExpired(c.expiryDate)).length}
                </div>
                <div className="text-sm text-green-800">Active</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {profile.certifications.filter(c => c.expiryDate && isExpired(c.expiryDate)).length}
                </div>
                <div className="text-sm text-red-800">Expired</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsSection;