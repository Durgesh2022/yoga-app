'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, Calendar, DollarSign, TrendingUp, Clock, 
  Users, Phone, Video, MessageSquare, Settings,
  CheckCircle, XCircle, AlertCircle, Edit2, Save, X
} from 'lucide-react';

interface AstrologerDashboardProps {
  astrologerName: string;
  onLogout?: () => void;
}

interface AstrologerProfile {
  _id: string;
  name: string;
  expertise: string;
  experience: string;
  languages: string[];
  price: number;
  rating: number;
  reviews: number;
  available: boolean;
  services: {
    name: string;
    duration: string;
    price: number;
    description: string;
    tag: 'intro' | 'popular' | '';
  }[];
  bio?: string;
  email?: string;
  phone?: string;
}

interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  service_name: string;
  service_price: number;
  booking_date: string;
  booking_time: string;
  duration: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'pending';
  created_at: string;
  notes?: string;
}

interface Stats {
  total_bookings: number;
  completed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
  total_earnings: number;
  this_month_earnings: number;
  this_week_bookings: number;
  average_rating: number;
  total_reviews: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function AstrologerDashboard({ astrologerName, onLogout }: AstrologerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'earnings' | 'profile'>('overview');
  const [profile, setProfile] = useState<AstrologerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<AstrologerProfile>>({});

  useEffect(() => {
    fetchAstrologerData();
    fetchBookings();
    fetchStats();
  }, [astrologerName]);

  const fetchAstrologerData = async () => {
    try {
      const response = await fetch(`/api/astrologers?name=${encodeURIComponent(astrologerName)}`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setProfile(result.data[0]);
        setEditedProfile(result.data[0]);
      }
    } catch (err) {
      console.error('Error fetching astrologer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/astrologers/bookings?name=${encodeURIComponent(astrologerName)}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/astrologers/stats?name=${encodeURIComponent(astrologerName)}`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    
    try {
      const response = await fetch(`/api/astrologers/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !profile.available }),
      });

      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
        alert(`You are now ${result.data.available ? 'available' : 'unavailable'} for bookings`);
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      alert('Failed to update availability');
    }
  };

  const updateServicePrice = async (serviceIndex: number, newPrice: number) => {
    if (!profile) return;

    const updatedServices = [...profile.services];
    updatedServices[serviceIndex].price = newPrice;

    try {
      const response = await fetch(`/api/astrologers/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedServices }),
      });

      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
        alert('Service price updated successfully');
      }
    } catch (err) {
      console.error('Error updating service price:', err);
      alert('Failed to update service price');
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    
    try {
      const response = await fetch(`/api/astrologers/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      });

      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
        setEditMode(false);
        alert('Profile updated successfully');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/astrologers/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          astrologer_name: astrologerName 
        }),
      });

      const result = await response.json();
      if (result.success) {
        fetchBookings();
        alert('Booking status updated');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Failed to update booking status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <p className="mt-4 text-gray-900 font-semibold">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-sm text-gray-500">{profile.expertise}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAvailability}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  profile.available 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {profile.available ? '🟢 Available' : '🔴 Unavailable'}
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'profile', label: 'Profile', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {stats?.total_bookings || 0}
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-green-600 text-sm mt-2">
                  {stats?.this_week_bookings || 0} this week
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats?.total_earnings || 0)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                <p className="text-green-600 text-sm mt-2">
                  {formatCurrency(stats?.this_month_earnings || 0)} this month
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.rating}/5.0
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Average Rating</p>
                <p className="text-gray-600 text-sm mt-2">
                  {stats?.total_reviews || profile.reviews} reviews
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-purple-600" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {stats?.completed_bookings || 0}
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Completed Sessions</p>
                <p className="text-gray-600 text-sm mt-2">
                  {stats?.pending_bookings || 0} pending
                </p>
              </div>
            </div>

            {/* Service Packages with Price Editing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Service Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.services.map((service, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        {service.tag === 'intro' && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-500 text-white rounded font-semibold">
                            INTRO OFFER
                          </span>
                        )}
                        {service.tag === 'popular' && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-yellow-400 text-gray-900 rounded font-semibold">
                            MOST POPULAR
                          </span>
                        )}
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-700">
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{service.duration}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => updateServicePrice(idx, parseInt(e.target.value))}
                          className="w-24 px-3 py-1 border border-gray-300 rounded-lg text-right font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="font-bold text-gray-900">₹</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                        {booking.user_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.user_name}</p>
                        <p className="text-sm text-gray-500">{booking.service_name} • {booking.booking_date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(booking.service_price)}</p>
                      <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No bookings yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Filter
                </button>
                <button 
                  onClick={fetchBookings}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{booking.user_name}</p>
                            <p className="text-sm text-gray-500">{booking.user_email}</p>
                            <p className="text-sm text-gray-500">{booking.user_phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{booking.service_name}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{booking.booking_date}</p>
                          <p className="text-sm text-gray-500">{booking.booking_time}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{booking.duration}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {formatCurrency(booking.service_price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">No bookings found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EARNINGS TAB */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-500 text-sm font-medium mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats?.total_earnings || 0)}
                </p>
                <p className="text-sm text-green-600 mt-2">All time</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-500 text-sm font-medium mb-2">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats?.this_month_earnings || 0)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {stats?.completed_bookings || 0} sessions completed
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-500 text-sm font-medium mb-2">Average Per Session</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats?.total_bookings ? (stats.total_earnings / stats.total_bookings) : 0)}
                </p>
                <p className="text-sm text-gray-600 mt-2">Based on {stats?.total_bookings || 0} bookings</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
              <div className="space-y-3">
                {profile.services.map((service, idx) => {
                  const serviceBookings = bookings.filter(b => b.service_name === service.name && b.status === 'completed');
                  const serviceEarnings = serviceBookings.reduce((sum, b) => sum + b.service_price, 0);
                  
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{serviceBookings.length} sessions completed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(serviceEarnings)}</p>
                        <p className="text-sm text-gray-500">₹{service.price} per session</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {editMode ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditedProfile(profile);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editMode ? editedProfile.name : profile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                  <input
                    type="text"
                    value={editMode ? editedProfile.expertise : profile.expertise}
                    onChange={(e) => setEditedProfile({ ...editedProfile, expertise: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    value={editMode ? editedProfile.experience : profile.experience}
                    onChange={(e) => setEditedProfile({ ...editedProfile, experience: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                  <input
                    type="text"
                    value={editMode ? editedProfile.languages?.join(', ') : profile.languages.join(', ')}
                    onChange={(e) => setEditedProfile({ ...editedProfile, languages: e.target.value.split(',').map(l => l.trim()) })}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    placeholder="Hindi, English, Sanskrit"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editMode ? editedProfile.bio : profile.bio || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    disabled={!editMode}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    placeholder="Tell clients about yourself..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{profile.rating}/5.0 ⭐</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{profile.reviews}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total_bookings || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.completed_bookings || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}