
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'manager' | 'service-center' | 'user';
  avatarUrl: string;
};

export type SubsystemHealth = {
  name: 'Engine' | 'Brakes' | 'Battery' | 'Suspension' | 'Sensors';
  health: number; // 0-100
  anomalyProbability: number; // 0-1
};

export type HealthHistoryEntry = {
    date: string;
    engine: number;
    brakes: number;
    battery: number;
    suspension: number;
    sensors: number;
}

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

export type PredictedAlert = {
    id: string;
    issue: string;
    priority: 'High' | 'Medium' | 'Low';
    recommendation: string;
    estimatedTime: string;
    estimatedCost: number;
    parts: { name: string; cost: number }[];
    laborCost: number;
};

export type UsageDataPoint = {
    date: string;
    distance: number;
    avgSpeed: number;
    consumption: number;
    anomaly?: 'high_vibration' | 'overheating';
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
  healthScore: number; // 0-100
  lastService: string;
  nextServiceDue: string;
  subsystemHealth: SubsystemHealth[];
  predictedAlerts: PredictedAlert[];
  sensorData: SensorData;
  maintenanceHistory: MaintenanceLog[];
  usageHistory: UsageDataPoint[];
  healthHistory: HealthHistoryEntry[];
};

export type ServiceCenter = {
  id: string;
  name:string;
  city: string;
  lat: number;
  lng: number;
  capacity: number;
  availableSlots: string[];
  rating: number;
  avgCompletionTime: number;
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

export type UebaEvent = {
  id: string;
  agentId: string;
  action: string;
  timestamp: string;
  anomalyScore: number;
  isAnomalous: boolean;
  explanation?: string;
};

export type CustomerFeedback = {
  id: string;
  userId: string;
  vehicleId: string;
  rating: number;
  comment: string;
  date: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
};
