export type UserRole = 'staff' | 'patient' | 'landing';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type ReminderStatus = 'Taken' | 'Pending' | 'Missed' | 'Snoozed';

export type AppointmentStatus = 'Confirmed' | 'Upcoming' | 'Pending' | 'Missed' | 'Completed';

export interface Patient {
  id: string; // e.g. "P001"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodGroup: string;
  dischargeDate: string;
  primaryCondition: string;
  address: string;
  emergencyContact: string;
  assignedDoctor: string;
  riskCategory: RiskLevel;
  riskReason: string;
  riskScore: number; // 0 - 100
  medicineCount: number;
  nextFollowUpDate: string;
  appointmentStatus: 'Upcoming' | 'Confirmed' | 'Pending' | 'Missed' | 'None';
  reminderStatus: 'On track' | 'Pending' | 'Missed';
  followUpStatus: 'On track' | 'Action needed' | 'Overdue' | 'Completed';
  notes: string[];
}

export interface Medicine {
  id: string;
  patientId: string;
  patientName: string;
  name: string;
  dosage: string; // e.g. "500mg"
  timing: string; // e.g. "08:00 AM"
  frequency: string; // e.g. "2 times/day"
  foodRelation: 'Before food' | 'After food' | 'With food' | 'Anytime';
  status: ReminderStatus;
  totalPrescribedDays: number;
  completedDoses: number;
  missedDoses: number;
  adherenceRate: number; // percentage 0 - 100
  startDate: string;
  instructions: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string; // e.g. "2026-10-15"
  time: string; // e.g. "10:30 AM"
  type: 'In-person follow-up' | 'Virtual consultation' | 'Post-Discharge Review' | 'Lab Review';
  status: AppointmentStatus;
  reminderSent: boolean;
  notes: string;
}

export interface NotificationItem {
  id: string;
  type: 'medicine' | 'appointment' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'normal' | 'warning' | 'urgent';
  patientId?: string;
  patientName?: string;
}

export interface CareActivity {
  id: string;
  timestamp: string;
  type: 'medicine_taken' | 'medicine_missed' | 'followup_scheduled' | 'ai_triage' | 'staff_contact' | 'patient_added';
  title: string;
  description: string;
  patientName: string;
  staff?: string;
}
