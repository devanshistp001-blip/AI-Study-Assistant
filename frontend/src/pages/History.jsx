import React, { useState, useEffect } from 'react';
import { historyAPI, notesAPI, questionsAPI, mcqsAPI, chatAPI } from '../services/apiService';
import { ErrorMessage, SuccessMessage, Loading } from '../components/Common/Common';
import { FiTrash2 } from 'react-icons/fi';

export const History = () => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await historyAPI.getHistory();
      setHistoryData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;

    try {
      setDeletingId(id);
      let deleteFunc;
      switch (type) {
        case 'note':
          deleteFunc = notesAPI.delete;
          break;
        case 'question':
          deleteFunc = questionsAPI.delete;
          break;
        case 'mcq':
          deleteFunc = mcqsAPI.delete;
          break;
        case 'chat':
          deleteFunc = chatAPI.deleteChat;
          break;
        default:
          return;
      }

      await deleteFunc(id);
      setSuccess(`${type} deleted successfully`);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to delete ${type}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loading />;

  const { stats, recent } = historyData || { stats: {}, recent: {} };

  const tabs = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'notes', label: 'Notes', icon: '📚' },
    { id: 'questions', label: 'Questions', icon: '❓' },
    { id: 'mcqs', label: 'MCQs', icon: '🎯' },
    { id: 'chats', label: 'Chats', icon: '💬' },
  ];

  const renderContent = () => {
    if (activeTab === 'all') {
      return (
        <div className="space-y-8">
          {recent?.notes && recent.notes.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">📚 Recent Notes</h3>
              <div className="space-y-2">
                {recent.notes.map((note) => (
                  <div key={note._id} className="card p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{note.topic}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(note.generatedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete('note', note._id)}
                      disabled={deletingId === note._id}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recent?.questions && recent.questions.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">❓ Recent Questions</h3>
              <div className="space-y-2">
                {recent.questions.map((q) => (
                  <div key={q._id} className="card p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{q.topic}</p>
                      <p className="text-sm text-gray-500">{q.questions.length} questions</p>
                    </div>
                    <button
                      onClick={() => handleDelete('question', q._id)}
                      disabled={deletingId === q._id}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recent?.mcqs && recent.mcqs.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">🎯 Recent MCQs</h3>
              <div className="space-y-2">
                {recent.mcqs.map((mcq) => (
                  <div key={mcq._id} className="card p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{mcq.topic}</p>
                      <p className="text-sm text-gray-500">{mcq.mcqs.length} questions</p>
                    </div>
                    <button
                      onClick={() => handleDelete('mcq', mcq._id)}
                      disabled={deletingId === mcq._id}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recent?.chats && recent.chats.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">💬 Recent Chats</h3>
              <div className="space-y-2">
                {recent.chats.map((chat) => (
                  <div key={chat._id} className="card p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{chat.topic}</p>
                      <p className="text-sm text-gray-500">{chat.messages.length} messages</p>
                    </div>
                    <button
                      onClick={() => handleDelete('chat', chat._id)}
                      disabled={deletingId === chat._id}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'notes' && recent?.notes) {
      return (
        <div className="space-y-2">
          {recent.notes.length === 0 ? (
            <p className="text-gray-500">No notes yet</p>
          ) : (
            recent.notes.map((note) => (
              <div key={note._id} className="card p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{note.topic}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(note.generatedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete('note', note._id)}
                  disabled={deletingId === note._id}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
      );
    }

    // Similar for other tabs...
    return <p className="text-gray-500">No items yet</p>;
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">📖 Study History</h1>
        <p className="text-gray-600">View and manage all your generated content</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} />}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-gray-600">📚 Notes</p>
          <p className="text-3xl font-bold text-primary">{stats.totalNotes || 0}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600">❓ Questions</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalQuestions || 0}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600">🎯 MCQs</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.totalMCQs || 0}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600">💬 Chats</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalChats || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
};
