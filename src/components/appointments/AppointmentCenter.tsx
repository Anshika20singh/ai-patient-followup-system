import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Send,
  Video,
  Hospital,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AppointmentCenterProps {
  onOpenSchedule: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const AppointmentCenter: React.FC<AppointmentCenterProps> = ({
  onOpenSchedule,
  onSelectPatient
}) => {
  const { appointments, updateAppointmentStatus, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'missed' | 'reminders'>('all');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(8); // 8th Oct

  const filteredAppointments = appointments.filter(a => {
    if (activeTab === 'upcoming') return a.status === 'Upcoming' || a.status === 'Confirmed';
    if (activeTab === 'missed') return a.status === 'Missed';
    if (activeTab === 'reminders') return a.reminderSent;
    return true;
  });

  // Calendar days grid for October 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const appointmentDays = [7, 8, 9, 12, 15, 16, 20, 22];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white font-sans tracking-tight">Appointment Center</h1>
          <p className="text-xs text-slate-400">
            Manage post-discharge clinical visits, track attendance and send automated reminder nudges
          </p>
        </div>

        <button
          onClick={onOpenSchedule}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-semibold transition shadow-lg shadow-teal-950/60 border border-teal-400/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Mini Calendar */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-white">October 2026</h2>
            <div className="flex items-center gap-1">
              <button aria-label="Previous month" className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button aria-label="Next month" className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* 4 offset days */}
            <div className="h-8"></div>
            <div className="h-8"></div>
            <div className="h-8"></div>
            <div className="h-8"></div>

            {daysInMonth.map(day => {
              const isSelected = selectedCalendarDay === day;
              const hasAppt = appointmentDays.includes(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedCalendarDay(day)}
                  className={`h-8 rounded-xl flex flex-col items-center justify-center relative font-medium transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-950/60 border border-purple-400/40 glow-purple'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <span>{day}</span>
                  {hasAppt && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-pink-300' : 'bg-teal-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>Appointments booked</span>
            </span>
            <span className="font-semibold text-purple-300">8 visits this month</span>
          </div>
        </div>

        {/* Right Column: Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="bg-[#121528]/80 backdrop-blur-xl p-2 rounded-2xl border border-purple-900/30 shadow-2xl flex items-center gap-1 text-xs">
            {[
              { id: 'all', label: `All (${appointments.length})` },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'missed', label: 'Missed' },
              { id: 'reminders', label: 'Reminders Sent' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-xl font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List of cards */}
          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="bg-[#121528]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 text-center text-slate-400 text-xs">
                No appointments found for the selected view.
              </div>
            ) : (
              filteredAppointments.map(appt => (
                <div
                  key={appt.id}
                  className="bg-[#121528]/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-purple-900/30 shadow-2xl hover:border-teal-500/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                        {appt.type.includes('Virtual') ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <Hospital className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => onSelectPatient(appt.patientId)}
                            className="font-bold text-sm text-white hover:text-teal-300 transition-colors text-left"
                          >
                            {appt.patientName}
                          </button>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              appt.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : appt.status === 'Missed'
                                ? 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-300 mt-0.5">
                          {appt.department} • <span className="text-purple-300">{appt.doctorName}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {appt.notes}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between shrink-0 gap-2">
                      <div className="text-left sm:text-right text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <CalendarIcon className="w-3.5 h-3.5 text-teal-400" />
                          <span>{appt.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] mt-0.5">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>{appt.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {appt.status !== 'Confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, 'Confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status !== 'Missed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, 'Missed')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-pink-300 text-[11px] font-semibold border border-rose-500/30 transition"
                          >
                            Mark Missed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
