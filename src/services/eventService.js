import api from './api';

export const eventService = {
  
  getEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  
  getEventStalls: async (id) => {
    const response = await api.get(`/events/${id}/stalls`);
    return response.data;
  },

  
  createEvent: async (eventData) => {
    const response = await api.post('/admin/events', eventData);
    return response.data;
  },

  
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/admin/events/${id}`, eventData);
    return response.data;
  },
  
   deleteEvent: async (id) => {
    const response = await api.delete(`/events/delete/${id}`);
    return response.data;
  },

  
  setupEventStalls: async (id, stallsData) => {
    const response = await api.post(`/admin/events/${id}/stalls`, stallsData);
    return response.data;
  },

  
  getAdminEvents: async (params = {}) => {
    const response = await api.get('/admin/events', { params });
    return response.data;
  }
};