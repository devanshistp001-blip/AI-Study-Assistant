import React, { useState, useEffect } from 'react';
import { mcqsAPI } from '../services/apiService';
import { ErrorMessage, SuccessMessage, Loading } from '../components/Common/Common';
import { FiTrash2 } from 'react-icons/fi';

export const MCQGenerator = () => {
  const [topic, setTopic] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMcqs, setLoadingMcqs] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingId, setGeneratingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    fetchMCQs();
  }, []);

  const fetchMCQs = async () => {
    try {
      setLoadingMcqs(true);
      const response = await mcqsAPI.getAll();
      setMcqs(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load MCQs');
    } finally {
      setLoadingMcqs(false);
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
      const response = await mcqsAPI.generate({ topic });
      setSuccess('MCQs generated successfully!');
      setMcqs([response.data.data, ...mcqs]);
      setTopic('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate MCQs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete these MCQs?')) return;

    try {
      setGeneratingId(id);
      await mcqsAPI.delete(id);
      setMcqs(mcqs.filter((m) => m._id !== id));
      setSuccess('MCQs deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete MCQs');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleSelectAnswer = (key, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [key]: optionIndex,
    }));
  };

  const isAnswerCorrect = (key, mcqSet, questionIndex) => {
    const selectedIdx = selectedAnswers[key];
    if (selectedIdx === undefined) return null;
    return selectedIdx === mcqSet.mcqs[questionIndex].correctOptionIndex;
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">🎯 MCQ Generator</h1>
        <p className="text-gray-600">Generate multiple-choice questions for self-assessment</p>
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
              placeholder="e.g., OOP Concepts, Arrays, Web Sockets"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Generating MCQs...' : 'Generate MCQs'}
          </button>
        </form>
      </div>

      {/* MCQs List */}
      <div>
        <h2 className="section-title">Your Generated MCQs</h2>

        {loadingMcqs ? (
          <Loading />
        ) : mcqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No MCQs generated yet. Create your first set above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mcqs.map((mcqSet) => (
              <div key={mcqSet._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{mcqSet.topic}</h3>
                    <p className="text-sm text-gray-500">
                      {mcqSet.mcqs.length} questions •{' '}
                      {new Date(mcqSet.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(mcqSet._id)}
                    disabled={generatingId === mcqSet._id}
                    className="btn-outline py-1 px-3 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="space-y-4">
                  {mcqSet.mcqs.map((mcq, idx) => {
                    const key = `${mcqSet._id}-${idx}`;
                    const isCorrect = isAnswerCorrect(key, mcqSet, idx);
                    return (
                      <div key={idx} className="bg-gray-50 p-4 rounded">
                        <p className="font-semibold mb-3">{`Q${idx + 1}: ${mcq.questionText}`}</p>

                        <div className="space-y-2">
                          {mcq.options.map((option, optIdx) => {
                            const isSelected = selectedAnswers[key] === optIdx;
                            let bgColor = 'hover:bg-gray-100';

                            if (isSelected) {
                              if (isCorrect === true) {
                                bgColor = 'bg-green-100 border-green-500';
                              } else if (isCorrect === false) {
                                bgColor = 'bg-red-100 border-red-500';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectAnswer(key, optIdx)}
                                className={`w-full text-left p-2 border-2 rounded transition ${bgColor}`}
                              >
                                <span className="font-semibold">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>{' '}
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {selectedAnswers[key] !== undefined && (
                          <div className="mt-3 p-3 bg-white rounded border-l-4 border-primary">
                            <p className="text-sm font-semibold">
                              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                            </p>
                            <p className="text-sm mt-1">
                              <strong>Explanation:</strong> {mcq.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
