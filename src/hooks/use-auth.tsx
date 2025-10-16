"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Vehicle, UsageDataPoint, HealthHistoryEntry } from '@/lib/types';
import { users as mockUsers, vehicles as mockVehicles } from '@/lib/data';
import { subDays, format } from 'date-fns';

interface AuthContextType {
  user: User | null;
  vehicles: Vehicle[];
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (data: Partial<User>) => void;
  addVehicle: (data: Omit<Vehicle, 'id' | 'ownerId' | 'vin' | 'imageUrl' | 'imageHint' | 'healthStatus' | 'healthScore' | 'lastService' | 'nextServiceDue' | 'subsystemHealth' | 'predictedAlerts' | 'sensorData' | 'maintenanceHistory' | 'usageHistory' | 'healthHistory'>) => void;
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

const generateUsageHistory = (): UsageDataPoint[] => {
    const today = new Date();
    return Array.from({ length: 30 }).map((_, i) => {
        const date = subDays(today, 29 - i);
        let anomaly: UsageDataPoint['anomaly'] | undefined = undefined;
        if (Math.random() < 0.05) anomaly = 'high_vibration';
        if (Math.random() < 0.03) anomaly = 'overheating';

        return {
            date: format(date, 'yyyy-MM-dd'),
            distance: 20 + Math.random() * 80,
            avgSpeed: 30 + Math.random() * 40,
            consumption: 15 + Math.random() * 10,
            anomaly: anomaly,
        };
    });
};

const generateHealthHistory = (): HealthHistoryEntry[] => {
  const today = new Date();
  return Array.from({ length: 30 }).map((_, i) => {
      const date = subDays(today, 29 - i);
      return {
          date: format(date, 'yyyy-MM-dd'),
          engine: 90 - i * 0.2 + Math.random() * 5,
          brakes: 95 - i * 0.3 + Math.random() * 8,
          battery: 98 - i * 0.1 + Math.random() * 4,
          suspension: 88 - i * 0.4 + Math.random() * 10,
          sensors: 99 - i * 0.05 + Math.random() * 2,
      };
  });
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

  const addVehicle = (data: Omit<Vehicle, 'id' | 'ownerId' | 'vin' | 'imageUrl' | 'imageHint' | 'healthStatus' | 'healthScore' | 'lastService' | 'nextServiceDue' | 'subsystemHealth' | 'predictedAlerts' | 'sensorData' | 'maintenanceHistory' | 'usageHistory' | 'healthHistory'>) => {
    const newVehicle: Vehicle = {
      ...data,
      id: `V${vehicles.length + 1001}`,
      ownerId: '3', // Default owner for now
      vin: `VIN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      imageUrl: `https://picsum.photos/seed/vehicle${vehicles.length + 1}/600/400`,
      imageHint: 'car',
      healthStatus: 'Good',
      healthScore: 95,
      lastService: new Date().toISOString().split('T')[0],
      nextServiceDue: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().split('T')[0],
      subsystemHealth: [
        { name: 'Engine', health: 98, anomalyProbability: 0.02 },
        { name: 'Brakes', health: 95, anomalyProbability: 0.05 },
        { name: 'Battery', health: 99, anomalyProbability: 0.01 },
        { name: 'Suspension', health: 92, anomalyProbability: 0.08 },
        { name: 'Sensors', health: 97, anomalyProbability: 0.03 },
      ],
      predictedAlerts: [
        { id: 'PA1', issue: 'Brake Pad Wear', priority: 'High', recommendation: 'Replace front brake pads within 2 weeks.', estimatedTime: '2 hours', estimatedCost: 8000, parts: [{ name: 'Brake Pads', cost: 6000 }], laborCost: 2000 },
        { id: 'PA2', issue: 'Battery Degradation', priority: 'Medium', recommendation: 'Voltage dropping. Test and potential replacement recommended at next service.', estimatedTime: '1 hour', estimatedCost: 12000, parts: [{ name: 'Battery', cost: 11000 }], laborCost: 1000 },
      ],
      sensorData: {
        engine_temp: 90, oil_level: 0.9, vibration: 5, tire_pressure: 32, battery_voltage: 12.6, fuel_level: 1,
      },
      maintenanceHistory: [],
      usageHistory: generateUsageHistory(),
      healthHistory: generateHealthHistory(),
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
