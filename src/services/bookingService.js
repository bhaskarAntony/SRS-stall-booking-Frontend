import api from './api';

export const bookingService = {
  // Get user bookings
  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Get single booking
  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Admin: Get all bookings
  getAdminBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  }
};