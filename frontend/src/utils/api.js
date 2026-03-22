// =============================================
// utils/api.js — Axios API Configuration
// =============================================
// Axios is a library for making HTTP requests.
// We create a single "instance" with our base URL configured
// so we don't have to repeat it in every request.

import axios from "axios";

// Create axios instance with default settings
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------------------------
// REQUEST INTERCEPTOR
// -----------------------------------------------
// This runs BEFORE every request is sent.
// We attach the JWT token from localStorage automatically.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crmToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------
// RESPONSE INTERCEPTOR
// -----------------------------------------------
// This runs AFTER every response.
// If we get a 401 (unauthorized), log the user out.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem("crmToken");
      localStorage.removeItem("crmAdmin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// -----------------------------------------------
// API Functions — Auth
// -----------------------------------------------
export const authAPI = {
  login: (credentials) => API.post("/auth/login", credentials),
  getMe: () => API.get("/auth/me"),
  seedAdmin: () => API.post("/auth/seed"),
  // Public registration (first admin or open signup)
  publicRegister: (data) => API.post("/auth/public-register", data),
  // Protected registration (existing admin creates another admin)
  register: (data) => API.post("/auth/register", data),
};

// -----------------------------------------------
// API Functions — Leads
// -----------------------------------------------
export const leadsAPI = {
  // Get all leads with optional filters
  getAll: (params) => API.get("/leads", { params }),

  // Get dashboard analytics
  getAnalytics: () => API.get("/leads/analytics"),

  // Create a new lead
  create: (data) => API.post("/leads", data),

  // Get single lead by ID
  getById: (id) => API.get(`/leads/${id}`),

  // Update a lead
  update: (id, data) => API.put(`/leads/${id}`, data),

  // Update only the status
  updateStatus: (id, status) => API.patch(`/leads/${id}/status`, { status }),

  // Add a note
  addNote: (id, text) => API.post(`/leads/${id}/notes`, { text }),

  // Delete a note
  deleteNote: (id, noteId) => API.delete(`/leads/${id}/notes/${noteId}`),

  // Delete a lead
  delete: (id) => API.delete(`/leads/${id}`),
};

export default API;
