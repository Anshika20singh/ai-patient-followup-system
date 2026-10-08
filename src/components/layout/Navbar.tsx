import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw,
  UserCheck,
  Stethoscope,
  ChevronDown,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface NavbarProps {
  onOpenSimulate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSimulate }) => {
  const {
    role,
    setRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    selectedPatientId,
    setSelectedPatientId,
    patients,
    resetToSampleData
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  return (
    <header className="sticky top-0 z-30 bg-[#0c0e1c]/85 backdrop-blur-xl border-b border-purple-900/25 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (role === 'landing') setRole('staff');
                setActiveTab('dashboard');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-purple-950/60 group-hover:scale-105 group-hover:shadow-purple-500/30 transition-all border border-purple-400/30">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors font-sans">
                    PulseCare
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-pink-300 border border-pink-500/30 tracking-wider uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Patient Follow-up & Medicine Reminder System
                </p>
              </div>
            </button>
          </div>

          {/* Central Role / Perspective Switcher */}
          <div className="flex items-center bg-[#14182e]/90 p-1 rounded-xl border border-purple-500/20 shadow-inner text-xs">
            <button
              onClick={() => {
                setRole('staff');
                setActiveTab('dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                role === 'staff'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-purple-300" />
              <span>Staff Dashboard</span>
            </button>

            <button
              onClick={() => {
                setRole('patient');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                role === 'patient'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-900/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>Patient View</span>
              <span className="hidden md:inline text-[10px] text-slate-300/80 font-normal">
                ({currentPatient ? currentPatient.name.split(' ')[0] : 'Aarav'})
              </span>
            </button>

            <button
              onClick={() => setRole('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                role === 'landing'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-900/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Info</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Simulator Button */}
            <button
              onClick={onOpenSimulate}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white text-xs font-medium border border-purple-500/30 transition-all hover:border-purple-400"
              title="Simulate patient response or dose action for demonstration"
            >
              <Zap className="w-3.5 h-3.5 text-pink-400" />
              <span>Simulate Workflow</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-purple-500/20"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-bold text-white shadow-md shadow-pink-900/60 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#121528]/95 backdrop-blur-2xl shadow-2xl border border-purple-500/25 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/30">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.patientId && role === 'staff') {
                              setSelectedPatientId(n.patientId);
                            }
                          }}
                          className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer border ${
                            !n.read
                              ? 'bg-purple-950/40 border-purple-500/30 hover:bg-purple-900/40'
                              : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {n.severity === 'urgent' ? (
                              <ShieldAlert className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                            ) : n.type === 'medicine' ? (
                              <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className="font-semibold text-slate-100 truncate">{n.title}</p>
                                <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                              </div>
                              <p className="text-slate-300 line-clamp-2 mt-0.5 text-[11px]">{n.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setRole('staff');
                        setActiveTab('notifications');
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      View all notification center →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Badge */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-purple-500/20"
              >
                {role === 'staff' ? (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-md shadow-purple-950/60 border border-purple-400/30">
                      DS
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-xs font-bold text-white leading-tight">Dr. Sharma</p>
                      <p className="text-[10px] text-purple-300">Healthcare Staff</p>
                    </div>
                  </>
                ) : role === 'patient' ? (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-teal-950/60 border border-teal-400/30">
                      {currentPatient ? currentPatient.name.slice(0, 2).toUpperCase() : 'AS'}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-xs font-bold text-white leading-tight">
                        {currentPatient ? currentPatient.name : 'Aarav Singh'}
                      </p>
                      <p className="text-[10px] text-teal-300">Patient Portal</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-pink-950/60 border border-pink-400/30">
                      PC
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-xs font-bold text-white leading-tight">PulseCare</p>
                      <p className="text-[10px] text-pink-300">Public Portal</p>
                    </div>
                  </>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile / Demo switch menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#121528]/95 backdrop-blur-2xl shadow-2xl border border-purple-500/25 p-2 z-50">
                  <div className="p-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-white">
                      {role === 'staff' ? 'Dr. Sharma (Cardiology Staff)' : `${currentPatient.name} (Patient)`}
                    </p>
                    <p className="text-[11px] text-purple-300">
                      {role === 'staff' ? 'staff.sharma@pulsecare.ai' : currentPatient.email}
                    </p>
                  </div>

                  {role === 'patient' && (
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-slate-400 mb-1">Switch Patient View:</p>
                      <select
                        value={selectedPatientId}
                        onChange={e => setSelectedPatientId(e.target.value)}
                        className="w-full text-xs p-1.5 rounded-lg border border-purple-500/20 bg-[#191d36] text-white"
                      >
                        {patients.map(p => (
                          <option key={p.id} value={p.id} className="bg-[#121528] text-white">
                            {p.name} ({p.riskCategory} Risk)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        resetToSampleData();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-left transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                      <span>Reset Sample Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
