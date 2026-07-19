import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/client';
import { toast } from 'react-toastify';
import { Search as SearchIcon, Map as MapIcon, Star as StarIcon, FilterList as FilterIcon } from '@mui/icons-material';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    location: searchParams.get('location') || '',
    skillName: searchParams.get('skillName') || '',
    category: searchParams.get('category') || '',
    experience: searchParams.get('experience') || '',
    availability: searchParams.get('availability') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page') || '0', 10),
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'PROGRAMMING', label: 'Programming' },
    { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
    { value: 'MOBILE_DEVELOPMENT', label: 'Mobile Development' },
    { value: 'DATA_SCIENCE', label: 'Data Science' },
    { value: 'MACHINE_LEARNING', label: 'Machine Learning' },
    { value: 'CLOUD', label: 'Cloud' },
    { value: 'DEVOPS', label: 'DevOps' },
    { value: 'CYBER_SECURITY', label: 'Cyber Security' },
    { value: 'UI_UX', label: 'UI/UX' },
    { value: 'LANGUAGE', label: 'Language' },
    { value: 'MUSIC', label: 'Music' },
    { value: 'COOKING', label: 'Cooking' },
    { value: 'PHOTOGRAPHY', label: 'Photography' },
    { value: 'FITNESS', label: 'Fitness' },
    { value: 'OTHERS', label: 'Others' }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.skillName) queryParams.append('skillName', filters.skillName);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.experience) queryParams.append('experience', filters.experience);
      if (filters.availability) queryParams.append('availability', filters.availability);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      queryParams.append('page', filters.page);
      queryParams.append('size', 6);

      const res = await API.get(`/api/users?${queryParams.toString()}`);
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Update browser URL query params
    const updatedParams = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '') {
        updatedParams[key] = filters[key].toString();
      }
    });
    setSearchParams(updatedParams);
  }, [filters.page, filters.sortBy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 0 }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 0 }));
    fetchUsers();
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      location: '',
      skillName: '',
      category: '',
      experience: '',
      availability: '',
      sortBy: 'newest',
      page: 0
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4 bg-slate-950/40 border border-slate-800 rounded-3xl p-6 h-fit space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-850">
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <FilterIcon fontSize="small" className="text-primary-400" /> Filters
            </h3>
            <button onClick={handleClearFilters} className="text-xs text-slate-500 hover:text-white transition">
              Clear All
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Search Name</label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleInputChange}
                placeholder="e.g. John"
                className="w-full bg-slate-900 border border-slate-850 focus:border-primary-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none"
              />
            </div>

            {/* Skill Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skill Name</label>
              <input
                type="text"
                name="skillName"
                value={filters.skillName}
                onChange={handleInputChange}
                placeholder="e.g. React, Guitar"
                className="w-full bg-slate-900 border border-slate-850 focus:border-primary-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-850 focus:border-primary-500 rounded-xl py-2 px-3 text-sm text-slate-350 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
                placeholder="e.g. New York"
                className="w-full bg-slate-900 border border-slate-850 focus:border-primary-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Experience</label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-850 focus:border-primary-500 rounded-xl py-2 px-3 text-sm text-slate-355 focus:outline-none"
              >
                <option value="">All Experience Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Availability</label>
              <select
                name="availability"
                value={filters.availability}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-850 focus:border-primary-500 rounded-xl py-2 px-3 text-sm text-slate-355 focus:outline-none"
              >
                <option value="">Any Availability</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-650 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-xl text-sm transition"
            >
              Apply Search
            </button>
          </form>
        </aside>

        {/* Results section */}
        <section className="flex-1 space-y-6">
          {/* Header toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/20 p-4 rounded-2xl border border-slate-805">
            <h2 className="text-xl font-bold text-white">Explore Swappers</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Sort By:</span>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 0 }));
                }}
                className="bg-slate-900 border border-slate-850 text-xs rounded-lg py-1.5 px-3 text-slate-300 focus:outline-none focus:border-primary-500"
              >
                <option value="newest">Newest Members</option>
                <option value="oldest">Oldest Members</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="most skilled">Experience Level</option>
              </select>
            </div>
          </div>

          {/* User grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 shadow-xl animate-pulse space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 bg-slate-950/20 border border-slate-805 rounded-3xl">
              <p className="text-slate-500">No matching skill swap partners found.</p>
              <button onClick={handleClearFilters} className="text-primary-400 hover:underline text-sm font-semibold mt-2">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map(u => (
                <div key={u.id} className="glass-card rounded-3xl p-6 hover:-translate-y-0.5 transition duration-300 flex flex-col justify-between border border-slate-800">
                  <div>
                    {/* User header */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={u.profilePicture ? `${import.meta.env.VITE_API_URL}${u.profilePicture}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-700"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'; }}
                      />
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight">{u.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-0.5 mt-0.5">
                          <MapIcon fontSize="inherit" /> {u.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{u.bio || "No description provided."}</p>

                    {/* Offered Skills list */}
                    <div className="space-y-1.5 mb-4">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Offers:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {u.skills.length === 0 ? (
                          <span className="text-[10px] text-slate-600">No catalog skills</span>
                        ) : (
                          u.skills.map(s => (
                            <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-slate-900 text-slate-300 border border-slate-800">
                              {s.skillName}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Wanted Skills list */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Wants:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {u.skillsWanted ? (
                          u.skillsWanted.split(',').map((sw, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-primary-950/20 text-primary-300 border border-primary-900/10">
                              {sw.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-600">Any skill</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-slate-850 pt-4 mt-6">
                    <div className="flex items-center text-xs font-bold text-amber-400 gap-0.5">
                      <StarIcon fontSize="inherit" /> {u.averageRating.toFixed(1)}
                    </div>
                    <Link
                      to={`/profile/${u.id}`}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-750 transition"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                disabled={filters.page === 0}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 text-xs px-3 py-1.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500">Page {filters.page + 1} of {totalPages}</span>
              <button
                disabled={filters.page === totalPages - 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 text-xs px-3 py-1.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchResults;
