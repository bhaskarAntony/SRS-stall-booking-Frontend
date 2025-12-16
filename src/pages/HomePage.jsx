import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  CurrencyRupeeIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { eventService } from '../services/eventService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventCard from '../components/events/EventCard';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    happyCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents({ limit: 6, status: 'live' });
      setFeaturedEvents(response.events);
      
      setStats({
        totalEvents: response.totalEvents,
        totalBookings: 1250,
        happyCustomers: 950,
      });
    } catch (error) {
      console.error('Failed to fetch featured events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-r from-orange-500 via-orange-600 to-sky-500">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-tight">
              Book Your Perfect
              <span className="block text-3xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-100 to-white bg-clip-text text-transparent">
                Event Stall
              </span>
            </h1>
            <p className="text-base text-black sm:text-lg  mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover upcoming events and secure prime stall locations instantly. 
              Fast booking, secure payments, instant confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-orange-600 hover:bg-black-50 transition-colors"
              >
                <CalendarDaysIcon className="h-4 w-4" />
                <span>Browse Stalls</span>
              </Link>
              
            </div>
          </div>
        </div>
      </section>

   

      {/* Featured Events */}
      <section className="py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">
                Live Events
              </h2>
              <p className="text-sm text-slate-600">Book stalls for upcoming events</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 mt-2 sm:mt-0"
            >
              <span>View All</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="sm" text="Loading events..." />
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-16">
              <CalendarDaysIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No live events
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Check back soon for upcoming events
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

    
     
    </div>
  );
};

export default HomePage;
