import { create } from 'zustand';
import api from '../services/api';

const useBookingStore = create((set, get) => ({
  selectedStalls: [],
  currentEvent: null,
  lockedStalls: [],
  lockExpiry: null,
  isLoading: false,
  totalAmount: 0,

  setSelectedStalls: (stalls) => {
    const totalAmount = stalls.reduce((sum, stall) => sum + stall.category.price, 0);
    set({ selectedStalls: stalls, totalAmount });
  },

  setCurrentEvent: (event) => {
    set({ currentEvent: event });
  },

  lockStalls: async (stallIds, eventId) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/stalls/lock', { stallIds, eventId });
      const { expiresAt } = response.data;
      
      set({ 
        lockedStalls: stallIds, 
        lockExpiry: new Date(expiresAt),
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to lock stalls' 
      };
    }
  },

  releaseStalls: async (eventId) => {
    set({ isLoading: true });
    try {
      await api.post('/stalls/release', { eventId });
      set({ 
        lockedStalls: [], 
        lockExpiry: null,
        selectedStalls: [],
        totalAmount: 0,
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to release stalls' 
      };
    }
  },

  getLockedStalls: async (eventId) => {
    try {
      const response = await api.get(`/stalls/locked/${eventId}`);
      const { lockedStalls, expiresAt } = response.data;
      
      if (lockedStalls.length > 0 && expiresAt) {
        set({ 
          lockedStalls: lockedStalls.map(s => s.stallId),
          lockExpiry: new Date(expiresAt)
        });
      }
    } catch (error) {
      console.error('Failed to get locked stalls:', error);
    }
  },

  clearBookingData: () => {
    set({
      selectedStalls: [],
      currentEvent: null,
      lockedStalls: [],
      lockExpiry: null,
      totalAmount: 0
    });
  }
}));

export { useBookingStore };