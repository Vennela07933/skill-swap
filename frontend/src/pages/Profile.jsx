import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Map as MapIcon,
  Star as StarIcon,
  PhotoCamera as CameraIcon,
  Phone as PhoneIcon,
  HourglassEmpty as HourIcon,
  CheckCircle as DoneIcon,
  RateReview as ReviewIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const Profile = () => {
  const { id } = useParams();
  const { user, updateUserLocal } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const isOwner = user && user.id === parseInt(id);
  const isAdmin = user && user.role === 'ADMIN';

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          API.get(`/api/users/${id}`),
          API.get(`/api/reviews/user/${id}?size=10`)
        ]);
        setProfile(profileRes.data);
        setReviews(reviewsRes.data.content || []);
      } catch (err) {
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await API.post('/api/users/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
      if (isOwner) {
        updateUserLocal(res.data);
      }
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-white">Profile Not Found</h2>
        <Link to="/dashboard" className="text-primary-400 mt-4 block hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Section */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Profile picture upload overlay */}
        <div className="relative group">
          <img
            src={profile.profilePicture ? `http://localhost:8080${profile.profilePicture}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
            alt={profile.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-slate-700 shadow-xl"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'; }}
          />
          {(isOwner || isAdmin) && (
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <CameraIcon className="text-white" />
              )}
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" disabled={uploading} />
            </label>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">{profile.name}</h1>
              <p className="text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-1 text-sm">
                <MapIcon fontSize="inherit" className="text-slate-500" /> {profile.location}
              </p>
            </div>
            {(isOwner || isAdmin) && (
              <Link
                to={`/profile/${profile.id}/edit`}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold py-2 px-4 rounded-xl border border-slate-700 transition"
              >
                Edit Profile
              </Link>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="bg-primary-500/10 text-primary-400 text-xs px-3 py-1 rounded-full font-semibold border border-primary-500/20">
              Availability: {profile.availability}
            </span>
            <span className="bg-teal-500/10 text-teal-400 text-xs px-3 py-1 rounded-full font-semibold border border-teal-500/20">
              Experience: {profile.experience}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <StarIcon fontSize="inherit" /> Rating: {profile.averageRating.toFixed(1)} / 5.0
            </span>
          </div>

          <div className="pt-2">
            <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">About Bio</h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line max-w-2xl">{profile.bio || "No introduction added."}</p>
          </div>
        </div>
      </div>

      {/* Grid of skills offered, wanted and rating lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skills Lists (Offered vs Wanted) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills Offered */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Skills Offered</h3>
              {isOwner && (
                <Link to="/skills/add" className="text-sm text-primary-400 hover:underline">
                  + Add Skill
                </Link>
              )}
            </div>
            {profile.skills?.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No skills offered yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.skills?.map((skill) => (
                  <div key={skill.id} className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-bold text-slate-200">{skill.skillName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-slate-800 text-slate-400">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{skill.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-850">
                      <span className="text-[10px] text-primary-400 font-bold bg-primary-500/5 px-2 py-0.5 rounded border border-primary-500/10">
                        {skill.category.replace('_', ' ')}
                      </span>
                      {!isOwner && user && (
                        <Link
                          to={`/exchanges/new?partner=${profile.id}&skill=${skill.id}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
                        >
                          Request Swap <ArrowIcon fontSize="inherit" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Skills Desired / Wanted</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skillsWanted ? (
                profile.skillsWanted.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1 rounded-xl font-semibold border border-indigo-500/20"
                  >
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No skills requested.</p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ReviewIcon className="text-primary-400" /> Member Reviews
          </h3>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No reviews submitted yet.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="border-b border-slate-800/40 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-350">{r.reviewerName}</span>
                    <span className="flex items-center text-xs font-semibold text-amber-400">
                      <StarIcon fontSize="inherit" /> {r.rating}.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">"{r.feedback}"</p>
                  <p className="text-[10px] text-slate-600 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
