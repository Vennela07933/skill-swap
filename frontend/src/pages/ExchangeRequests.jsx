import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Done as DoneIcon,
  Close as CloseIcon,
  CheckCircle as CompleteIcon,
  Send as SendIcon,
  AssignmentTurnedIn as ReviewIcon
} from '@mui/icons-material';

const ExchangeRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get('partner');
  const receiverSkillId = searchParams.get('skill');

  const [mySkills, setMySkills] = useState([]);
  const [partner, setPartner] = useState(null);
  const [partnerSkill, setPartnerSkill] = useState(null);
  const [mySelectedSkillId, setMySelectedSkillId] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Request list state
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal State for Review
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // 1. Load data for creating request
  useEffect(() => {
    if (partnerId && receiverSkillId) {
      const loadRequestFormData = async () => {
        try {
          const [myProfileRes, partnerRes, skillRes] = await Promise.all([
            API.get(`/api/users/${user.id}`),
            API.get(`/api/users/${partnerId}`),
            API.get(`/api/skills/${receiverSkillId}`)
          ]);

          setMySkills(myProfileRes.data.skills || []);
          if (myProfileRes.data.skills?.length > 0) {
            setMySelectedSkillId(myProfileRes.data.skills[0].id.toString());
          }
          setPartner(partnerRes.data);
          setPartnerSkill(skillRes.data);
        } catch (err) {
          toast.error("Failed to load details for exchange creation");
        }
      };
      loadRequestFormData();
    }
  }, [partnerId, receiverSkillId, user.id]);

  // 2. Load requests for list tabs
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/exchanges?type=${activeTab}&page=${page}&size=10`);
      setRequests(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load exchange requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!partnerId) {
      fetchRequests();
    }
  }, [activeTab, page, partnerId]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!mySelectedSkillId) {
      toast.error("Please select a skill you want to offer");
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/api/exchanges', {
        receiverId: parseInt(partnerId),
        receiverSkillId: parseInt(receiverSkillId),
        senderSkillId: parseInt(mySelectedSkillId),
        message: requestMessage
      });
      toast.success("Skill swap request sent!");
      navigate('/exchanges?type=sent');
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to submit swap request";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, action) => {
    try {
      const res = await API.put(`/api/exchanges/${id}/${action}`);
      toast.success(`Exchange request ${action}ed!`);
      
      // If completed, prompt user for review
      if (action === 'complete') {
        const completedEx = res.data;
        // Identify reviewee
        const revieweeId = completedEx.senderId === user.id ? completedEx.receiverId : completedEx.senderId;
        const revieweeName = completedEx.senderId === user.id ? completedEx.receiverName : completedEx.senderName;
        setSelectedExchangeForReview({
          exchangeId: completedEx.id,
          revieweeId,
          revieweeName
        });
        setReviewModalOpen(true);
      }
      fetchRequests();
    } catch (err) {
      toast.error(`Failed to update request: ${err.response?.data?.message || 'error'}`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/reviews', {
        revieweeId: selectedExchangeForReview.revieweeId,
        exchangeRequestId: selectedExchangeForReview.exchangeId,
        rating: reviewRating,
        feedback: reviewFeedback
      });
      toast.success("Review submitted! Thank you.");
      setReviewModalOpen(false);
      setReviewFeedback('');
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // Render NEW REQUEST FORM if params exist
  if (partnerId && receiverSkillId) {
    if (!partner || !partnerSkill) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="glass-card rounded-3xl p-8 border border-slate-800">
          <h2 className="text-2xl font-extrabold text-white mb-2">Request Skill Swap</h2>
          <p className="text-xs text-slate-500 mb-8">
            You are requesting to learn <span className="text-primary-400 font-bold">{partnerSkill.skillName}</span> from <span className="text-slate-300 font-bold">{partner.name}</span>.
          </p>

          <form onSubmit={handleCreateRequest} className="space-y-6">
            {/* Offer Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Choose your offered skill to swap</label>
              {mySkills.length === 0 ? (
                <div className="text-xs text-red-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                  You must add at least one offered skill to your profile before requesting swaps.{' '}
                  <Link to="/skills/add" className="underline font-bold text-red-300">Add offered skill now</Link>
                </div>
              ) : (
                <select
                  value={mySelectedSkillId}
                  onChange={(e) => setMySelectedSkillId(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-350 focus:outline-none transition duration-200"
                >
                  {mySkills.map((s) => (
                    <option key={s.id} value={s.id}>{s.skillName} ({s.level})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Proposal Message</label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Introduce yourself, say why you want to learn their skill, and specify how you plan to alternate teaching days..."
                rows={4}
                required
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none transition duration-200 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 bg-slate-850 hover:bg-slate-800 text-slate-300 text-center font-semibold py-3 rounded-xl transition duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || mySkills.length === 0}
                className="w-2/3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Send Swap Proposal'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render REQUESTS LIST (Received / Sent tabs)
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-8">Exchange Swap Requests</h1>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-8">
        <button
          onClick={() => { setActiveTab('received'); setPage(0); }}
          className={`pb-4 px-6 text-sm font-semibold transition ${
            activeTab === 'received' ? 'border-b-2 border-primary-500 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Received Requests
        </button>
        <button
          onClick={() => { setActiveTab('sent'); setPage(0); }}
          className={`pb-4 px-6 text-sm font-semibold transition ${
            activeTab === 'sent' ? 'border-b-2 border-primary-500 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Sent Requests
        </button>
      </div>

      {/* Requests log */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-24 animate-pulse"></div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-slate-950/20 border border-slate-805 rounded-3xl">
          <p className="text-slate-500">No {activeTab} exchange requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isSender = req.senderId === user.id;
            const partnerName = isSender ? req.receiverName : req.senderName;
            const partnerEmail = isSender ? req.receiverEmail : req.senderEmail;

            return (
              <div key={req.id} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                      req.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-400' :
                      req.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                      'bg-teal-500/10 text-teal-400'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm text-slate-350 leading-relaxed">
                    Partner: <span className="text-white font-bold">{partnerName}</span> ({partnerEmail})
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                    <p className="text-xs text-slate-400">
                      Offered: <span className="text-slate-200 font-semibold">{req.senderSkillName}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Requested: <span className="text-slate-200 font-semibold">{req.receiverSkillName}</span>
                    </p>
                  </div>

                  {req.message && (
                    <p className="text-xs text-slate-500 italic bg-slate-900/20 p-2.5 rounded-lg border border-slate-850/50">
                      "{req.message}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                  {/* Received Pending */}
                  {req.status === 'PENDING' && !isSender && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'accept')}
                        className="flex-1 md:w-32 bg-primary-650 hover:bg-primary-600 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition"
                      >
                        <DoneIcon fontSize="inherit" /> Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'reject')}
                        className="flex-1 md:w-32 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1 border border-slate-700 transition"
                      >
                        <CloseIcon fontSize="inherit" /> Reject
                      </button>
                    </>
                  )}

                  {/* Accepted status */}
                  {req.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'complete')}
                      className="w-full md:w-32 bg-teal-650 hover:bg-teal-600 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <CompleteIcon fontSize="inherit" /> Complete
                    </button>
                  )}

                  {/* Completed status - leave a review option */}
                  {req.status === 'COMPLETED' && (
                    <button
                      onClick={() => {
                        const revieweeId = isSender ? req.receiverId : req.senderId;
                        const revieweeName = isSender ? req.receiverName : req.senderName;
                        setSelectedExchangeForReview({ exchangeId: req.id, revieweeId, revieweeName });
                        setReviewModalOpen(true);
                      }}
                      className="w-full md:w-32 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <ReviewIcon fontSize="inherit" /> Review Partner
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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

      {/* Review Modal Dialog */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Review Partner</h3>
              <p className="text-xs text-slate-500 mt-1">Rate your swap experience with {selectedExchangeForReview?.revieweeName}</p>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-350 focus:outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Poor)</option>
                  <option value={1}>⭐ (1 - Terrible)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Feedback / Message</label>
                <textarea
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Share a short feedback regarding their domain knowledge, friendliness, availability, etc."
                  rows={3}
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-200 focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="w-1/3 bg-slate-850 hover:bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-2 rounded-xl text-xs shadow-lg transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeRequests;
