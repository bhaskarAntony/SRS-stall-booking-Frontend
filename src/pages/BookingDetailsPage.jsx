import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { bookingService } from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getBooking(bookingId);
      setBooking(response.booking);
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-amber-500" />;
      case 'cancelled':
      case 'refunded':
        return <XCircleIcon className="w-4 h-4 text-rose-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-100';
      case 'refunded':
        return 'bg-slate-50 text-slate-700 border border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  // Uses booking.invoice.downloadUrl set by backend to stream PDF to browser
  const handleDownloadInvoice = async () => {
    if (!booking?.invoice?.downloadUrl) return;
    try {
      setDownloading(true);

      // If your API needs auth headers, route via bookingService or fetch wrapper
      const res = await fetch(booking.invoice.downloadUrl, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const fileName =
        booking.invoice.invoiceNumber ||
        `invoice-${booking.bookingId || booking._id}.pdf`;
      a.download = `${fileName}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      // Optional: use toast here if you already use react-hot-toast
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="sm" text="Loading booking details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 sm:pt-6 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <ErrorMessage message={error} onRetry={fetchBookingDetails} />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-4 sm:pt-6 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <ErrorMessage message="Booking not found" />
        </div>
      </div>
    );
  }

  const gstAmount = Math.round((booking.totalAmount || 0) * 0.18);
  const grandTotal = Math.round((booking.totalAmount || 0) * 1.18);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/bookings"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
                Booking
              </p>
              <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900 truncate">
                Booking details
              </h1>
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
                ID: {booking.bookingId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusColor(
                booking.status,
              )}`}
            >
              {getStatusIcon(booking.status)}
              <span>{booking.status?.toUpperCase()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Left: event, stalls, customer */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Event */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Event information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {booking.eventId?.name}
                  </p>
                  {booking.eventId?.description && (
                    <p className="mt-0.5 text-[12px] text-slate-500">
                      {booking.eventId.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <MapPinIcon className="mt-0.5 h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">
                        {booking.eventId?.venue?.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {booking.eventId?.venue?.address?.city},{' '}
                        {booking.eventId?.venue?.address?.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CalendarDaysIcon className="mt-0.5 h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">
                        Event dates
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {booking.eventId?.dates?.startDate &&
                          format(
                            parseISO(booking.eventId.dates.startDate),
                            'MMM dd, yyyy',
                          )}{' '}
                        -{' '}
                        {booking.eventId?.dates?.endDate &&
                          format(
                            parseISO(booking.eventId.dates.endDate),
                            'MMM dd, yyyy',
                          )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stalls */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Booked stalls ({booking.stalls?.length || 0})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {booking.stalls?.map((stall, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-4 w-4 rounded"
                        style={{
                          backgroundColor:
                            stall.category?.color || '#0EA5E9',
                        }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {stall.stallId}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {stall.category?.name} • R{stall.row} · C{stall.column}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">
                      ₹
                      {stall.category?.price
                        ? stall.category.price.toLocaleString()
                        : 0}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Customer */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Customer information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {booking.userDetails?.name}
                      </p>
                      <p className="text-[11px] text-slate-500">Full name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {booking.userDetails?.email}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Email address
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <PhoneIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {booking.userDetails?.phone}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Phone number
                      </p>
                    </div>
                  </div>
                </div>

                {booking.userDetails?.businessDetails?.companyName && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <BuildingOfficeIcon className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {
                            booking.userDetails.businessDetails
                              .companyName
                          }
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Company name
                        </p>
                      </div>
                    </div>
                    {booking.userDetails.businessDetails.gstNumber && (
                      <div className="flex items-center gap-2.5">
                        <div className="h-4 w-4" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            {
                              booking.userDetails.businessDetails
                                .gstNumber
                            }
                          </p>
                          <p className="text-[11px] text-slate-500">
                            GST number
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right: payment + timeline + invoice */}
          <div className="space-y-4 sm:space-y-5">
            {/* Payment summary */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Payment summary
              </h2>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Stalls ({booking.stalls?.length || 0})
                  </span>
                  <span className="text-slate-900">
                    ₹{(booking.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform fee</span>
                  <span className="text-slate-900">₹0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST (18%)</span>
                  <span className="text-slate-900">
                    ₹{gstAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-3 border-t border-slate-200 pt-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Total paid
                  </span>
                  <div className="flex items-center text-lg font-bold text-emerald-600">
                    <CurrencyRupeeIcon className="h-4 w-4 mr-0.5" />
                    <span>{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {booking.status === 'confirmed' &&
                booking.invoice?.downloadUrl && (
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={downloading}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-1.75 text-[11px] font-medium text-white disabled:opacity-60"
                  >
                    <DocumentArrowDownIcon className="h-3.5 w-3.5" />
                    <span>
                      {downloading ? 'Preparing invoice…' : 'Download invoice'}
                    </span>
                  </button>
                )}
              {booking.status === 'confirmed' &&
                !booking.invoice?.downloadUrl && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Invoice not generated yet. Please try again later.
                  </p>
                )}
            </section>

            {/* Payment details */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Payment details
              </h2>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method</span>
                  <span className="text-slate-900 capitalize">
                    {booking.paymentDetails?.method || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment ID</span>
                  <span className="font-mono text-[11px] text-slate-900">
                    {booking.paymentDetails?.paymentId || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={`text-xs font-medium ${
                      booking.paymentDetails?.status === 'completed'
                        ? 'text-emerald-600'
                        : booking.paymentDetails?.status === 'failed'
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {booking.paymentDetails?.status
                      ? booking.paymentDetails.status.toUpperCase()
                      : 'PENDING'}
                  </span>
                </div>
                {booking.paymentDetails?.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid on</span>
                    <span className="text-slate-900">
                      {format(
                        parseISO(booking.paymentDetails.paidAt),
                        'MMM dd, yyyy HH:mm',
                      )}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Booking timeline
              </h2>
              <div className="space-y-3 text-[12px]">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Booking created
                    </p>
                    <p className="text-slate-500">
                      {format(
                        parseISO(booking.createdAt),
                        'MMM dd, yyyy HH:mm',
                      )}
                    </p>
                  </div>
                </div>

                {booking.paymentDetails?.paidAt && (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Payment completed
                      </p>
                      <p className="text-slate-500">
                        {format(
                          parseISO(booking.paymentDetails.paidAt),
                          'MMM dd, yyyy HH:mm',
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Booking confirmed
                      </p>
                      <p className="text-slate-500">
                        Stalls reserved successfully.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
