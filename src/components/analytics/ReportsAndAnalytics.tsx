import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  PieChart
} from 'lucide-react';

export const ReportsAndAnalytics: React.FC = () => {
  const { stats, patients, medicines } = useApp();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '6M'>('30D');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // SVG circular progress component with neon glow
  const CircularProgress = ({
    percentage,
    color,
    label
  }: {
    percentage: number;
    color: string;
    label: string;
  }) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              className="text-[#1a1f3d]"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`${color} transition-all duration-700`}
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-black text-white tracking-tight font-mono">
              {percentage}%
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs font-bold text-slate-200 text-center">{label}</p>
      </div>
    );
  };

  const handleExport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      reportRange: timeRange,
      metrics: {
        medicineAdherence: stats.overallAdherence,
        reminderCompletion: 92,
        missedAppointments: 12,
        followUpCompletion: stats.followUpCompletionRate,
        cohortSize: patients.length,
        aiAttentionBreakdown: stats.aiAttentionCases
      },
      patients: patients.map(p => ({
        id: p.id,
        name: p.name,
        riskCategory: p.riskCategory,
        riskScore: p.riskScore,
        condition: p.primaryCondition,
        followUpStatus: p.followUpStatus
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PulseCare_Clinical_Report_${timeRange}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('PulseCare Clinical Audit Report exported as JSON summary.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Weekly compliance data
  const weeklyData = [
    { day: 'Mon', adherence: 88, completedReminders: 16 },
    { day: 'Tue', adherence: 91, completedReminders: 18 },
    { day: 'Wed', adherence: 84, completedReminders: 15 },
    { day: 'Thu', adherence: 94, completedReminders: 19 },
    { day: 'Fri', adherence: 89, completedReminders: 17 },
    { day: 'Sat', adherence: 82, completedReminders: 14 },
    { day: 'Sun', adherence: 86, completedReminders: 16 }
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {exportNotice && (
        <div className="p-3.5 rounded-2xl bg-[#1b1436] text-white flex items-center justify-between text-xs shadow-2xl border border-purple-500/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-pink-400" />
            <span className="text-purple-200">{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-purple-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white font-sans tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-slate-400">
            Track adherence performance, missed milestones, and AI triage distributions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-[#161a33] p-1 rounded-2xl text-xs font-semibold border border-purple-500/20">
            {(['7D', '30D', '3M', '6M'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeRange === range
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1d2244] hover:bg-[#252c56] text-white text-xs font-semibold transition shadow-md border border-purple-500/30"
          >
            <Download className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>
        </div>
      </div>

      {/* 4 Circular Progress KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-500/25 shadow-xl flex flex-col items-center">
          <CircularProgress
            percentage={stats.overallAdherence}
            color="text-purple-400"
            label="Medicine Adherence"
          />
          <span className="text-[10px] text-purple-300/80 mt-1">Benchmark: &gt;85%</span>
        </div>

        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-teal-500/25 shadow-xl flex flex-col items-center">
          <CircularProgress
            percentage={92}
            color="text-teal-400"
            label="Reminder Completion"
          />
          <span className="text-[10px] text-teal-300/80 mt-1">Response in &lt;1h</span>
        </div>

        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-pink-500/25 shadow-xl flex flex-col items-center">
          <CircularProgress
            percentage={12}
            color="text-pink-400"
            label="Missed Appointments"
          />
          <span className="text-[10px] text-pink-300/80 mt-1">Down 4% this month</span>
        </div>

        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/25 shadow-xl flex flex-col items-center">
          <CircularProgress
            percentage={stats.followUpCompletionRate}
            color="text-emerald-400"
            label="Follow-up Completion"
          />
          <span className="text-[10px] text-emerald-300/80 mt-1">Supervised by Dr. Sharma</span>
        </div>
      </div>

      {/* Two Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Attention Statistics */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-bold text-white">AI Attention Statistics</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Cohort Distribution</span>
          </div>

          <div className="h-52 flex items-end justify-around pt-6 px-4 pb-2 border-b border-white/10">
            {/* High Attention Bar */}
            <div className="flex flex-col items-center gap-2 w-20 group">
              <span className="text-xs font-bold font-mono text-pink-300">
                {stats.aiAttentionCases.high} cases
              </span>
              <div
                className="w-12 bg-gradient-to-t from-rose-700 to-pink-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-lg shadow-rose-950/60"
                style={{ height: `${Math.max(25, (stats.aiAttentionCases.high / patients.length) * 160)}px` }}
              />
              <span className="text-xs font-bold text-white">High</span>
              <span className="text-[10px] text-pink-400">Immediate</span>
            </div>

            {/* Medium Attention Bar */}
            <div className="flex flex-col items-center gap-2 w-20 group">
              <span className="text-xs font-bold font-mono text-amber-300">
                {stats.aiAttentionCases.medium} cases
              </span>
              <div
                className="w-12 bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-lg shadow-amber-950/60"
                style={{ height: `${Math.max(25, (stats.aiAttentionCases.medium / patients.length) * 160)}px` }}
              />
              <span className="text-xs font-bold text-white">Medium</span>
              <span className="text-[10px] text-amber-400">Monitor</span>
            </div>

            {/* Low Attention Bar */}
            <div className="flex flex-col items-center gap-2 w-20 group">
              <span className="text-xs font-bold font-mono text-teal-300">
                {stats.aiAttentionCases.low} cases
              </span>
              <div
                className="w-12 bg-gradient-to-t from-teal-700 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-lg shadow-teal-950/60"
                style={{ height: `${Math.max(25, (stats.aiAttentionCases.low / patients.length) * 160)}px` }}
              />
              <span className="text-xs font-bold text-white">Low</span>
              <span className="text-[10px] text-teal-400">Stable</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            The AI engine automatically down-triages patients as they complete doses, and escalates when consecutive misses occur.
          </p>
        </div>

        {/* Right: Weekly Adherence Trend */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-bold text-white">7-Day Adherence Trajectory</h2>
            </div>
            <span className="text-xs font-semibold text-teal-300 font-mono">Avg 88%</span>
          </div>

          <div className="h-52 flex items-end justify-between pt-6 px-2 pb-2 border-b border-white/10">
            {weeklyData.map(item => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1 group">
                <span className="text-[11px] font-bold font-mono text-slate-400 group-hover:text-purple-300">
                  {item.adherence}%
                </span>
                <div
                  className="w-7 sm:w-9 bg-gradient-to-t from-purple-800 via-indigo-600 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-md shadow-purple-950/60"
                  style={{ height: `${(item.adherence / 100) * 130}px` }}
                />
                <span className="text-xs font-semibold text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Peak compliance: <strong className="text-teal-300">Thursday (94%)</strong></span>
            <span>Follow-up prompt efficacy: <strong className="text-purple-300">+18%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
