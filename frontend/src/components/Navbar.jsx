import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';
import {
  Search as SearchIcon,
  Notifications as NotifIcon,
  AccountCircle as UserIcon,
  Dashboard as DashIcon,
  SwapHoriz as SwapIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchUnreadNotifications = async () => {
        try {
          const res = await API.get('/api/notifications?size=100');
          const unread = res.data.content.filter(n => !n.read).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error("Failed to load notifications count", error);
        }
      };

      fetchUnreadNotifications();
      // Poll every 30 seconds for notifications
      const interval = setInterval(fetchUnreadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const activeClass = (path) =>
    location.pathname === path
      ? "text-primary-400 font-semibold"
      : "text-slate-300 hover:text-white transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 glass-nav shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary-500 to-indigo-500 text-transparent bg-clip-text font-black">
                SKILL SWAP
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={activeClass('/')}>Home</Link>
            <Link to="/search" className={activeClass('/search')}>
              <span className="flex items-center gap-1">
                <SearchIcon fontSize="small" /> Explore
              </span>
            </Link>

            {user && (
              <>
                <Link to="/dashboard" className={activeClass('/dashboard')}>
                  <span className="flex items-center gap-1">
                    <DashIcon fontSize="small" /> Dashboard
                  </span>
                </Link>
                <Link to="/exchanges" className={activeClass('/exchanges')}>
                  <span className="flex items-center gap-1">
                    <SwapIcon fontSize="small" /> Exchanges
                  </span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className={activeClass('/admin')}>
                    <span className="flex items-center gap-1 text-amber-400 hover:text-amber-300">
                      <AdminIcon fontSize="small" /> Admin
                    </span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Notifications Link */}
                <Link to="/notifications" className="relative p-1 text-slate-400 hover:text-white transition">
                  <NotifIcon />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Link */}
                <Link to={`/profile/${user.id}`} className="flex items-center space-x-2 text-slate-300 hover:text-white transition">
                  {user.profilePicture ? (
                    <img
                      //src={`http://localhost:8080${user.profilePicture}`}
                      src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-slate-600 object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'; }}
                    />
                  ) : (
                    <UserIcon />
                  )}
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 transition"
                  title="Sign Out"
                >
                  <LogoutIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-slate-300 hover:text-white px-3 py-1.5 text-sm font-medium transition">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white px-4 py-1.5 text-sm font-semibold rounded-lg shadow-md transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link to="/notifications" className="relative p-1 text-slate-400 hover:text-white mr-4 transition">
                <NotifIcon />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            Explore Skills
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/exchanges"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Exchanges
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-amber-400 hover:text-amber-300 px-3 py-2 rounded-md text-base font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to={`/profile/${user.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
              >
                <LogoutIcon size="small" /> Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 pb-2 border-t border-slate-800 flex flex-col gap-2 px-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white text-center py-2 rounded-md text-base font-medium border border-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-center py-2 rounded-md text-base font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
