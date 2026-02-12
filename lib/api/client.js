import axios from 'axios';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request(config) {
    const response = await this.client(config);
    return response.data.data || response.data;
  }

  // GET request
  async get(url, params) {
    return this.request({ method: 'GET', url, params });
  }

  // POST request
  async post(url, data) {
    return this.request({ method: 'POST', url, data });
  }

  // PUT request
  async put(url, data) {
    return this.request({ method: 'PUT', url, data });
  }

  // DELETE request
  async delete(url) {
    return this.request({ method: 'DELETE', url });
  }
}

export const apiClient = new ApiClient();
