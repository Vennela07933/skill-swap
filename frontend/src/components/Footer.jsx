import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-indigo-400 text-transparent bg-clip-text">
              SKILL SWAP
            </span>
            <p className="mt-4 text-sm text-slate-500 max-w-sm">
              The ultimate collaborative platform for peer-to-peer knowledge exchanges. Share what you know, request what you want to learn, and grow your skillset together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-white transition">Explore Skills</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Join Platform</Link></li>
              <li><a href={`${import.meta.env.VITE_API_URL}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">API Swagger Docs</a></li>
            </ul>
          </div>

          {/* Contact info / support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Developer</h3>
            <p className="mt-4 text-sm text-slate-500">
              Built with Spring Boot 3, MySQL, and React + Vite + Tailwind CSS.
            </p>
            <p className="mt-2 text-xs text-slate-600">
              © {new Date().getFullYear()} Skill Swap. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
