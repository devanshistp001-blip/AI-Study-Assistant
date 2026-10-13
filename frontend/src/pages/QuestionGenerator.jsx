import React, { useState, useEffect } from 'react';
import { questionsAPI } from '../services/apiService';
import { ErrorMessage, SuccessMessage, Loading } from '../components/Common/Common';
import { FiTrash2 } from 'react-icons/fi';

export const QuestionGenerator = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingId, setGeneratingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const response = await questionsAPI.getAll();
      setQuestions(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions');
    } finally {
      setLoadingQuestions(false);
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
      const response = await questionsAPI.generate({ topic });
      setSuccess('Questions generated successfully!');
      setQuestions([response.data.data, ...questions]);
      setTopic('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete these questions?')) return;

    try {
      setGeneratingId(id);
      await questionsAPI.delete(id);
      setQuestions(questions.filter((q) => q._id !== id));
      setSuccess('Questions deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete questions');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">✍️ Practice Questions Generator</h1>
        <p className="text-gray-600">Generate practice questions for self-assessment</p>
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
              placeholder="e.g., Graphs, Sorting Algorithms, SQL Joins"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Generating questions...' : 'Generate Questions'}
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div>
        <h2 className="section-title">Your Generated Questions</h2>

        {loadingQuestions ? (
          <Loading />
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No questions generated yet. Create your first set above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((questionSet) => (
              <div key={questionSet._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{questionSet.topic}</h3>
                    <p className="text-sm text-gray-500">
                      {questionSet.questions.length} questions •{' '}
                      {new Date(questionSet.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(questionSet._id)}
                    disabled={generatingId === questionSet._id}
                    className="btn-outline py-1 px-3 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="space-y-3">
                  {questionSet.questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === `${questionSet._id}-${idx}` ? null : `${questionSet._id}-${idx}`)
                        }
                        className="w-full text-left font-semibold hover:text-primary"
                      >
                        Q{idx + 1}: {q.questionText}
                      </button>

                      {expandedId === `${questionSet._id}-${idx}` && (
                        <div className="mt-3 p-3 bg-white rounded border-l-4 border-primary">
                          <p className="font-semibold text-sm text-gray-700">Answer:</p>
                          <p className="text-sm mt-1">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
