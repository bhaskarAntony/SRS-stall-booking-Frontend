import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import { paymentService } from '../services/paymentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    selectedStalls,
    currentEvent,
    totalAmount,
    lockedStalls,
    lockExpiry,
    clearBookingData,
  } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // Guard and timer
  useEffect(() => {
    // if no locked stalls or event, bounce to events list
    if (!currentEvent || !lockedStalls || lockedStalls.length === 0) {
      navigate('/events');
      return;
    }

    if (!lockExpiry) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = lockExpiry - now;

      if (diff <= 0) {
        setTimeLeft(null);
        toast.error('Stall selection expired. Please select again.');
        navigate(`/events/${currentEvent?._id || ''}/select-stalls`);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiry, lockedStalls, navigate, currentEvent]);

  const handlePayment = async () => {
    if (!currentEvent || !lockedStalls || lockedStalls.length === 0) {
      toast.error('Stall selection is missing. Please select stalls again.');
      navigate('/events');
      return;
    }

    try {
      setLoading(true);

      const scriptLoaded = await paymentService.loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Payment gateway failed to load. Please try again.');
        return;
      }

      const orderData = await paymentService.createOrder(
        lockedStalls,
        currentEvent._id,
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'SRS Stall Booking',
        description: `Stall booking for ${currentEvent.name || 'Event'}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId,
            };

            const result = await paymentService.verifyPayment(verificationData);

            toast.success('Payment successful! Booking confirmed.');
            clearBookingData();
            navigate(`/bookings/${result.booking.bookingId}`);
          } catch (error) {
            toast.error(
              'Payment verification failed. Please contact support.',
            );
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#F97316', // orange
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (currentEvent?._id) {
      navigate(`/events/${currentEvent._id}/select-stalls`);
    } else {
      navigate('/events');
    }
  };

  if (!currentEvent || !lockedStalls || lockedStalls.length === 0) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="sm" text="Loading checkout..." />
      </div>
    );
  }

  const gst = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + gst;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleGoBack}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
                Checkout
              </p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {currentEvent.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Review stalls and complete secure payment.
              </p>
            </div>
          </div>

          {timeLeft && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 border border-amber-100">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>Time left: {timeLeft}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 pb-24 sm:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Left: details */}
            <section className="lg:col-span-2 space-y-3 sm:space-y-4">
              {/* Event details */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                  Event details
                </h2>
                <div className="space-y-2 text-[12px] sm:text-sm">
                  <div>
                    <p className="font-medium text-slate-700">Event</p>
                    <p className="text-slate-900">{currentEvent.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Venue</p>
                    <p className="text-slate-900">
                      {currentEvent.venue?.name}
                    </p>
                    <p className="text-slate-500">
                      {currentEvent.venue?.address?.city},{' '}
                      {currentEvent.venue?.address?.state}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Dates</p>
                    <p className="text-slate-900">
                      {new Date(
                        currentEvent.dates?.startDate,
                      ).toLocaleDateString()}{' '}
                      –{' '}
                      {new Date(
                        currentEvent.dates?.endDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected stalls */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                  Selected stalls ({selectedStalls.length})
                </h2>
                {selectedStalls.length === 0 ? (
                  <p className="text-[12px] text-slate-500">
                    No stalls selected. Go back and choose stalls.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {selectedStalls.map((stall) => (
                      <div
                        key={stall.stallId}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="h-3.5 w-3.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: stall.category?.color }}
                          />
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-slate-900 truncate">
                              {stall.stallId}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {stall.category?.name} • Row {stall.row}, Col{' '}
                              {stall.column}
                            </p>
                          </div>
                        </div>
                        <p className="text-[12px] font-semibold text-slate-900">
                          ₹
                          {stall.category?.price
                            ? stall.category.price.toLocaleString()
                            : 0}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Billing/user details */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                  Billing details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] sm:text-sm">
                  <div>
                    <p className="font-medium text-slate-700">Name</p>
                    <p className="text-slate-900">{user?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Email</p>
                    <p className="text-slate-900">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Phone</p>
                    <p className="text-slate-900">{user?.phone || '-'}</p>
                  </div>
                  {user?.businessDetails?.companyName && (
                    <div>
                      <p className="font-medium text-slate-700">Company</p>
                      <p className="text-slate-900">
                        {user.businessDetails.companyName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Right: summary (desktop) */}
            <aside className="hidden lg:block">
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4 sticky top-20">
                <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                  Payment summary
                </h2>

                <div className="space-y-2 text-[12px] sm:text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Stalls ({selectedStalls.length})
                    </span>
                    <span className="text-slate-900">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Platform fee</span>
                    <span className="text-slate-900">₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">GST (18%)</span>
                    <span className="text-slate-900">
                      ₹{gst.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        Total payable
                      </span>
                      <div className="flex items-center text-xl font-bold text-emerald-600">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                        <span>{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || selectedStalls.length === 0}
                  className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <CreditCardIcon className="h-4 w-4 mr-1" />
                      <span>Pay now</span>
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheckIcon className="h-3.5 w-3.5" />
                  <span>Payments are securely processed by Razorpay.</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur px-3 py-2.5" style={{bottom:"59px"}}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500">
              {selectedStalls.length} stall
              {selectedStalls.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center text-sm font-semibold text-emerald-600">
              <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
              <span>{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={handlePayment}
            disabled={loading || selectedStalls.length === 0}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing…' : 'Pay now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
