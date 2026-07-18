import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  School,
  Share,
  Groups,
  Star,
  CheckCircle,
  Code,
  MusicNote,
  Translate
} from '@mui/icons-material';

const LandingPage = () => {
  const popularCategories = [
    { name: 'Web Development', count: 124, icon: <Code className="text-primary-400" /> },
    { name: 'Music & Instrument', count: 56, icon: <MusicNote className="text-teal-400" /> },
    { name: 'Languages', count: 87, icon: <Translate className="text-pink-400" /> },
    { name: 'Data Science', count: 48, icon: <TrendingUp className="text-blue-400" /> },
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 px-4 py-1.5 rounded-full text-xs font-semibold text-primary-300 mb-6 backdrop-blur">
          <Star fontSize="small" className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} /> Peer-to-Peer Skill Exchange
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
          Learn from Others.<br />
          <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Teach What You Know.
          </span>
        </h1>
        <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Skill Swap connects creators, developers, designers, and enthusiasts to exchange skills directly. No money required — just barter knowledge, exchange experiences, and grow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40 transition-all duration-200"
          >
            Start Swapping Now
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-8 py-3.5 text-base font-semibold rounded-xl transition-all duration-200"
          >
            Explore Skills Catalog
          </Link>
        </div>

        {/* Statistics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20 pt-10 border-t border-slate-800/60 max-w-4xl mx-auto">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-white">5K+</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-wider">Active Swappers</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-white">12K+</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-wider">Skills Offered</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-white">8K+</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-wider">Successful Swaps</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-white">99%</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-wider">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="bg-slate-900/40 py-20 border-t border-slate-850 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">How Skill Swap Works</h2>
            <p className="text-sm md:text-base text-slate-400">
              Bartering skills has never been simpler. Swap, teach, and learn in three steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center mb-6">
                <School className="text-primary-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Create Profile & Add Skills</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add the skills you offer (languages, framework, hobbies) and specify the skills you want to learn.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-teal-650/10 flex items-center justify-center mb-6">
                <Share className="text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Send Swap Request</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Search users near you or globally. Find someone who offers your desired skill and requests your expertise.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center mb-6">
                <Groups className="text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Exchange Knowledge</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Accept requests, connect via meetings, complete exchanges, and leave reviews to build your ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills Showcase */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Trending Exchange Categories</h2>
            <p className="text-sm md:text-base text-slate-400 max-w-md">
              Find partners to swap skills across development, music, languages, design, and more.
            </p>
          </div>
          <Link to="/search" className="text-sm text-primary-400 hover:text-primary-300 font-semibold mt-4 md:mt-0 transition">
            See all categories →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCategories.map((cat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:bg-slate-800/40 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                {cat.icon}
              </div>
              <div>
                <h4 className="font-bold text-white">{cat.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{cat.count} expert members</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900/60 py-20 border-t border-slate-850 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">What Swappers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-8 relative">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&h=60&q=80"
                  alt="Sarah L."
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">Sarah Jenkins</h4>
                  <p className="text-xs text-slate-500">UX Designer</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 italic leading-relaxed">
                "I swapped my UI design tips with a backend engineer who taught me Java basics. It was a game changer! The community is incredibly supportive."
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 relative">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&h=60&q=80"
                  alt="Daniel K."
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">Alex Mercer</h4>
                  <p className="text-xs text-slate-500">Software Architect</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 italic leading-relaxed">
                "I wanted to practice Spanish. I found native speakers in location filters who wanted to learn web dev. We hold weekly video meets and alternate languages."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-indigo-600/10 blur-xl rounded-3xl pointer-events-none"></div>
        <div className="glass-card rounded-3xl p-10 md:p-16 border border-slate-700/60 relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Ready to Expand Your Horizon?
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Create your account today, offer your skills, search for learning partners, and unlock reciprocal knowledge barter.
          </p>
          <Link
            to="/register"
            className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3.5 text-base font-bold rounded-xl transition duration-200 inline-block shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
