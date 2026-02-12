'use client';

import React, { useState } from 'react';
import { X, Save, User, Star, Briefcase, Globe, DollarSign, Clock, Award } from 'lucide-react';

interface AddAstrologerFormProps {
  onClose: () => void;
  onSubmit: (astrologerData: AstrologerFormData) => void;
}
interface SlotData {
  time: string;
  isBooked?: boolean;
}

interface AvailabilityData {
  date: string;
  slots: SlotData[];
}

export interface AstrologerFormData {
  name: string;
  rating: number;
  reviews: number;
  expertise: string;
  available: boolean;
  price: number;
  languages: string[];
  experience: string;
  services: ServiceData[];
  availability: AvailabilityData[]; // ✅ NEW
}


interface ServiceData {
  name: string;
  duration: string;
  price: number;
  description: string;
  tag?: 'intro' | 'popular' | '';
}

const EXPERTISE_OPTIONS = [
  'Vedic Astrology',
  'Tarot & Palmistry',
  'Numerology',
  'Horoscope Reading',
  'Kundli Reading',
  'Vastu Shastra',
  'Face Reading',
  'Gemstone Consultation',
];

const LANGUAGE_OPTIONS = [
  'Hindi',
  'English',
  'Sanskrit',
  'Tamil',
  'Telugu',
  'Punjabi',
  'Bengali',
  'Marathi',
  'Gujarati',
];

export default function AddAstrologerForm({ onClose, onSubmit }: AddAstrologerFormProps) {
  const [formData, setFormData] = useState<AstrologerFormData>({
    name: '',
    rating: 4.5,
    reviews: 0,
    expertise: '',
    available: true,
    price: 400,
    languages: [],
    experience: '',
    services: [
      { name: 'Aaramb', duration: '12 min', price: 99, description: 'Quick introduction call', tag: 'intro' },
      { name: 'Sutra', duration: '20 min', price: 400, description: 'Get to know yourself', tag: '' },
      { name: 'Yatra', duration: '40 min', price: 800, description: 'Detailed life analysis', tag: 'popular' },
      { name: 'Vishwas', duration: '60 min', price: 1200, description: 'Complete horoscope reading', tag: '' },
      { name: 'Anant', duration: '90 min', price: 1500, description: 'In-depth life path & future guidance', tag: '' },
    ],
    availability: [
    {
      date: '',
      slots: [{ time: '', isBooked: false }],
    },
  ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof AstrologerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleServiceChange = (index: number, field: keyof ServiceData, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.expertise) {
      newErrors.expertise = 'Expertise is required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }

    if (formData.languages.length === 0) {
      newErrors.languages = 'Select at least one language';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be positive';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };
  const handleDateChange = (index: number, value: string) => {
  const updated = [...formData.availability];
  updated[index].date = value;
  handleInputChange('availability', updated);
};

const handleSlotChange = (
  dayIndex: number,
  slotIndex: number,
  value: string
) => {
  const updated = [...formData.availability];
  updated[dayIndex].slots[slotIndex].time = value;
  handleInputChange('availability', updated);
};

const addNewDate = () => {
  handleInputChange('availability', [
    ...formData.availability,
    { date: '', slots: [{ time: '', isBooked: false }] },
  ]);
};

const addSlot = (dayIndex: number) => {
  const updated = [...formData.availability];
  updated[dayIndex].slots.push({ time: '', isBooked: false });
  handleInputChange('availability', updated);
};

const removeDate = (index: number) => {
  const updated = formData.availability.filter((_, i) => i !== index);
  handleInputChange('availability', updated);
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Star className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Astrologer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Astro Meera"
                    className={`w-full px-4 py-3 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience *
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="e.g., 10+ years"
                    className={`w-full px-4 py-3 border ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                  )}
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise *
                  </label>
                  <select
                    value={formData.expertise}
                    onChange={(e) => handleInputChange('expertise', e.target.value)}
                    className={`w-full px-4 py-3 border ${
                      errors.expertise ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                  >
                    <option value="">Select expertise</option>
                    {EXPERTISE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.expertise && (
                    <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>
                  )}
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    placeholder="400"
                    min="0"
                    className={`w-full px-4 py-3 border ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', Number(e.target.value))}
                    placeholder="4.9"
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Reviews Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviews Count
                  </label>
                  <input
                    type="number"
                    value={formData.reviews}
                    onChange={(e) => handleInputChange('reviews', Number(e.target.value))}
                    placeholder="1200"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe size={20} className="text-indigo-600" />
                Languages *
              </h3>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageToggle(language)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      formData.languages.includes(language)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              {errors.languages && (
                <p className="text-red-500 text-sm mt-2">{errors.languages}</p>
              )}
            </div>

            {/* Availability */}
            {/* Availability Schedule */}
<div className="bg-gray-50 p-6 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Clock size={20} className="text-indigo-600" />
    Availability Schedule
  </h3>

  {formData.availability.map((day, dayIndex) => (
    <div
      key={dayIndex}
      className="bg-white p-4 rounded-lg border border-gray-200 mb-4"
    >
      <div className="flex justify-between items-center mb-3">
        <input
          type="date"
          value={day.date}
          onChange={(e) => handleDateChange(dayIndex, e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          type="button"
          onClick={() => removeDate(dayIndex)}
          className="text-red-500 text-sm"
        >
          Remove
        </button>
      </div>

      {/* Slots */}
      <div className="space-y-2">
        {day.slots.map((slot, slotIndex) => (
          <input
            key={slotIndex}
            type="time"
            value={slot.time}
            onChange={(e) =>
              handleSlotChange(dayIndex, slotIndex, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => addSlot(dayIndex)}
        className="mt-3 text-indigo-600 text-sm font-medium"
      >
        + Add Time Slot
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={addNewDate}
    className="text-indigo-600 font-medium"
  >
    + Add New Date
  </button>
</div>


            {/* Services */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={20} className="text-indigo-600" />
                Service Packages
              </h3>
              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Name
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) =>
                            handleServiceChange(index, 'name', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={service.duration}
                          onChange={(e) =>
                            handleServiceChange(index, 'duration', e.target.value)
                          }
                          placeholder="e.g., 20 min"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) =>
                            handleServiceChange(index, 'price', Number(e.target.value))
                          }
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tag
                        </label>
                        <select
                          value={service.tag}
                          onChange={(e) =>
                            handleServiceChange(index, 'tag', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                          <option value="">No Tag</option>
                          <option value="intro">INTRO</option>
                          <option value="popular">POPULAR</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) =>
                            handleServiceChange(index, 'description', e.target.value)
                          }
                          placeholder="Brief description of the service"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Save size={20} />
            Save Astrologer
          </button>
        </div>
      </div>
    </div>
  );
}