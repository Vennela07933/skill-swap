import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  WorkspacePremium as SkillIcon,
  SwapHoriz as SwapIcon,
  NotificationImportant as NotifIcon,
  CheckCircle as DoneIcon,
  HourglassEmpty as PendingIcon,
  ArrowForward as ArrowIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const HomeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    skillsCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
    completedCount: 0,
    profileCompletion: 20
  });
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileRes, sentRes, receivedRes, notifRes] = await Promise.all([
          API.get(`/api/users/${user.id}`),
          API.get('/api/exchanges?type=sent&size=50'),
          API.get('/api/exchanges?type=received&size=50'),
          API.get('/api/notifications?size=5')
        ]);

        const profileData = profileRes.data;
        const sent = sentRes.data.content || [];
        const received = receivedRes.data.content || [];
        const notifs = notifRes.data.content || [];

        // Count states
        const skillsCount = profileData.skills?.length || 0;
        const allRequests = [...sent, ...received];
        const pendingCount = allRequests.filter(r => r.status === 'PENDING').length;
        const acceptedCount = allRequests.filter(r => r.status === 'ACCEPTED').length;
        const completedCount = allRequests.filter(r => r.status === 'COMPLETED').length;

        // Calculate profile completion
        let completion = 20; // base value
        if (profileData.phone) completion += 15;
        if (profileData.location) completion += 15;
        if (profileData.bio) completion += 20;
        if (profileData.profilePicture) completion += 15;
        if (skillsCount > 0) completion += 15;

        setStats({
          skillsCount,
          pendingCount,
          acceptedCount,
          completedCount,
          profileCompletion: Math.min(completion, 100)
        });

        setNotifications(notifs);

        // Map recent exchange updates to activities
        const recentActivities = allRequests
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(req => {
            const isSender = req.senderId === user.id;
            const partner = isSender ? req.receiverName : req.senderName;
            let actionText = '';
            if (req.status === 'PENDING') {
              actionText = isSender ? `Sent a swap request to ${partner}` : `Received a swap request from ${partner}`;
            } else if (req.status === 'ACCEPTED') {
              actionText = `Swap request with ${partner} accepted`;
            } else if (req.status === 'REJECTED') {
              actionText = `Swap request with ${partner} rejected`;
            } else if (req.status === 'COMPLETED') {
              actionText = `Completed skill exchange with ${partner}`;
            }
            return {
              id: req.id,
              text: actionText,
              time: new Date(req.createdAt).toLocaleDateString(),
              status: req.status
            };
          });

        setActivities(recentActivities);
      } catch (err) {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800/50 to-indigo-950/20 p-6 md:p-8 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Hello, {user.name}!</h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">Ready to exchange knowledge? Explore catalog or check your request logs below.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/skills/add"
            className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2 px-4 rounded-xl text-sm transition"
          >
            + Add Skill Offered
          </Link>
          <Link
            to={`/profile/${user.id}`}
            className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold py-2 px-4 rounded-xl text-sm border border-slate-700 transition flex items-center gap-1"
          >
            <EditIcon fontSize="small" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Completion and Quick Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Completion Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Profile Completion</h3>
            <p className="text-xs text-slate-500 mb-6">Complete your profile details to rank higher in explore searches.</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-400">Progress</span>
              <span className="text-primary-400">{stats.profileCompletion}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.profileCompletion}%` }}
              ></div>
            </div>
            {stats.profileCompletion < 100 && (
              <Link to={`/profile/${user.id}`} className="text-xs text-primary-400 hover:underline flex items-center gap-1 mt-2">
                Complete profile items now <ArrowIcon fontSize="inherit" />
              </Link>
            )}
          </div>
        </div>

        {/* Counter cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <SkillIcon className="text-primary-400" />
            <div className="mt-8">
              <p className="text-3xl font-extrabold text-white">{stats.skillsCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Skills Offered</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <PendingIcon className="text-amber-400" />
            <div className="mt-8">
              <p className="text-3xl font-extrabold text-white">{stats.pendingCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Pending Swaps</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <SwapIcon className="text-blue-400" />
            <div className="mt-8">
              <p className="text-3xl font-extrabold text-white">{stats.acceptedCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Active Swaps</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
            <DoneIcon className="text-teal-400" />
            <div className="mt-8">
              <p className="text-3xl font-extrabold text-white">{stats.completedCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications and Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <NotifIcon className="text-primary-400" /> Notifications
            </h3>
            <Link to="/notifications" className="text-xs text-slate-500 hover:text-white transition">
              See All
            </Link>
          </div>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No recent notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="flex gap-3 items-start py-2 border-b border-slate-800/40 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${n.read ? 'bg-slate-700' : 'bg-primary-500'}`}></div>
                  <div className="flex-1">
                    <p className={`text-sm ${n.read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <SwapIcon className="text-indigo-400" /> Recent Activities
            </h3>
            <Link to="/exchanges" className="text-xs text-slate-500 hover:text-white transition">
              View History
            </Link>
          </div>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No recent exchange activities</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
                  <div>
                    <p className="text-sm text-slate-200">{act.text}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{act.time}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    act.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    act.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    act.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  }`}>
                    {act.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
