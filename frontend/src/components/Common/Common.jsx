import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          📚 AI Study Assistant
        </Link>

        <div className="hidden md:flex gap-4 items-center">
          <span className="text-sm">Welcome, {user?.username || 'Student'}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-secondary px-3 py-2 rounded hover:bg-opacity-80 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary px-4 py-4">
          <span className="block text-sm mb-3">Welcome, {user?.username || 'Student'}</span>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-primary px-3 py-2 rounded hover:bg-opacity-80 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-25"></div>
  </div>
);

export const ErrorMessage = ({ message, onDismiss }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
    <span>{message}</span>
    {onDismiss && (
      <button onClick={onDismiss} className="text-red-700 font-bold">
        ✕
      </button>
    )}
  </div>
);

export const SuccessMessage = ({ message }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
    {message}
  </div>
);
