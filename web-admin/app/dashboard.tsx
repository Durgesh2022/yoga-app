'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Star, Home, DollarSign, TrendingUp, Calendar, 
  Activity, CreditCard, Package, Phone, Clock 
} from 'lucide-react';
import Navbar from './navbar';
import Sidebar from './Sidebar';
import AddAstrologerForm, { AstrologerFormData } from './AddAstrologer/page';

interface DashboardProps {
  onLogout?: () => void;
}

interface Astrologer {
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
}

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  is_verified: boolean;
  wallet_balance: number;
  gender?: string;
  date_of_birth?: string;
}

interface Booking {
  id: string;
  user_id: string;
  astrologer_name?: string;
  service_name?: string;
  class_name?: string;
  package_name?: string;
  service_price?: number;
  price?: number;
  booking_date?: string;
  booking_time?: string;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

interface Stats {
  users: {
    total: number;
    new_this_month: number;
    growth_percentage: number;
  };
  bookings: {
    total: number;
    pending: number;
    paid: number;
    yoga_classes: number;
    yoga_packages: number;
    consultations: number;
  };
  revenue: {
    total: number;
    this_month: number;
    wallet_balance: number;
  };
}

interface Activity {
  type: string;
  message: string;
  timestamp: string;
  user_id?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yoga-app-self.vercel.app/api';

export default function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddAstrologerForm, setShowAddAstrologerForm] = useState(false);
  
