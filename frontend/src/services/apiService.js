import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
};

// Notes APIs
export const notesAPI = {
  generate: (data) => apiClient.post('/notes/generate', data),
  getAll: () => apiClient.get('/notes'),
  getOne: (id) => apiClient.get(`/notes/${id}`),
  delete: (id) => apiClient.delete(`/notes/${id}`),
};

// Questions APIs
export const questionsAPI = {
  generate: (data) => apiClient.post('/questions/generate', data),
  getAll: () => apiClient.get('/questions'),
  getOne: (id) => apiClient.get(`/questions/${id}`),
  delete: (id) => apiClient.delete(`/questions/${id}`),
};

// MCQs APIs
export const mcqsAPI = {
  generate: (data) => apiClient.post('/mcqs/generate', data),
  getAll: () => apiClient.get('/mcqs'),
  getOne: (id) => apiClient.get(`/mcqs/${id}`),
  delete: (id) => apiClient.delete(`/mcqs/${id}`),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => apiClient.post('/chat/message', data),
  getChats: () => apiClient.get('/chat'),
  getChat: (id) => apiClient.get(`/chat/${id}`),
  deleteChat: (id) => apiClient.delete(`/chat/${id}`),
};

// History APIs
export const historyAPI = {
  getHistory: () => apiClient.get('/history'),
};

export default apiClient;
