import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    verified: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/users/list');
      const data = await response.json();
      const list = data.userslist || [];
      setUsers(list);
      setFilteredUsers(list);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...users];

    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q) ||
          user.phone?.includes(filters.search),
      );
    }

    if (filters.verified !== '') {
      const isVerified = filters.verified === 'true';
      filtered = filtered.filter((user) => user.isVerified === isVerified);
    }

    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const viewUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalUsers = users.filter((u) => u.role === 'user').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-600">Loading users…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-r from-orange-500 to-sky-500 flex items-center justify-center text-white">
              <UserGroupIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
                Admin
              </p>
              <h1 className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900 truncate">
                Users management
              </h1>
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
                Search, filter, and inspect all registered users.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-right">
              <p className="text-[11px] text-slate-500">Total users</p>
              <p className="text-sm font-semibold text-slate-900">{users.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-right">
              <p className="text-[11px] text-slate-500">Admins</p>
              <p className="text-sm font-semibold text-slate-900">{totalAdmins}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-right">
              <p className="text-[11px] text-slate-500">Users</p>
              <p className="text-sm font-semibold text-slate-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-t border-slate-200 bg-white/90">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex flex-col sm:flex-row gap-2.5 sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, phone…"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              <select
                value={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">All status</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
        {/* Mobile / tablet cards */}
        <div className="grid gap-3 sm:gap-4 lg:hidden">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => viewUserDetails(user._id)}
              className="w-full text-left rounded-xl border border-slate-200 bg-white/95 px-3 py-3 sm:px-4 sm:py-3.5 shadow-sm hover:border-sky-300 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.name}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        user.role === 'admin'
                          ? 'bg-orange-50 text-orange-700 border border-orange-100'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <p className="text-[11px] text-slate-500">{user.phone}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[11px] text-slate-500">
                      {user.address?.city || 'No city'} • {user.address?.state || 'N/A'}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        user.isVerified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      <ShieldCheckIcon className="h-3 w-3" />
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block rounded-xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  User
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Contact
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Location
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{user._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-700">
                    <p>{user.email}</p>
                    <p className="text-[11px] text-slate-500">{user.phone}</p>
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        user.role === 'admin'
                          ? 'bg-orange-50 text-orange-700 border border-orange-100'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        user.isVerified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      <ShieldCheckIcon className="h-3 w-3" />
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-700">
                    <p>{user.address?.city || 'N/A'}</p>
                    <p className="text-[11px] text-slate-500">
                      {user.address?.state || ''} {user.address?.country || ''}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => viewUserDetails(user._id)}
                      className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="mt-4 text-center text-[12px] text-slate-500 lg:hidden">
            No users found matching your filters.
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersList;
