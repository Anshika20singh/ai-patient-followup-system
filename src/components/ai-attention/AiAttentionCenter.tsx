import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, RiskLevel } from '../../types';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Send,
  UserCheck,
  ChevronRight,
  Info,
  RotateCw,
  Clock
} from 'lucide-react';

interface AiAttentionCenterProps {
  onSelectPatient: (patientId: string) => void;
  onOpenScheduleAppt: (patientId: string) => void;
}

export const AiAttentionCenter: React.FC<AiAttentionCenterProps> = ({
  onSelectPatient,
  onOpenScheduleAppt
}) => {
  const {
    patients,
    runAiTriage,
    markFollowUpContacted,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [recalculating, setRecalculating] = useState(false);
  const [resolvedPatientId, setResolvedPatientId] = useState<string | null>(null);

  const highAttentionPatients = patients.filter(p => p.riskCategory === 'High');
  const mediumAttentionPatients = patients.filter(p => p.riskCategory === 'Medium');
  const lowAttentionPatients = patients.filter(p => p.riskCategory === 'Low');

  const handleRunTriage = () => {
    setRecalculating(true);
    setTimeout(() => {
      runAiTriage();
      setRecalculating(false);
    }, 700);
  };

  const handleMarkFollowUpDone = (patient: Patient) => {
    setResolvedPatientId(patient.id);
    markFollowUpContacted(patient.id, 'Clinical tele-triage conducted by Dr. Sharma. Patient counseled on adherence.');
    setTimeout(() => setResolvedPatientId(null), 2500);
  };

  const handleQuickCall = (patient: Patient) => {
    addNotification({
      type: 'alert',
      title: 'Nurse Call Initiated',
      message: `Nurse outreach initiated to ${patient.name} (${patient.phone}).`,
      read: false,
      severity: 'normal',
      patientId: patient.id,
      patientName: patient.name
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-sans tracking-tight">AI Attention Center</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Decision Support
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time patient cohort risk prioritization driven by medicine responses and clinical milestones
          </p>
        </div>

        <button
          onClick={handleRunTriage}
          disabled={recalculating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-95 transition shadow-lg shadow-purple-950/60 border border-purple-400/30 self-start md:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
          <span>{recalculating ? 'Analyzing Telemetry...' : 'Recalculate AI Risk Triage'}</span>
        </button>
      </div>

      {/* Assistive AI Safety Statement Banner */}
      <div className="p-4 rounded-3xl bg-[#1d1822]/90 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3 shadow-xl">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">
            Clinical Assistive Safety Statement
          </p>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            PulseCare AI is an assistive decision-aid system engineered to highlight missed reminders and follow-up delays.
            It does not diagnose, prescribe, or substitute professional healthcare judgment. Healthcare professionals must independently verify all patient recommendations before intervention.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-2 rounded-2xl border border-purple-900/30 shadow-2xl flex items-center gap-1.5 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-1.5 px-3.5 rounded-xl font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-purple-600/30 text-purple-200 font-bold border border-purple-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Attention Cohorts ({patients.length})
        </button>

        <button
          onClick={() => setActiveTab('high')}
          className={`py-1.5 px-3.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'high'
              ? 'bg-rose-500/20 text-pink-300 font-bold border border-rose-500/40 glow-pink'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>High Attention ({highAttentionPatients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('medium')}
          className={`py-1.5 px-3.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'medium'
              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Medium Attention ({mediumAttentionPatients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('low')}
          className={`py-1.5 px-3.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'low'
              ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40 glow-teal'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Low Attention ({lowAttentionPatients.length})</span>
        </button>
      </div>

      {/* 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HIGH ATTENTION COLUMN (Rose / Pink Accent) */}
        {(activeTab === 'all' || activeTab === 'high') && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#221020]/90 border border-rose-500/40 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h2 className="font-bold text-xs text-pink-200">
                  High Attention ({highAttentionPatients.length})
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wider">
                Immediate Review
              </span>
            </div>

            <div className="space-y-3">
              {highAttentionPatients.map(patient => (
                <div
                  key={patient.id}
                  className="bg-[#14152a]/90 backdrop-blur-xl p-4 rounded-3xl border-2 border-rose-500/35 shadow-xl hover:border-rose-400/60 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <button
                        onClick={() => onSelectPatient(patient.id)}
                        className="font-bold text-sm text-white hover:text-pink-300 transition-colors text-left"
                      >
                        {patient.name}
                      </button>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {patient.id} • Age: {patient.age} • {patient.phone}
                      </p>
                    </div>
                    <span className="font-bold font-mono text-xs text-pink-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md">
                      Risk {patient.riskScore}
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-2xl bg-[#211222] border border-rose-500/20 text-xs">
                    <p className="font-semibold text-pink-300 text-[11px] mb-0.5">
                      Flagged Clinical Reason:
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {patient.riskReason}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleQuickCall(patient)}
                      className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-pink-300 text-[11px] font-semibold flex items-center gap-1 border border-rose-500/30 transition"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Patient</span>
                    </button>

                    <button
                      onClick={() => handleMarkFollowUpDone(patient)}
                      className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold flex items-center gap-1 transition shadow-md shadow-purple-950/60"
                    >
                      <UserCheck className="w-3 h-3 text-pink-300" />
                      <span>{resolvedPatientId === patient.id ? 'Logged!' : 'Mark Contacted'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEDIUM ATTENTION COLUMN (Amber Accent) */}
        {(activeTab === 'all' || activeTab === 'medium') && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#221b10]/90 border border-amber-500/40 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="font-bold text-xs text-amber-200">
                  Medium Attention ({mediumAttentionPatients.length})
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                Monitor Closely
              </span>
            </div>

            <div className="space-y-3">
              {mediumAttentionPatients.map(patient => (
                <div
                  key={patient.id}
                  className="bg-[#14152a]/90 backdrop-blur-xl p-4 rounded-3xl border border-amber-500/30 shadow-xl hover:border-amber-400/60 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <button
                        onClick={() => onSelectPatient(patient.id)}
                        className="font-bold text-sm text-white hover:text-amber-300 transition-colors text-left"
                      >
                        {patient.name}
                      </button>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {patient.id} • Age: {patient.age} • {patient.phone}
                      </p>
                    </div>
                    <span className="font-bold font-mono text-xs text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md">
                      Risk {patient.riskScore}
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-2xl bg-[#221c12] border border-amber-500/20 text-xs">
                    <p className="font-semibold text-amber-300 text-[11px] mb-0.5">
                      Flagged Clinical Reason:
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {patient.riskReason}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenScheduleAppt(patient.id)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition"
                    >
                      Schedule Review
                    </button>

                    <button
                      onClick={() => handleMarkFollowUpDone(patient)}
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-semibold transition"
                    >
                      {resolvedPatientId === patient.id ? 'Resolved!' : 'Mark Checked'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOW ATTENTION COLUMN (Teal Accent) */}
        {(activeTab === 'all' || activeTab === 'low') && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#0f2122]/90 border border-teal-500/40 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <h2 className="font-bold text-xs text-teal-200">
                  Low Attention ({lowAttentionPatients.length})
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-teal-300 uppercase tracking-wider">
                Stable / On Track
              </span>
            </div>

            <div className="space-y-3">
              {lowAttentionPatients.map(patient => (
                <div
                  key={patient.id}
                  className="bg-[#14152a]/90 backdrop-blur-xl p-4 rounded-3xl border border-teal-500/30 shadow-xl hover:border-teal-400/60 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <button
                        onClick={() => onSelectPatient(patient.id)}
                        className="font-bold text-sm text-white hover:text-teal-300 transition-colors text-left"
                      >
                        {patient.name}
                      </button>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {patient.id} • Age: {patient.age}
                      </p>
                    </div>
                    <span className="font-bold font-mono text-xs text-teal-300 bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 rounded-md">
                      Risk {patient.riskScore}
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-2xl bg-[#112426] border border-teal-500/20 text-xs">
                    <p className="font-semibold text-teal-300 text-[11px] mb-0.5">
                      Status Summary:
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {patient.riskReason}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Next Follow-up: <strong className="text-slate-200">{patient.nextFollowUpDate}</strong>
                    </span>
                    <button
                      onClick={() => onSelectPatient(patient.id)}
                      className="text-xs font-semibold text-teal-400 hover:text-teal-300"
                    >
                      Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
