import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const AdminEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: {
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      }
    },
    dates: {
      startDate: '',
      endDate: '',
      registrationDeadline: ''
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
        country: 'India'
      },
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: ''
      }
    },
    categories: [],
    status: 'draft'
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEvent(id);
      const event = response.event;
      
      // Format dates for input fields
      const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
      };

      setFormData({
        name: event.name || '',
        description: event.description || '',
        venue: {
          name: event.venue?.name || '',
          address: {
            street: event.venue?.address?.street || '',
            city: event.venue?.address?.city || '',
            state: event.venue?.address?.state || '',
            zipCode: event.venue?.address?.zipCode || '',
            country: event.venue?.address?.country || 'India'
          }
        },
        dates: {
          startDate: formatDate(event.dates?.startDate),
          endDate: formatDate(event.dates?.endDate),
          registrationDeadline: formatDate(event.dates?.registrationDeadline)
        },
        organizer: {
          name: event.organizer?.name || '',
          email: event.organizer?.email || '',
          phone: event.organizer?.phone || '',
          organization: event.organizer?.organization || '',
          designation: event.organizer?.designation || '',
          address: {
            street: event.organizer?.address?.street || '',
            city: event.organizer?.address?.city || '',
            state: event.organizer?.address?.state || '',
            zipCode: event.organizer?.address?.zipCode || '',
            country: event.organizer?.address?.country || 'India'
          },
          website: event.organizer?.website || '',
          socialMedia: {
            facebook: event.organizer?.socialMedia?.facebook || '',
            instagram: event.organizer?.socialMedia?.instagram || '',
            twitter: event.organizer?.socialMedia?.twitter || '',
            linkedin: event.organizer?.socialMedia?.linkedin || ''
          }
        },
        categories: event.categories || [],
        status: event.status || 'draft'
      });
    } catch (error) {
      console.error('Failed to fetch event:', error);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, [field]: field === 'price' ? parseInt(value) || 0 : value } : cat
      )
    }));
  };

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { name: '', price: 0, color: '#6B7280', description: '' }]
    }));
  };

  const removeCategory = (index) => {
    if (formData.categories.length > 1) {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.venue.name || !formData.dates.startDate || !formData.dates.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.dates.startDate) >= new Date(formData.dates.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    if (new Date(formData.dates.registrationDeadline) >= new Date(formData.dates.startDate)) {
      toast.error('Registration deadline must be before event start date');
      return;
    }

    try {
      setSaving(true);
      await eventService.updateEvent(id, formData);
      toast.success('Event updated successfully!');
      navigate('/admin/events');
    } catch (error) {
      toast.error('Failed to update event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading event details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} onRetry={fetchEvent} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/events"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Event
              </h1>
              <p className="text-sm text-gray-600">
                Update event information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Venue Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="venue.name" className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="venue.name"
                  name="venue.name"
                  required
                  value={formData.venue.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter venue name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venue.address.street" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="venue.address.street"
                    name="venue.address.street"
                    value={formData.venue.address.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <label htmlFor="venue.address.city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="venue.address.city"
                    name="venue.address.city"
                    required
                    value={formData.venue.address.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label htmlFor="venue.address.state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="venue.address.state"
                    name="venue.address.state"
                    required
                    value={formData.venue.address.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label htmlFor="venue.address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="venue.address.zipCode"
                    name="venue.address.zipCode"
                    value={formData.venue.address.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Event Dates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Dates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="dates.startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="dates.startDate"
                  name="dates.startDate"
                  required
                  value={formData.dates.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="dates.endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="dates.endDate"
                  name="dates.endDate"
                  required
                  value={formData.dates.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="dates.registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  id="dates.registrationDeadline"
                  name="dates.registrationDeadline"
                  required
                  value={formData.dates.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Organizer Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="organizer.name" className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    id="organizer.name"
                    name="organizer.name"
                    required
                    value={formData.organizer.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter organizer name"
                  />
                </div>

                <div>
                  <label htmlFor="organizer.email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="organizer.email"
                    name="organizer.email"
                    required
                    value={formData.organizer.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label htmlFor="organizer.phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="organizer.phone"
                    name="organizer.phone"
                    required
                    value={formData.organizer.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label htmlFor="organizer.organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organizer.organization"
                    name="organizer.organization"
                    value={formData.organizer.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter organization"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stall Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Stall Categories</h2>
              <button
                type="button"
                onClick={addCategory}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Category name"
                        value={category.name}
                        onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Price"
                        value={category.price}
                        onChange={(e) => handleCategoryChange(index, 'price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="color"
                        value={category.color}
                        onChange={(e) => handleCategoryChange(index, 'color', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Description"
                        value={category.description}
                        onChange={(e) => handleCategoryChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  {formData.categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/events"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventEdit;