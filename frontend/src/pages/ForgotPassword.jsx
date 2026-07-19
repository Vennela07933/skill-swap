import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/client';
import { toast } from 'react-toastify';
import { MailOutlined, ArrowBack } from '@mui/icons-material';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await API.post('/api/auth/forgot-password', { email: data.email });
      const token = response.data.token;
      setResetToken(token);
      toast.success('Password reset token generated successfully!');
      
      // Auto redirect to reset-password after 3 seconds for easy dev workflow
      toast.info('Redirecting to password reset page...');
      setTimeout(() => {
        navigate(`/reset-password?token=${token}`);
      }, 3500);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Email not found';
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
          <h2 className="text-3xl font-extrabold text-white">Forgot Password?</h2>
          <p className="text-sm text-slate-500 mt-2">Enter your email and we'll generate a password reset token for you.</p>
        </div>

        {!resetToken ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="you@example.com"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition duration-200"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Generate Reset Token'
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Your Password Reset Token</p>
              <code className="text-lg font-bold text-primary-400 break-all select-all">{resetToken}</code>
            </div>
            <p className="text-xs text-slate-500">
              In a production system, this token would be sent to your email. Since this is in development, we show it here and will redirect you automatically.
            </p>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="block w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg text-center transition duration-200"
            >
              Go to Reset Password Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
