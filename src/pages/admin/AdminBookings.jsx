import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { bookingService } from '../../services/bookingService';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    eventId: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [filters, pagination.currentPage]);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAdminEvents({ limit: 100 });
      setEvents(response.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters,
      };

      const response = await bookingService.getAdminBookings(params);
      setBookings(response.bookings);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalBookings: response.totalBookings,
      });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600';
      case 'pending':
        return 'text-amber-600';
      case 'failed':
        return 'text-rose-600';
      default:
        return 'text-slate-500';
    }
  };

  if (error) {
    return (
      <div className="pt-4 sm:pt-6">
        <ErrorMessage message={error} onRetry={fetchBookings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
              Bookings
            </p>
            <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">
              Manage bookings
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
              Search and review all stall bookings across events.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-500">
            <span>{pagination.totalBookings} bookings</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by booking ID, customer, or event"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-7 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Event Filter */}
            <div className="flex items-center gap-1.5 sm:w-48">
              <FunnelIcon className="hidden sm:block h-4 w-4 text-slate-400" />
              <select
                value={filters.eventId}
                onChange={(e) => handleFilterChange('eventId', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">All events</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 sm:w-40">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="all">All status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="sm" text="Loading bookings..." />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10">
            <FunnelIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              No bookings found
            </h3>
            <p className="text-[12px] text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-lg border border-slate-200 bg-white/95 px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {booking.bookingId}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {booking.createdAt
                          ? format(
                              parseISO(booking.createdAt),
                              'MMM dd, yyyy HH:mm',
                            )
                          : ''}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-start gap-2">
                    <UserIcon className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-900 truncate">
                        {booking.userId?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {booking.userId?.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-start gap-2">
                    <CalendarDaysIcon className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-900 truncate">
                        {booking.eventId?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {booking.eventId?.venue?.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <div className="min-w-0">
                      <p className="text-slate-900">
                        {booking.stalls?.length || 0} stalls
                      </p>
                      <p className="text-slate-500 truncate">
                        {booking.stalls
                          ?.slice(0, 3)
                          .map((s) => s.stallId)
                          .join(', ')}
                        {booking.stalls?.length > 3 && '…'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end text-[12px] font-semibold text-slate-900">
                        <CurrencyRupeeIcon className="mr-1 h-3.5 w-3.5" />
                        <span>
                          {booking.totalAmount
                            ? booking.totalAmount.toLocaleString()
                            : 0}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 text-[11px] ${getPaymentStatusColor(
                          booking.paymentDetails?.status,
                        )}`}
                      >
                        {booking.paymentDetails?.status
                          ? booking.paymentDetails.status.toUpperCase()
                          : 'PENDING'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <Link
                      to={`/admin/bookings/${booking.bookingId}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-sky-600 hover:bg-sky-50"
                      title="View booking"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-slate-200 bg-white/95 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-slate-500">
                      <th className="px-3 sm:px-4 py-2 text-left">Booking</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Customer</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Event</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Stalls</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Amount</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Status</th>
                      <th className="px-3 sm:px-4 py-2 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-50/80">
                        <td className="px-3 sm:px-4 py-2.5 align-top">
                          <div>
                            <p className="text-xs font-medium text-slate-900 truncate">
                              {booking.bookingId}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {booking.createdAt
                                ? format(
                                    parseISO(booking.createdAt),
                                    'MMM dd, yyyy HH:mm',
                                  )
                                : ''}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 align-top">
                          <div className="flex items-start gap-2">
                            <UserIcon className="mt-0.5 h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {booking.userId?.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                                {booking.userId?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 align-top">
                          <div className="flex items-start gap-2">
                            <CalendarDaysIcon className="mt-0.5 h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {booking.eventId?.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                                {booking.eventId?.venue?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 align-top">
                          <p className="text-xs text-slate-900">
                            {booking.stalls?.length || 0} stalls
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                            {booking.stalls
                              ?.slice(0, 3)
                              .map((s) => s.stallId)
                              .join(', ')}
                            {booking.stalls?.length > 3 && '…'}
                          </p>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 align-top">
                          <div className="flex items-center text-xs font-semibold text-slate-900">
                            <CurrencyRupeeIcon className="mr-1 h-3.5 w-3.5" />
                            <span>
                              {booking.totalAmount
                                ? booking.totalAmount.toLocaleString()
                                : 0}
                            </span>
                          </div>
                          <p
                            className={`mt-0.5 text-[11px] ${getPaymentStatusColor(
                              booking.paymentDetails?.status,
                            )}`}
                          >
                            {booking.paymentDetails?.status
                              ? booking.paymentDetails.status.toUpperCase()
                              : 'PENDING'}
                          </p>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            {booking.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 align-top text-right">
                          <Link
                            to={`/admin/bookings/${booking.bookingId}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-sky-600 hover:bg-sky-50"
                            title="View booking"
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() =>
                    handlePageChange(pagination.currentPage - 1)
                  }
                  disabled={pagination.currentPage === 1}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`h-7 w-7 rounded-full text-[11px] ${
                            page === pagination.currentPage
                              ? 'bg-orange-500 text-white'
                              : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(pagination.currentPage + 1)
                  }
                  disabled={
                    pagination.currentPage === pagination.totalPages
                  }
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
