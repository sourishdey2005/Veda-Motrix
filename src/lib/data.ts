



import type { User, Vehicle, ServiceCenter, Appointment, UebaEvent, CustomerFeedback, Notification, UsageDataPoint, HealthHistoryEntry, MaintenanceLog, PredictedAlert, PredictiveInsight, EnvironmentalData, Technician, TechnicianPerformance, LiveQueueVehicle, WorkloadForecastData, InventoryPart, PartConsumptionTrend, RootCauseData, CorrelationMatrix, ServiceDurationData, RepairCostData, PartLifecycleData, AnomalyTimelineDataPoint, RepairComplexityData, FirstTimeFixRateData, AiConfidenceData, CenterBenchmarkData, PartReliabilityData, TimeOfDayLoadData, ServiceDelayReason, DiagnosisAccuracyData, CustomerLifetimeValueData, FailurePattern, LoadBalancingSuggestion, CapaItem, WhatIfScenario } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Bot, CheckCircle, CircuitBoard, Factory, Settings } from 'lucide-react';
import { subDays, format, addDays } from 'date-fns';

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

export const indianMakes = ['Mahindra', 'Hero'];

const mahindraVehicles = [
    { make: 'Mahindra', model: 'Thar' },
    { make: 'Mahindra', model: 'Scorpio' },
    { make: 'Mahindra', model: 'Scorpio-N' },
    { make: 'Mahindra', model: 'Bolero' },
    { make: 'Mahindra', model: 'Bolero Neo' },
    { make: 'Mahindra', model: 'XUV300' },
    { make: 'Mahindra', model: 'XUV400 EV' },
    { make: 'Mahindra', model: 'XUV500' },
    { make: 'Mahindra', model: 'XUV700' },
    { make: 'Mahindra', model: 'Marazzo' },
    { make: 'Mahindra', model: 'TUV300' },
    { make: 'Mahindra', model: 'KUV100 NXT' },
    { make: 'Mahindra', model: 'Alturas G4' },
    { make: 'Mahindra', model: 'Verito' },
    { make: 'Mahindra', model: 'Verito Vibe' },
    { make: 'Mahindra', model: 'eVerito' },
    { make: 'Mahindra', model: 'e2o Plus' },
    { make: 'Mahindra', model: 'Jeeto' },
    { make: 'Mahindra', model: 'Supro Van' },
    { make: 'Mahindra', model: 'Supro Maxitruck' },
    { make: 'Mahindra', model: 'Bolero Pik-Up' },
    { make: 'Mahindra', model: 'Imperio' },
    { make: 'Mahindra', model: 'Furio' },
    { make: 'Mahindra', model: 'Blazo X' },
    { make: 'Mahindra', model: 'Treo' },
];

const heroVehicles = [
    { make: 'Hero', model: 'Splendor Plus' },
    { make: 'Hero', model: 'HF Deluxe' },
    { make: 'Hero', model: 'Passion Pro' },
    { make: 'Hero', model: 'Glamour' },
    { make: 'Hero', model: 'Super Splendor' },
    { make: 'Hero', model: 'Xtreme 160R' },
    { make: 'Hero', model: 'Xtreme 200S' },
    { make: 'Hero', model: 'Xpulse 200' },
    { make: 'Hero', model: 'Xpulse 200 4V' },
    { make: 'Hero', model: 'Hunk 150R' },
    { make: 'Hero', model: 'Achiever 150' },
    { make: 'Hero', model: 'Karizma XMR' },
    { make: 'Hero', model: 'CBZ' },
    { make: 'Hero', model: 'Ignitor' },
    { make: 'Hero', model: 'Maestro Edge' },
    { make: 'Hero', model: 'Pleasure Plus' },
    { make: 'Hero', model: 'Destini 125' },
    { make: 'Hero', model: 'Maestro Xoom 110' },
    { make: 'Hero', model: 'Duet' },
    { make: 'Hero', model: 'Vida V1' },
    { make: 'Hero', model: 'HF 100' },
    { make: 'Hero', model: 'Passion XPro' },
    { make: 'Hero', model: 'Splendor iSmart' },
    { make: 'Hero', model: 'Glamour Xtec' },
    { make: 'Hero', model: 'Mavrick 440' },
];

export const indianModels = [...mahindraVehicles, ...heroVehicles];


export const indianCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Noida'];


