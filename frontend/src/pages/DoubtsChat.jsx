import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/apiService';
import { ErrorMessage, SuccessMessage } from '../components/Common/Common';
import { FiTrash2, FiSend } from 'react-icons/fi';

export const DoubtsChat = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [topic, setTopic] = useState('General Doubts');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const response = await chatAPI.getChats();
      setChats(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chats');
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSelectChat = async (chatId) => {
    try {
      setError('');
      setCurrentChatId(chatId);

      const response = await chatAPI.getChat(chatId);

      setCurrentMessages(response.data.data.messages);
      setTopic(response.data.data.topic);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chat');
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setCurrentMessages([]);
    setTopic('General Doubts');
    setMessage('');
    setError('');
    setSuccess('');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await chatAPI.sendMessage({
        message: message.trim(),
        topic,
        conversationId: currentChatId,
      });

      const { conversationId, conversation } = response.data.data;

      if (!currentChatId) {
        setCurrentChatId(conversationId);
        setChats((prevChats) => [conversation, ...prevChats]);
      } else {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === conversationId ? conversation : chat
          )
        );
      }

      setCurrentMessages(conversation.messages);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Delete this conversation?')) return;

    try {
      setError('');

      await chatAPI.deleteChat(chatId);

      setChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== chatId)
      );

      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setCurrentMessages([]);
        setTopic('General Doubts');
        setMessage('');
      }

      setSuccess('Conversation deleted');

      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete chat');
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">
          💬 Ask Doubts (AI Doubt Solver)
        </h1>

        <p className="text-gray-600">
          Chat with AI to clarify your doubts and get instant answers
        </p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      {success && (
        <SuccessMessage
          message={success}
          onDismiss={() => setSuccess('')}
        />
      )}

      <div className="grid lg:grid-cols-4 gap-4 h-96 lg:h-screen lg:-mt-10">

        {/* Chats Sidebar */}
        <div className="lg:col-span-1 card overflow-y-auto">

          <h3 className="font-bold mb-4">
            Conversations
          </h3>

          <button
            onClick={handleNewChat}
            className="w-full btn-secondary mb-4 text-sm"
          >
            + New Chat
          </button>

          {loadingChats ? (
            <p className="text-gray-500 text-sm">
              Loading...
            </p>
          ) : chats.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-2">

              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`p-2 rounded cursor-pointer transition ${
                    currentChatId === chat._id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectChat(chat._id)}
                >

                  <p className="font-semibold text-sm truncate">
                    {chat.topic}
                  </p>

                  <p className="text-xs opacity-75">
                    {chat.messages.length} messages
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat._id);
                    }}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    <FiTrash2 size={14} />
                  </button>

                </div>
              ))}

            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 card flex flex-col">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">

            {currentMessages.length === 0 ? (

              <div className="h-full flex items-center justify-center text-gray-500">

                <div className="text-center">

                  <p className="text-lg font-semibold mb-2">
                    Start a new conversation
                  </p>

                  <p className="text-sm">
                    Type your doubt below and ask the AI.
                  </p>

                </div>

              </div>

            ) : (

              <>
                {currentMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >

                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-gray-200 text-black rounded-bl-none'
                      }`}
                    >

                      <p className="text-sm">
                        {msg.content}
                      </p>

                      <p className="text-xs opacity-70 mt-1">
                        {new Date(
                          msg.timestamp
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                    </div>

                  </div>
                ))}

                <div ref={messagesEndRef} />

              </>

            )}

          </div>

          {/* Input Form - ALWAYS VISIBLE */}
          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 pt-4 border-t"
          >

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field flex-1"
              placeholder="Ask your doubt..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="btn-primary px-4 disabled:opacity-50"
            >
              <FiSend />
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};