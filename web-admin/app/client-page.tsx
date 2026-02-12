'use client';

import { useEffect, useState } from 'react';
import AstrologerDashboard from './astrologerdashboard/dashboard';
import Dashboard from './dashboard';
import Login from './login/Login';
import SignUp from './signup/Signup';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'astrologer';
  token: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const result = await response.json();

          if (result.success) {
            setCurrentUser({
              id: result.data.user.id,
              email: result.data.user.email,
              fullName: result.data.user.fullName,
              role: result.data.user.role,
              token: token,
            });
            setCurrentView('dashboard');
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Session check failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      
      setLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        const userData: User = {
          id: result.data.user.id,
          email: result.data.user.email,
          fullName: result.data.user.fullName,
          role: result.data.user.role,
          token: result.data.token,
        };

        // Save token to localStorage
        localStorage.setItem('authToken', result.data.token);

        setCurrentUser(userData);
        setCurrentView('dashboard');
        return true;
      } else {
        alert(result.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please try again.');
      return false;
    }
  };

  const handleSignUp = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const userData: User = {
          id: result.data.user.id,
          email: result.data.user.email,
          fullName: result.data.user.fullName,
          role: result.data.user.role,
          token: result.data.token,
        };

        // Save token to localStorage
        localStorage.setItem('authToken', result.data.token);

        setCurrentUser(userData);
        setCurrentView('dashboard');
        return true;
      } else {
        alert(result.message || 'Signup failed');
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Network error. Please try again.');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleSwitchToSignUp = () => {
    setCurrentView('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  // Show loading screen while checking session
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render based on current view and user role
  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />;
  }

  if (currentView === 'signup') {
    return <SignUp onSignUp={handleSignUp} onSwitchToLogin={handleSwitchToLogin} />;
  }

  if (currentView === 'dashboard' && currentUser) {
    if (currentUser.role === 'admin') {
      return <Dashboard onLogout={handleLogout} />;
    } else {
      return <AstrologerDashboard astrologerName={currentUser.fullName} onLogout={handleLogout} />;
    }
  }

  // Fallback
  return <Login onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />;
}