export const serviceCenters: ServiceCenter[] = [
  { id: 'SC1', name: 'VedaMotrix Andheri', city: 'Mumbai', lat: 19.119, lng: 72.847, capacity: 15, availableSlots: ['09:30', '11:30', '14:30'], rating: 4.8, avgCompletionTime: 2.5, workload: 80, delayIndex: 1.1 },
  { id: 'SC2', name: 'VedaMotrix Koramangala', city: 'Bengaluru', lat: 12.935, lng: 77.624, capacity: 12, availableSlots: ['10:00', '13:00', '16:00'], rating: 4.6, avgCompletionTime: 3.1, workload: 92, delayIndex: 1.4 },
  { id: 'SC3', name: 'VedaMotrix Connaught Place', city: 'Delhi', lat: 28.632, lng: 77.219, capacity: 10, availableSlots: ['09:00', '11:00', '14:00', '17:00'], rating: 4.7, avgCompletionTime: 2.8, workload: 75, delayIndex: 0.9 },
  { id: 'SC4', name: 'VedaMotrix T. Nagar', city: 'Chennai', lat: 13.04, lng: 80.23, capacity: 8, availableSlots: ['10:30', '14:30'], rating: 4.5, avgCompletionTime: 3.5, workload: 65, delayIndex: 1.0 },
  { id: 'SC5', name: 'VedaMotrix Park Street', city: 'Kolkata', lat: 22.55, lng: 88.35, capacity: 9, availableSlots: ['09:00', '12:00', '15:00'], rating: 4.6, avgCompletionTime: 3.2, workload: 85, delayIndex: 1.2 },
  { id: 'SC6', name: 'VedaMotrix Deccan', city: 'Pune', lat: 18.52, lng: 73.85, capacity: 14, availableSlots: ['09:00', '12:30', '15:30'], rating: 4.9, avgCompletionTime: 2.2, workload: 78, delayIndex: 0.8 },
  { id: 'SC7', name: 'VedaMotrix Jubilee Hills', city: 'Hyderabad', lat: 17.43, lng: 78.4, capacity: 11, availableSlots: ['10:00', '13:30', '16:30'], rating: 4.7, avgCompletionTime: 2.9, workload: 88, delayIndex: 1.1 },
  { id: 'SC8', name: 'VedaMotrix SG Highway', city: 'Ahmedabad', lat: 23.02, lng: 72.57, capacity: 10, availableSlots: ['09:30', '11:30', '14:30'], rating: 4.5, avgCompletionTime: 3.0, workload: 70, delayIndex: 1.0 },
  { id: 'SC9', name: 'VedaMotrix C-Scheme', city: 'Jaipur', lat: 26.91, lng: 75.78, capacity: 7, availableSlots: ['10:00', '14:00'], rating: 4.4, avgCompletionTime: 3.4, workload: 60, delayIndex: 1.3 },
  { id: 'SC10', name: 'VedaMotrix Gomti Nagar', city: 'Lucknow', lat: 26.84, lng: 80.94, capacity: 8, availableSlots: ['09:00', '11:00', '15:00'], rating: 4.6, avgCompletionTime: 2.9, workload: 82, delayIndex: 1.0 },
  { id: 'SC11', name: 'VedaMotrix The Mall', city: 'Kanpur', lat: 26.47, lng: 80.35, capacity: 6, availableSlots: ['10:00', '13:00'], rating: 4.3, avgCompletionTime: 3.6, workload: 95, delayIndex: 1.6 },
  { id: 'SC12', name: 'VedaMotrix Sitabuldi', city: 'Nagpur', lat: 21.14, lng: 79.08, capacity: 7, availableSlots: ['09:30', '12:30', '15:30'], rating: 4.5, avgCompletionTime: 3.1, workload: 77, delayIndex: 0.9 },
  { id: 'SC13', name: 'VedaMotrix Vijay Nagar', city: 'Indore', lat: 22.71, lng: 75.85, capacity: 9, availableSlots: ['10:00', '13:00', '16:00'], rating: 4.8, avgCompletionTime: 2.6, workload: 81, delayIndex: 0.8 },
  { id: 'SC14', name: 'VedaMotrix Wagle Estate', city: 'Thane', lat: 19.19, lng: 72.96, capacity: 10, availableSlots: ['09:00', '11:30', '14:30', '16:30'], rating: 4.6, avgCompletionTime: 2.7, workload: 85, delayIndex: 1.1 },
  { id: 'SC15', name: 'VedaMotrix MP Nagar', city: 'Bhopal', lat: 23.23, lng: 77.41, capacity: 6, availableSlots: ['10:00', '14:00'], rating: 4.2, avgCompletionTime: 3.8, workload: 68, delayIndex: 1.2 },
  { id: 'SC16', name: 'VedaMotrix Dwaraka Nagar', city: 'Visakhapatnam', lat: 17.72, lng: 83.3, capacity: 7, availableSlots: ['09:30', '13:30'], rating: 4.5, avgCompletionTime: 3.3, workload: 72, delayIndex: 1.0 },
  { id: 'SC17', name: 'VedaMotrix Boring Road', city: 'Patna', lat: 25.6, lng: 85.12, capacity: 5, availableSlots: ['10:00', '14:30'], rating: 4.1, avgCompletionTime: 4.0, workload: 90, delayIndex: 1.5 },
  { id: 'SC18', name: 'VedaMotrix Alkapuri', city: 'Vadodara', lat: 22.3, lng: 73.18, capacity: 8, availableSlots: ['09:00', '12:00', '15:00'], rating: 4.6, avgCompletionTime: 2.9, workload: 79, delayIndex: 0.9 },
  { id: 'SC19', name: 'VedaMotrix Indirapuram', city: 'Ghaziabad', lat: 28.63, lng: 77.37, capacity: 9, availableSlots: ['10:00', '13:00', '16:00'], rating: 4.4, avgCompletionTime: 3.1, workload: 84, delayIndex: 1.2 },
  { id: 'SC20', name: 'VedaMotrix Feroze Gandhi Mkt', city: 'Ludhiana', lat: 30.9, lng: 75.85, capacity: 7, availableSlots: ['09:30', '12:30', '15:30'], rating: 4.5, avgCompletionTime: 3.2, workload: 76, delayIndex: 1.0 },
  { id: 'SC21', name: 'VedaMotrix Fatehabad Road', city: 'Agra', lat: 27.16, lng: 78.04, capacity: 6, availableSlots: ['10:00', '14:00'], rating: 4.3, avgCompletionTime: 3.5, workload: 65, delayIndex: 1.1 },
  { id: 'SC22', name: 'VedaMotrix College Road', city: 'Nashik', lat: 20.0, lng: 73.78, capacity: 8, availableSlots: ['09:00', '11:30', '15:00'], rating: 4.7, avgCompletionTime: 2.8, workload: 80, delayIndex: 0.9 },
  { id: 'SC23', name: 'VedaMotrix Sector 18', city: 'Noida', lat: 28.57, lng: 77.32, capacity: 12, availableSlots: ['09:00', '12:00', '15:00', '17:00'], rating: 4.8, avgCompletionTime: 2.4, workload: 89, delayIndex: 1.0 },
  { id: 'SC24', name: 'VedaMotrix Elante', city: 'Chandigarh', lat: 30.7, lng: 76.79, capacity: 10, availableSlots: ['10:00', '13:00', '16:00'], rating: 4.7, avgCompletionTime: 2.7, workload: 83, delayIndex: 0.9 },
  { id: 'SC25', name: 'VedaMotrix G.S. Road', city: 'Guwahati', lat: 26.14, lng: 91.79, capacity: 6, availableSlots: ['09:30', '13:30'], rating: 4.4, avgCompletionTime: 3.3, workload: 71, delayIndex: 1.1 },
];

