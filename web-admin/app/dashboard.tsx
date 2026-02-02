'use client';

import React, { useState, useEffect } from 'react';
import { Users, Star, Home } from 'lucide-react';
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

export default function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddAstrologerForm, setShowAddAstrologerForm] = useState(false);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch astrologers from API
  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-4">↑ 12% from last month</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Astrologers</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{astrologers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="text-purple-600" size={24} />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-4">
                    {astrologers.filter(a => a.available).length} available
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Active Sessions</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Home className="text-green-600" size={24} />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-4">↑ 5% from last hour</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                        U{i}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">User consulted with Astrologer</p>
                        <p className="text-sm text-gray-500">{i * 5} minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {['John Doe', 'Jane Smith', 'Bob Johnson'].map((name, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                              {name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{name.toLowerCase().replace(' ', '.')}@example.com</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">Jan {15 + i}, 2026</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

              {loading ? (
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