export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'manager' | 'service-center' | 'user';
  avatarUrl: string;
};

export type SensorData = {
  engine_temp: number;
  oil_level: number;
  vibration: number;
  tire_pressure: number;
  battery_voltage: number;
  fuel_level: number;
};

export type MaintenanceLog = {
  id: string;
  date: string;
  mileage: number;
  service: string;
  notes: string;
};

export type Vehicle = {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  imageUrl: string;
  imageHint: string;
  healthStatus: 'Good' | 'Warning' | 'Critical';
  sensorData: SensorData;
  maintenanceHistory: MaintenanceLog[];
};

export type ServiceCenter = {
  id: string;
  name: string;
  city: string;
  capacity: number;
  availableSlots: string[];
};

export type Appointment = {
  id: string;
  vehicleId: string;
  serviceCenterId: string;
  date: string;
  time: string;
  status: 'Booked' | 'In Progress' | 'Completed' | 'Cancelled';
  notes: string;
};

export type CapaRcaEntry = {
  id: string;
  component: string;
  issuePattern: string;
  suggestion: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export type UebaEvent = {
  id: string;
  agentId: string;
  action: string;
  timestamp: string;
  anomalyScore: number;
  isAnomalous: boolean;
};

export type CustomerFeedback = {
  id: string;
  userId: string;
  vehicleId: string;
  rating: number;
  comment: string;
  date: string;
};
