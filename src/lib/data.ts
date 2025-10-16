import type { User, Vehicle, ServiceCenter, Appointment, CapaRcaEntry, UebaEvent, CustomerFeedback } from './types';
import { PlaceHolderImages } from './placeholder-images';

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

export const vehicles: Vehicle[] = Array.from({ length: 10 }, (_, i) => {
  const healthStatus = i % 3 === 0 ? 'Critical' : i % 2 === 0 ? 'Warning' : 'Good';
  const selectedImg = i % 3 === 0 ? vehicleImg1 : i % 2 === 0 ? vehicleImg2 : vehicleImg3;
  return {
    id: `V${1001 + i}`,
    ownerId: '3', // All owned by Rohan Joshi for simplicity
    make: ['Maruti Suzuki', 'Tata', 'Mahindra', 'Hyundai', 'Kia', 'Toyota', 'Honda', 'Skoda', 'Volkswagen', 'MG'][i],
    model: ['Swift', 'Nexon', 'XUV700', 'Creta', 'Seltos', 'Innova', 'City', 'Kushaq', 'Virtus', 'Hector'][i],
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

export const capaRcaEntries: CapaRcaEntry[] = [
  { id: 'C1', component: 'Clutch Assembly', issuePattern: 'Premature wear reported in Tata Nexon under 30,000 kms in city driving.', suggestion: 'Investigate clutch plate material for higher durability.', status: 'Pending' },
  { id: 'C2', component: 'AC Compressor', issuePattern: 'Failure in Hyundai Creta models in regions with high ambient temperature.', suggestion: 'Evaluate higher-rated AC compressor units for hot climates.', status: 'Approved' },
  { id: 'C3', component: 'Suspension Bushings', issuePattern: 'Frequent wear and tear in Mahindra XUV700 on rough roads.', suggestion: 'Test polyurethane bushings as a potential replacement for standard rubber.', status: 'Pending' },
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
