// frontend/src/components/RecommendedCareers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecommendedCareers = () => {
  const navigate = useNavigate();
  const [recommendedCareers, setRecommendedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedCareers();
  }, []);

  const fetchRecommendedCareers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/careers/recommended/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendedCareers(response.data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Careers Recommended for You</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Careers Recommended for You</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/assessment/start')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Take Career Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Careers Recommended for You</h2>
        <button
          onClick={() => navigate('/careers')}
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          View All →
        </button>
      </div>

      {recommendedCareers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Complete your career assessment to get personalized recommendations!</p>
          <button
            onClick={() => navigate('/assessment/start')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendedCareers.slice(0, 6).map(career => (
            <div
              key={career._id}
              onClick={() => navigate(`/careers/${career.slug}`)}
              className="p-4 border-2 border-gray-100 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {career.title}
                    </h3>
                    {career.matchScore && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                        {career.matchScore}% Match
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {career.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      <span className="font-semibold">Salary:</span> ${(career.salary.min / 1000).toFixed(0)}K - ${(career.salary.max / 1000).toFixed(0)}K
                    </span>
                    {career.growthOutlook && (
                      <span className={`font-semibold ${
                        career.growthOutlook.rate === 'Explosive Growth' || career.growthOutlook.rate === 'Fast Growing'
                          ? 'text-green-600'
                          : 'text-blue-600'
                      }`}>
                        {career.growthOutlook.rate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {recommendedCareers.length > 6 && (
            <button
              onClick={() => navigate('/careers')}
              className="w-full py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              View All {recommendedCareers.length} Recommendations
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendedCareers;