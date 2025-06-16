import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Session endpoints
export const sessions = {
  create: (data) => api.post('/sessions', data),
  getById: (id) => api.get(`/sessions/${id}`),
  getUserSessions: (userId) => api.get(`/sessions/user/${userId}`),
  getFeed: () => api.get('/sessions/feed'),
  like: (id) => api.post(`/sessions/${id}/like`),
  comment: (id, text) => api.post(`/sessions/${id}/comment`, { text }),
};

// User endpoints
export const users = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (id, data) => api.put(`/users/profile/${id}`, data),
  follow: (id) => api.post(`/users/follow/${id}`),
  unfollow: (id) => api.post(`/users/unfollow/${id}`),
};

export default api; 