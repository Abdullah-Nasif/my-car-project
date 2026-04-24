import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Cars API
export const carAPI = {
  getAll: (params) => axios.get(`${API_URL}/cars`, { params }),
  getById: (id) => axios.get(`${API_URL}/cars/${id}`),
  add: (data) => axios.post(`${API_URL}/cars`, data),
  update: (id, data) => axios.put(`${API_URL}/cars/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/cars/${id}`),
  getMyCars: () => axios.get(`${API_URL}/cars/owner/mycars`),
};

// Bookings API
export const bookingAPI = {
  create: (data) => axios.post(`${API_URL}/bookings`, data),
  getMyBookings: () => axios.get(`${API_URL}/bookings/my`),
  getById: (id) => axios.get(`${API_URL}/bookings/${id}`),
  cancel: (id) => axios.put(`${API_URL}/bookings/${id}/cancel`),
  addReview: (id, data) => axios.put(`${API_URL}/bookings/${id}/review`, data),
};

// Admin API
export const adminAPI = {
  getStats: () => axios.get(`${API_URL}/admin/stats`),
  getAllUsers: () => axios.get(`${API_URL}/admin/users`),
  getAllBookings: () => axios.get(`${API_URL}/admin/bookings`),
  updateBooking: (id, data) => axios.put(`${API_URL}/admin/bookings/${id}`, data),
  getOwnerBookings: () => axios.get(`${API_URL}/admin/owner/bookings`),
};

// ImageKit auth
export const getImageKitAuth = () => axios.get(`${API_URL}/imagekit/auth`);