const generateTechnicianPerformance = (): TechnicianPerformance => ({
    vehiclesServicedToday: 3 + Math.floor(Math.random() * 4),
    skillProficiency: [
        { skill: 'Engine', score: 70 + Math.random() * 30 },
        { skill: 'Brakes', score: 65 + Math.random() * 35 },
        { skill: 'Electrical', score: 80 + Math.random() * 20 },
        { skill: 'Diagnostics', score: 85 + Math.random() * 15 },
    ],
    avgTurnaround: [
        { issueType: 'General Service', time: 2 + Math.random() * 1 },
        { issueType: 'Engine Repair', time: 6 + Math.random() * 4 },
        { issueType: 'Brake Work', time: 3 + Math.random() * 1.5 },
    ],
    satisfaction: 90 + Math.random() * 10,
    experience: 2 + Math.random() * 8, // years
});

export const technicians: Technician[] = [
    { id: 'T1', name: 'Sanjay Kumar', specialty: 'Engine', serviceCenterId: 'SC1', performance: generateTechnicianPerformance() },
    { id: 'T2', name: 'Rajesh Sharma', specialty: 'Electronics', serviceCenterId: 'SC1', performance: generateTechnicianPerformance() },
    { id: 'T3', name: 'Vijay Singh', specialty: 'General', serviceCenterId: 'SC1', performance: generateTechnicianPerformance() },
    { id: 'T4', name: 'Anil Mehta', specialty: 'Suspension', serviceCenterId: 'SC2', performance: generateTechnicianPerformance() },
    { id: 'T5', name: 'Prakash Rao', specialty: 'General', serviceCenterId: 'SC2', performance: generateTechnicianPerformance() },
    { id: 'T6', name: 'Deepak Verma', specialty: 'Engine', serviceCenterId: 'SC3', performance: generateTechnicianPerformance() },
    { id: 'T7', name: 'Arun Gupta', specialty: 'Brakes', serviceCenterId: 'SC1', performance: generateTechnicianPerformance() },
    { id: 'T8', name: 'Manoj Patel', specialty: 'General', serviceCenterId: 'SC3', performance: generateTechnicianPerformance() },
    { id: 'T9', name: 'Ravi Reddy', specialty: 'Electronics', serviceCenterId: 'SC4', performance: generateTechnicianPerformance() },
    { id: 'T10', name: 'Sunil Yadav', specialty: 'Engine', serviceCenterId: 'SC4', performance: generateTechnicianPerformance() },
    { id: 'T11', name: 'Girish Jain', specialty: 'General', serviceCenterId: 'SC5', performance: generateTechnicianPerformance() },
    { id: 'T12', name: 'Hari Prasad', specialty: 'Brakes', serviceCenterId: 'SC6', performance: generateTechnicianPerformance() },
    { id: 'T13', name: 'Irfan Khan', specialty: 'Suspension', serviceCenterId: 'SC7', performance: generateTechnicianPerformance() },
    { id: 'T14', name: 'Jitendra Soni', specialty: 'Electronics', serviceCenterId: 'SC8', performance: generateTechnicianPerformance() },
    { id: 'T15', name: 'Kamal Nath', specialty: 'Engine', serviceCenterId: 'SC9', performance: generateTechnicianPerformance() },
];

