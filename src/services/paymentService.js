import api from './api';

export const paymentService = {
  // Create Razorpay order
  createOrder: async (stallIds, eventId) => {
    const response = await api.post('/payments/create-order', {
      stallIds,
      eventId
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify-payment', paymentData);
    return response.data;
  },

  // Load Razorpay script
  loadRazorpayScript: () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
};