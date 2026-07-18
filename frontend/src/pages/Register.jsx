import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MailOutlined, LockOutlined, PersonOutlined, LocalPhone, Map, Info } from '@mui/icons-material';

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      location: '',
      bio: '',
      skillsWanted: '',
      availability: 'Weekends',
      experience: 'Intermediate'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed. Try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-900 relative">
      <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[90px] pointer-events-none"></div>

      <div className="w-full max-w-2xl glass-card rounded-3xl p-8 shadow-2xl relative border border-slate-800 my-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Join Skill Swap</h2>
          <p className="text-sm text-slate-500 mt-2">Set up your profile to start bartering skills</p>
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
                  placeholder="John Doe"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <MailOutlined fontSize="small" />
                </span>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <LockOutlined fontSize="small" />
                </span>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
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
                  placeholder="+1 (555) 000-0000"
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
                  placeholder="San Francisco, CA"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition duration-200"
                />
              </div>
              {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location.message}</p>}
            </div>

            {/* Skills Wanted */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Skills Wanted</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Info fontSize="small" />
                </span>
                <input
                  type="text"
                  {...register('skillsWanted')}
                  placeholder="React, Spanish, Guitar (comma separated)"
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
              placeholder="Tell other swappers about yourself, what you offer, and what you hope to achieve..."
              rows={3}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none transition duration-200 resize-none"
            />
            {errors.bio && <p className="text-xs text-red-400 mt-1">{errors.bio.message}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
