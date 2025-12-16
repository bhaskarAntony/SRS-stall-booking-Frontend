// src/components/layout/AdminLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  TicketIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('#sidebar-toggle-button')
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const adminNav = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Events', href: '/admin/events', icon: CalendarDaysIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: TicketIcon },
    { name: 'Users', href: '/admin/users', icon: User },

  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 z-30 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:relative top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-slate-200">
          <Link to="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-orange-500 to-sky-500 flex items-center justify-center text-white">
              <ChartBarIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                Admin panel
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                SRS Stall Booking
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <XMarkIcon className="h-4 w-4 text-slate-700" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {adminNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${
                    active ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-slate-200 px-3 sm:px-4 py-3 space-y-2.5 bg-slate-50/80">
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-xs font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[11px] text-slate-500">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-rose-500 px-3 py-2 text-[11px] font-medium text-white hover:bg-rose-600"
          >
            <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between bg-white/90 backdrop-blur border-b border-slate-200 px-3 py-2.5">
          <button
            id="sidebar-toggle-button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <Bars3Icon className="h-5 w-5 text-slate-800" />
          </button>
          <p className="text-sm font-semibold text-slate-900">Admin panel</p>
          <div className="h-8 w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
