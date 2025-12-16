import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';

const AppFooter = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Logo + about */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-r from-orange-500 to-sky-500 flex items-center justify-center text-sm font-bold text-white">
                SRS
              </div>
              <span className="text-sm font-semibold text-slate-50">
                SRS Stall Booking
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mb-3">
              Manage event stalls, bookings, and payments in one clean, mobile‑first
              dashboard.
            </p>
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <MapPinIcon className="h-4 w-4" />
              <span>Karnataka · Online SRS event stall Booking</span>
            </div>
          </div>

          {/* Sitemap */}
          <div className="flex flex-col sm:items-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-3">
              Sitemap
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-[13px]">
              <Link
                to="/"
                className="text-slate-300 hover:text-orange-400 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/events"
                className="text-slate-300 hover:text-orange-400 transition-colors"
              >
                Events
              </Link>
              <Link
                to="/bookings"
                className="text-slate-300 hover:text-orange-400 transition-colors"
              >
                My bookings
              </Link>
              <Link
                to="/profile"
                className="text-slate-300 hover:text-orange-400 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/admin"
                className="text-slate-300 hover:text-orange-400 transition-colors"
              >
                Admin
              </Link>
              {/* <Link
                to="/support"
                className="text-slate-300 hover:text-orange-400 transition-colors"
              >
                Support
              </Link> */}
            </div>
          </div>

          {/* Social links */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-3">
              Connect
            </p>
            <p className="text-[12px] text-slate-400 mb-3">
              Follow SRS on social for product updates and release notes.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:bg-slate-800 text-xs font-semibold"
              >
                X
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:bg-slate-800 text-xs font-semibold"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-300 hover:text-orange-400 hover:bg-slate-800 text-xs font-semibold"
              >
                IG
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:bg-slate-800 text-xs font-semibold"
              >
                in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-center gap-2">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} SRS Stall Booking. All rights reserved.
          </p>
          {/* <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <Link to="/terms" className="hover:text-slate-200">
              Terms
            </Link>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <Link to="/privacy" className="hover:text-slate-200">
              Privacy
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
