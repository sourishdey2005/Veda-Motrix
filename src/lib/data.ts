import type { User, Vehicle, ServiceCenter, Appointment, UebaEvent, CustomerFeedback, Notification } from './types';
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

export const indianMakes = ['Hero', 'Mahindra', 'Tata', 'Maruti Suzuki'];
export const indianModels = ['Splendor', 'Xtreme', 'XUV700', 'Scorpio', 'Pleasure+', 'Thar', 'Passion', 'Jawa', 'Karizma', 'Bolero', 'Nexon', 'Harrier', 'Swift', 'Baleno'];
export const indianCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad'];

export const vehicles: Vehicle[] = Array.from({ length: 10 }, (_, i) => {
  const healthStatus = i % 3 === 0 ? 'Critical' : i % 2 === 0 ? 'Warning' : 'Good';
  const selectedImg = i % 3 === 0 ? vehicleImg1 : i % 2 === 0 ? vehicleImg2 : vehicleImg3;
  return {
    id: `V${1001 + i}`,
    ownerId: '3', // All owned by Rohan Joshi for simplicity
    make: indianMakes[i % indianMakes.length],
    model: indianModels[i % indianModels.length],
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

export const allVehicles = vehicles;

export const serviceCenters: ServiceCenter[] = [
  { id: 'SC1', name: 'VedaMotrix Andheri', city: 'Mumbai', capacity: 15, availableSlots: ['09:30', '11:30', '14:30'], rating: 4.8, avgCompletionTime: 2.5 },
  { id: 'SC2', name: 'VedaMotrix Koramangala', city: 'Bengaluru', capacity: 12, availableSlots: ['10:00', '13:00', '16:00'], rating: 4.6, avgCompletionTime: 3.1 },
  { id: 'SC3', name: 'VedaMotrix Connaught Place', city: 'Delhi', capacity: 10, availableSlots: ['09:00', '11:00', '14:00', '17:00'], rating: 4.7, avgCompletionTime: 2.8 },
  { id: 'SC4', name: 'VedaMotrix T. Nagar', city: 'Chennai', capacity: 8, availableSlots: ['10:30', '14:30'], rating: 4.5, avgCompletionTime: 3.5 },
  { id: 'SC5', name: 'VedaMotrix Park Street', city: 'Kolkata', capacity: 9, availableSlots: ['09:00', '12:00', '15:00'], rating: 4.6, avgCompletionTime: 3.2 },
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

export const notifications: Notification[] = [
  { id: 'N1', title: 'Critical Alert: V1003', description: 'Engine vibration has exceeded critical threshold. Immediate inspection recommended.', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: 'N2', title: 'Agent Anomaly Detected', description: 'Scheduling Agent attempted unauthorized access. Action was blocked.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'N3', title: 'New Feedback Received', description: 'A 5-star review was submitted for service at Mumbai SC.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

const components = ['Engine', 'Transmission', 'Suspension', 'Brakes', 'AC System'];

export const analyticsData = {
  kpis: {
    downtimeReduction: 12.5,
    predictionAccuracy: 88.2,
    fleetUtilization: 92.3,
    preventiveSavings: 1250000,
  },
  predictiveBreakdown: components.flatMap(component => 
    indianMakes.map(model => ({
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
  ageVsFailureRate: indianMakes.flatMap(make => 
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

const rcaSuppliers = ['Bosch India', 'Minda Corp', 'Bharat Forge', 'Lumax', 'Uno Minda'];
const rcaComponents = ['ECU', 'Fuel Injector', 'ABS Module', 'Wiring Harness', 'Infotainment Unit'];

export const rcaCapaAnalyticsData = {
  rcaClusters: [
    { name: 'ECU_Software_Glitch', count: 25, make: 'Hero', x: 0.2, y: 0.3 },
    { name: 'Injector_Clogging', count: 40, make: 'Mahindra', x: 0.6, y: 0.7 },
    { name: 'Wiring_Harness_Short', count: 15, make: 'Hero', x: 0.8, y: 0.2 },
    { name: 'ABS_Sensor_Failure', count: 30, make: 'Hero', x: 0.25, y: 0.35 },
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
  designVulnerability: indianModels.slice(0, 5).map((model, i) => ({
    model: `${indianMakes[i % 2]} ${model}`,
    riskScore: 20 + Math.random() * 70,
  })),
  aiRecommendations: [
    { issue: "Recurring coolant leak on Hero Xtreme", recommendation: "Investigate thermal expansion properties of hose connector material under high-load.", confidence: 0.88 },
    { issue: "Mahindra XUV700 screen freeze", recommendation: "Analyze memory allocation logs for potential overflow. Suggest firmware patch.", confidence: 0.92 },
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


export const executiveAnalyticsData = {
  aiRoi: {
    costSavings: 1500000,
    timeSavings: 25,
    breakdownReduction: 18,
  },
  regionalPerformance: indianCities.map(city => ({
    city,
    efficiency: 75 + Math.random() * 25,
    uptime: 90 + Math.random() * 10,
  })),
  policyCompliance: [
    { center: "Mumbai SC", score: 95 },
    { center: "Bengaluru SC", score: 88 },
    { center: "Delhi SC", score: 92 },
  ],
  innovationOpportunities: [
    { area: "Battery Technology", impact: 8, feasibility: 7, suggestion: "Focus on improving battery chemistry for longer life and faster charging, based on high warranty claims for battery degradation." },
    { area: "Predictive UI/UX", impact: 6, feasibility: 9, suggestion: "Develop more intuitive in-car alerts for predicted failures. Current alerts have a low user response rate." },
  ],
  maintenanceRatio: [
    { month: "Jan", predictive: 20, reactive: 80 },
    { month: "Feb", predictive: 25, reactive: 75 },
    { month: "Mar", predictive: 35, reactive: 65 },
    { month: "Apr", predictive: 50, reactive: 50 },
    { month: "May", predictive: 65, reactive: 35 },
    { month: "Jun", predictive: 70, reactive: 30 },
  ],
  warrantyCost: [
    { month: "Jan", beforeAI: 500000, afterAI: 450000 },
    { month: "Feb", beforeAI: 520000, afterAI: 430000 },
    { month: "Mar", beforeAI: 480000, afterAI: 380000 },
    { month: "Apr", beforeAI: 550000, afterAI: 350000 },
    { month: "May", beforeAI: 530000, afterAI: 320000 },
    { month: "Jun", beforeAI: 580000, afterAI: 300000 },
  ],
  rulPrediction: indianModels.map((model, i) => ({
    model: `${indianMakes[i % indianMakes.length]} ${model}`,
    rul: 3.5 + Math.random() * 4,
  })),
  detectionRate: 85.4,
  sri: 91.3,
};

export const customerExperienceData = {
  sentimentScore: 8.2,
  appointmentDeclineRate: 15,
  voiceInteractionSuccess: 78,
  feedbackToActionRatio: 45,
  retentionProbability: 85,
  networkUtilization: 88,
  responseTime: indianCities.map(city => ({
    city,
    predictionToAppointment: Math.random() * 3 + 1, // 1-4 days
    appointmentToRepair: Math.random() * 2 + 0.5, // 0.5-2.5 days
  })),
  userEngagement: [
    { metric: 'Avg. App Opens/Wk', value: 4.5 },
    { metric: 'Avg. Chat Interactions/Mo', value: 2.1 },
    { metric: 'Avg. Voice Interactions/Mo', value: 0.8 },
  ],
  complaintRecurrence: [
    { issue: "Brake Noise", count: 12, users: 8 },
    { issue: "Infotainment Lag", count: 9, users: 7 },
    { issue: "AC Cooling", count: 7, users: 5 },
  ]
};
