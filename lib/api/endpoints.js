import { apiClient } from './client';

export const API = {
  // ============ AUTH ENDPOINTS ============
  auth: {
    login: (data) => apiClient.post('/auth/login', data),
    register: (data) => apiClient.post('/auth/register', data),
    getMe: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout'),
  },

  // ============ PRODUCTION ENDPOINTS ============
  productions: {
    getAll: (filters) => apiClient.get('/productions', filters),
    getById: (id) => apiClient.get(`/productions/${id}`),
    create: (data) => apiClient.post('/productions', data),
    update: (id, data) => apiClient.put(`/productions/${id}`, data),
    delete: (id) => apiClient.delete(`/productions/${id}`),
  },

  // ============ MACHINE ENDPOINTS ============
  machines: {
    getAll: () => apiClient.get('/machines'),
    getById: (id) => apiClient.get(`/machines/${id}`),
    create: (data) => apiClient.post('/machines', data),
    update: (id, data) => apiClient.put(`/machines/${id}`, data),
    delete: (id) => apiClient.delete(`/machines/${id}`),
  },

  // ============ USER ENDPOINTS ============
  users: {
    getAll: (role) => apiClient.get('/users', { role }),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`),
  },

  // ============ REPORT ENDPOINTS ============
  reports: {
    getSummary: () => apiClient.get('/reports/summary'),
    getDailyReport: (date) => apiClient.get('/reports', { date }),
    getMachineReport: (machineId, startDate, endDate) => 
      apiClient.get('/reports/machine', { machineId, startDate, endDate }),
  },
};
