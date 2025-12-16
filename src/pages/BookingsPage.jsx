import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  EyeIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { bookingService } from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
  });

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, pagination.currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: 10,
        status: filter === 'all' ? undefined : filter,
      };

      const response = await bookingService.getMyBookings(params);
      setBookings(response.bookings || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalBookings: response.totalBookings || 0,
      });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'refunded':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          <ErrorMessage message={error} onRetry={fetchBookings} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
              Bookings
            </p>
            <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">
              My stall bookings
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
              View status, stalls, and payment details for each booking.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[11px] text-slate-500">Total bookings</p>
            <p className="text-sm font-semibold text-slate-900">
              {pagination.totalBookings}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="border-t border-slate-200 bg-white/95">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center gap-3 overflow-x-auto">
            <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <FunnelIcon className="h-4 w-4" />
              <span>Filter by status</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 border border-slate-200">
              {[
                { key: 'all', label: 'All' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'pending', label: 'Pending' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                    setFilter(item.key);
                  }}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    filter === item.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 pb-20 sm:pb-8">
          {loading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="sm" text="Loading bookings..." />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <CalendarDaysIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
                No bookings yet
              </h3>
              <p className="text-[12px] sm:text-sm text-slate-500 mb-4">
                Start by choosing an event and reserving your first stall.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-sky-600"
              >
                Browse events
              </Link>
            </div>
          ) : (
            <>
              {/* Bookings list */}
              <div className="space-y-3 sm:space-y-4">
                {bookings.map((booking) => (
                  <article
                    key={booking._id}
                    className="rounded-xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden"
                  >
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-3">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                              {booking.eventId?.name}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(
                                booking.status,
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="flex items-center text-[11px] text-slate-500 mb-1">
                            <MapPinIcon className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            <span className="truncate">
                              {booking.eventId?.venue?.name}
                            </span>
                          </p>
                          <p className="flex items-center text-[11px] text-slate-500">
                            <CalendarDaysIcon className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            <span>
                              {booking.eventId?.dates?.startDate &&
                                format(
                                  parseISO(booking.eventId.dates.startDate),
                                  'MMM dd, yyyy',
                                )}{' '}
                              –{' '}
                              {booking.eventId?.dates?.endDate &&
                                format(
                                  parseISO(booking.eventId.dates.endDate),
                                  'MMM dd, yyyy',
                                )}
                            </span>
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="inline-flex items-center text-sm sm:text-base font-bold text-emerald-600 mb-1">
                            <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                            <span>
                              {booking.totalAmount
                                ? booking.totalAmount.toLocaleString()
                                : 0}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {booking.stalls?.length || 0} stall
                            {booking.stalls?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Stalls chips */}
                      <div className="mb-3">
                        <p className="text-[11px] font-medium text-slate-600 mb-1">
                          Stalls
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {booking.stalls?.slice(0, 6).map((stall, index) => (
                            <span
                              key={`${stall.stallId}-${index}`}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                            >
                              {stall.stallId}
                            </span>
                          ))}
                          {booking.stalls?.length > 6 && (
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                              +{booking.stalls.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer row */}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="text-[11px] text-slate-500">
                          <p>
                            Booking ID:{' '}
                            <span className="font-medium text-slate-800">
                              {booking.bookingId}
                            </span>
                          </p>
                          <p>
                            Booked on:{' '}
                            {booking.createdAt &&
                              format(
                                parseISO(booking.createdAt),
                                'MMM dd, yyyy',
                              )}
                          </p>
                        </div>
                        <Link
                          to={`/bookings/${booking.bookingId}`}
                          className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
                        >
                          <EyeIcon className="h-3.5 w-3.5 mr-1" />
                          <span>View details</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(pagination.currentPage - 1)
                    }
                    disabled={pagination.currentPage === 1}
                    className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 border border-slate-200">
                    {Array.from(
                      {
                        length: Math.min(5, pagination.totalPages),
                      },
                      (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`h-7 w-7 rounded-full text-[11px] font-medium ${
                              page === pagination.currentPage
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      },
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(pagination.currentPage + 1)
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingsPage;