const generateMaintenanceHistory = (vehicleIndex: number): MaintenanceLog[] => {
    const history: MaintenanceLog[] = [
        { id: `M${vehicleIndex}1`, date: '2023-03-10', mileage: 12000 + vehicleIndex*1000, service: 'Engine Oil Change', notes: 'General check-up, all OK. Replaced oil filter and topped up fluids.', serviceCenterId: `SC${(vehicleIndex % 10) + 1}`, cost: 4500, rating: 5 },
        { id: `M${vehicleIndex}2`, date: '2023-09-15', mileage: 21000 + vehicleIndex*1000, service: 'Air Filter Replacement', notes: 'Replaced air and cabin filters. Cleaned throttle body.', serviceCenterId: `SC${(vehicleIndex % 10) + 2}`, cost: 2500, rating: 4 },
        { id: `M${vehicleIndex}3`, date: '2024-02-20', mileage: 30500 + vehicleIndex*1000, service: 'Brake Pad Replacement', notes: 'Front brake pads replaced. Fluid topped up. Customer reported slight shudder, but not reproducible.', serviceCenterId: `SC${(vehicleIndex % 10) + 1}`, cost: 7800 },
    ];
    return history;
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
            consumption: 5 + Math.random() * 5, // L/100km
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

const generatePredictedAlerts = (): PredictedAlert[] => [
    { id: 'PA1', issue: 'Brake Pad Wear', priority: 'High', recommendation: 'Replace front brake pads within 2 weeks.', estimatedTime: '2 hours', estimatedCost: 8000, parts: [{ name: 'Brake Pads', cost: 6000 }], laborCost: 2000 },
    { id: 'PA2', issue: 'Battery Degradation', priority: 'Medium', recommendation: 'Voltage dropping. Test and potential replacement recommended at next service.', estimatedTime: '1 hour', estimatedCost: 12000, parts: [{ name: 'Battery', cost: 11000 }], laborCost: 1000 },
    { id: 'PA3', issue: 'Tire Pressure Imbalance', priority: 'Low', recommendation: 'Check and adjust tire pressures. Monitor for slow leaks.', estimatedTime: '15 mins', estimatedCost: 200, parts: [], laborCost: 200 },
];

const generatePredictiveInsights = (): PredictiveInsight[] => [
  {
    id: 'PI1',
    title: 'Brake Pad Wear',
    shortDescription: 'Brake pads likely to wear out in the next 500 km.',
    detailedExplanation: 'Our AI has detected a pattern of increased brake pedal travel and minor vibrations consistent with thinning brake pads. This is a critical safety component.',
    recommendedAction: 'Schedule a brake inspection and replacement now to ensure safety.',
    urgency: 'High',
  },
  {
    id: 'PI2',
    title: 'Battery Health',
    shortDescription: 'Battery voltage fluctuations detected.',
    detailedExplanation: 'The battery is showing inconsistent voltage readings, especially during engine start-up. This could lead to a no-start situation, particularly in colder weather.',
    recommendedAction: 'Recommend a battery check-up at your next service appointment.',
    urgency: 'Medium',
  },
  {
    id: 'PI3',
    title: 'Fuel Efficiency',
    shortDescription: 'Fuel consumption is 15% higher than average.',
    detailedExplanation: 'Your recent driving patterns show a higher-than-normal fuel consumption rate. This could be due to factors like tire pressure, a dirty air filter, or driving style.',
    recommendedAction: 'Check tire pressure and consider a general tune-up to improve mileage.',
    urgency: 'Low',
  }
];

const generateEnvironmentalData = (): EnvironmentalData => ({
  fuelEfficiencyTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({
    month,
    efficiency: 14 + Math.random() * 4 - i * 0.3, // km/L
  })),
  carbonFootprint: {
    current: 135, // g/km
    reduction: 12, // g/km
  },
  ecoBadges: [
    { id: 'B1', name: 'Eco Driver', description: 'Maintained optimal fuel efficiency for a month.', icon: 'leaf', earned: true },
    { id: 'B2', name: 'Smooth Operator', description: 'Consistently low harsh acceleration/braking events.', icon: 'feather', earned: true },
    { id: 'B3', name: 'Green Commuter', description: 'Completed 500km with above-average efficiency.', icon: 'award', earned: false },
    { id: 'B4', name: 'Carbon Saver', description: 'Saved 50kg of CO2 through proactive maintenance.', icon: 'shield', earned: false },
  ]
});

export const predictedIssues = [
  { issue: 'Brake Pad Wear', risk: 'High' },
  { issue: 'Battery Degradation', risk: 'Medium' },
  { issue: 'Oil Level Low', risk: 'Medium' },
  { issue: 'Tire Pressure Imbalance', risk: 'Low' },
  { issue: 'Suspension Weakness', risk: 'High' },
  { issue: 'ECU Anomaly', risk: 'Critical' },
  { issue: 'Air Filter Clogged', risk: 'Low' },
  { issue: 'Coolant Level Low', risk: 'Medium' },
];

