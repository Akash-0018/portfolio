import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : '/api',
  timeout: 10000,
})

// Attach token to request headers if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, (error) => {
  return Promise.reject(error)
})

/**
 * Turn an axios error into something a user can act on.
 *
 * `err.response` is undefined when the request never completed - the backend is
 * down, the request timed out, or the browser blocked it (CORS). Reporting those
 * with the caller's fallback string makes a connectivity problem look like a
 * rejected credential, which is exactly how a dev-server port change once
 * presented itself as "Authentication failed."
 */
export const describeApiError = (err, fallback = 'Request failed.') => {
  if (err?.response) return err.response.data?.detail || fallback
  if (err?.code === 'ECONNABORTED') return 'The server took too long to respond.'
  return 'Could not reach the API. Check that the backend is running and that this origin is allowed.'
}

export const fetchProjects = () => api.get('/projects/')
export const fetchFeaturedProjects = () => api.get('/projects/featured')
export const submitContact = (data) => api.post('/contact/', data)

// Profile Settings APIs
export const fetchProfile = () => api.get('/profile/')
export const updateProfile = (data) => api.put('/profile/', data)
export const updateProfilePhoto = (photo_url) => api.put('/profile/', { photo_url })

// Auth APIs
export const loginAdmin = (username, password) => api.post('/auth/login/', { username, password })
export const verifyAuth = () => api.get('/auth/verify/')

// Admin Project Management APIs
export const createProject = (projectData) => api.post('/projects/', projectData)
export const updateProject = (id, projectData) => api.put(`/projects/${id}`, projectData)
export const deleteProject = (id) => api.delete(`/projects/${id}`)

// Admin Seminar Management APIs
export const fetchSeminars = () => api.get('/seminars/')
export const createSeminar = (seminarData) => api.post('/seminars/', seminarData)
export const updateSeminar = (id, seminarData) => api.put(`/seminars/${id}`, seminarData)
export const deleteSeminar = (id) => api.delete(`/seminars/${id}`)

// Admin Contact Inbox APIs
export const fetchContactMessages = () => api.get('/contact/')
export const deleteContactMessage = (id) => api.delete(`/contact/${id}`)

// File Upload API
export const uploadFile = (formData) => api.post('/upload/', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// Resolve backend image URLs
export const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/api/uploads/')) {
    return `${API_BASE}${url}`
  }
  return url
}

export default api


