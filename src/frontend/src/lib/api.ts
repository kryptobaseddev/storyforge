import axios from 'axios';

// Define types for our API data
export interface UserData {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProjectData {
  title: string;
  description: string;
  genre?: string;
  targetAudience?: string;
}

export interface CharacterData {
  name: string;
  role: string;
  description: string;
  traits?: string[];
  backstory?: string;
}

export interface GenerationPrompt {
  prompt: string;
  type: 'text' | 'character' | 'plot' | 'setting';
  options?: Record<string, unknown>;
}

export interface ImageGenerationPrompt {
  prompt: string;
  style?: string;
  size?: string;
}

export interface GenerationSaveData {
  content: string;
  metadata?: Record<string, unknown>;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints for authentication
export const authApi = {
  register: (userData: UserData) => api.post('/auth/register', userData),
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// API endpoints for projects
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (projectData: ProjectData) => api.post('/projects', projectData),
  update: (id: string, projectData: ProjectData) => api.put(`/projects/${id}`, projectData),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// API endpoints for characters
export const charactersApi = {
  getAll: (projectId: string) => api.get(`/projects/${projectId}/characters`),
  getById: (projectId: string, id: string) => api.get(`/projects/${projectId}/characters/${id}`),
  create: (projectId: string, characterData: CharacterData) => api.post(`/projects/${projectId}/characters`, characterData),
  update: (projectId: string, id: string, characterData: CharacterData) => api.put(`/projects/${projectId}/characters/${id}`, characterData),
  delete: (projectId: string, id: string) => api.delete(`/projects/${projectId}/characters/${id}`),
};

// API endpoints for AI generation
export const aiApi = {
  generate: (prompt: GenerationPrompt) => api.post('/ai/generate', prompt),
  generateImage: (prompt: ImageGenerationPrompt) => api.post('/ai/generate-image', prompt),
  saveGeneration: (id: string, data: GenerationSaveData) => api.put(`/ai/generations/${id}/save`, data),
};

export default api; 