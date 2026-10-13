import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/apiService';
import { Loading, ErrorMessage } from '../components/Common/Common';
import { FiBook, FiHelpCircle, FiList, FiEdit3, FiMessageSquare } from 'react-icons/fi';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await historyAPI.getHistory();
      setStats(response.data.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const features = [
    {
      icon: <FiBook className="text-2xl" />,
      title: 'Generate Notes',
      description: 'Generate comprehensive study notes using AI',
      path: '/notes',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: <FiEdit3 className="text-2xl" />,
      title: 'Generate Questions',
      description: 'Create practice questions for any topic',
      path: '/questions',
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: <FiHelpCircle className="text-2xl" />,
      title: 'Generate MCQs',
      description: 'Generate multiple-choice questions',
      path: '/mcqs',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      icon: <FiMessageSquare className="text-2xl" />,
      title: 'Ask Doubts',
      description: 'Chat with AI to clarify your doubts',
      path: '/chat',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      icon: <FiList className="text-2xl" />,
      title: 'View History',
      description: 'See all your generated content',
      path: '/history',
      color: 'bg-pink-100 text-pink-700',
    },
  ];

  return (
    <div className="page-container">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.username}! 👋</h1>
        <p className="text-gray-600">Personalized learning powered by AI</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-gray-600">Study Notes</p>
            <p className="text-3xl font-bold text-primary">{stats.totalNotes}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600">Questions</p>
            <p className="text-3xl font-bold text-green-600">{stats.totalQuestions}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600">MCQs</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalMCQs}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600">Chat Sessions</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalChats}</p>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="section-title">What would you like to do?</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature) => (
          <div
            key={feature.path}
            onClick={() => navigate(feature.path)}
            className="card cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
            <button className="text-primary font-semibold text-sm hover:underline">
              Get Started →
            </button>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
        <h3 className="font-bold mb-2">💡 Quick Tips</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Use AI Notes to generate comprehensive study material</li>
          <li>• Generate Questions and MCQs for self-assessment</li>
          <li>• Ask any doubt in the chat to get instant AI-powered explanations</li>
          <li>• All your generated content is saved and can be accessed anytime</li>
        </ul>
      </div>
    </div>
  );
};
