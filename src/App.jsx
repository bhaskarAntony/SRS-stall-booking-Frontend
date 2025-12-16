// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// User pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import StallSelectionPage from './pages/StallSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventCreate from './pages/admin/AdminEventCreate';
import AdminEventEdit from './pages/admin/AdminEventEdit';
import AdminStallSetup from './pages/admin/AdminStallSetup';
import AdminBookings from './pages/admin/AdminBookings';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import UsersList from './pages/admin/UsersList';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import AppFooter from './components/layout/AppFooter';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  const {isAuthenticated, user} = useAuth();
  console.log(isAuthenticated, user);
  
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop/>
      <Routes>
        {/* User layout */}
       {/* User layout - wraps all user pages */}
<Route element={<UserLayout />}>
  {/* Public routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/events" element={<EventsPage />} />
  <Route path="/events/:id" element={<EventDetailsPage />} />
  <Route path="/login" element={<AuthPage />} />
  <Route path="/register" element={<AuthPage />} />
  <Route path="/verify-otp" element={<VerifyOTPPage />} />

  {/* Protected routes - individually wrapped (this fixes dynamic routes) */}
  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/bookings"
    element={
      <ProtectedRoute>
        <BookingsPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/bookings/:bookingId"
    element={
      <ProtectedRoute>
        <BookingDetailsPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/events/:id/select-stalls"
    element={
      <ProtectedRoute>
        <StallSelectionPage />
      </ProtectedRoute>
    }
  />
</Route>

        {/* Admin layout */}
       <Route path="/admin" element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="events" element={<AdminEvents />} />
     <Route
            path="/admin/bookings/:bookingId"
            element={
              <ProtectedRoute>
                <BookingDetailsPage />
              </ProtectedRoute>
            }
          />
    <Route path="events/create" element={<AdminEventCreate />} />
    <Route path="users" element={<UsersList />} />
    <Route path="users/:userId" element={<AdminUserDetailsPage />} />
    <Route path="events/:id/edit" element={<AdminEventEdit />} />
    <Route path="events/:id/stalls" element={<AdminStallSetup />} />
    <Route path="bookings" element={<AdminBookings />} />
  </Route>
</Route>
<Route path='/*' element={<NotFoundPage/>}/>
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
