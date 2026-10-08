/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WorkflowBanner } from './components/layout/WorkflowBanner';
import { StaffDashboard } from './components/dashboard/StaffDashboard';
import { PatientManagement } from './components/patients/PatientManagement';
import { PatientProfileModal } from './components/patients/PatientProfileModal';
import { AddPatientModal } from './components/patients/AddPatientModal';
import { MedicineCenter } from './components/medicines/MedicineCenter';
import { AddMedicineModal } from './components/medicines/AddMedicineModal';
import { AppointmentCenter } from './components/appointments/AppointmentCenter';
import { ScheduleAppointmentModal } from './components/appointments/ScheduleAppointmentModal';
import { AiAttentionCenter } from './components/ai-attention/AiAttentionCenter';
import { PatientView } from './components/patient-portal/PatientView';
import { ReportsAndAnalytics } from './components/analytics/ReportsAndAnalytics';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { SimulateActionModal } from './components/common/SimulateActionModal';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, activeTab, patients } = useApp();

  // Modals state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [addMedicinePatientId, setAddMedicinePatientId] = useState<string | undefined>();
  const [isScheduleApptOpen, setIsScheduleApptOpen] = useState(false);
  const [scheduleApptPatientId, setScheduleApptPatientId] = useState<string | undefined>();
  const [selectedProfilePatientId, setSelectedProfilePatientId] = useState<string | null>(null);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  const selectedPatientForProfile = patients.find(p => p.id === selectedProfilePatientId);

  return (
    <div className="min-h-screen bg-[#090b14] flex flex-col text-slate-100">
      {/* Top Navbar */}
      <Navbar onOpenSimulate={() => setIsSimulateOpen(true)} />

      {/* Main View Switcher based on Role */}
      {role === 'landing' ? (
        <div className="flex-1 flex flex-col">
          <LandingPage />
        </div>
      ) : role === 'patient' ? (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <PatientView />
        </main>
      ) : (
        /* Healthcare Staff View */
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Mobile Sidebar Toggle Header */}
            <div className="lg:hidden bg-[#0d1021] border-b border-purple-900/25 px-4 py-2.5 flex items-center justify-between text-slate-300">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-white/5 flex items-center gap-2 text-xs font-semibold"
              >
                <Menu className="w-4 h-4 text-purple-400" />
                <span>Navigation Menu</span>
              </button>
              <span className="text-xs font-bold text-purple-300 capitalize">
                {activeTab.replace('-', ' ')}
              </span>
            </div>

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {activeTab === 'dashboard' && (
                <StaffDashboard
                  onOpenAddPatient={() => setIsAddPatientOpen(true)}
                  onOpenAddMedicine={() => {
                    setAddMedicinePatientId(undefined);
                    setIsAddMedicineOpen(true);
                  }}
                  onSelectPatient={id => setSelectedProfilePatientId(id)}
                />
              )}

              {activeTab === 'patients' && (
                <PatientManagement
                  onSelectPatient={id => setSelectedProfilePatientId(id)}
                  onOpenAddPatient={() => setIsAddPatientOpen(true)}
                  onOpenAddMedicine={id => {
                    setAddMedicinePatientId(id);
                    setIsAddMedicineOpen(true);
                  }}
                  onOpenScheduleAppt={id => {
                    setScheduleApptPatientId(id);
                    setIsScheduleApptOpen(true);
                  }}
                />
              )}

              {activeTab === 'medicines' && (
                <MedicineCenter
                  onOpenAddMedicine={() => {
                    setAddMedicinePatientId(undefined);
                    setIsAddMedicineOpen(true);
                  }}
                  onSelectPatient={id => setSelectedProfilePatientId(id)}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentCenter
                  onOpenSchedule={() => {
                    setScheduleApptPatientId(undefined);
                    setIsScheduleApptOpen(true);
                  }}
                  onSelectPatient={id => setSelectedProfilePatientId(id)}
                />
              )}

              {activeTab === 'ai-attention' && (
                <AiAttentionCenter
                  onSelectPatient={id => setSelectedProfilePatientId(id)}
                  onOpenScheduleAppt={id => {
                    setScheduleApptPatientId(id);
                    setIsScheduleApptOpen(true);
                  }}
                />
              )}

              {activeTab === 'analytics' && <ReportsAndAnalytics />}

              {activeTab === 'notifications' && <NotificationsView />}

              {activeTab === 'settings' && <SettingsView />}
            </main>
          </div>
        </div>
      )}

      {/* Global Interactive Workflow Banner */}
      <WorkflowBanner />

      {/* MODALS */}
      {/* 1. Add Patient Modal */}
      {isAddPatientOpen && (
        <AddPatientModal
          onClose={() => setIsAddPatientOpen(false)}
          onSuccess={newId => {
            setSelectedProfilePatientId(newId);
          }}
        />
      )}

      {/* 2. Add Medicine Modal */}
      {isAddMedicineOpen && (
        <AddMedicineModal
          initialPatientId={addMedicinePatientId}
          onClose={() => {
            setIsAddMedicineOpen(false);
            setAddMedicinePatientId(undefined);
          }}
        />
      )}

      {/* 3. Schedule Appointment Modal */}
      {isScheduleApptOpen && (
        <ScheduleAppointmentModal
          initialPatientId={scheduleApptPatientId}
          onClose={() => {
            setIsScheduleApptOpen(false);
            setScheduleApptPatientId(undefined);
          }}
        />
      )}

      {/* 4. Patient Detailed Profile Modal */}
      {selectedProfilePatientId && selectedPatientForProfile && (
        <PatientProfileModal
          patient={selectedPatientForProfile}
          onClose={() => setSelectedProfilePatientId(null)}
          onOpenAddMedicine={id => {
            setSelectedProfilePatientId(null);
            setAddMedicinePatientId(id);
            setIsAddMedicineOpen(true);
          }}
          onOpenScheduleAppt={id => {
            setSelectedProfilePatientId(null);
            setScheduleApptPatientId(id);
            setIsScheduleApptOpen(true);
          }}
        />
      )}

      {/* 5. Live Presentation Simulator Modal */}
      {isSimulateOpen && (
        <SimulateActionModal onClose={() => setIsSimulateOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
