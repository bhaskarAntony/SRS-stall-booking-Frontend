import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  TicketIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { format, parseISO } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentBookings(response.data.recentBookings);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
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
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="sm" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 sm:pt-6">
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Events',
      value: stats.totalEvents,
      icon: CalendarDaysIcon,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
      pill: '+12% vs last month',
    },
    {
      label: 'Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      pill: '+8% vs last month',
    },
    {
      label: 'Bookings',
      value: stats.totalBookings,
      icon: TicketIcon,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      pill: '+15% vs last month',
    },
    {
      label: 'Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      color: 'text-orange-600 bg-orange-50 border-orange-100',
      pill: '+22% vs last month',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
              Overview
            </p>
            <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">
              Admin dashboard
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
              Today&apos;s snapshot of events, bookings and revenue.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
              Refresh
            </button>
            {/* <Link
              to="/admin/events/create"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-3 py-1.5 text-[11px] font-medium text-white"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              New event
            </Link> */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Stats - mobile 2 cols, desktop 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 sm:px-4 sm:py-3"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs ${stat.color}`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-sm sm:text-base font-semibold text-slate-900 truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
              {/* <p className="mt-2 text-[10px] text-emerald-600">
                {stat.pill}
              </p> */}
            </div>
          ))}
        </div>

        {/* Lower section: Recent bookings + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Recent bookings */}
          <section className="rounded-xl border border-slate-200 bg-white/90">
            <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent bookings
              </h2>
              <Link
                to="/admin/bookings"
                className="text-[11px] font-medium text-sky-600 hover:text-sky-700"
              >
                View all
              </Link>
            </header>
            <div className="p-3 sm:p-4">
              {recentBookings.length === 0 ? (
                <p className="text-[12px] text-slate-500 text-center py-4">
                  No recent bookings yet.
                </p>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-2.5 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {booking.userId?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {booking.eventId?.name || 'Event'}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            {booking.status?.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {booking.stalls?.length || 0} stalls
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700">
                            ₹{booking.totalAmount?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500">
                          {booking.createdAt
                            ? format(
                                parseISO(booking.createdAt),
                                'MMM dd',
                              )
                            : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Quick actions */}
          <section className="rounded-xl border border-slate-200 bg-white/90">
            <header className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">
                Quick actions
              </h2>
            </header>
            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              <Link
                to="/admin/events/create"
                className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 sm:px-3.5 sm:py-3 hover:bg-orange-100/70"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-orange-600 text-xs">
                  <PlusIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-900">
                    Create new event
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">
                    Configure details and stall layout.
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/events"
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-3.5 sm:py-3 hover:bg-slate-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sky-600 text-xs">
                  <CalendarDaysIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-900">
                    Manage events
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">
                    View, edit and publish events.
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/bookings"
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-3.5 sm:py-3 hover:bg-slate-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-600 text-xs">
                  <TicketIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-900">
                    View bookings
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">
                    Monitor all stall reservations.
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2.5 sm:px-3.5 sm:py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 text-xs">
                  <ArrowPathIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-500">
                    Analytics (soon)
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    Detailed performance insights and trends.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
