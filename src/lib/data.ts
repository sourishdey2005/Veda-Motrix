import type { User, Vehicle, ServiceCenter, Appointment, UebaEvent, CustomerFeedback } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Bot, CheckCircle, CircuitBoard, Factory, Settings } from 'lucide-react';

// A simple hashing function for demonstration. Do not use in production.
const simpleHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h.toString();
};

const avatar1 = PlaceHolderImages.find(img => img.id === 'avatar-1')?.imageUrl || '';
const avatar2 = PlaceHolderImages.find(img => img.id === 'avatar-2')?.imageUrl || '';
const avatar3 = PlaceHolderImages.find(img => img.id === 'avatar-3')?.imageUrl || '';

export const users: User[] = [
  { id: '1', name: 'Priya Sharma', email: 'manager@vedamotrix.ai', passwordHash: simpleHash('VEDA@123'), role: 'manager', avatarUrl: avatar1 },
  { id: '2', name: 'Amit Singh', email: 'service@vedamotrix.ai', passwordHash: simpleHash('SERVICE@123'), role: 'service-center', avatarUrl: avatar2 },
  { id: '3', name: 'Rohan Joshi', email: 'rohan.joshi@email.com', passwordHash: simpleHash('password123'), role: 'user', avatarUrl: avatar3 },
];

const vehicleImg1 = PlaceHolderImages.find(img => img.id === 'vehicle-1');
const vehicleImg2 = PlaceHolderImages.find(img => img.id === 'vehicle-2');
const vehicleImg3 = PlaceHolderImages.find(img => img.id === 'vehicle-3');

const indianMakes = ['Maruti Suzuki', 'Tata', 'Mahindra', 'Hyundai', 'Kia', 'Toyota', 'Honda', 'Skoda', 'Volkswagen', 'MG'];
const indianModels = ['Swift', 'Nexon', 'XUV700', 'Creta', 'Seltos', 'Innova', 'City', 'Kushaq', 'Virtus', 'Hector'];

