import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { PersonOutlined, LocalPhone, Map, Info } from '@mui/icons-material';

const EditProfile = () => {
  const { id } = useParams();
  const { user, updateUserLocal } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      bio: '',
      skillsWanted: '',
      availability: 'Weekends',
      experience: 'Intermediate'
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get(`/api/users/${id}`);
        const data = res.data;
        reset({
          name: data.name,
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          skillsWanted: data.skillsWanted || '',
          availability: data.availability || 'Weekends',
          experience: data.experience || 'Intermediate'
        });
      } catch (err) {
        toast.error("Failed to load profile details");
      }
    };
    fetchUserData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.put(`/api/users/${id}`, data);
      
      // Update local storage user if it was the owner updating
      if (user.id === parseInt(id)) {
        updateUserLocal(res.data);
      }
      toast.success("Profile updated successfully!");
      navigate(`/profile/${id}`);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update profile';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-8 shadow-2xl border border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Edit Profile Details</h2>
          <p className="text-sm text-slate-500 mt-2">Modify your swap availability, location, bio, and desired skills</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <PersonOutlined fontSize="small" />
                </span>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <LocalPhone fontSize="small" />
                </span>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Map fontSize="small" />
                </span>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
              {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location.message}</p>}
            </div>

            {/* Skills Wanted */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Skills Desired</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Info fontSize="small" />
                </span>
                <input
                  type="text"
                  {...register('skillsWanted')}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Availability</label>
              <select
                {...register('availability')}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-350 focus:outline-none transition duration-200"
              >
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Experience Level</label>
              <select
                {...register('experience')}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-350 focus:outline-none transition duration-200"
              >
                <option value="Beginner">Beginner (&lt; 1 yr)</option>
                <option value="Intermediate">Intermediate (1-3 yrs)</option>
                <option value="Advanced">Advanced (3+ yrs)</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Bio / Introduction</label>
            <textarea
              {...register('bio', { required: 'Bio is required' })}
              rows={4}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none transition duration-200 resize-none"
            />
            {errors.bio && <p className="text-xs text-red-400 mt-1">{errors.bio.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              to={`/profile/${id}`}
              className="w-1/3 bg-slate-850 hover:bg-slate-800 text-slate-300 text-center font-semibold py-3 rounded-xl transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
