import api from './api';

export const eventService = {
  // Get all events (public)
  getEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Get single event (public)
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Get event stalls
  getEventStalls: async (id) => {
    const response = await api.get(`/events/${id}/stalls`);
    return response.data;
  },

  // Admin: Create event
  createEvent: async (eventData) => {
    const response = await api.post('/admin/events', eventData);
    return response.data;
  },

  // Admin: Update event
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/admin/events/${id}`, eventData);
    return response.data;
  },

  // Admin: Setup event stalls
  setupEventStalls: async (id, stallsData) => {
    const response = await api.post(`/admin/events/${id}/stalls`, stallsData);
    return response.data;
  },

  // Admin: Get all events
  getAdminEvents: async (params = {}) => {
    const response = await api.get('/admin/events', { params });
    return response.data;
  }
};