import type { User, Vehicle, ServiceCenter, Appointment, UebaEvent, CustomerFeedback, Notification, UsageDataPoint, HealthHistoryEntry, MaintenanceLog, PredictedAlert, PredictiveInsight, EnvironmentalData, Technician, TechnicianPerformance, LiveQueueVehicle, WorkloadForecastData, InventoryPart, PartConsumptionTrend, RootCauseData, CorrelationMatrix, ServiceDurationData, RepairCostData, PartLifecycleData, SankeyData, AnomalyTimelineDataPoint, RepairComplexityData, FirstTimeFixRateData, AiConfidenceData } from './types';
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

export const indianMakes = ['Hero', 'Mahindra', 'Tata', 'Maruti Suzuki'];
export const indianModels = ['Splendor', 'Xtreme', 'XUV700', 'Scorpio', 'Pleasure+', 'Thar', 'Passion', 'Jawa', 'Karizma', 'Bolero', 'Nexon', 'Harrier', 'Swift', 'Baleno'];
export const indianCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad'];

export const serviceCenters: ServiceCenter[] = [
  { id: 'SC1', name: 'VedaMotrix Andheri', city: 'Mumbai', lat: 19.119, lng: 72.847, capacity: 15, availableSlots: ['09:30', '11:30', '14:30'], rating: 4.8, avgCompletionTime: 2.5 },
  { id: 'SC2', name: 'VedaMotrix Koramangala', city: 'Bengaluru', lat: 12.935, lng: 77.624, capacity: 12, availableSlots: ['10:00', '13:00', '16:00'], rating: 4.6, avgCompletionTime: 3.1 },
  { id: 'SC3', name: 'VedaMotrix Connaught Place', city: 'Delhi', lat: 28.632, lng: 77.219, capacity: 10, availableSlots: ['09:00', '11:00', '14:00', '17:00'], rating: 4.7, avgCompletionTime: 2.8 },
  { id: 'SC4', name: 'VedaMotrix T. Nagar', city: 'Chennai', lat: 13.04, lng: 80.23, capacity: 8, availableSlots: ['10:30', '14:30'], rating: 4.5, avgCompletionTime: 3.5 },
  { id: 'SC5', name: 'VedaMotrix Park Street', city: 'Kolkata', lat: 22.55, lng: 88.35, capacity: 9, availableSlots: ['09:00', '12:00', '15:00'], rating: 4.6, avgCompletionTime: 3.2 },
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
];

const generateMaintenanceHistory = (vehicleIndex: number): MaintenanceLog[] => {
    const history: MaintenanceLog[] = [
        { id: `M${vehicleIndex}1`, date: '2023-03-10', mileage: 12000 + vehicleIndex*1000, service: 'Engine Oil Change', notes: 'General check-up, all OK. Replaced oil filter and topped up fluids.', serviceCenterId: 'SC1', cost: 4500, rating: 5 },
        { id: `M${vehicleIndex}2`, date: '2023-09-15', mileage: 21000 + vehicleIndex*1000, service: 'Air Filter Replacement', notes: 'Replaced air and cabin filters. Cleaned throttle body.', serviceCenterId: 'SC2', cost: 2500, rating: 4 },
        { id: `M${vehicleIndex}3`, date: '2024-02-20', mileage: 30500 + vehicleIndex*1000, service: 'Brake Pad Replacement', notes: 'Front brake pads replaced. Fluid topped up. Customer reported slight shudder, but not reproducible.', serviceCenterId: 'SC1', cost: 7800 },
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


export const vehicles: Vehicle[] = Array.from({ length: 10 }, (_, i) => {
  const healthStatus = i % 3 === 0 ? 'Critical' : i % 2 === 0 ? 'Warning' : 'Good';
  const healthScore = healthStatus === 'Critical' ? 30 + Math.random() * 20 : healthStatus === 'Warning' ? 60 + Math.random() * 20 : 85 + Math.random() * 15;
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

export const appointments: Appointment[] = [
  { id: 'A1', vehicleId: 'V1001', serviceCenterId: 'SC1', date: '2024-08-01', time: '09:30', status: 'Completed', notes: 'Diagnosed high engine temperature.', technicianId: 'T1', estimatedTime: 3, stageProgress: 100 },
  { id: 'A2', vehicleId: 'V1002', serviceCenterId: 'SC1', date: '2024-08-02', time: '10:00', status: 'In Service', notes: 'Investigating low oil pressure warning.', technicianId: 'T2', estimatedTime: 5, stageProgress: 60 },
  { id: 'A3', vehicleId: 'V1003', serviceCenterId: 'SC1', date: '2024-08-03', time: '14:00', status: 'Pending', notes: 'Customer reports high vibration during braking.', technicianId: 'T1', estimatedTime: 2, stageProgress: 0 },
  { id: 'A4', vehicleId: 'V1004', serviceCenterId: 'SC1', date: '2024-08-04', time: '11:00', status: 'Pending', notes: 'Annual service and check-up.', technicianId: 'T3', estimatedTime: 4, stageProgress: 0 },
  { id: 'A5', vehicleId: 'V1005', serviceCenterId: 'SC1', date: '2024-08-05', time: '15:00', status: 'In Service', notes: 'Replace battery as per predictive alert.', technicianId: 'T2', estimatedTime: 1, stageProgress: 80 },
  { id: 'A6', vehicleId: 'V1006', serviceCenterId: 'SC1', date: '2024-08-06', time: '10:30', status: 'Awaiting Parts', notes: 'ABS module failure. Part ordered.', technicianId: 'T2', estimatedTime: 6, stageProgress: 40 },
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
  { id: 'N4', title: 'Parts Shortage Warning', description: 'Low stock for "Brake Pads - XUV700". Consider reordering.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
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

export const sankeyChartData: SankeyData = {
    nodes: [
        { name: "Brake Pad" }, { name: "Engine" },
        { name: "Braking System" }, { name: "Powertrain" },
        { name: "Wear & Tear" }, { name: "Overheating" },
        { name: "Replacement" }, { name: "Diagnostic Check" },
        { name: "Sanjay Kumar" }, { name: "Rajesh Sharma" }
    ],
    links: [
        { source: 0, target: 2, value: 40 },
        { source: 1, target: 3, value: 25 },
        { source: 2, target: 4, value: 30 },
        { source: 2, target: 5, value: 10 },
        { source: 3, target: 5, value: 25 },
        { source: 4, target: 6, value: 30 },
        { source: 5, target: 7, value: 35 },
        { source: 6, target: 8, value: 20 },
        { source: 6, target: 9, value: 10 },
        { source: 7, target: 8, value: 15 },
        { source: 7, target: 9, value: 20 }
    ]
};

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
