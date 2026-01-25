import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  gender?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  location?: string;
  created_at: string;
  is_verified: boolean;
  wallet_balance: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUserState(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (newUser: User | null) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem('user');
      }
      setUserState(newUser);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUserState(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUserState(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
