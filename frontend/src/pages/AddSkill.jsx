import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/client';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AddSkill = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'PROGRAMMING', label: 'Programming' },
    { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
    { value: 'MOBILE_DEVELOPMENT', label: 'Mobile Development' },
    { value: 'DATA_SCIENCE', label: 'Data Science' },
    { value: 'MACHINE_LEARNING', label: 'Machine Learning' },
    { value: 'CLOUD', label: 'Cloud Computing' },
    { value: 'DEVOPS', label: 'DevOps' },
    { value: 'CYBER_SECURITY', label: 'Cyber Security' },
    { value: 'UI_UX', label: 'UI/UX Design' },
    { value: 'LANGUAGE', label: 'Language Barter' },
    { value: 'MUSIC', label: 'Music & Instruments' },
    { value: 'COOKING', label: 'Cooking & Culinary' },
    { value: 'PHOTOGRAPHY', label: 'Photography' },
    { value: 'FITNESS', label: 'Fitness & Health' },
    { value: 'OTHERS', label: 'Others' }
  ];

  const levels = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' }
  ];

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      skillName: '',
      description: '',
      category: 'PROGRAMMING',
      level: 'BEGINNER'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post('/api/skills', data);
      toast.success("Skill added successfully!");
      navigate(`/profile/${user.id}`);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to add skill";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-900">
      <div className="w-full max-w-xl glass-card rounded-3xl p-8 border border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Add a Skill Offered</h2>
          <p className="text-sm text-slate-500 mt-2">Publish a skill you possess to make it swappable by others</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Skill Name</label>
            <input
              type="text"
              {...register('skillName', { required: 'Skill Name is required' })}
              placeholder="e.g. Next.js Development, Italian Cooking"
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none transition duration-200"
            />
            {errors.skillName && <p className="text-xs text-red-400 mt-1">{errors.skillName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
              <select
                {...register('category')}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-350 focus:outline-none transition duration-200"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Expertise Level</label>
              <select
                {...register('level')}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-350 focus:outline-none transition duration-200"
              >
                {levels.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe your experience with this skill, projects you have worked on, what you can teach others, etc."
              rows={4}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none transition duration-200 resize-none"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Link
              to={`/profile/${user.id}`}
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
                'Add Skill'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkill;
