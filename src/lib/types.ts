





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
  serviceCenterId: string;
  cost: number;
  rating?: number;
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
    consumption: number; // L/100km
    anomaly?: 'high_vibration' | 'overheating';
};

export type PredictiveInsight = {
  id: string;
  title: string;
  shortDescription: string;
  detailedExplanation: string;
  recommendedAction: string;
  urgency: 'High' | 'Medium' | 'Low';
};

export type EnvironmentalData = {
  fuelEfficiencyTrend: { month: string; efficiency: number }[];
  carbonFootprint: {
    current: number; // in g CO2/km
    reduction: number; // in g CO2/km
  };
  ecoBadges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
  }[];
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
  predictiveInsights: PredictiveInsight[];
  environmentalData?: EnvironmentalData;
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

export type TechnicianPerformance = {
    vehiclesServicedToday: number;
    skillProficiency: {
        skill: 'Engine' | 'Brakes' | 'Electrical' | 'Diagnostics';
        score: number; // 0-100
    }[];
    avgTurnaround: {
        issueType: string;
        time: number; // in hours
    }[];
};

export type Technician = {
    id: string;
    name: string;
    specialty: string;
    serviceCenterId: string;
    performance: TechnicianPerformance;
}

export type AppointmentStatus = 'Pending' | 'In Service' | 'Awaiting Parts' | 'Completed';

export type Appointment = {
  id: string;
  vehicleId: string;
  serviceCenterId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  technicianId?: string;
  estimatedTime: number; // hours
  stageProgress?: number; // 0-100
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

export type LiveQueueVehicle = {
  id: string;
  model: string;
  stage: 'In Service' | 'Diagnosis' | 'Ready for Pickup';
};

export type WorkloadForecastData = {
    date: string;
    predictedJobs: number;
};

export type InventoryPart = {
    id: string;
    name: string;
    inStock: number;
    avgUsePerWeek: number;
    reorderLevel: number;
    predictedShortageDate: string;
};

export type PartConsumptionTrend = {
    part: string;
    change: number;
};
