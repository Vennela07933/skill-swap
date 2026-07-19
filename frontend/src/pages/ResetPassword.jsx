import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/client';
import { toast } from 'react-toastify';
import { LockOutlined, VpnKeyOutlined, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const tokenParam = searchParams.get('token') || '';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      token: tokenParam,
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Keep form value in sync if the parameter loads asynchronously
  useEffect(() => {
    if (tokenParam) {
      setValue('token', tokenParam);
    }
  }, [tokenParam, setValue]);

  const newPasswordVal = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post('/api/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword
      });
      toast.success('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Invalid or expired token';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-900 relative">
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full bg-primary-600/10 blur-[80px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl relative border border-slate-800">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-white transition gap-1">
            <ArrowBack fontSize="inherit" /> Back to Sign In
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Reset Password</h2>
          <p className="text-sm text-slate-500 mt-2">Enter your token and set your new account password.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Token */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Reset Token</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                <VpnKeyOutlined fontSize="small" />
              </span>
              <input
                type="text"
                {...register('token', { required: 'Reset token is required' })}
                placeholder="Paste your reset token here"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition duration-200"
              />
            </div>
            {errors.token && (
              <p className="text-xs text-red-400 mt-1.5">{errors.token.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                <LockOutlined fontSize="small" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 transition"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-400 mt-1.5">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                <LockOutlined fontSize="small" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === newPasswordVal || 'Passwords do not match'
                })}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition duration-200"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
