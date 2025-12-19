import { create } from 'zustand';
import api from '../services/api';

export const useBookingStore = create((set, get) => ({
  selectedStalls: [],        
  currentEvent: null,
  lockedStalls: [],          
  lockExpiry: null,
  isLoading: false,
  totalAmount: 0,

  setCurrentEvent: (event) => set({ currentEvent: event }),

  
  setSelectedStalls: (updater) => {
    const prev = get().selectedStalls;
    const next =
      typeof updater === 'function'
        ? updater(prev)
        : Array.isArray(updater)
        ? updater
        : prev;

    const totalAmount = next.reduce(
      (sum, stall) => sum + (stall?.category?.price || 0),
      0
    );

    set({ selectedStalls: next, totalAmount });
  },

  lockStalls: async (stallIds, eventId) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/stalls/lock', { stallIds, eventId });
      const { expiresAt } = res.data;
      set({
        lockedStalls: stallIds,
        lockExpiry: new Date(expiresAt),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to lock stalls',
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
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to release stalls',
      };
    }
  },

  getLockedStalls: async (eventId) => {
    try {
      const res = await api.get(`/stalls/locked/${eventId}`);
      const { lockedStalls, expiresAt } = res.data;
      if (lockedStalls.length && expiresAt) {
        set({
          lockedStalls: lockedStalls.map((s) => s.stallId),
          lockExpiry: new Date(expiresAt),
        });
      }
    } catch (e) {
      console.error('Failed to get locked stalls', e);
    }
  },
  clearBookingData: () => set({
    selectedStalls: [],
    currentEvent: null,
    totalAmount: 0,
    lockedStalls: [],
    lockExpiry: null,
  })
}));
