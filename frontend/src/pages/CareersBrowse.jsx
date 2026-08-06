import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CareersBrowse = () => {
  const [careers, setCareers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    minSalary: '',
    demand: '',
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [filters, page]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/careers/categories');
      setCategories(['All', ...response.data.categories]);
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.minSalary && { minSalary: filters.minSalary }),
        ...(filters.demand && { demand: filters.demand }),
      });

      const response = await axios.get(`http://localhost:5000/api/careers?${params}`);
      setCareers(response.data.careers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Fetch careers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCareers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CareerCompass AI
              </span>
            </Link>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Career Library</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Explore 100+ careers and find your perfect match
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search careers... (e.g., software developer, nurse)"
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:shadow-xl transition"
              >
                🔍 Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Salary Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Salary
                </label>
                <select
                  value={filters.minSalary}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Any</option>
                  <option value="40000">$40,000+</option>
                  <option value="60000">$60,000+</option>
                  <option value="80000">$80,000+</option>
                  <option value="100000">$100,000+</option>
                  <option value="120000">$120,000+</option>
                </select>
              </div>

              {/* Demand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Demand
                </label>
                <select
                  value={filters.demand}
                  onChange={(e) => handleFilterChange('demand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Any</option>
                  <option value="Very High">Very High</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({ search: '', category: 'All', minSalary: '', demand: '' });
                  setPage(1);
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Career Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-4">Loading careers...</p>
              </div>
            ) : careers.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-xl text-gray-600">No careers found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{careers.length}</span> of{' '}
                    <span className="font-semibold">{pagination?.totalCareers}</span> careers
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careers.map(career => (
                    <Link
                      key={career._id}
                      to={`/careers/${career.slug}`}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition transform hover:scale-105"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {career.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          career.jobOutlook?.demand === 'Very High' ? 'bg-green-100 text-green-700' :
                          career.jobOutlook?.demand === 'High' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {career.jobOutlook?.demand}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2">{career.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {career.description}
                      </p>

                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Salary Range</span>
                          <span className="font-semibold text-gray-800">
                            ${(career.salary?.midLevel?.min / 1000).toFixed(0)}K - ${(career.salary?.midLevel?.max / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="text-indigo-600 font-semibold text-sm">
                          Learn More →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          page === i + 1
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
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

export default CareersBrowse;