import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { toast } from 'react-toastify';
import { NotificationsActive as NotifIcon, Done as ReadIcon } from '@mui/icons-material';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/notifications?page=${page}&size=10`);
      setNotifications(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <NotifIcon className="text-primary-500" fontSize="large" />
        <h1 className="text-3xl font-extrabold text-white">Your Notifications</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-16 animate-pulse"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-slate-950/20 border border-slate-805 rounded-3xl">
          <p className="text-slate-500">You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between gap-4 transition duration-200 ${
                n.read ? 'opacity-70' : 'bg-slate-800/40 border-l-2 border-l-primary-500'
              }`}
            >
              <div className="space-y-1">
                <p className={`text-sm ${n.read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                  {n.message}
                </p>
                <p className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleString()}</p>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-700 transition"
                  title="Mark as Read"
                >
                  <ReadIcon fontSize="small" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 text-xs px-3 py-1.5 rounded-xl disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 text-xs px-3 py-1.5 rounded-xl disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
