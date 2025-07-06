import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Update this to match your backend URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This ensures cookies are sent with every request
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to debug cookies
api.interceptors.request.use(
  (config) => {
    console.log('🔍 API Request:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      cookies: document.cookie,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to debug responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

// Utility function to debug cookies
export const debugCookies = () => {
  const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      acc[name] = value;
    }
    return acc;
  }, {});
  
  console.log('🍪 Current cookies:', cookies);
  console.log('🍪 Raw cookie string:', document.cookie);
  return cookies;
};

// Auth API endpoints
export const authAPI = {
  sendOTP: (email: string) => api.post("/api/v1/auth/send-otp", { email }),
  verifyOTP: (email: string, otp: string) =>
    api.post("/api/v1/auth/verify-otp", { email, otp }),
  register: (
    email: string,
    name: string,
    password: string,
    confirmPassword: string
  ) =>
    api.post("/api/v1/auth/register", {
      email,
      name,
      password,
      confirmPassword,
    }),
  login: (email: string, password: string) =>
    api.post("/api/v1/auth/login", { email, password }),
  logout: () => api.post("/api/v1/auth/logout"),
  // Validate current authentication status
  validateAuth: () => api.get("/api/v1/auth/me"),
  githubAuth: () => {
    // Redirect to GitHub OAuth - backend handles everything and redirects to dashboard
    window.location.href = `${API_BASE_URL}/api/v1/auth/github`;
  },
};

// Agent types
export interface Agent {
  id: string;
  hostname: string;
  os: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  concurrency: number;
  tags: string[];
}

// Job types  
export interface Job {
  id: string;
  name: string;
  description?: string;
  script: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agentId: string;
  env?: Record<string, string>;
  tags: string[];
  cron?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobRequest {
  name: string;
  script: string;
  agentId?: string;
  env?: Record<string, string>;
  tags?: string[];
  cron?: string;
}

// Agent API endpoints
export const agentAPI = {
  // Get all connected agents
  getAgents: () => api.get<Agent[]>("/api/v1/agents"),
  
  // Get specific agent
  getAgent: (id: string) => api.get<Agent>(`/api/v1/agents/${id}`),
  
  // Tag an agent
  tagAgent: (id: string, tags: string[]) => 
    api.patch(`/api/v1/agents/${id}/tags`, { tags }),
  
  // Disconnect an agent
  disconnectAgent: (id: string) => 
    api.delete(`/api/v1/agents/${id}`),
};

// Job API endpoints
export const jobAPI = {
  // Get all jobs
  getJobs: (limit?: number, offset?: number) => 
    api.get<Job[]>("/api/v1/jobs", { params: { limit, offset } }),
  
  // Get specific job
  getJob: (id: string) => 
    api.get<Job>(`/api/v1/jobs/${id}`),
  
  // Create new job
  createJob: (jobData: CreateJobRequest) => 
    api.post<Job>("/api/v1/jobs", jobData),
  
  // Cancel job
  cancelJob: (id: string) => 
    api.post(`/api/v1/jobs/${id}/cancel`),
  
  // Get job logs
  getJobLogs: (id: string) => 
    api.get<string>(`/api/v1/jobs/${id}/logs`),
  
  // Delete job
  deleteJob: (id: string) => 
    api.delete(`/api/v1/jobs/${id}`),
};

// Dashboard API endpoints
export const dashboardAPI = {
  // Get user's agent token
  getAgentToken: () => 
    api.get<{ token: string }>("/api/v1/dashboard/agent-token"),
  
  // Regenerate agent token
  regenerateAgentToken: () => 
    api.post<{ token: string }>("/api/v1/dashboard/agent-token/regenerate"),
};
