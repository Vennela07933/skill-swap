import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative bg-slate-900 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-primary-900/10 blur-[100px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 space-y-6">
        <h1 className="text-9xl font-black bg-gradient-to-r from-primary-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
          404
        </h1>
        <h2 className="text-3xl font-extrabold text-white">
          Page Not Found
        </h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-6">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
