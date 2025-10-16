"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Vehicle } from '@/lib/types';
import { users as mockUsers, vehicles as mockVehicles } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  vehicles: Vehicle[];
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (data: Partial<User>) => void;
  addVehicle: (data: Omit<Vehicle, 'id' | 'ownerId' | 'vin' | 'imageUrl' | 'imageHint' | 'healthStatus' | 'sensorData' | 'maintenanceHistory'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple hashing function for demonstration. Do not use in production.
const simpleHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h.toString();
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Persist user session
    try {
      const storedUser = localStorage.getItem('veda-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedVehicles = localStorage.getItem('veda-vehicles');
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      } else {
        localStorage.setItem('veda-vehicles', JSON.stringify(mockVehicles));
      }

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      localStorage.removeItem('veda-user');
      localStorage.removeItem('veda-vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const passwordHash = simpleHash(pass);
    const foundUser = mockUsers.find(u => u.email === email && u.passwordHash === passwordHash);
    
    if (foundUser) {
      const userToStore = { ...foundUser };
      // @ts-ignore
      delete userToStore.passwordHash; // Don't store hash in state or localStorage
      setUser(userToStore);
      localStorage.setItem('veda-user', JSON.stringify(userToStore));
      
      let redirectPath = '/dashboard';
      if(userToStore.role === 'manager') redirectPath = '/dashboard/manager';
      if(userToStore.role === 'service-center') redirectPath = '/dashboard/service-center';
      if(userToStore.role === 'user') redirectPath = '/dashboard/user';

      router.push(redirectPath);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
     if (mockUsers.find(u => u.email === email)) {
        return false; // User already exists
     }
     const newUser: User = {
        id: `U${mockUsers.length + 1}`,
        name,
        email,
        passwordHash: simpleHash(pass),
        role: 'user',
        avatarUrl: `https://picsum.photos/seed/avatar${mockUsers.length + 1}/100/100`,
     };
     mockUsers.push(newUser);
     
     const userToStore = { ...newUser };
     // @ts-ignore
     delete userToStore.passwordHash;
     setUser(userToStore);
     localStorage.setItem('veda-user', JSON.stringify(userToStore));
     router.push('/dashboard/user');
     return true;
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('veda-user');
    localStorage.removeItem('veda-vehicles');
    router.push('/');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('veda-user', JSON.stringify(updatedUser));
      
      // Also update the mock user data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      }
    }
  };

  const addVehicle = (data: Omit<Vehicle, 'id' | 'ownerId' | 'vin' | 'imageUrl' | 'imageHint' | 'healthStatus' | 'sensorData' | 'maintenanceHistory'>) => {
    const newVehicle: Vehicle = {
      ...data,
      id: `V${vehicles.length + 1001}`,
      ownerId: '3', // Default owner for now
      vin: `VIN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      imageUrl: `https://picsum.photos/seed/vehicle${vehicles.length + 1}/600/400`,
      imageHint: 'car',
      healthStatus: 'Good',
      sensorData: {
        engine_temp: 90, oil_level: 0.9, vibration: 5, tire_pressure: 32, battery_voltage: 12.6, fuel_level: 1,
      },
      maintenanceHistory: [],
    };
    const newVehicles = [...vehicles, newVehicle];
    setVehicles(newVehicles);
    localStorage.setItem('veda-vehicles', JSON.stringify(newVehicles));
  };


  const value = { user, vehicles, login, signup, logout, loading, updateUser, addVehicle };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
