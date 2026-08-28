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