  // State for data
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'astrologers':
        fetchAstrologers();
        break;
      case 'bookings':
        fetchBookings();
        break;
      case 'transactions':
        fetchTransactions();
        break;
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await fetch(`${API_BASE_URL}/admin/stats`);
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch statistics');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/recent-activity?limit=10`);
      const data = await response.json();
      setRecentActivity(data.activities || []);
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=100`);
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchAstrologers = async () => {
    try {
      setLoading(prev => ({ ...prev, astrologers: true }));
      const response = await fetch('/api/astrologers');
      const result = await response.json();

      if (result.success) {
        setAstrologers(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch astrologers');
      }
    } catch (err) {
      console.error('Error fetching astrologers:', err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(prev => ({ ...prev, astrologers: false }));
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(prev => ({ ...prev, bookings: true }));
      const response = await fetch(`${API_BASE_URL}/admin/bookings?limit=100`);
      const data = await response.json();
      
      // Combine all booking types
      const allBookings = [
        ...(data.astrology_bookings || []).map((b: any) => ({ ...b, booking_type: 'Astrology' })),
        ...(data.yoga_class_bookings || []).map((b: any) => ({ ...b, booking_type: 'Yoga Class' })),
        ...(data.yoga_package_purchases || []).map((b: any) => ({ ...b, booking_type: 'Yoga Package' })),
        ...(data.yoga_consultations || []).map((b: any) => ({ ...b, booking_type: 'Consultation' })),
      ];
      
      setBookings(allBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const response = await fetch(`${API_BASE_URL}/admin/transactions?limit=200`);
      const data = await response.json();
      setTransactions(data.transactions || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const handleAddAstrologer = async (astrologerData: AstrologerFormData) => {
    try {
      const response = await fetch('/api/astrologers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(astrologerData),
      });

      const result = await response.json();

      if (result.success) {
        setAstrologers([result.data, ...astrologers]);
        setShowAddAstrologerForm(false);
        setError(null);
      } else {
        setError(result.error || 'Failed to add astrologer');
        alert(result.message || 'Failed to add astrologer');
      }
    } catch (err) {
      console.error('Error adding astrologer:', err);
      setError('Failed to connect to the server');
      alert('Failed to add astrologer');
    }
  };

  const handleDeleteAstrologer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this astrologer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/astrologers/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setAstrologers(astrologers.filter(a => a._id !== id));
        setError(null);
      } else {
        setError(result.error || 'Failed to delete astrologer');
        alert(result.message || 'Failed to delete astrologer');
      }
    } catch (err) {
      console.error('Error deleting astrologer:', err);
      setError('Failed to connect to the server');
      alert('Failed to delete astrologer');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/astrologers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !currentStatus }),
      });

      const result = await response.json();

      if (result.success) {
        setAstrologers(astrologers.map(a => 
          a._id === id ? result.data : a
        ));
        setError(null);
      } else {
        setError(result.error || 'Failed to update availability');
        alert(result.message || 'Failed to update availability');
      }
    } catch (err) {
      console.error('Error updating availability:', err);
      setError('Failed to connect to the server');
      alert('Failed to update availability');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will delete all their bookings and transactions.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setUsers(users.filter(u => u.id !== userId));
        alert('User deleted successfully');
      } else {
        alert(result.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string, bookingType: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status?booking_type=${bookingType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        fetchBookings(); // Refresh bookings
        alert('Booking status updated');
      } else {
        alert(result.message || 'Failed to update booking');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking');
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
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar activeTab={activeTab} />

        {/* Content Area */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">✕</button>
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats?.users.total || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-4">
                    ↑ {stats?.users.growth_percentage || 0}% from last month
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats?.bookings.total || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-purple-600" size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    {stats?.bookings.pending || 0} pending
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {formatCurrency(stats?.revenue.total || 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-4">
                    {formatCurrency(stats?.revenue.this_month || 0)} this month
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Astrologers</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {astrologers.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="text-yellow-600" size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    {astrologers.filter(a => a.available).length} available
                  </p>
                </div>
              </div>

              {/* Booking Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="text-indigo-600" size={20} />
                    <h4 className="font-semibold text-gray-900">Yoga Classes</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.bookings.yoga_classes || 0}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="text-purple-600" size={20} />
                    <h4 className="font-semibold text-gray-900">Yoga Packages</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.bookings.yoga_packages || 0}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="text-green-600" size={20} />
                    <h4 className="font-semibold text-gray-900">Consultations</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.bookings.consultations || 0}
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="text-indigo-600" size={20} />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  ) : (
                    recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {activity.type === 'user_signup' ? 'U' : activity.type === 'transaction' ? '₹' : 'B'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{activity.message}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button 
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Refresh
                </button>
              </div>

              {loading.users ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                                  {user.full_name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">{user.full_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{user.phone}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {formatCurrency(user.wallet_balance || 0)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {user.is_verified ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                <button 
                  onClick={fetchBookings}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Refresh
                </button>
              </div>

              {loading.bookings ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.map((booking: any) => (
                          <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                                {booking.booking_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {booking.service_name || booking.class_name || booking.package_name || 'Consultation'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{booking.user_id.slice(0, 8)}...</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {formatCurrency(booking.service_price || booking.price || 0)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {booking.booking_date || new Date(booking.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={booking.status}
                                onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value, booking.booking_type.toLowerCase().replace(' ', '_'))}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                <button 
                  onClick={fetchTransactions}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Refresh
                </button>
              </div>

              {loading.transactions ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance After</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${txn.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {txn.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <span className={txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{txn.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(txn.balance_after)}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{txn.user_id.slice(0, 8)}...</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(txn.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ASTROLOGERS TAB */}
          {activeTab === 'astrologers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Manage Astrologers</h3>
                <button 
                  onClick={() => setShowAddAstrologerForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Star size={18} />
                  Add Astrologer
                </button>
              </div>

              {loading.astrologers ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="mt-4 text-gray-600">Loading astrologers...</p>
                </div>
              ) : astrologers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Star className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No astrologers</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a new astrologer.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {astrologers.map((astrologer) => (
                    <div key={astrologer._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold relative">
                          {astrologer.name.charAt(0)}
                          {astrologer.available && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{astrologer.name}</h3>
                          <p className="text-sm text-gray-500">{astrologer.expertise}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Experience:</span>
                          <span className="font-medium text-gray-900">{astrologer.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Languages:</span>
                          <span className="font-medium text-gray-900 text-right">{astrologer.languages.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Base Price:</span>
                          <span className="font-medium text-gray-900">₹{astrologer.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rating:</span>
                          <span className="font-medium text-gray-900">{astrologer.rating}/5.0 ⭐</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Reviews:</span>
                          <span className="font-medium text-gray-900">{astrologer.reviews}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Status:</span>
                          <button
                            onClick={() => handleToggleAvailability(astrologer._id, astrologer.available)}
                            className={`font-medium ${astrologer.available ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                          >
                            {astrologer.available ? 'Available' : 'Unavailable'}
                          </button>
                        </div>
                      </div>

                      {/* Service Packages */}
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Service Packages</h4>
                        <div className="space-y-2">
                          {astrologer.services.map((service, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900">{service.name}</span>
                                  {service.tag === 'intro' && (
                                    <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded font-semibold">INTRO</span>
                                  )}
                                  {service.tag === 'popular' && (
                                    <span className="text-xs px-2 py-0.5 bg-yellow-400 text-gray-900 rounded font-semibold">POPULAR</span>
                                  )}
                                </div>
                                <span className="text-sm font-bold text-gray-900">₹{service.price}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{service.description}</span>
                                <span className="text-xs text-gray-600 font-medium">{service.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteAstrologer(astrologer._id)}
                          className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Wallet Balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(stats?.revenue.wallet_balance || 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">New Users This Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.users.new_this_month || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Astrologer Form Modal */}
      {showAddAstrologerForm && (
        <AddAstrologerForm
          onClose={() => setShowAddAstrologerForm(false)}
          onSubmit={handleAddAstrologer}
        />
      )}
    </div>
  );
}