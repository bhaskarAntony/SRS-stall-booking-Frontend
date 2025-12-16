import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      tempUserData: null,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, tempUserData: userData });
        try {
          const response = await api.post('/auth/register', userData);
          set({ isLoading: false });
          
          return { success: true, message: response.data.message };
        } catch (error) {
          set({ isLoading: false, tempUserData: null });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Registration failed' 
          };
        }
      },

      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/verify-otp', { email, otp });
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false, tempUserData: null });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'OTP verification failed' 
          };
        }
      },

      resendOTP: async (email) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/resend-otp', { email });
          set({ isLoading: false });
          
          return { success: true, message: 'OTP sent successfully' };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to resend OTP' 
          };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, tempUserData: null });
      },

      loadUserFromToken: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await api.get('/auth/me');
          set({ user: response.data.user, token });
        } catch (error) {
          localStorage.removeItem('token');
          set({ user: null, token: null });
        }
      },

      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === 'admin'
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);

export { useAuthStore };