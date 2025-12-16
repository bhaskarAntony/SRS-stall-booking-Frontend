import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { bookingService } from '../../services/bookingService';

const AdminUserDetailsPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Adjust API endpoints to your backend
    //   const params = {
    //             page: pagination.currentPage,
    //             limit: 10,
    //             status: filter === 'all' ? undefined : filter,
    //           };
      const [userRes, bookingsRes] = await Promise.all([
        fetch(`https://srs-stalls-backend-1.onrender.com/api/admin/user/${userId}`),
        
      ]);

      if (!userRes.ok) throw new Error('Failed to load user');
      const userData = await userRes.json();
      setUser(userData.user);
       const res =  await bookingService.getMyBookings()
        console.log(res);
        
        setBookings(res.bookings);
    } catch (err) {
      console.error(err);
      setError('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVerifiedClasses = (isVerified) =>
    isVerified
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      : 'bg-amber-50 text-amber-700 border border-amber-100';

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-600">Loading user details…</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-4 sm:pt-6">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-3 sm:px-4 sm:py-4 text-sm text-rose-700">
            {error || 'User not found.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/admin/users"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 flex items-center justify-center text-white">
                {user.name?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
                  Admin
                </p>
                <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900 truncate">
                  {user.name}
                </h1>
                <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${getVerifiedClasses(
                user.isVerified,
              )}`}
            >
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              {user.isVerified ? 'Verified' : 'Unverified'}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Left: user profile, business, address */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-2">
            {/* Profile */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Profile information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2.5 text-[12px]">
                  <div className="flex items-center gap-2.5">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500">Full name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {user.email}
                      </p>
                      <p className="text-[11px] text-slate-500">Email address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <PhoneIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {user.phone}
                      </p>
                      <p className="text-[11px] text-slate-500">Phone number</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-[12px]">
                  <div className="flex items-center gap-2.5">
                    <CalendarDaysIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {user.createdAt
                          ? format(parseISO(user.createdAt), 'MMM dd, yyyy')
                          : 'N/A'}
                      </p>
                      <p className="text-[11px] text-slate-500">Joined on</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CalendarDaysIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {user.updatedAt
                          ? format(parseISO(user.updatedAt), 'MMM dd, yyyy')
                          : 'N/A'}
                      </p>
                      <p className="text-[11px] text-slate-500">Last updated</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Business */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Business details
              </h2>
              {user.businessDetails?.companyName ? (
                <div className="space-y-2.5 text-[12px]">
                  <div className="flex items-center gap-2.5">
                    <BuildingOfficeIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {user.businessDetails.companyName}
                      </p>
                      <p className="text-[11px] text-slate-500">Company name</p>
                    </div>
                  </div>
                  {user.businessDetails.gstNumber && (
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {user.businessDetails.gstNumber}
                        </p>
                        <p className="text-[11px] text-slate-500">GST number</p>
                      </div>
                    </div>
                  )}
                  {user.businessDetails.businessType && (
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 capitalize">
                          {user.businessDetails.businessType}
                        </p>
                        <p className="text-[11px] text-slate-500">Business type</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[12px] text-slate-500">
                  No business details provided.
                </p>
              )}
            </section>

            {/* Address */}
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Address
              </h2>
              {user.address ? (
                <div className="flex items-start gap-2.5 text-[12px]">
                  <MapPinIcon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {user.address.street || 'N/A'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {user.address.city || ''}{' '}
                      {user.address.state ? `• ${user.address.state}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {user.address.zipCode || ''}{' '}
                      {user.address.country || 'India'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-slate-500">
                  No address information available.
                </p>
              )}
            </section>
          </div>

          {/* Right: quick stats / bookings */}
          <div className="space-y-4 sm:space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                Activity summary
              </h2>
              <div className="space-y-2.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total bookings</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {bookings.length}
                  </span>
                </div>
              </div>
            </section>

            {bookings.length > 0 && (
              <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2.5">
                  Recent bookings
                </h2>
                <div className="space-y-2 text-[12px]">
                  {bookings.slice(0, 4).map((b) => (
                    <Link
                      key={b._id}
                      to={`/bookings/${b.bookingId}`}
                      className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 hover:border-sky-300 hover:bg-slate-50/80"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {b.eventId?.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {b.bookingId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500">
                          {b.createdAt
                            ? format(parseISO(b.createdAt), 'MMM dd')
                            : ''}
                        </p>
                        <p className="text-[11px] text-slate-700">
                          ₹{(b.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUserDetailsPage;
