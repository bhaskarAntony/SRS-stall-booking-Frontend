import api from './api';

export const bookingService = {
  
  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  
  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  
  getAdminBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  }
};