export const vehicles: Vehicle[] = Array.from({ length: 10 }, (_, i) => {
  const healthStatus = i % 3 === 0 ? 'Critical' : i % 2 === 0 ? 'Warning' : 'Good';
  const selectedImg = i % 3 === 0 ? vehicleImg1 : i % 2 === 0 ? vehicleImg2 : vehicleImg3;
  return {
    id: `V${1001 + i}`,
    ownerId: '3', // All owned by Rohan Joshi for simplicity
    make: indianMakes[i],
    model: indianModels[i],
    year: 2020 + (i % 4),
    vin: `VIN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    imageUrl: selectedImg?.imageUrl || '',
    imageHint: selectedImg?.imageHint || 'car',
    healthStatus: healthStatus,
    sensorData: {
      engine_temp: 90 + Math.random() * 30 * (healthStatus === 'Critical' ? 1.2 : 1),
      oil_level: 0.5 + Math.random() * 0.5 * (healthStatus === 'Warning' ? 0.8 : 1),
      vibration: 5 + Math.random() * 15 * (healthStatus === 'Critical' ? 1.5 : 1),
      tire_pressure: 32 + (Math.random() - 0.5) * 5,
      battery_voltage: 12.5 + (Math.random() - 0.5),
      fuel_level: Math.random(),
    },
    maintenanceHistory: [
      { id: `M${i}1`, date: '2023-03-10', mileage: 12000 + i*1000, service: 'Engine Oil Change', notes: 'General check-up, all OK.' },
      { id: `M${i}2`, date: '2023-09-15', mileage: 21000 + i*1000, service: 'Air Filter Replacement', notes: 'Replaced air and cabin filters.' },
    ],
  };
});

export const serviceCenters: ServiceCenter[] = [
  { id: 'SC1', name: 'VedaMotrix Andheri', city: 'Mumbai', capacity: 15, availableSlots: ['09:30', '11:30', '14:30'] },
  { id: 'SC2', name: 'VedaMotrix Koramangala', city: 'Bengaluru', capacity: 12, availableSlots: ['10:00', '13:00', '16:00'] },
  { id: 'SC3', name: 'VedaMotrix Connaught Place', city: 'Delhi', capacity: 10, availableSlots: ['09:00', '11:00', '14:00', '17:00'] },
];

export const appointments: Appointment[] = [
  { id: 'A1', vehicleId: 'V1001', serviceCenterId: 'SC1', date: '2024-08-01', time: '09:30', status: 'Completed', notes: 'Diagnosed high engine temperature.' },
  { id: 'A2', vehicleId: 'V1002', serviceCenterId: 'SC2', date: '2024-08-02', time: '10:00', status: 'In Progress', notes: 'Investigating low oil pressure warning.' },
  { id: 'A3', vehicleId: 'V1003', serviceCenterId: 'SC3', date: '2024-08-03', time: '14:00', status: 'Booked', notes: 'Customer reports high vibration during braking.' },
];

export const uebaEvents: UebaEvent[] = [
  { id: 'UEBA1', agentId: 'Data Analysis Agent', action: 'Accessed V1005 sensor data', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), anomalyScore: 0.1, isAnomalous: false, explanation: 'Routine data access for health monitoring.' },
  { id: 'UEBA2', agentId: 'Diagnosis Agent', action: 'Predicted failure for V1005', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), anomalyScore: 0.2, isAnomalous: false, explanation: 'Standard diagnostic procedure following data analysis.' },
  { id: 'UEBA3', agentId: 'Scheduling Agent', action: 'Accessed all user calendars', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), anomalyScore: 0.9, isAnomalous: true, explanation: 'Unauthorized access to all user calendars. Expected access to a single user calendar for scheduling.' },
  { id: 'UEBA4', agentId: 'Customer Engagement Agent', action: 'Initiated contact with owner of V1005', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), anomalyScore: 0.1, isAnomalous: false, explanation: 'Normal follow-up action after failure prediction.' },
  { id: 'UEBA5', agentId: 'UEBA Security Agent', action: 'Flagged anomalous behavior from Scheduling Agent', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(), anomalyScore: 0.0, isAnomalous: false, explanation: 'Internal security action.' },
];

export const customerFeedbackData: CustomerFeedback[] = [
    { id: 'F1', userId: '3', vehicleId: 'V1001', rating: 5, comment: 'Excellent service at the Mumbai center. The staff was very courteous and explained everything clearly.', date: '2024-08-02' },
    { id: 'F2', userId: '3', vehicleId: 'V1004', rating: 3, comment: 'The service in Delhi took a bit longer than I was told. The car is fine now, but the wait was too long.', date: '2024-07-28' },
    { id: 'F3', userId: '3', vehicleId: 'V1007', rating: 4, comment: 'Good experience in Bengaluru. The lounge was clean and they fixed the issue promptly. Price was reasonable.', date: '2024-07-25' },
];

const indianCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'];
const components = ['Engine', 'Transmission', 'Suspension', 'Brakes', 'AC System'];
const topParts = ['Clutch', 'Brake Pad', 'Injector', 'Air Filter', 'Oil Filter'];

export const analyticsData = {
  kpis: {
    downtimeReduction: 12.5,
    predictionAccuracy: 88.2,
    fleetUtilization: 92.3,
    preventiveSavings: 1250000,
  },
  predictiveBreakdown: components.flatMap(component => 
    indianMakes.slice(0,5).map(model => ({
      component,
      model,
      probability: Math.random()
    }))
  ),
  maintenanceForecast: indianCities.map(city => ({
    city,
    demand: 50 + Math.floor(Math.random() * 100),
  })),
  serviceLoad: [
    { name: 'Mumbai SC', workload: 120, backlog: 15 },
    { name: 'Delhi SC', workload: 90, backlog: 25 },
    { name: 'Bengaluru SC', workload: 110, backlog: 10 },
  ],
  ageVsFailureRate: indianMakes.slice(0,3).flatMap(make => 
    Array.from({length: 5}, (_, i) => ({
      make,
      age: i + 1,
      failureRate: (i + 1) * 2 + Math.random() * 5,
      vehicleCount: 100 + Math.random() * 200,
    }))
  ),
  failureSeverity: [
    { name: 'Low', count: 120 },
    { name: 'Medium', count: 75 },
    { name: 'High', count: 40 },
    { name: 'Critical', count: 15 },
  ],
  partsReplacementTrend: ['January', 'February', 'March', 'April', 'May', 'June'].map(month => ({
    month,
    'Clutch': 50 + Math.random() * 20,
    'Brake Pad': 80 + Math.random() * 30,
    'Injector': 30 + Math.random() * 15,
  }))
};


// RCA / CAPA Analytics Data
const rcaMakes = ['Tata', 'Mahindra', 'Maruti'];
const rcaSuppliers = ['Bosch India', 'Minda Corp', 'Bharat Forge', 'Lumax', 'Uno Minda'];
const rcaComponents = ['ECU', 'Fuel Injector', 'ABS Module', 'Wiring Harness', 'Infotainment Unit'];

export const rcaCapaAnalyticsData = {
  rcaClusters: [
    { name: 'ECU_Software_Glitch', count: 25, make: 'Tata', x: 0.2, y: 0.3 },
    { name: 'Injector_Clogging', count: 40, make: 'Mahindra', x: 0.6, y: 0.7 },
    { name: 'Wiring_Harness_Short', count: 15, make: 'Maruti', x: 0.8, y: 0.2 },
    { name: 'ABS_Sensor_Failure', count: 30, make: 'Tata', x: 0.25, y: 0.35 },
    { name: 'Infotainment_Lag', count: 50, make: 'Mahindra', x: 0.65, y: 0.75 },
  ],
  defectRecurrence: Array.from({ length: 7 }, (_, i) => ({
    days: (i + 1) * 30,
    postCapa: 15 * Math.exp(-i * 0.4) + Math.random() * 2,
  })),
  capaEffectiveness: {
    successful: 82,
    failed: 18,
  },
  failureChain: [
    { stage: 'Root Cause', detail: 'Inconsistent torque specs on assembly line', icon: Settings },
    { stage: 'Sub-Cause', detail: 'Vibration loosens fuel line connector', icon: CircuitBoard },
    { stage: 'Effect', detail: 'Fuel leak reported by vehicle sensors', icon: Factory },
    { stage: 'Resolution', detail: 'CAPA #812 issued, torque wrenches recalibrated', icon: CheckCircle },
  ],
  supplierDefectCorrelation: rcaSuppliers.map(supplier => ({
    supplier,
    issues: rcaComponents.map(component => ({
      name: component,
      count: Math.floor(Math.random() * 20),
    })),
  })),
  designVulnerability: indianModels.slice(0, 5).map(model => ({
    model,
    riskScore: 20 + Math.random() * 70,
  })),
  aiRecommendations: [
    { issue: "Recurring coolant leak on Nexon EV", recommendation: "Investigate thermal expansion properties of hose connector material under high-voltage battery load.", confidence: 0.88 },
    { issue: "XUV700 infotainment screen freeze", recommendation: "Analyze memory allocation logs for potential overflow during multi-app usage. Suggest firmware patch.", confidence: 0.92 },
  ],
  assemblyLineRisk: Array.from({length: 5}, (_, i) => ({
      lotId: `PUNE-A${101+i}`,
      failureRate: 0.01 + Math.random() * 0.08
  })),
  componentImpact: rcaComponents.map(c => ({
      component: c,
      impactScore: 10 + Math.random() * 90,
  }))
};
