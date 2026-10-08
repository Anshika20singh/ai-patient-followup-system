import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Medicine,
  Appointment,
  NotificationItem,
  CareActivity,
  UserRole,
  ReminderStatus,
  AppointmentStatus,
  RiskLevel
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_MEDICINES,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES
} from '../data/initialData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  patients: Patient[];
  medicines: Medicine[];
  appointments: Appointment[];
  notifications: NotificationItem[];
  activities: CareActivity[];
  
  // Actions
  addPatient: (patient: Omit<Patient, 'id'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Medicine;
  updateMedicineStatus: (id: string, status: ReminderStatus, reason?: string) => void;
  scheduleAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  markFollowUpContacted: (patientId: string, staffNote: string) => void;
  runAiTriage: () => { high: number; medium: number; low: number; changed: number };
  resetToSampleData: () => void;

  // Computed statistics
  stats: {
    activePatients: number;
    todayRemindersCount: number;
    todayPendingReminders: number;
    upcomingAppointmentsCount: number;
    todayAppointmentsCount: number;
    followUpCompletionRate: number;
    overallAdherence: number;
    aiAttentionCases: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

const STORAGE_KEY = 'pulsecare_ai_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('staff');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('P001');

  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patients`);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_medicines`);
      return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activities, setActivities] = useState<CareActivity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_patients`, JSON.stringify(patients));
      localStorage.setItem(`${STORAGE_KEY}_medicines`, JSON.stringify(medicines));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to sync to localStorage', e);
    }
  }, [patients, medicines, appointments, notifications, activities]);

  // Add Patient
  const addPatient = (newPatientData: Omit<Patient, 'id'>): Patient => {
    const nextNum = patients.length + 1;
    const newId = `P${String(nextNum).padStart(3, '0')}`;
    const newPatient: Patient = {
      ...newPatientData,
      id: newId,
    };
    setPatients(prev => [newPatient, ...prev]);

    // Add activity
    const newAct: CareActivity = {
      id: `ACT_${Date.now()}`,
      timestamp: 'Just now',
      type: 'patient_added',
      title: 'New Patient Registered',
      description: `${newPatient.name} (${newPatient.id}) admitted to post-discharge care.`,
      patientName: newPatient.name,
      staff: 'Dr. Sharma'
    };
    setActivities(prev => [newAct, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF_${Date.now()}`,
      type: 'system',
      title: 'New Patient Enrolled',
      message: `${newPatient.name} has been added under your supervision.`,
      timestamp: 'Just now',
      read: false,
      severity: 'normal',
      patientId: newPatient.id,
      patientName: newPatient.name
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setMedicines(prev => prev.filter(m => m.patientId !== id));
    setAppointments(prev => prev.filter(a => a.patientId !== id));
  };

  // Add Medicine
  const addMedicine = (newMedData: Omit<Medicine, 'id'>): Medicine => {
    const newId = `M${String(medicines.length + 1).padStart(3, '0')}`;
    const newMed: Medicine = {
      ...newMedData,
      id: newId
    };
    setMedicines(prev => [newMed, ...prev]);

    // Update patient medicine count
    setPatients(prev =>
      prev.map(p =>
        p.id === newMed.patientId ? { ...p, medicineCount: p.medicineCount + 1 } : p
      )
    );

    const newAct: CareActivity = {
      id: `ACT_${Date.now()}`,
      timestamp: 'Just now',
      type: 'followup_scheduled',
      title: 'Prescription Added',
      description: `${newMed.name} ${newMed.dosage} prescribed to ${newMed.patientName}.`,
      patientName: newMed.patientName,
      staff: 'Dr. Sharma'
    };
    setActivities(prev => [newAct, ...prev]);

    return newMed;
  };

  // Update Medicine Status
  const updateMedicineStatus = (id: string, status: ReminderStatus, reason?: string) => {
    setMedicines(prev =>
      prev.map(m => {
        if (m.id === id) {
          const completedDoses = status === 'Taken' ? m.completedDoses + 1 : m.completedDoses;
          const missedDoses = status === 'Missed' ? m.missedDoses + 1 : m.missedDoses;
          const totalAttempted = completedDoses + missedDoses;
          const adherenceRate = totalAttempted > 0 ? Math.round((completedDoses / totalAttempted) * 100) : m.adherenceRate;
          return {
            ...m,
            status,
            completedDoses,
            missedDoses,
            adherenceRate
          };
        }
        return m;
      })
    );

    const targetMed = medicines.find(m => m.id === id);
    if (!targetMed) return;

    // Log Activity
    const newAct: CareActivity = {
      id: `ACT_${Date.now()}`,
      timestamp: 'Just now',
      type: status === 'Taken' ? 'medicine_taken' : 'medicine_missed',
      title: status === 'Taken' ? 'Dose Logged as Taken' : 'Dose Missed / Delayed',
      description: status === 'Taken'
        ? `${targetMed.patientName} acknowledged taking ${targetMed.name} ${targetMed.dosage}.`
        : `${targetMed.patientName} missed ${targetMed.name}. ${reason ? `Reason: ${reason}` : ''}`,
      patientName: targetMed.patientName
    };
    setActivities(prev => [newAct, ...prev]);

    // If missed or skipped, trigger AI attention analysis for this patient
    if (status === 'Missed') {
      const urgentNotif: NotificationItem = {
        id: `NOTIF_${Date.now()}`,
        type: 'alert',
        title: 'Missed Medication Alert',
        message: `${targetMed.patientName} missed ${targetMed.name} (${targetMed.timing}). ${reason || 'Immediate follow-up advised.'}`,
        timestamp: 'Just now',
        read: false,
        severity: 'urgent',
        patientId: targetMed.patientId,
        patientName: targetMed.patientName
      };
      setNotifications(prev => [urgentNotif, ...prev]);

      // Escalate patient risk status if multiple missed
      setPatients(prev =>
        prev.map(p => {
          if (p.id === targetMed.patientId) {
            const newScore = Math.min(95, p.riskScore + 20);
            const newCategory: RiskLevel = newScore >= 75 ? 'High' : 'Medium';
            return {
              ...p,
              riskCategory: newCategory,
              riskScore: newScore,
              reminderStatus: 'Missed',
              followUpStatus: 'Action needed',
              riskReason: `Missed scheduled dose of ${targetMed.name} (${targetMed.dosage}). ${reason ? `Reported: ${reason}` : ''}`
            };
          }
          return p;
        })
      );
    }
  };

  // Schedule Appointment
  const scheduleAppointment = (apptData: Omit<Appointment, 'id'>): Appointment => {
    const newId = `APT${String(appointments.length + 1).padStart(3, '0')}`;
    const newAppt: Appointment = {
      ...apptData,
      id: newId
    };
    setAppointments(prev => [newAppt, ...prev]);

    // Update patient next follow-up date
    setPatients(prev =>
      prev.map(p =>
        p.id === newAppt.patientId
          ? { ...p, nextFollowUpDate: newAppt.date, appointmentStatus: newAppt.status === 'Confirmed' ? 'Confirmed' : 'Upcoming' }
          : p
      )
    );

    const newAct: CareActivity = {
      id: `ACT_${Date.now()}`,
      timestamp: 'Just now',
      type: 'followup_scheduled',
      title: 'Appointment Scheduled',
      description: `${newAppt.type} set for ${newAppt.patientName} on ${newAppt.date} at ${newAppt.time}.`,
      patientName: newAppt.patientName,
      staff: newAppt.doctorName
    };
    setActivities(prev => [newAct, ...prev]);

    return newAppt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    const target = appointments.find(a => a.id === id);
    if (target && status === 'Missed') {
      // Escalate patient
      setPatients(prev =>
        prev.map(p => {
          if (p.id === target.patientId) {
            return {
              ...p,
              appointmentStatus: 'Missed',
              riskCategory: 'High',
              riskScore: Math.min(98, p.riskScore + 25),
              followUpStatus: 'Action needed',
              riskReason: `Missed appointment on ${target.date} with ${target.doctorName}. Urgent reschedule required.`
            };
          }
          return p;
        })
      );

      const alertNotif: NotificationItem = {
        id: `NOTIF_${Date.now()}`,
        type: 'alert',
        title: 'Missed Appointment Escalation',
        message: `${target.patientName} failed to attend ${target.department} on ${target.date}.`,
        timestamp: 'Just now',
        read: false,
        severity: 'urgent',
        patientId: target.patientId,
        patientName: target.patientName
      };
      setNotifications(prev => [alertNotif, ...prev]);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF_${Date.now()}`,
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markFollowUpContacted = (patientId: string, staffNote: string) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          const updatedNotes = [...p.notes, `Staff follow-up (${new Date().toLocaleDateString()}): ${staffNote}`];
          return {
            ...p,
            followUpStatus: 'On track',
            riskCategory: p.riskCategory === 'High' ? 'Medium' : p.riskCategory,
            riskScore: Math.max(20, p.riskScore - 20),
            notes: updatedNotes,
            riskReason: `Followed up by staff: "${staffNote}". Monitored closely.`
          };
        }
        return p;
      })
    );

    const targetPatient = patients.find(p => p.id === patientId);
    if (targetPatient) {
      const act: CareActivity = {
        id: `ACT_${Date.now()}`,
        timestamp: 'Just now',
        type: 'staff_contact',
        title: 'Staff Follow-up Completed',
        description: `Healthcare staff contacted ${targetPatient.name}: ${staffNote}`,
        patientName: targetPatient.name,
        staff: 'Dr. Sharma'
      };
      setActivities(prev => [act, ...prev]);
    }
  };

  // Run AI Risk Triage Engine (Algorithmic clinical rule-base)
  const runAiTriage = () => {
    let changed = 0;
    const updated = patients.map(p => {
      // Find patient's medicines and calculate adherence
      const pMeds = medicines.filter(m => m.patientId === p.id);
      const avgAdherence = pMeds.length > 0
        ? pMeds.reduce((acc, curr) => acc + curr.adherenceRate, 0) / pMeds.length
        : 90;
      
      const hasMissedMeds = pMeds.some(m => m.status === 'Missed');
      const hasPendingMeds = pMeds.some(m => m.status === 'Pending');
      const hasMissedAppt = p.appointmentStatus === 'Missed';

      let score = 20; // baseline
      let reason = 'Patient exhibits consistent adherence and stable recovery.';
      let category: RiskLevel = 'Low';

      if (hasMissedAppt) {
        score += 45;
        reason = 'Missed crucial post-discharge clinic follow-up.';
      }

      if (hasMissedMeds) {
        score += 35;
        reason = 'Recent missed medicine doses detected by automated check-in.';
      } else if (avgAdherence < 75) {
        score += 30;
        reason = `Sub-optimal medication adherence (${Math.round(avgAdherence)}%). Risk of treatment failure.`;
      } else if (avgAdherence < 85 || hasPendingMeds) {
        score += 20;
        reason = 'Delayed response to medicine reminders. Requires gentle reinforcement.';
      }

      if (p.age > 65) score += 10;

      if (score >= 70) {
        category = 'High';
      } else if (score >= 45) {
        category = 'Medium';
      } else {
        category = 'Low';
      }

      if (category !== p.riskCategory || score !== p.riskScore) {
        changed++;
      }

      return {
        ...p,
        riskScore: Math.min(99, score),
        riskCategory: category,
        riskReason: reason
      };
    });

    setPatients(updated);

    const high = updated.filter(p => p.riskCategory === 'High').length;
    const medium = updated.filter(p => p.riskCategory === 'Medium').length;
    const low = updated.filter(p => p.riskCategory === 'Low').length;

    const triageAct: CareActivity = {
      id: `ACT_${Date.now()}`,
      timestamp: 'Just now',
      type: 'ai_triage',
      title: 'Full Cohort AI Triage Executed',
      description: `Evaluated ${updated.length} patients: ${high} High, ${medium} Medium, ${low} Low attention cases.`,
      patientName: 'All Active Cohorts',
      staff: 'PulseCare AI Engine'
    };
    setActivities(prev => [triageAct, ...prev]);

    return { high, medium, low, changed };
  };

  const resetToSampleData = () => {
    setPatients(INITIAL_PATIENTS);
    setMedicines(INITIAL_MEDICINES);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.removeItem(`${STORAGE_KEY}_patients`);
    localStorage.removeItem(`${STORAGE_KEY}_medicines`);
    localStorage.removeItem(`${STORAGE_KEY}_appointments`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);
  };

  // Compute live stats
  const activePatients = patients.length;
  const todayRemindersCount = medicines.length;
  const todayPendingReminders = medicines.filter(m => m.status === 'Pending').length;
  const upcomingAppointmentsCount = appointments.filter(a => a.status === 'Upcoming' || a.status === 'Confirmed').length;
  const todayAppointmentsCount = appointments.filter(a => a.date === '2026-10-08' || a.date.includes('Today')).length;
  
  const followedUpCount = patients.filter(p => p.followUpStatus === 'On track' || p.followUpStatus === 'Completed').length;
  const followUpCompletionRate = activePatients > 0 ? Math.round((followedUpCount / activePatients) * 100) : 83;

  const totalAdherence = medicines.reduce((sum, m) => sum + m.adherenceRate, 0);
  const overallAdherence = medicines.length > 0 ? Math.round(totalAdherence / medicines.length) : 86;

  const highCases = patients.filter(p => p.riskCategory === 'High').length;
  const mediumCases = patients.filter(p => p.riskCategory === 'Medium').length;
  const lowCases = patients.filter(p => p.riskCategory === 'Low').length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        patients,
        medicines,
        appointments,
        notifications,
        activities,
        addPatient,
        updatePatient,
        deletePatient,
        addMedicine,
        updateMedicineStatus,
        scheduleAppointment,
        updateAppointmentStatus,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        markFollowUpContacted,
        runAiTriage,
        resetToSampleData,
        stats: {
          activePatients,
          todayRemindersCount,
          todayPendingReminders,
          upcomingAppointmentsCount,
          todayAppointmentsCount,
          followUpCompletionRate,
          overallAdherence,
          aiAttentionCases: {
            high: highCases,
            medium: mediumCases,
            low: lowCases
          }
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
