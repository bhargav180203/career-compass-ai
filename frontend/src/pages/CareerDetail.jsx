// frontend/src/pages/CareerDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CareerDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [relatedCareers, setRelatedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCareerDetail();
  }, [slug]);

  const fetchCareerDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/careers/${slug}`);
      setCareer(response.data.data);
      
      // Related careers are populated in the response
      if (response.data.data.relatedCareers) {
        setRelatedCareers(response.data.data.relatedCareers);
      }
    } catch (error) {
      console.error('Error fetching career:', error);
      setError('Career not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Not Found</h2>
          <button
            onClick={() => navigate('/careers')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Career Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/careers')}
            className="mb-4 text-indigo-100 hover:text-white flex items-center gap-2"
          >
            ← Back to Careers
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full">
                  {career.industry}
                </span>
                <span className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full">
                  {career.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{career.title}</h1>
              <p className="text-xl text-indigo-100 max-w-3xl">{career.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Salary Range</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${(career.salary.min / 1000).toFixed(0)}K - ${(career.salary.max / 1000).toFixed(0)}K
                  </p>
                  <p className="text-gray-500 text-sm">Median: ${(career.salary.median / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Growth Rate</p>
                  <p className={`text-xl font-bold ${
                    career.growthOutlook.rate === 'Explosive Growth' || career.growthOutlook.rate === 'Fast Growing'
                      ? 'text-green-600'
                      : career.growthOutlook.rate === 'Growing'
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}>
                    {career.growthOutlook.percentage}%
                  </p>
                  <p className="text-gray-500 text-sm">{career.growthOutlook.rate}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Education</p>
                  <p className="text-lg font-bold text-gray-900">{career.educationRequired}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Experience</p>
                  <p className="text-lg font-bold text-gray-900">{career.experienceLevel}</p>
                </div>
              </div>
            </div>

            {/* Career Outlook */}
            {career.growthOutlook.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Outlook</h2>
                <p className="text-gray-700 leading-relaxed">{career.growthOutlook.description}</p>
              </div>
            )}

            {/* Day in the Life */}
            {career.dayInLife && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">A Day in the Life</h2>
                <p className="text-gray-700 leading-relaxed">{career.dayInLife}</p>
              </div>
            )}

            {/* Work Environment */}
            {career.workEnvironment && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Work Environment</h2>
                <p className="text-gray-700 leading-relaxed">{career.workEnvironment}</p>
              </div>
            )}

            {/* Pros and Cons */}
            {(career.advantages?.length > 0 || career.challenges?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {career.advantages?.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Advantages</h3>
                    <ul className="space-y-2">
                      {career.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold text-lg">✓</span>
                          <span className="text-gray-700">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {career.challenges?.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Challenges</h3>
                    <ul className="space-y-2">
                      {career.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 font-bold">!</span>
                          <span className="text-gray-700">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Career Path */}
            {career.careerPath && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Progression</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-gray-600">Entry Level</div>
                    <div className="flex-1 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <p className="font-semibold text-gray-900">{career.careerPath.entryLevel}</p>
                    </div>
                  </div>
                  <div className="ml-12 text-2xl text-gray-400">↓</div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-gray-600">Mid Level</div>
                    <div className="flex-1 p-4 bg-indigo-100 rounded-lg border-2 border-indigo-300">
                      <p className="font-semibold text-gray-900">{career.careerPath.midLevel}</p>
                    </div>
                  </div>
                  <div className="ml-12 text-2xl text-gray-400">↓</div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-gray-600">Senior Level</div>
                    <div className="flex-1 p-4 bg-indigo-200 rounded-lg border-2 border-indigo-400">
                      <p className="font-semibold text-gray-900">{career.careerPath.seniorLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills Required */}
            {(career.skills?.technical?.length > 0 || career.skills?.soft?.length > 0) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h3>
                
                {career.skills.technical?.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Technical Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {career.skills.soft?.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Soft Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.soft.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Personality Match */}
            {career.personalityTypes?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Best Fit Personalities</h3>
                <div className="flex flex-wrap gap-2">
                  {career.personalityTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-lg"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Holland Codes */}
            {career.hollandCodes?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Interest Areas</h3>
                <div className="space-y-2">
                  {career.hollandCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-700">{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Companies */}
            {career.topCompanies?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top Employers</h3>
                <div className="space-y-2">
                  {career.topCompanies.map((company, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-gray-700">
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {career.certifications?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {career.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-indigo-600">📜</span>
                      <span className="text-gray-700 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Careers */}
        {relatedCareers.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Careers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCareers.map(related => (
                <div
                  key={related._id}
                  onClick={() => navigate(`/careers/${related.slug}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
                >
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                    {related.industry}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 group-hover:text-indigo-600 transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{related.category}</p>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Salary: </span>
                    <span className="text-gray-900">
                      ${(related.salary.min / 1000).toFixed(0)}K - ${(related.salary.max / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Interested in {career.title}?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Take our comprehensive career assessment to discover if this career path aligns with your personality, interests, and skills.
          </p>
          <button
            onClick={() => navigate('/assessment/start')}
            className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Take Career Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerDetail;