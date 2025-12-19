import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  Cog6ToothIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Trash } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, [filters, pagination.currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters,
      };

      const response = await eventService.getAdminEvents(params);
      setEvents(response.events);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalEvents: response.totalEvents,
      });
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) =>{
    if(window.confirm()){
       const res = await eventService.deleteEvent(id);
       console.log(res)
    if(res.status){
      toast.success("Event deleted Succesfully");
      fetchEvents();
    }else{
      toast.error("failed to deleted Event, Try again to Delete")
    }
  }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'draft':
        return 'bg-slate-50 text-slate-700 border border-slate-200';
      case 'closed':
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  if (error) {
    return (
      <div className="pt-4 sm:pt-6">
        <ErrorMessage message={error} onRetry={fetchEvents} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
              Events
            </p>
            <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">
              Manage events
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
              Search, filter and configure all active and past events.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-[11px] text-slate-500">
              {pagination.totalEvents} events
            </span>
            <Link
              to="/admin/events/create"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-3 py-1.5 text-[11px] font-medium text-white"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              New event
            </Link>
          </div>
        </div>
      </div>

      {}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            {}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by name or venue"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-7 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {}
            <div className="flex items-center gap-1.5 sm:w-40">
              <FunnelIcon className="hidden sm:block h-4 w-4 text-slate-400" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="all">All status</option>
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <span className="sm:hidden text-[11px] text-slate-500">
              {pagination.totalEvents} events
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="sm" text="Loading events..." />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <FunnelIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              No events match your filters
            </h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Try adjusting the search or status filters, or create a new event.
            </p>
            <Link
              to="/admin/events/create"
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-orange-600"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Create event
            </Link>
          </div>
        ) : (
          <>
            {}
            <div className="space-y-3 md:hidden">
              {events.map((event) => {
                const booked = event.bookedStalls || 0;
                const total = event.totalStalls || 0;
                const percent =
                  total > 0 ? ((booked / total) * 100).toFixed(0) : 0;

                return (
                  <div
                    key={event._id}
                    className="rounded-lg border border-slate-200 bg-white/95 px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {event.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                          {event.venue?.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {event.venue?.address?.city}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
                          event.status,
                        )}`}
                      >
                        {event.status?.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-600">
                      <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">
                        {event.dates?.startDate
                          ? format(
                              parseISO(event.dates.startDate),
                              'MMM dd, yyyy',
                            )
                          : '-'}
                        {event.dates?.endDate &&
                          ` • ${format(
                            parseISO(event.dates.endDate),
                            'MMM dd, yyyy',
                          )}`}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <div>
                        <p className="text-slate-900">
                          {booked} / {total} stalls
                        </p>
                        <p className="text-slate-500">{percent}% booked</p>
                      </div>
                      <p className="text-[12px] font-semibold text-slate-900">
                        ₹{(event.revenue || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1.5">
                      <Link
                        to={`/events/${event._id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-sky-600 hover:bg-sky-50"
                        title="Preview"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to={`/admin/events/${event._id}/edit`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-emerald-600 hover:bg-emerald-50"
                        title="Edit"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to={`/admin/events/${event._id}/stalls`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-indigo-600 hover:bg-indigo-50"
                        title="Stalls"
                      >
                        <Cog6ToothIcon className="h-3.5 w-3.5" />
                      </Link>

                       <button
                                 onClick={()=>handleDelete(event._id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {}
            <div className="hidden md:block rounded-xl border border-slate-200 bg-white/95 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-slate-500">
                      <th className="px-3 sm:px-4 py-2 text-left">Event</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Dates</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Status</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Stalls</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Revenue</th>
                      <th className="px-3 sm:px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {events.map((event) => {
                      const booked = event.bookedStalls || 0;
                      const total = event.totalStalls || 0;
                      const percent =
                        total > 0 ? ((booked / total) * 100).toFixed(0) : 0;

                      return (
                        <tr key={event._id} className="hover:bg-slate-50/80">
                          <td className="px-3 sm:px-4 py-2.5 align-top">
                            <div className="min-w-[160px]">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {event.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                                {event.venue?.name}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {event.venue?.address?.city}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 align-top">
                            <p className="text-xs text-slate-900">
                              {event.dates?.startDate
                                ? format(
                                    parseISO(event.dates.startDate),
                                    'MMM dd, yyyy',
                                  )
                                : '-'}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {event.dates?.endDate
                                ? `to ${format(
                                    parseISO(event.dates.endDate),
                                    'MMM dd, yyyy',
                                  )}`
                                : ''}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 align-top">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
                                event.status,
                              )}`}
                            >
                              {event.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 align-top">
                            <p className="text-xs text-slate-900">
                              {booked} / {total}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {percent}% booked
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 align-top">
                            <p className="text-xs font-semibold text-slate-900">
                              ₹{(event.revenue || 0).toLocaleString()}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 align-top text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Link
                                to={`/events/${event._id}`}
                                className="rounded-full border border-slate-200 px-1.5 py-1 text-[10px] text-sky-600 hover:bg-sky-50"
                                title="Preview"
                              >
                                <EyeIcon className="h-3.5 w-3.5" />
                              </Link>
                              <Link
                                to={`/admin/events/${event._id}/edit`}
                                className="rounded-full border border-slate-200 px-1.5 py-1 text-[10px] text-emerald-600 hover:bg-emerald-50"
                                title="Edit"
                              >
                                <PencilIcon className="h-3.5 w-3.5" />
                              </Link>
                              <Link
                                to={`/admin/events/${event._id}/stalls`}
                                className="rounded-full border border-slate-200 px-1.5 py-1 text-[10px] text-indigo-600 hover:bg-indigo-50"
                                title="Stalls"
                              >
                                <Cog6ToothIcon className="h-3.5 w-3.5" />
                              </Link>

                                 <button
                                 onClick={()=>handleDelete(event._id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {}
            {pagination.totalPages > 1 && (
              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
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
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
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

export default AdminEvents;
