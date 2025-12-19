import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { eventService } from '../../services/eventService';
import toast from 'react-hot-toast';

const AdminEventCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image:'',
    rows:0,
    cols:0,
    venue: {
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
    },
    dates: {
      startDate: '',
      endDate: '',
      registrationDeadline: '',
    },
    organizer: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      designation: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
      },
    },
    categories: [
      {
        name: 'Premium',
        price: 10000,
        color: '#F97316',
        description: 'Prime location stalls',
      },
      {
        name: 'Standard',
        price: 6000,
        color: '#0EA5E9',
        description: 'Good visibility stalls',
      },
      {
        name: 'Economy',
        price: 3000,
        color: '#22C55E',
        description: 'Budget-friendly stalls',
      },
    ],
    status: 'draft',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData((prev) => {
        const newData = { ...prev };
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === index
          ? {
              ...cat,
              [field]: field === 'price' ? parseInt(value, 10) || 0 : value,
            }
          : cat,
      ),
    }));
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        { name: '', price: 0, color: '#64748B', description: '' },
      ],
    }));
  };

  const removeCategory = (index) => {
    if (formData.categories.length > 1) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.venue.name ||
      !formData.dates.startDate ||
      !formData.dates.endDate
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.dates.startDate) >= new Date(formData.dates.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    if (
      formData.dates.registrationDeadline &&
      new Date(formData.dates.registrationDeadline) >=
        new Date(formData.dates.startDate)
    ) {
      toast.error('Registration deadline must be before event start date');
      return;
    }

    try {
      setLoading(true);
      const response = await eventService.createEvent(formData);
      toast.success('Event created successfully!');
      navigate(`/admin/events/${response.event._id}/stalls`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center gap-3">
          <Link
            to="/admin/events"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
              New event
            </p>
            <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">
              Create event
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
              Basic details, venue, dates and stall categories.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {}
          <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Basic information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Event name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Eg. Diwali Fest 2025"
                />
              </div>
               <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Stall Layout Image *
                </label>
                <input
                  type="text"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Stall layout URL"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Short description for vendors and visitors."
                />
              </div>
               <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Stall Layout Rows *
                </label>
                <input
                  type="number"
                  name="rows"
                  required
                  value={formData.rows}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="10, 20 ..."
                />
              </div>

               <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Stall Layout Columns *
                </label>
                <input
                  type="number"
                  name="cols"
                  required
                  value={formData.cols}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="10, 20 ..."
                />
              </div>

              <div className="max-w-xs">
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>
          </section>

          {}
          <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Venue
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Venue name *
                </label>
                <input
                  type="text"
                  name="venue.name"
                  required
                  value={formData.venue.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Eg. City Exhibition Ground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                    Street
                  </label>
                  <input
                    type="text"
                    name="venue.address.street"
                    value={formData.venue.address.street}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="venue.address.city"
                    required
                    value={formData.venue.address.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    name="venue.address.state"
                    required
                    value={formData.venue.address.state}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                    ZIP code
                  </label>
                  <input
                    type="text"
                    name="venue.address.zipCode"
                    value={formData.venue.address.zipCode}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="ZIP"
                  />
                </div>
              </div>
            </div>
          </section>

          {}
          <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Dates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Start date *
                </label>
                <input
                  type="date"
                  name="dates.startDate"
                  required
                  value={formData.dates.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  End date *
                </label>
                <input
                  type="date"
                  name="dates.endDate"
                  required
                  value={formData.dates.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Registration deadline
                </label>
                <input
                  type="date"
                  name="dates.registrationDeadline"
                  value={formData.dates.registrationDeadline}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </section>

          {}
          <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Organizer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  name="organizer.name"
                  required
                  value={formData.organizer.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Organizer name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  name="organizer.email"
                  required
                  value={formData.organizer.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Contact email"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="organizer.phone"
                  required
                  value={formData.organizer.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="WhatsApp / mobile"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Organization
                </label>
                <input
                  type="text"
                  name="organizer.organization"
                  value={formData.organizer.organization}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Org / brand"
                />
              </div>
            </div>
          </section>

          {}
          <section className="rounded-xl border border-slate-200 bg-white/95 px-3 sm:px-4 py-3 sm:py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Stall categories
              </h2>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            <div className="space-y-2.5">
              {formData.categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={category.name}
                      onChange={(e) =>
                        handleCategoryChange(index, 'name', e.target.value)
                      }
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={category.price}
                      onChange={(e) =>
                        handleCategoryChange(index, 'price', e.target.value)
                      }
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <input
                      type="color"
                      value={category.color}
                      onChange={(e) =>
                        handleCategoryChange(index, 'color', e.target.value)
                      }
                      className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 p-0"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={category.description}
                      onChange={(e) =>
                        handleCategoryChange(index, 'description', e.target.value)
                      }
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  {formData.categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-rose-200 text-rose-500 hover:bg-rose-50"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {}
          <div className="flex justify-end gap-2 sm:gap-3 pt-1">
            <Link
              to="/admin/events"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-1.5 text-[11px] font-medium text-white disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventCreate;
