import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md w-full text-center">
        {/* Gradient circle behind gif */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-gradient-to-tr from-orange-500/20 via-sky-500/20 to-slate-200 blur-2xl" />
          <img
            src="https://lottie.host/placeholder-404.gif"
            alt="Page not found"
            className="relative h-40 w-40 sm:h-48 sm:w-48 object-contain"
          />
        </div>

        <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500 mb-1">
          404 error
        </p>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
          Lost in the stalls?
        </h1>
        <p className="text-sm text-slate-500 mb-5">
          The page you are looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.4)] hover:from-orange-400 hover:to-sky-400"
          >
            Go to home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50"
          >
            Go back
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-400">
          Error code: 404 · SRS Stall Booking
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
