'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const getTabTitle = (tab: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard Overview',
      users: 'User Management',
      astrologers: 'Astrologer Management',
      bookings: 'Booking Management',
      transactions: 'Transaction History',
      settings: 'Settings',
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{getTabTitle(activeTab)}</h1>
        <p className="text-sm text-gray-500">Manage your platform efficiently</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@celestials.com</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}