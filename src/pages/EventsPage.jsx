import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { eventService } from '../services/eventService';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    status: 'live',
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
        limit: 12,
        ...filters,
      };

      const response = await eventService.getEvents(params);
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  if (error) {
    return (
      <div className="pt-4 sm:pt-6 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <ErrorMessage message={error} onRetry={fetchEvents} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
              Events
            </p>
            <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">
              Discover events
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
              Find the right event and stall location for your business.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <MapPinIcon className="h-4 w-4 text-slate-400 hidden sm:block" />
            <span>{pagination.totalEvents} events found</span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-3">
            {/* Search */}
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

            {/* City */}
            <div className="flex items-center gap-1.5 md:w-44">
              <MapPinIcon className="hidden md:block h-4 w-4 text-slate-400" />
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">All cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 md:w-44">
              <FunnelIcon className="hidden md:block h-4 w-4 text-slate-400" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="live">Live events</option>
                <option value="all">All events</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="sm" text="Loading events..." />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <FunnelIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              No events found
            </h3>
            <p className="text-[12px] text-slate-500">
              Try changing the city, status, or search keywords.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
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
      </main>
    </div>
  );
};

export default EventsPage;
