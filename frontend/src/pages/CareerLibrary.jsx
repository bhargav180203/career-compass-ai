// frontend/src/pages/CareerLibrary.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CareerLibrary = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    industry: searchParams.get('industry') || '',
    educationRequired: searchParams.get('education') || '',
    experienceLevel: searchParams.get('experience') || '',
    minSalary: searchParams.get('minSalary') || '',
    maxSalary: searchParams.get('maxSalary') || '',
    growthOutlook: searchParams.get('growth') || '',
    sortBy: searchParams.get('sort') || 'featured'
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCareers: 0
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch careers when filters change
  useEffect(() => {
    fetchCareers();
  }, [filters, pagination.currentPage]);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/careers/filters');
      setFilterOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.currentPage,
        limit: 12
      });

      // Remove empty filters
      for (const [key, value] of params.entries()) {
        if (!value) params.delete(key);
      }

      const response = await axios.get(`http://localhost:5000/api/careers?${params}`);
      setCareers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      industry: '',
      educationRequired: '',
      experienceLevel: '',
      minSalary: '',
      maxSalary: '',
      growthOutlook: '',
      sortBy: 'featured'
    });
    setSearchParams({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCareers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Library</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Explore {pagination.totalCareers}+ career paths. Find your perfect match based on your interests, skills, and goals.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-3xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search careers by title, skills, or keywords..."
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 border-2 border-transparent focus:border-white focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear All
                </button>
              </div>

              {filterOptions && (
                <div className="space-y-6">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      value={filters.industry}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">All Industries</option>
                      {filterOptions.industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Education Required
                    </label>
                    <select
                      value={filters.educationRequired}
                      onChange={(e) => handleFilterChange('educationRequired', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Any Education</option>
                      {filterOptions.educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={filters.experienceLevel}
                      onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Any Level</option>
                      {filterOptions.experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Growth Outlook */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Growth Outlook
                    </label>
                    <select
                      value={filters.growthOutlook}
                      onChange={(e) => handleFilterChange('growthOutlook', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Any Growth Rate</option>
                      {filterOptions.growthRates.map(rate => (
                        <option key={rate} value={rate}>{rate}</option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={filters.minSalary}
                        onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                        placeholder="Min Salary"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={filters.maxSalary}
                        onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                        placeholder="Max Salary"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <p className="text-gray-600">
                  {pagination.totalCareers} careers found
                </p>
              </div>
              
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="title">Title (A-Z)</option>
                <option value="salary-high">Salary (High to Low)</option>
                <option value="salary-low">Salary (Low to High)</option>
                <option value="growth">Growth Rate</option>
              </select>
            </div>

            {/* Career Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : careers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">No careers found matching your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {careers.map(career => (
                    <div
                      key={career._id}
                      onClick={() => navigate(`/careers/${career.slug}`)}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                          {career.industry}
                        </span>
                        {career.growthOutlook && (
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            career.growthOutlook.rate === 'Explosive Growth' || career.growthOutlook.rate === 'Fast Growing'
                              ? 'bg-green-100 text-green-700'
                              : career.growthOutlook.rate === 'Growing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {career.growthOutlook.rate}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {career.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {career.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Salary:</span>
                          <span className="text-gray-900">
                            ${(career.salary.min / 1000).toFixed(0)}K - ${(career.salary.max / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Education:</span>
                          <span className="text-gray-900">{career.educationRequired}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-indigo-600 font-semibold group-hover:underline">
                          Learn More →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            pagination.currentPage === i + 1
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border-2 border-gray-200 hover:border-indigo-500'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerLibrary;