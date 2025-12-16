import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

const EventCard = ({ event }) => {
  const startDate = event.dates?.startDate
    ? format(parseISO(event.dates.startDate), 'MMM dd, yyyy')
    : '';
  const endDate = event.dates?.endDate
    ? format(parseISO(event.dates.endDate), 'MMM dd, yyyy')
    : '';

  const minPrice =
    event.categories && event.categories.length > 0
      ? Math.min(...event.categories.map((c) => c.price || 0))
      : null;

  const statusColor = (() => {
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
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-3 sm:px-4 sm:py-4 flex flex-col justify-between">
      {/* Top: title + status */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2">
            {event.name}
          </h3>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor}`}
          >
            {event.status?.toUpperCase()}
          </span>
        </div>

        {event.description && (
          <p className="text-[12px] text-slate-600 line-clamp-2 mb-3">
            {event.description}
          </p>
        )}

        {/* Meta */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center text-[11px] text-slate-600">
            <CalendarDaysIcon className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            <span>
              {startDate}
              {endDate && ` • ${endDate}`}
            </span>
          </div>

          {event.venue && (
            <div className="flex items-center text-[11px] text-slate-600">
              <MapPinIcon className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <span className="truncate">
                {event.venue.name}
                {event.venue.address?.city
                  ? ` • ${event.venue.address.city}`
                  : ''}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] mt-1">
            <div className="flex items-center text-slate-600">
              <UsersIcon className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <span>
                {event.availableStalls || 0} stalls available
              </span>
            </div>

            {minPrice !== null && (
              <div className="flex items-center text-[12px] font-semibold text-emerald-700">
                <CurrencyRupeeIcon className="h-3.5 w-3.5 mr-0.5" />
                <span>From {minPrice.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/events/${event._id}`}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-3 py-3 text-xs sm:text-sm font-medium text-white hover:from-orange-600 hover:to-sky-600 transition-colors"
      >
        View details
      </Link>
    </div>
  );
};

export default EventCard;