export const vehicles: Vehicle[] = indianModels.map((vehicleInfo, i) => {
  const healthStatus = i % 5 === 0 ? 'Critical' : i % 3 === 0 ? 'Warning' : 'Good';
  const healthScore = healthStatus === 'Critical' ? 30 + Math.random() * 20 : healthStatus === 'Warning' ? 60 + Math.random() * 20 : 85 + Math.random() * 15;
  const selectedImg = i % 3 === 0 ? vehicleImg1 : i % 2 === 0 ? vehicleImg2 : vehicleImg3;

  return {
    id: `V${1001 + i}`,
    ownerId: '3', // All owned by Rohan Joshi for simplicity
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: 2020 + (i % 5),
    vin: `VIN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    imageUrl: selectedImg?.imageUrl || '',
    imageHint: selectedImg?.imageHint || 'car',
    healthStatus: healthStatus,
    healthScore: healthScore,
    lastService: `2024-0${1+i%5}-15`,
    nextServiceDue: `2024-10-${15+i%10}`,
    subsystemHealth: [
      { name: 'Engine', health: 80 + Math.random() * 20, anomalyProbability: Math.random() * 0.1 },
      { name: 'Brakes', health: 70 + Math.random() * 30, anomalyProbability: Math.random() * 0.2 },
      { name: 'Battery', health: 90 + Math.random() * 10, anomalyProbability: Math.random() * 0.05 },
      { name: 'Suspension', health: 60 + Math.random() * 40, anomalyProbability: Math.random() * 0.3 },
      { name: 'Sensors', health: 95 + Math.random() * 5, anomalyProbability: Math.random() * 0.02 },
    ],
    predictedAlerts: generatePredictedAlerts(),
    sensorData: {
      engine_temp: 90 + Math.random() * 30 * (healthStatus === 'Critical' ? 1.2 : 1),
      oil_level: 0.5 + Math.random() * 0.5 * (healthStatus === 'Warning' ? 0.8 : 1),
      vibration: 5 + Math.random() * 15 * (healthStatus === 'Critical' ? 1.5 : 1),
      tire_pressure: 32 + (Math.random() - 0.5) * 5,
      battery_voltage: 12.5 + (Math.random() - 0.5),
      fuel_level: Math.random(),
    },
    maintenanceHistory: generateMaintenanceHistory(i),
    usageHistory: generateUsageHistory(),
    healthHistory: generateHealthHistory(),
    predictiveInsights: generatePredictiveInsights(),
    environmentalData: generateEnvironmentalData(),
  };
});

export const allVehicles = vehicles;

export const appointments: Appointment[] = Array.from({ length: 50 }, (_, i) => {
    const statuses: AppointmentStatus[] = ['Pending', 'In Service', 'Awaiting Parts', 'Completed'];
    const vehicle = vehicles[i % vehicles.length];
    const serviceCenter = serviceCenters[i % serviceCenters.length];
    const technician = technicians[i % technicians.length];

    return {
        id: `A${i + 1}`,
        vehicleId: vehicle.id,
        serviceCenterId: serviceCenter.id,
        date: format(addDays(new Date(), i - 15), 'yyyy-MM-dd'),
        time: `${9 + (i % 8)}:30`,
        status: statuses[i % statuses.length],
        notes: `Diagnosing issue for ${vehicle.make} ${vehicle.model}. Customer reported unusual noise.`,
        technicianId: technician.id,
        estimatedTime: 2 + Math.random() * 3,
        stageProgress: Math.random() * 100,
    };
});


export const uebaEvents: UebaEvent[] = [
  { id: 'UEBA1', agentId: 'Data Analysis Agent', action: 'Accessed V1005 sensor data', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), anomalyScore: 0.1, isAnomalous: false, explanation: 'Routine data access for health monitoring.' },
  { id: 'UEBA2', agentId: 'Diagnosis Agent', action: 'Predicted failure for V1005', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), anomalyScore: 0.2, isAnomalous: false, explanation: 'Standard diagnostic procedure following data analysis.' },
  { id: 'UEBA3', agentId: 'Scheduling Agent', action: 'Accessed all user calendars', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), anomalyScore: 0.9, isAnomalous: true, explanation: 'Unauthorized access to all user calendars. Expected access to a single user calendar for scheduling.' },
  { id: 'UEBA4', agentId: 'Customer Engagement Agent', action: 'Initiated contact with owner of V1005', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), anomalyScore: 0.1, isAnomalous: false, explanation: 'Normal follow-up action after failure prediction.' },
  { id: 'UEBA5', agentId: 'UEBA Security Agent', action: 'Flagged anomalous behavior from Scheduling Agent', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(), anomalyScore: 0.0, isAnomalous: false, explanation: 'Internal security action.' },
];

export const customerFeedbackData: CustomerFeedback[] = [
    { 
        id: 'F1', 
        userId: '3', 
        vehicleId: 'V1001', 
        rating: 5, 
        comment: 'Exceptional service at the Mumbai Andheri center. My car feels brand new. The AI prediction for the brake pads was spot on and saved me from a bigger issue. Staff was very professional.', 
        date: '2024-08-02',
        analysis: {
            sentiment: 'Very Positive',
            keyAreas: 'Service Quality, Predictive Accuracy, Staff Professionalism',
            suggestions: 'Highlight the predictive maintenance success in marketing materials.'
        }
    },
    { 
        id: 'F2', 
        userId: '3', 
        vehicleId: 'V1004', 
        rating: 2, 
        comment: 'The service in Delhi was a nightmare. It took them three days for a standard service, and the final bill was much higher than the initial estimate. The problem I came for is still not fully resolved.', 
        date: '2024-07-28',
        analysis: {
            sentiment: 'Very Negative',
            keyAreas: 'Service Time, Billing Transparency, Issue Resolution',
            suggestions: 'Investigate the delay and billing discrepancy. Follow up with the customer to resolve the outstanding issue.'
        }
    },
    { 
        id: 'F3', 
        userId: '3', 
        vehicleId: 'V1007', 
        rating: 4, 
        comment: 'Good experience in Bengaluru. The lounge was clean and comfortable. They fixed the electrical issue promptly. I only wish they had communicated the status more proactively.', 
        date: '2024-07-25',
        analysis: {
            sentiment: 'Positive',
            keyAreas: 'Facility Cleanliness, Repair Time, Communication',
            suggestions: 'Implement an automated SMS/WhatsApp update system for service status.'
        }
    },
    { 
        id: 'F4', 
        userId: '3', 
        vehicleId: 'V1002', 
        rating: 3, 
        comment: 'Average service. The issue was fixed, but it felt very transactional. No one explained what was done or why. Just a bill at the end. Expected more from a "smart" service center.', 
        date: '2024-07-20',
        analysis: {
            sentiment: 'Neutral',
            keyAreas: 'Customer Interaction, Service Explanation',
            suggestions: 'Train technicians to walk customers through the work done and explain the value of the repairs.'
        }
    },
    { 
        id: 'F5', 
        userId: '3', 
        vehicleId: 'V1005', 
        rating: 5, 
        comment: 'I am blown away by the predictive maintenance! I got an alert about my battery, booked an appointment easily, and they replaced it before it could leave me stranded. This is the future!', 
        date: '2024-07-18',
        analysis: {
            sentiment: 'Very Positive',
            keyAreas: 'Predictive Maintenance, Convenience, User Experience',
            suggestions: 'Use this as a testimonial. The system worked perfectly.'
        }
    },
    { 
        id: 'F6', 
        userId: '3', 
        vehicleId: 'V1008', 
        rating: 1, 
        comment: 'Terrible. They damaged the interior of my car and are refusing to take responsibility. I had to wait for 2 hours just to talk to a manager. Never coming back to the Pune location.', 
        date: '2024-07-15',
        analysis: {
            sentiment: 'Very Negative',
            keyAreas: 'Service Quality, Customer Support, Issue Resolution',
            suggestions: 'Urgent management intervention required. Review CCTV footage and contact the customer immediately to resolve the damage claim.'
        }
    }
];

export const notifications: Notification[] = [
  { id: 'N1', title: 'Critical Alert: V1003', description: 'Engine vibration has exceeded critical threshold. Immediate inspection recommended.', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: 'N2', title: 'Agent Anomaly Detected', description: 'Scheduling Agent attempted unauthorized access. Action was blocked.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'N3', title: 'New Feedback Received', description: 'A 5-star review was submitted for service at Mumbai SC.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'N4', title: 'Parts Shortage Warning', description: 'Low stock for "Brake Pads - XUV700". Consider reordering.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'N5', title: 'High Workload Alert', description: 'Bengaluru SC workload is at 92%. Consider load balancing.', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
];

export const liveQueueData: LiveQueueVehicle[] = [
    { id: 'V1002', model: 'Hero Xtreme', stage: 'Diagnosis' },
    { id: 'V1005', model: 'Mahindra Thar', stage: 'In Service' },
    { id: 'V1008', model: 'Tata Nexon', stage: 'In Service' },
    { id: 'V1001', model: 'Hero Splendor', stage: 'Ready for Pickup' },
];

const rcaComponents = ['ECU', 'Injector', 'ABS Sensor', 'Wiring'];
const rcaSuppliers = ['Bosch', 'Delphi', 'Continental', 'Minda'];

export const analyticsData = {
  kpis: {
    downtimeReduction: 12.5,
    predictionAccuracy: 88.2,
    fleetUtilization: 92.3,
    preventiveSavings: 1250000,
  },
  predictiveBreakdown: rcaComponents.flatMap(component => 
    indianModels.slice(0, 5).map(model => ({
      component,
      model: model.model,
      probability: Math.random()
    }))
  ),
  maintenanceForecast: indianCities.slice(0, 10).map(city => ({
    city,
    demand: 50 + Math.floor(Math.random() * 100),
  })),
  serviceLoad: [
    { name: 'Mumbai SC', workload: 120, backlog: 15 },
    { name: 'Delhi SC', workload: 90, backlog: 25 },
    { name: 'Bengaluru SC', workload: 110, backlog: 10 },
    { name: 'Pune SC', workload: 85, backlog: 5 },
    { name: 'Chennai SC', workload: 70, backlog: 8 },
  ],
  ageVsFailureRate: indianModels.slice(0,5).flatMap(vehicle => 
    Array.from({length: 5}, (_, i) => ({
      make: vehicle.make,
      model: vehicle.model,
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
  designVulnerability: indianModels.slice(0, 5).map((v, i) => ({
    model: `${v.make} ${v.model}`,
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

export const capaData: CapaItem[] = [
  {
    id: 'CAPA-0812',
    title: 'Fuel Line Vibration Failure',
    originatingIssue: 'Recurring fuel leak reports for Hero Splendor (Lot B-2023)',
    proposedAction: 'Increase torque specification for fuel line connectors by 5%.',
    aiSuggestion: 'Approve',
    aiJustification: 'Action directly addresses the identified root cause of connector loosening from vibration.',
    status: 'Pending',
  },
  {
    id: 'CAPA-0813',
    title: 'ECU Software Glitch',
    originatingIssue: 'Infotainment system freezes on Mahindra XUV700 models.',
    proposedAction: 'Develop and deploy firmware patch v2.3.1 to address memory leak.',
    aiSuggestion: 'Merge with CAPA-0811',
    aiJustification: 'CAPA-0811 already addresses a similar memory management issue in the same ECU. Merging efforts will be more efficient.',
    status: 'Pending',
  },
  {
    id: 'CAPA-0814',
    title: 'ABS Sensor Contamination',
    originatingIssue: 'False ABS activation in dusty conditions.',
    proposedAction: 'Redesign sensor housing to improve shielding from debris.',
    aiSuggestion: 'Forward to Manufacturing',
    aiJustification: 'This requires a hardware design change. Forwarding to the manufacturing and design team for feasibility study.',
    status: 'Pending',
  },
  {
    id: 'CAPA-0815',
    title: 'Fuel Line Vibration Failure',
    originatingIssue: 'Fuel leaks reported for Hero Splendor (Lot C-2023)',
    proposedAction: 'Add thread-locking compound to fuel line connectors.',
    aiSuggestion: 'Reject (Duplicate)',
    aiJustification: 'This is a duplicate of CAPA-0812, which proposes a different solution for the same root cause. Evaluate which solution is superior.',
    status: 'Pending',
  }
];


export const executiveAnalyticsData = {
  aiRoi: {
    costSavings: 1500000,
    timeSavings: 25,
    breakdownReduction: 18,
  },
  regionalPerformance: indianCities.slice(0, 8).map(city => ({
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
  rulPrediction: indianModels.map((v, i) => ({
    model: `${v.make} ${v.model}`,
    rul: 3.5 + Math.random() * 4,
  })),
  detectionRate: 85.4,
  sri: 91.3,
  preventiveActionEffectiveness: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({
    month,
    failures: 30 - i * 4.5,
  })),
  fleetReliability: [
    { model: 'XUV700', '2023': 12.5, '2024': 10.6 },
    { model: 'Splendor', '2023': 8.2, '2024': 7.1 },
    { model: 'Nexon', '2023': 10.1, '2024': 8.9 },
  ],
  whatIfScenarios: [
    {
      id: 'scenario1',
      name: 'Increase Service Intervals by 20%',
      description: 'Simulates the effect of extending the time between scheduled maintenance for all vehicles.',
      impact: [
        { metric: 'Cost Savings', value: '+12%', changeDirection: 'positive' },
        { metric: 'Defect Rate', value: '+8%', changeDirection: 'negative' },
        { metric: 'Satisfaction', value: '-5%', changeDirection: 'negative' },
      ],
    },
    {
      id: 'scenario2',
      name: 'Replace Supplier A with Supplier B',
      description: 'Models the impact of switching from Supplier A (cheaper) to Supplier B (higher quality) for brake components.',
      impact: [
        { metric: 'Cost Savings', value: '-4%', changeDirection: 'negative' },
        { metric: 'Defect Rate', value: '-15%', changeDirection: 'positive' },
        { metric: 'Satisfaction', value: '+9%', changeDirection: 'positive' },
      ],
    },
    {
      id: 'scenario3',
      name: 'Deploy New ECU Firmware',
      description: 'Predicts the outcome of rolling out a major firmware update designed to improve engine efficiency.',
      impact: [
        { metric: 'Cost Savings', value: '+6%', changeDirection: 'positive' },
        { metric: 'Defect Rate', value: '-3%', changeDirection: 'positive' },
        { metric: 'Satisfaction', value: '+4%', changeDirection: 'positive' },
      ],
    },
  ],
};

export const customerExperienceData = {
  sentimentScore: 8.2,
  appointmentDeclineRate: 15,
  voiceInteractionSuccess: 78,
  feedbackToActionRatio: 45,
  retentionProbability: 85,
  networkUtilization: 88,
  responseTime: indianCities.slice(0, 5).map(city => ({
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
  ],
  serviceDelayReasons: [
    { reason: 'Parts Delay', count: 45 },
    { reason: 'Technician Shortage', count: 25 },
    { reason: 'Customer Hold', count: 15 },
    { reason: 'Diagnostic Complexity', count: 10 },
    { reason: 'Workspace Unavailability', count: 5 },
  ] as ServiceDelayReason[],
  diagnosisAccuracy: {
    overall: 87.5,
    matrix: [
      { aiPrediction: 'Brakes', technicianDiagnosis: 'Brakes', count: 80 },
      { aiPrediction: 'Brakes', technicianDiagnosis: 'Suspension', count: 5 },
      { aiPrediction: 'Engine', technicianDiagnosis: 'Engine', count: 65 },
      { aiPrediction: 'Engine', technicianDiagnosis: 'Electrical', count: 8 },
      { aiPrediction: 'Electrical', technicianDiagnosis: 'Electrical', count: 92 },
      { aiPrediction: 'Electrical', technicianDiagnosis: 'Engine', count: 3 },
      { aiPrediction: 'Suspension', technicianDiagnosis: 'Suspension', count: 75 },
      { aiPrediction: 'Suspension', technicianDiagnosis: 'Brakes', count: 2 },
    ] as DiagnosisAccuracyData[],
  },
  customerLifetimeValue: [
    { customerId: 'C1', name: 'Fleet Co.', clv: 500000, retentionProbability: 0.95 },
    { customerId: 'C2', name: 'Logistics Inc.', clv: 420000, retentionProbability: 0.92 },
    { customerId: 'C3', name: 'Mr. Joshi', clv: 150000, retentionProbability: 0.88 },
    { customerId: 'C4', name: 'Mrs. Gupta', clv: 120000, retentionProbability: 0.85 },
  ] as CustomerLifetimeValueData[],
};


export const workloadForecast: WorkloadForecastData[] = Array.from({ length: 7 }).map((_, i) => ({
    date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
    predictedJobs: 10 + Math.floor(Math.random() * 15) + (i === 4 ? 10 : 0), // Spike on Friday
}));


export const inventoryData: InventoryPart[] = [
    { id: 'P1', name: 'Brake Pads (XUV700)', inStock: 50, avgUsePerWeek: 15, reorderLevel: 20, predictedShortageDate: '2024-09-15' },
    { id: 'P2', name: 'Oil Filter (Splendor)', inStock: 120, avgUsePerWeek: 40, reorderLevel: 50, predictedShortageDate: '2024-09-10' },
    { id: 'P3', name: 'Battery (Nexon EV)', inStock: 8, avgUsePerWeek: 2, reorderLevel: 10, predictedShortageDate: '2024-08-25' },
    { id: 'P4', name: 'Air Filter (Swift)', inStock: 75, avgUsePerWeek: 25, reorderLevel: 30, predictedShortageDate: '2024-09-20' },
    { id: 'P5', name: 'Spark Plug (Set)', inStock: 200, avgUsePerWeek: 50, reorderLevel: 75, predictedShortageDate: '2024-09-30' },
];

export const partConsumptionTrends: PartConsumptionTrend[] = [
    { part: 'Oil Filters', change: 20 },
    { part: 'Brake Pads', change: 15 },
    { part: 'Air Filters', change: -5 },
];

export const rootCauseData: RootCauseData[] = [
    { faultType: 'Engine', recurrence: 0.1, frequency: 15 },
    { faultType: 'Brake', recurrence: 0.35, frequency: 30 },
    { faultType: 'Electrical', recurrence: 0.2, frequency: 25 },
    { faultType: 'Suspension', recurrence: 0.15, frequency: 20 },
];

export const technicianCorrelationMatrix: CorrelationMatrix[] = [
    { metric: 'Skill', skill: 1.0, experience: 0.6, serviceTime: -0.82, satisfaction: 0.7 },
    { metric: 'Experience', skill: 0.6, experience: 1.0, serviceTime: -0.5, satisfaction: 0.4 },
    { metric: 'Service Time', skill: -0.82, experience: -0.5, serviceTime: 1.0, satisfaction: -0.65 },
    { metric: 'Satisfaction', skill: 0.7, experience: 0.4, serviceTime: -0.65, satisfaction: 1.0 },
];

export const serviceDurationData: ServiceDurationData[] = [
  { id: 'SD1', task: 'Oil Change', predicted: 1.0, actual: 0.9, technician: 'Vijay' },
  { id: 'SD2', task: 'Brake Check', predicted: 2.5, actual: 3.1, technician: 'Sanjay' },
  { id: 'SD3', task: 'ECU Flash', predicted: 1.5, actual: 1.6, technician: 'Rajesh' },
  { id: 'SD4', task: 'Suspension', predicted: 4.0, actual: 4.8, technician: 'Anil' },
  { id: 'SD5', task: 'Filter Swap', predicted: 0.5, actual: 0.4, technician: 'Prakash' },
  { id: 'SD6', task: 'Engine Diag', predicted: 3.0, actual: 2.8, technician: 'Sanjay' },
];

export const repairCostData: RepairCostData[] = [
  { month: 'Jan', actualCost: 12500, standardCost: 12000 },
  { month: 'Feb', actualCost: 14000, standardCost: 13000 },
  { month: 'Mar', actualCost: 13200, standardCost: 13500 },
  { month: 'Apr', actualCost: 15000, standardCost: 14000 },
  { month: 'May', actualCost: 14500, standardCost: 14200 },
  { month: 'Jun', actualCost: 16000, standardCost: 15000 },
];

export const partLifecycleData: PartLifecycleData[] = Array.from({ length: 10 }).map((_, i) => ({
  mileage: (i + 1) * 10000,
  failureProbability: (1 / (1 + Math.exp(-(i - 5) * 0.8))) * 100, // Sigmoid curve
}));

export const anomalyTimelineData: AnomalyTimelineDataPoint[] = Array.from({length: 24}).map((_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    score: i > 8 && i < 18 ? Math.random() * 0.3 : (i === 2 || i === 22) ? Math.random() * 0.5 + 0.4 : Math.random() * 0.1,
}));

export const repairComplexityData: RepairComplexityData = {
    easy: 75,
    complex: 25,
};

export const firstTimeFixRateData: FirstTimeFixRateData[] = [
    { month: 'Jan', rate: 88 },
    { month: 'Feb', rate: 91 },
    { month: 'Mar', rate: 90 },
    { month: 'Apr', rate: 92 },
    { month: 'May', rate: 94 },
    { month: 'Jun', rate: 95 },
];

export const aiConfidenceData: AiConfidenceData[] = [
    { level: 'High', count: 25 },
    { level: 'Medium', count: 60 },
    { level: 'Low', count: 15 },
];

export const centerBenchmarkData: CenterBenchmarkData[] = [
  { metric: 'Satisfaction', center: 92, average: 88 },
  { metric: 'Turnaround', center: 3.1, average: 3.8 },
  { metric: 'Cost', center: 95, average: 105 }, // Center is 5% below avg
  { metric: 'FTF Rate', center: 94, average: 91 },
  { metric: 'Diagnostics', center: 89, average: 82 },
];

export const partReliabilityData: PartReliabilityData[] = [
  { id: 'PR1', partName: 'Alternator', score: 92, failureRate: 0.8, cost: 15000 },
  { id: 'PR2', partName: 'Fuel Injector', score: 85, failureRate: 1.2, cost: 8000 },
  { id: 'PR3', partName: 'ABS Sensor', score: 78, failureRate: 2.1, cost: 4000 },
  { id: 'PR4', partName: 'Turbocharger', score: 65, failureRate: 3.5, cost: 45000 },
  { id: 'PR5', partName: 'Water Pump', score: 55, failureRate: 4.2, cost: 7000 },
].sort((a,b) => a.score - b.score);

export const timeOfDayLoadData: TimeOfDayLoadData[] = Array.from({length: 10}).map((_, i) => ({
    hour: `${(i + 9).toString().padStart(2,'0')}:00`,
    vehicles: Math.floor(Math.random() * 10) + (i > 1 && i < 6 ? 5 : 0) // peak mid-day
}));

export const failurePatterns: FailurePattern[] = [
    { region: 'West', issue: 'High Brake Pad Wear', insight: 'Possible correlation with high dust levels and stop-and-go traffic in Mumbai & Pune.', severity: 'High' },
    { region: 'South', issue: 'Battery Degradation', insight: 'Accelerated degradation in Bengaluru & Chennai, likely due to high ambient temperatures.', severity: 'Medium' },
    { region: 'North', issue: 'Suspension Damage', insight: 'Increased reports of suspension issues in Delhi NCR, correlating with poor road conditions.', severity: 'High' },
];

export const loadBalancingSuggestion: LoadBalancingSuggestion[] = [
    { id: 'LB1', fromCenter: 'VedaMotrix Koramangala', toCenter: 'VedaMotrix Whitefield', reason: 'High workload (92%) at Koramangala.', etaImpact: -18, status: 'suggested' },
    { id: 'LB2', fromCenter: 'VedaMotrix Andheri', toCenter: 'VedaMotrix Thane', reason: 'Andheri at capacity; Thane has 3 available bays.', etaImpact: -12, status: 'suggested' },
];

    
