// src/components/layout/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl  bg-orange-500  flex items-center justify-center text-white text-sm font-bold">
              SRS
            </div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-semibold text-slate-900">
                SRS Stall Booking
              </p>
              <p className="text-[10px] text-slate-500">
                Event stall reservations
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                location.pathname === '/'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/events"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                location.pathname.startsWith('/events')
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Events</span>
            </Link>

            {user && (
              <Link
                to="/bookings"
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  location.pathname.startsWith('/bookings')
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>My bookings</span>
              </Link>
            )}

            {isAdmin() && (
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Cog6ToothIcon className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right: auth / profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm text-slate-700 hover:text-orange-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white hover:from-orange-600 hover:to-sky-600"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm hover:bg-slate-50"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 flex items-center justify-center text-[11px] font-semibold text-white">
                    {initial}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[11px] font-medium text-slate-900 truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      {user.role === 'admin' ? 'Administrator' : 'Vendor'}
                    </p>
                  </div>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur py-2 z-30">
                    <div className="px-3 pb-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {user.email}
                      </p>
                      <p className="mt-1 inline-flex items-center rounded-full bg-slate-900 text-[10px] font-medium text-white px-2 py-0.5">
                        {user.role === 'admin' ? 'Admin account' : 'User account'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/profile');
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="h-4 w-4 text-slate-500" />
                      <div className="flex flex-col">
                        <span className="font-medium text-start">Profile</span>
                        <span className="text-[10px] text-slate-500">
                          Bookings & details
                        </span>
                      </div>
                    </button>

                    {isAdmin() && (
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/admin');
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <Cog6ToothIcon className="h-4 w-4 text-slate-500" />
                        <div className="flex flex-col">
                          <span className="font-medium text-start">Admin panel</span>
                          <span className="text-[10px] text-slate-500">
                            Manage events & stalls
                          </span>
                        </div>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 mt-1"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile basic nav row */}
        <div className="md:hidden flex items-center gap-2 pb-2">
          <Link
            to="/"
            className={`flex-1 text-center rounded-full px-2 py-1.5 text-[11px] font-medium ${
              location.pathname === '/'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 bg-slate-100'
            }`}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={`flex-1 text-center rounded-full px-2 py-1.5 text-[11px] font-medium ${
              location.pathname.startsWith('/events')
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 bg-slate-100'
            }`}
          >
            Events
          </Link>
          {user && (
            <Link
              to="/bookings"
              className={`flex-1 text-center rounded-full px-2 py-1.5 text-[11px] font-medium ${
                location.pathname.startsWith('/bookings')
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 bg-slate-100'
              }`}
            >
              Bookings
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
