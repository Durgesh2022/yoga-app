// API Configuration
// This file centralizes the API URL configuration for the app

// Production URL - Your Vercel deployed backend
const PRODUCTION_API_URL = 'https://yoga-app-self.vercel.app/api';

// Get the API URL based on environment
export const getApiUrl = (): string => {
  // Check if EXPO_PUBLIC_BACKEND_URL is set (for development)
  const envUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  
  if (envUrl) {
    // If env variable exists, append /api if not already present
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // Default to production URL
  return PRODUCTION_API_URL;
};

// Export the API URL directly for convenience
export const API_URL = getApiUrl();

// Razorpay Key
export const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RN3ZMbtDzMZOLC';
