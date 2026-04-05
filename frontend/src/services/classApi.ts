import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/classes`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Class {
  id: number;
  name: string;
  grade: number;
  academicYear: string;
  homeroomTeacher?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const classApi = {
  // Get all classes
  getAll: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Get class by id
  getById: async (id: number) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Create new class
  create: async (data: Partial<Class>) => {
    const response = await api.post('/', data);
    return response.data;
  },

  // Update class
  update: async (id: number, data: Partial<Class>) => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  // Delete class
  delete: async (id: number) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};