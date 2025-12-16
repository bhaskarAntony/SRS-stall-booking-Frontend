import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { eventService } from '../services/eventService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEvent(id);
      setEvent(response.event);
    } catch (error) {
      console.error('Failed to fetch event:', error);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookStall = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}/select-stalls` } });
    } else {
      navigate(`/events/${id}/select-stalls`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="sm" text="Loading event details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          <ErrorMessage message={error} onRetry={fetchEvent} />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          <ErrorMessage message="Event not found" />
        </div>
      </div>
    );
  }

  const startDate = event.dates?.startDate
    ? format(parseISO(event.dates.startDate), 'EEEE, MMMM dd, yyyy')
    : '';
  const endDate = event.dates?.endDate
    ? format(parseISO(event.dates.endDate), 'EEEE, MMMM dd, yyyy')
    : '';
  const registrationDeadline = event.dates?.registrationDeadline
    ? format(parseISO(event.dates.registrationDeadline), 'MMMM dd, yyyy')
    : '';

  const minPrice =
    event.categories && event.categories.length > 0
      ? Math.min(...event.categories.map((c) => c.price || 0))
      : null;

  const statusChip = (() => {
    switch (event.status) {
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
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/events"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
            <span className="text-[11px] text-slate-500">Back to events</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-lg sm:text-2xl font-semibold text-slate-900 truncate">
                  {event.name}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusChip}`}
                >
                  {event.status?.toUpperCase()}
                </span>
              </div>
              {event.description && (
                <p className="text-[13px] sm:text-sm text-slate-600 max-w-2xl">
                  {event.description}
                </p>
              )}
            </div>

            {/* Booking summary (compact on desktop header) */}
            <div className="hidden md:flex flex-col items-end gap-1 text-[11px] text-slate-600">
              <p>
                {event.availableStalls} of {event.stallLayout?.totalStalls || 0}{' '}
                stalls available
              </p>
              {minPrice !== null && (
                <div className="flex items-center text-sm font-semibold text-emerald-600">
                  <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                  <span>From {minPrice.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Left: details */}
          <section className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Quick info */}
            <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Event details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 text-[12px] text-slate-700">
                  <CalendarDaysIcon className="h-4 w-4 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Event dates</p>
                    <p className="text-slate-600">
                      {startDate}
                      {endDate && ` – ${endDate}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-[12px] text-slate-700">
                  <ClockIcon className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Registration deadline
                    </p>
                    <p className="text-slate-600">{registrationDeadline}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-[12px] text-slate-700">
                  <MapPinIcon className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Venue</p>
                    <p className="text-slate-700">{event.venue?.name}</p>
                    <p className="text-slate-500">
                      {event.venue?.address?.street},{' '}
                      {event.venue?.address?.city},{' '}
                      {event.venue?.address?.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-[12px] text-slate-700">
                  <UsersIcon className="h-4 w-4 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Available stalls
                    </p>
                    <p className="text-slate-600">
                      {event.availableStalls} of{' '}
                      {event.stallLayout?.totalStalls || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Organizer information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
                <div className="space-y-2.5">
                  <p className="text-sm font-semibold text-slate-900">
                    {event.organizer?.name}
                  </p>
                  {event.organizer?.organization && (
                    <div>
                      <p className="font-medium text-slate-700 text-[12px]">
                        Organization
                      </p>
                      <p className="text-slate-600">
                        {event.organizer.organization}
                      </p>
                    </div>
                  )}
                  {event.organizer?.designation && (
                    <div>
                      <p className="font-medium text-slate-700 text-[12px]">
                        Role
                      </p>
                      <p className="text-slate-600">
                        {event.organizer.designation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  <p className="text-sm font-semibold text-slate-900">
                    Contact
                  </p>
                  <div className="flex items-center text-slate-600">
                    <EnvelopeIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                    <a
                      href={`mailto:${event.organizer?.email}`}
                      className="hover:text-sky-600"
                    >
                      {event.organizer?.email}
                    </a>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <PhoneIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                    <a
                      href={`tel:${event.organizer?.phone}`}
                      className="hover:text-sky-600"
                    >
                      {event.organizer?.phone}
                    </a>
                  </div>
                  {event.organizer?.website && (
                    <div className="flex items-center text-slate-600">
                      <GlobeAltIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                      <a
                        href={event.organizer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-600"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Right: booking card */}
          <section className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Stall booking
              </h3>

              {/* Mobile quick summary */}
              <div className="mb-3 md:hidden text-[11px] text-slate-600">
                <p>
                  {event.availableStalls} of {event.stallLayout?.totalStalls || 0}{' '}
                  stalls available
                </p>
              </div>

              {minPrice !== null && (
                <div className="mb-3">
                  <p className="text-[11px] text-slate-500 mb-1">
                    Stall price from
                  </p>
                  <div className="flex items-center text-xl font-bold text-emerald-600">
                    <CurrencyRupeeIcon className="h-5 w-5 mr-1" />
                    <span>{minPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {event.categories && event.categories.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-medium text-slate-900 mb-2">
                    Categories available
                  </p>
                  <div className="space-y-1.5">
                    {event.categories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-[12px] font-medium text-slate-900">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-[12px] text-slate-700">
                          ₹{category.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleBookStall}
                disabled={
                  event.status !== 'live' || event.availableStalls <= 0
                }
                className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {event.status !== 'live'
                  ? 'Booking not available'
                  : event.availableStalls <= 0
                  ? 'Sold out'
                  : 'Select stalls'}
              </button>

              {!isAuthenticated && event.status === 'live' && (
                <p className="mt-2 text-[11px] text-slate-500 text-center">
                  Login required to book stalls.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
