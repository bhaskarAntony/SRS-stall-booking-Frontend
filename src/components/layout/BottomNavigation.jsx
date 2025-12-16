import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  TicketIcon,
  UserIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  TicketIcon as TicketIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const getNavigationItems = () => {
    const items = [
      {
        name: 'Home',
        path: '/',
        icon: HomeIcon,
        activeIcon: HomeIconSolid,
      },
      {
        name: 'Events',
        path: '/events',
        icon: CalendarDaysIcon,
        activeIcon: CalendarDaysIconSolid,
      },
    ];

    if (user) {
      items.push({
        name: 'Bookings',
        path: '/bookings',
        icon: TicketIcon,
        activeIcon: TicketIconSolid,
      });

      if (isAdmin()) {
        items.push({
          name: 'Admin',
          path: '/admin',
          icon: Cog6ToothIcon,
          activeIcon: Cog6ToothIconSolid,
        });
      } else {
        items.push({
          name: 'Profile',
          path: '/profile',
          icon: UserIcon,
          activeIcon: UserIconSolid,
        });
      }
    } else {
      items.push({
        name: 'Login',
        path: '/login',
        icon: UserIcon,
        activeIcon: UserIconSolid,
      });
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 md:hidden">
      <nav className="max-w-5xl mx-auto flex items-stretch justify-between">
        {navigationItems.map((item) => {
          const active = isActive(item.path);
          const Icon = active ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
            >
              <div className="flex flex-col items-center gap-0.5">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? 'text-orange-500' : 'text-slate-500'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    active ? 'text-orange-600' : 'text-slate-600'
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <div
                className={`mt-0.5 h-0.5 w-8 rounded-full transition-opacity ${
                  active ? 'bg-orange-500 opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
