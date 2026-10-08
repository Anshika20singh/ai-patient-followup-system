import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BellRing,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Sparkles,
  Pill,
  Send,
  UserCheck,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Activity,
  Plus,
  Phone,
  BarChart2,
  Zap
} from 'lucide-react';

interface StaffDashboardProps {
  onOpenAddPatient: () => void;
  onOpenAddMedicine: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onOpenAddPatient,
  onOpenAddMedicine,
  onSelectPatient
}) => {
  const {
    stats,
    patients,
    medicines,
    appointments,
    activities,
    setActiveTab,
    runAiTriage,
    markFollowUpContacted,
    addNotification
  } = useApp();

  const [triageToast, setTriageToast] = useState<string | null>(null);
  const [nudgedPatientId, setNudgedPatientId] = useState<string | null>(null);
  const [activityTimeframe, setActivityTimeframe] = useState<'7D' | '24H'>('7D');

  // Trigger AI Triage
  const handleRunAiTriage = () => {
    const result = runAiTriage();
    setTriageToast(
      `AI Triage complete! Evaluated ${patients.length} patients (${result.high} High, ${result.medium} Medium, ${result.low} Low attention).`
    );
    setTimeout(() => setTriageToast(null), 4500);
  };

  const handleNudgeReminder = (medId: string, patientName: string, medName: string) => {
    setNudgedPatientId(medId);
    addNotification({
      type: 'medicine',
      title: 'Staff Nudge Sent',
      message: `SMS & WhatsApp push reminder dispatched to ${patientName} for ${medName}.`,
      read: false,
      severity: 'normal',
      patientName
    });
    setTimeout(() => setNudgedPatientId(null), 2500);
  };

  // Medicine reminders for today
  const todayReminders = medicines.slice(0, 6);

  // Upcoming appointments
  const upcomingAppointmentsList = appointments.slice(0, 5);

  // AI Attention Queue (patients requiring priority review)
  const aiAttentionQueue = patients
    .filter(p => p.riskCategory === 'High' || p.riskCategory === 'Medium')
    .slice(0, 4);

  // Chart data points for 7-day care activities
  const careActivityData = [
    { label: 'Mon', count: 28, adherence: 88 },
    { label: 'Tue', count: 35, adherence: 92 },
    { label: 'Wed', count: 24, adherence: 82 },
    { label: 'Thu', count: 42, adherence: 95 },
    { label: 'Fri', count: 38, adherence: 89 },
    { label: 'Sat', count: 20, adherence: 80 },
    { label: 'Sun', count: 31, adherence: 86 }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {triageToast && (
        <div className="p-3.5 rounded-2xl bg-[#1a1438] text-white flex items-center justify-between shadow-2xl border border-purple-500/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
            <span className="text-purple-100">{triageToast}</span>
          </div>
          <button
            onClick={() => setTriageToast(null)}
            className="text-xs text-purple-300 hover:text-white px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121528]/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-purple-900/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
              Good Morning, Dr. Sharma
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Live Supervision
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            Clinical intelligence & post-discharge adherence status for today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          <button
            onClick={handleRunAiTriage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 text-white text-xs font-semibold hover:opacity-95 transition shadow-lg shadow-purple-950/60 border border-purple-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-200" />
            <span>Run AI Risk Triage</span>
          </button>

          <button
            onClick={onOpenAddPatient}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1c2242] hover:bg-[#252c54] text-white text-xs font-semibold border border-purple-500/25 transition shadow-md"
          >
            <Plus className="w-3.5 h-3.5 text-purple-300" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards with Glassmorphism and Neon Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Patients (Cyan/Teal Secondary Accent) */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-teal-500/25 shadow-xl hover:border-teal-400/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Patients</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight font-mono">
              {stats.activePatients}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>2 new enrolled this week</span>
          </div>
        </div>

        {/* Today's Reminders (Violet/Purple Primary Accent) */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-500/25 shadow-xl hover:border-purple-400/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Reminders</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center justify-center shadow-xs">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight font-mono">
              {stats.todayRemindersCount}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.todayPendingReminders} pending responses</span>
          </div>
        </div>

        {/* Upcoming Appointments (Subtle Pink Highlight) */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-pink-500/25 shadow-xl hover:border-pink-400/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Upcoming Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-300 border border-pink-500/30 flex items-center justify-center shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight font-mono">
              {stats.upcomingAppointmentsCount}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-pink-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.todayAppointmentsCount} scheduled for today</span>
          </div>
        </div>

        {/* Follow-up Completion (Emerald/Teal Accent) */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/25 shadow-xl hover:border-emerald-400/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Follow-up Completion</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight font-mono">
              {stats.followUpCompletionRate}%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>↑ 12% from last week</span>
          </div>
        </div>
      </div>

      {/* AI Attention Cases Banner */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white font-sans">AI Attention Cases</h2>
            <span className="text-[11px] text-slate-400 font-medium">
              (Assistive clinical risk classification)
            </span>
          </div>
          <button
            onClick={() => setActiveTab('ai-attention')}
            className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Open Triage Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* High Attention */}
          <div
            onClick={() => setActiveTab('ai-attention')}
            className="p-4 rounded-2xl bg-[#211224]/80 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                High Attention
              </span>
              <span className="w-6 h-6 rounded-full bg-rose-500/25 text-pink-200 border border-rose-500/40 text-xs font-bold flex items-center justify-center">
                {stats.aiAttentionCases.high}
              </span>
            </div>
            <div className="mt-2.5">
              <p className="text-2xl font-black text-white tracking-tight font-mono">
                {stats.aiAttentionCases.high}
              </p>
              <p className="text-[11px] text-rose-300/90 font-medium mt-0.5">
                Needs immediate clinical review & callback
              </p>
            </div>
          </div>

          {/* Medium Attention */}
          <div
            onClick={() => setActiveTab('ai-attention')}
            className="p-4 rounded-2xl bg-[#241c14]/80 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Medium Attention
              </span>
              <span className="w-6 h-6 rounded-full bg-amber-500/25 text-amber-200 border border-amber-500/40 text-xs font-bold flex items-center justify-center">
                {stats.aiAttentionCases.medium}
              </span>
            </div>
            <div className="mt-2.5">
              <p className="text-2xl font-black text-white tracking-tight font-mono">
                {stats.aiAttentionCases.medium}
              </p>
              <p className="text-[11px] text-amber-300/90 font-medium mt-0.5">
                Monitor reminder responses closely
              </p>
            </div>
          </div>

          {/* Low Attention */}
          <div
            onClick={() => setActiveTab('ai-attention')}
            className="p-4 rounded-2xl bg-[#0f2324]/80 border border-teal-500/40 hover:border-teal-400 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Low Attention
              </span>
              <span className="w-6 h-6 rounded-full bg-teal-500/25 text-teal-200 border border-teal-500/40 text-xs font-bold flex items-center justify-center">
                {stats.aiAttentionCases.low}
              </span>
            </div>
            <div className="mt-2.5">
              <p className="text-2xl font-black text-white tracking-tight font-mono">
                {stats.aiAttentionCases.low}
              </p>
              <p className="text-[11px] text-teal-300/90 font-medium mt-0.5">
                Stable adherence and normal recovery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Care Activity Chart & AI Attention Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Care Activity Chart (7 columns) */}
        <div className="lg:col-span-7 bg-[#121528]/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-purple-900/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Care Activity Chart</h2>
                  <p className="text-[11px] text-slate-400">
                    Daily patient responses & adherence volume
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-[#191d36] p-1 rounded-xl text-[11px] font-semibold border border-purple-500/20">
                <button
                  onClick={() => setActivityTimeframe('7D')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activityTimeframe === '7D'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setActivityTimeframe('24H')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activityTimeframe === '24H'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  24 Hours
                </button>
              </div>
            </div>

            {/* Glowing Chart Visual */}
            <div className="mt-6 h-48 flex items-end justify-between gap-2 sm:gap-3 px-2 pb-2 border-b border-white/10">
              {careActivityData.map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-teal-300 transition-colors">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[36px] bg-[#1a1f3a] rounded-t-xl overflow-hidden relative h-36 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-purple-700 via-indigo-600 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-lg shadow-purple-950/60"
                      style={{ height: `${(item.count / 45) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                <span>Active Responses</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Scheduled Prompts</span>
              </span>
            </div>
            <span className="font-semibold text-teal-300">Avg 88.5% compliance</span>
          </div>
        </div>

        {/* AI Attention Queue (5 columns) */}
        <div className="lg:col-span-5 bg-[#121528]/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-purple-900/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">AI Attention Queue</h2>
                  <p className="text-[11px] text-slate-400">Urgent clinician callbacks</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai-attention')}
                className="text-xs font-semibold text-pink-400 hover:text-pink-300"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {aiAttentionQueue.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectPatient(p.id)}
                  className="p-3 rounded-2xl bg-[#161a33]/90 border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                          {p.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            p.riskCategory === 'High'
                              ? 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {p.riskCategory}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">
                        {p.riskReason}
                      </p>
                    </div>

                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => markFollowUpContacted(p.id, 'Clinician phone triage initiated.')}
                        className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white transition-colors"
                        title="Contacted"
                      >
                        <UserCheck className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveTab('ai-attention')}
              className="w-full py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 text-xs font-medium border border-purple-500/30 transition-all text-center"
            >
              Prioritize All Follow-up Cohorts →
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Today's Medicine Reminders & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Today's Medicine Reminders (2 cols) */}
        <div className="lg:col-span-2 bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm font-bold text-white">Today's Medicine Reminders</h2>
              <p className="text-[11px] text-slate-400">
                Track real-time patient dose logs and dispatch reminder nudges.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('medicines')}
              className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400">
                  <th className="pb-2.5 font-medium">Patient</th>
                  <th className="pb-2.5 font-medium">Medicine</th>
                  <th className="pb-2.5 font-medium">Time</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {todayReminders.map(med => {
                  return (
                    <tr key={med.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3">
                        <button
                          onClick={() => onSelectPatient(med.patientId)}
                          className="font-semibold text-white group-hover:text-purple-300 text-left transition-colors flex items-center gap-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center justify-center shrink-0 border border-purple-500/30">
                            {med.patientName.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{med.patientName}</span>
                        </button>
                      </td>
                      <td className="py-3 text-slate-300 font-medium">
                        <div>
                          <span>{med.name}</span>
                          <span className="text-slate-500 ml-1 font-normal">{med.dosage}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {med.timing}
                      </td>
                      <td className="py-3">
                        {med.status === 'Taken' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Taken
                          </span>
                        ) : med.status === 'Pending' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-pink-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            Missed
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {med.status === 'Pending' ? (
                          <button
                            onClick={() => handleNudgeReminder(med.id, med.patientName, med.name)}
                            disabled={nudgedPatientId === med.id}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300 hover:text-white bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>{nudgedPatientId === med.id ? 'Nudged!' : 'Nudge'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectPatient(med.patientId)}
                            className="text-[11px] font-medium text-slate-400 hover:text-white px-2 py-1"
                          >
                            Profile
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Upcoming Appointments (1 col) */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-sm font-bold text-white">Upcoming Appointments</h2>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs font-semibold text-teal-300 hover:text-white flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3.5 space-y-3">
              {upcomingAppointmentsList.map(appt => (
                <div
                  key={appt.id}
                  onClick={() => onSelectPatient(appt.patientId)}
                  className="p-3 rounded-2xl bg-[#161a33]/90 border border-white/5 hover:border-teal-500/40 hover:bg-[#1a203f] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center justify-center shrink-0">
                        {appt.patientName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-white">{appt.patientName}</p>
                        <p className="text-[10px] text-slate-400">{appt.department}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
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
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-teal-400" />
                      {appt.date}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-purple-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {appt.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveTab('appointments')}
              className="w-full py-2 px-3 rounded-xl bg-teal-950/50 hover:bg-teal-900/50 text-teal-200 text-xs font-medium border border-teal-500/30 text-center transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Open Appointment Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Patient Care Activity Stream */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Recent Patient Activity & Care Log</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Real-time audit log</span>
        </div>

        <div className="mt-3 divide-y divide-white/5">
          {activities.slice(0, 5).map(act => (
            <div key={act.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    act.type === 'medicine_taken'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : act.type === 'medicine_missed'
                      ? 'bg-rose-500/15 text-pink-300 border-rose-500/30'
                      : act.type === 'ai_triage'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                  }`}
                >
                  {act.type === 'medicine_taken' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : act.type === 'medicine_missed' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : act.type === 'ai_triage' ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-100 truncate">{act.title}</p>
                  <p className="text-slate-400 text-[11px] truncate">{act.description}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 whitespace-nowrap shrink-0 font-mono">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
