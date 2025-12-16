// src/layouts/UserLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, HomeIcon, CalendarDaysIcon, TicketIcon, UserIcon } from '@heroicons/react/24/outline';
import Navbar from './Navbar';
import BottomNavigation from './BottomNavigation';
import AppFooter from './AppFooter';

const UserLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        !e.target.closest('#user-drawer-toggle')
      ) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  const linkBase =
    'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors';
  const linkActive = 'text-slate-900 bg-slate-100 border-l-4 border-orange-500';
  const linkInactive = 'text-slate-600 hover:text-slate-900';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity md:hidden ${
          drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeDrawer}
      />

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform md:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 px-4 border-b flex items-center justify-between">
          <span className="font-semibold text-slate-900 text-sm">
            SRS Stall Booking
          </span>
          <button
            onClick={closeDrawer}
            className="p-1 rounded-lg hover:bg-slate-100"
          >
            <XMarkIcon className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="py-3">
          <NavLink
            to="/"
            onClick={closeDrawer}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/events"
            onClick={closeDrawer}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Events</span>
          </NavLink>

          <NavLink
            to="/bookings"
            onClick={closeDrawer}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <TicketIcon className="h-4 w-4" />
            <span>My bookings</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={closeDrawer}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-30">
        <Navbar />
      </div>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 h-14 flex items-center px-4">
        <button
          id="user-drawer-toggle"
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 mr-2"
        >
          <Bars3Icon className="w-6 h-6 text-slate-900" />
        </button>
        <span className="font-semibold text-slate-900 text-sm">
          SRS Stall Booking
        </span>
      </header>

      {/* Main + footer column */}
      <div className="flex-1 flex flex-col pt-14 md:pt-16">
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <div className="hidden md:block">
          <AppFooter />
        </div>
      </div>

      {/* Bottom nav only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default UserLayout;
