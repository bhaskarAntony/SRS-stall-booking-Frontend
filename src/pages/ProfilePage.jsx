import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'India',
    },
    businessDetails: {
      companyName: user?.businessDetails?.companyName || '',
      gstNumber: user?.businessDetails?.gstNumber || '',
      businessType: user?.businessDetails?.businessType || '',
    },
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'India',
      },
      businessDetails: {
        companyName: user.businessDetails?.companyName || '',
        gstNumber: user.businessDetails?.gstNumber || '',
        businessType: user.businessDetails?.businessType || '',
      },
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      // TODO: call update profile API with formData
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (!user) {
      setIsEditing(false);
      return;
    }
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'India',
      },
      businessDetails: {
        companyName: user.businessDetails?.companyName || '',
        gstNumber: user.businessDetails?.gstNumber || '',
        businessType: user.businessDetails?.businessType || '',
      },
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-600">
        You are not logged in.
      </div>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
              Profile
            </p>
            <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">
              Account settings
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
              View and update your details for stall bookings.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              Logout
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:from-orange-600 hover:to-sky-600"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              <span>Edit details</span>
            </button>
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              Edit
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Profile summary */}
            <section className="lg:col-span-1 rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 flex items-center justify-center text-lg font-semibold text-white mb-3">
                  {initial}
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
                <p className="text-[11px] text-slate-500">{user.phone}</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">
                  {user.role === 'admin' ? 'Admin account' : 'User account'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-[11px] font-medium text-slate-700 mb-1">
                  Address
                </p>
                <p className="text-[11px] text-slate-600 flex items-start gap-1.5">
                  <MapPinIcon className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                  <span className="truncate">
                    {user.address?.street && `${user.address.street}, `}
                    {user.address?.city}
                    {user.address?.state ? `, ${user.address.state}` : ''}
                    {user.address?.zipCode ? ` - ${user.address.zipCode}` : ''}
                  </span>
                </p>
              </div>
            </section>

            {/* Details */}
            <section className="lg:col-span-2 space-y-4 sm:space-y-5">
              {/* Personal info */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Personal information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px] sm:text-sm">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[11px] text-slate-500">Full name</p>
                      <p className="text-slate-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[11px] text-slate-500">Email</p>
                      <p className="text-slate-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[11px] text-slate-500">Phone</p>
                      <p className="text-slate-900">{user.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Address
                </h2>
                <div className="space-y-2 text-[12px] sm:text-sm">
                  <div>
                    <p className="text-[11px] text-slate-500">Street</p>
                    <p className="text-slate-900">
                      {user.address?.street || 'Not provided'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-[11px] text-slate-500">City</p>
                      <p className="text-slate-900">
                        {user.address?.city || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">State</p>
                      <p className="text-slate-900">
                        {user.address?.state || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">ZIP Code</p>
                      <p className="text-slate-900">
                        {user.address?.zipCode || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business */}
              <div className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Business information
                </h2>
                <div className="space-y-2 text-[12px] sm:text-sm">
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-[11px] text-slate-500">
                        Company name
                      </p>
                      <p className="text-slate-900">
                        {user.businessDetails?.companyName || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] text-slate-500">GST number</p>
                      <p className="text-slate-900">
                        {user.businessDetails?.gstNumber || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">
                        Business type
                      </p>
                      <p className="text-slate-900 capitalize">
                        {user.businessDetails?.businessType || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Edit sheet / modal */}
      {isEditing && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-slate-900/40">
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-hidden mb-16 md:mb-0" >
            <div className="px-3 sm:px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Edit profile
                </p>
                <p className="text-[11px] text-slate-500">
                  Update your contact, address and business details.
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
              >
                <XMarkIcon className="h-4 w-4 text-slate-600" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-3 sm:px-4 py-3 space-y-4">
              {/* Personal */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-700">
                  Personal
                </p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-700">
                  Address
                </p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Street
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">
                        ZIP
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-700">
                  Business
                </p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Company name
                    </label>
                    <input
                      type="text"
                      name="businessDetails.companyName"
                      value={formData.businessDetails.companyName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">
                        GST number
                      </label>
                      <input
                        type="text"
                        name="businessDetails.gstNumber"
                        value={formData.businessDetails.gstNumber}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">
                        Business type
                      </label>
                      <select
                        name="businessDetails.businessType"
                        value={formData.businessDetails.businessType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none bg-white"
                      >
                        <option value="">Select type</option>
                        <option value="retail">Retail</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="services">Services</option>
                        <option value="food">Food & Beverage</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 sm:px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-white">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:from-orange-600 hover:to-sky-600"
              >
                <CheckIcon className="h-3.5 w-3.5" />
                <span>Save changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
