import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeDashboard from './pages/HomeDashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddSkill from './pages/AddSkill';
import EditSkill from './pages/EditSkill';
import SearchResults from './pages/SearchResults';
import ExchangeRequests from './pages/ExchangeRequests';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 selection:bg-primary-500 selection:text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile/:id" element={<Profile />} />

              {/* Private Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <HomeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/skills/add" 
                element={
                  <ProtectedRoute>
                    <AddSkill />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/skills/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditSkill />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exchanges" 
                element={
                  <ProtectedRoute>
                    <ExchangeRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <ToastContainer 
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
