import React, { useState, useEffect } from 'react';
import { notesAPI } from '../services/apiService';
import { ErrorMessage, SuccessMessage, Loading } from '../components/Common/Common';
import { FiTrash2, FiDownload } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export const NotesGenerator = () => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const response = await notesAPI.getAll();
      setNotes(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await notesAPI.generate({ topic });
      setSuccess('Notes generated successfully!');
      setNotes([response.data.data, ...notes]);
      setTopic('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      setGeneratingId(id);
      await notesAPI.delete(id);
      setNotes(notes.filter((note) => note._id !== id));
      setSuccess('Note deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">📚 Study Notes Generator</h1>
        <p className="text-gray-600">Generate comprehensive study notes using AI</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} />}

      {/* Generator Form */}
      <div className="card mb-8">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Topic Name</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input-field"
              placeholder="e.g., Binary Search Trees, Recursion, Database Normalization"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Generating notes...' : 'Generate Notes'}
          </button>
        </form>
      </div>

      {/* Notes List */}
      <div>
        <h2 className="section-title">Your Generated Notes</h2>

        {loadingNotes ? (
          <Loading />
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notes generated yet. Create your first note above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{note.topic}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(note.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(note._id)}
                    disabled={generatingId === note._id}
                    className="btn-outline py-1 px-3 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto prose prose-sm max-w-none">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
