import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { toast } from 'react-toastify';
import {
  People as UsersIcon,
  WorkspacePremium as SkillsIcon,
  SwapHoriz as RequestsIcon,
  CheckCircle as DoneIcon,
  HourglassEmpty as PendingIcon,
  Block as BlockIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  
  // Manage Users State
  const [userList, setUserList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  
  // Manage Skills State
  const [skillList, setSkillList] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');

  const [loading, setLoading] = useState(true);

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/users/admin/stats');
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load admin statistics");
    } finally {
      setLoading(false);
    }
  };

  const loadUserList = async () => {
    try {
      const res = await API.get(`/api/users?size=100&name=${userSearch}`);
      // filter out admin user or show all
      setUserList(res.data.content || []);
    } catch (err) {
      toast.error("Failed to load user list");
    }
  };

  const loadSkillList = async () => {
    try {
      const res = await API.get(`/api/skills?size=100`);
      setSkillList(res.data.content || []);
    } catch (err) {
      toast.error("Failed to load skill list");
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      loadAdminStats();
    } else if (activeTab === 'users') {
      loadUserList();
    } else if (activeTab === 'skills') {
      loadSkillList();
    }
  }, [activeTab, userSearch]);

  const handleToggleBlock = async (id, currentBlockedStatus) => {
    try {
      await API.put(`/api/users/${id}/block?block=${!currentBlockedStatus}`);
      toast.success(currentBlockedStatus ? "User unblocked" : "User blocked");
      loadUserList();
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
    try {
      await API.delete(`/api/users/${id}`);
      toast.success("User deleted");
      loadUserList();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await API.delete(`/api/skills/${id}`);
      toast.success("Skill deleted");
      loadSkillList();
    } catch (err) {
      toast.error("Failed to delete skill");
    }
  };

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin Control Panel</h1>
          <p className="text-sm text-slate-500 mt-1">Manage swappers, moderate posted skills, and audit platform metrics.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'overview' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'users' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'skills' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Skills
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
              <UsersIcon className="text-primary-400" />
              <div>
                <p className="text-2xl font-black text-white">{stats.totalUsers}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Users</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
              <SkillsIcon className="text-indigo-400" />
              <div>
                <p className="text-2xl font-black text-white">{stats.totalSkills}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Skills</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
              <RequestsIcon className="text-blue-400" />
              <div>
                <p className="text-2xl font-black text-white">{stats.totalRequests}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Requests</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
              <DoneIcon className="text-teal-400" />
              <div>
                <p className="text-2xl font-black text-white">{stats.completedExchanges}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Completed Swaps</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
              <PendingIcon className="text-amber-400" />
              <div>
                <p className="text-2xl font-black text-white">{stats.pendingRequests}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pending Swaps</p>
              </div>
            </div>
          </div>

          {/* Recent list columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Recent Registrations</h3>
              <div className="space-y-4">
                {stats.recentUsers?.map(ru => (
                  <div key={ru.id} className="flex justify-between items-center py-2 border-b border-slate-800/40 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{ru.name}</p>
                      <p className="text-xs text-slate-500">{ru.email}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(ru.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Skills */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Recent Added Skills</h3>
              <div className="space-y-4">
                {stats.recentSkills?.map(rs => (
                  <div key={rs.id} className="flex justify-between items-center py-2 border-b border-slate-800/40 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{rs.skillName}</p>
                      <p className="text-xs text-slate-500">By: {rs.userName}</p>
                    </div>
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full uppercase">{rs.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE USERS TAB */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Registered Users</h3>
            <input
              type="text"
              placeholder="Search user by name..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-4 text-xs text-slate-350 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {userList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/10">
                    <td className="py-3 px-4 font-semibold text-slate-200">{u.name}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${u.role === 'ADMIN' ? 'text-amber-400 bg-amber-500/5' : 'text-slate-400 bg-slate-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${u.blocked ? 'text-red-400 bg-red-500/5' : 'text-teal-400 bg-teal-500/5'}`}>
                        {u.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {u.role !== 'ADMIN' && (
                        <>
                          <button
                            onClick={() => handleToggleBlock(u.id, u.blocked)}
                            className={`p-1 rounded transition ${u.blocked ? 'text-teal-400 hover:bg-teal-500/10' : 'text-amber-400 hover:bg-amber-500/10'}`}
                            title={u.blocked ? "Unblock User" : "Block User"}
                          >
                            <BlockIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10 transition"
                            title="Delete User"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MANAGE SKILLS TAB */}
      {activeTab === 'skills' && (
        <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Moderate Skills Inventory</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {skillList.map(s => (
                  <tr key={s.id} className="hover:bg-slate-900/10">
                    <td className="py-3 px-4 font-semibold text-slate-200">{s.skillName}</td>
                    <td className="py-3 px-4 text-slate-400">{s.category.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-slate-400">{s.userName}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-900 text-slate-400 px-2 py-0.5 rounded uppercase font-semibold">{s.level}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-1 rounded text-red-400 hover:bg-red-500/10 transition"
                        title="Delete Skill"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
