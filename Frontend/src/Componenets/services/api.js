import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - show error message
          console.error('Access forbidden:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', data.errors);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
          
        default:
          console.error('API error:', data.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    updateProfile: '/auth/profile'
  },
  
  // User endpoints
  users: {
    getAll: '/users',
    getById: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    search: '/users/search'
  },
  
  // Project endpoints
  projects: {
    getAll: '/projects',
    getById: (id) => `/projects/${id}`,
    create: '/projects',
    update: (id) => `/projects/${id}`,
    delete: (id) => `/projects/${id}`,
    addMember: (id) => `/projects/${id}/members`,
    removeMember: (id) => `/projects/${id}/members`,
    getMembers: (id) => `/projects/${id}/members`,
    getUserProjects: '/projects/user'
  },
  
  // Task endpoints
  tasks: {
    getAll: '/tasks',
    getById: (id) => `/tasks/${id}`,
    create: '/tasks',
    update: (id) => `/tasks/${id}`,
    delete: (id) => `/tasks/${id}`,
    getByProject: (projectId) => `/tasks/project/${projectId}`,
    updateStatus: (id) => `/tasks/${id}/status`,
    assign: (id) => `/tasks/${id}/assign`,
    addComment: (id) => `/tasks/${id}/comments`,
    getComments: (id) => `/tasks/${id}/comments`,
    uploadAttachment: (id) => `/tasks/${id}/attachments`,
    deleteAttachment: (id, attachmentId) => `/tasks/${id}/attachments/${attachmentId}`
  }
};

// Helper functions for common API operations
export const apiHelpers = {
  // Generic CRUD operations
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // File upload helper
  uploadFile: (url, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  },
  
  // Batch operations
  batchDelete: (url, ids) => {
    return api.delete(url, {
      data: { ids }
    });
  },
  
  // Search with pagination
  searchWithPagination: (url, params) => {
    return api.get(url, { params });
  }
};

// Export the configured axios instance
export default api;