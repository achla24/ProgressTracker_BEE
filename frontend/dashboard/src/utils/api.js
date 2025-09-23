import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('progresstracker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('progresstracker_token');
      localStorage.removeItem('progresstracker_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Tasks API calls
export const tasksAPI = {
  getTasks: () => api.get('/tasks'),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, updates) => api.patch(`/tasks/${id}`, updates),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Dashboard API calls
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
};

// Todoist API calls
export const todoistAPI = {
  getTasks: () => api.get('/todoist/tasks'),
  createTask: (task) => api.post('/todoist/tasks', task),
  completeTask: (id) => api.post(`/todoist/tasks/${id}/close`),
  deleteTask: (id) => api.delete(`/todoist/tasks/${id}`),
};

// Google Calendar API calls
export const googleAPI = {
  getAuthUrl: () => api.get('/google/auth'),
  createEvent: (event) => api.post('/google/event', event),
};

export default api;