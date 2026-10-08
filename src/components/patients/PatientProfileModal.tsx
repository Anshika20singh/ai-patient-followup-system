import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, RiskLevel } from '../../types';
import {
  X,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Pill,
  Send,
  Plus,
  Activity,
  HeartPulse,
  Sparkles,
  MapPin,
  UserCheck
} from 'lucide-react';

interface PatientProfileModalProps {
  patient: Patient;
  onClose: () => void;
  onOpenAddMedicine: (patientId: string) => void;
  onOpenScheduleAppt: (patientId: string) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  patient,
  onClose,
  onOpenAddMedicine,
  onOpenScheduleAppt
}) => {
  const {
    medicines,
    appointments,
    markFollowUpContacted,
    updatePatient,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'medicines' | 'appointments' | 'followups'>('overview');
  const [newNote, setNewNote] = useState('');
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);

  const patientMeds = medicines.filter(m => m.patientId === patient.id);
  const patientAppts = appointments.filter(a => a.patientId === patient.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    markFollowUpContacted(patient.id, newNote.trim());
    setNewNote('');
  };

  const handleSendQuickNudge = () => {
    setNudgeMessage('Direct WhatsApp/SMS follow-up dispatched to patient phone.');
    addNotification({
      type: 'medicine',
      title: 'Direct Care Nudge Sent',
      message: `Follow-up check-in sent to ${patient.name} (${patient.phone}).`,
      read: false,
      severity: 'normal',
      patientId: patient.id,
      patientName: patient.name
    });
    setTimeout(() => setNudgeMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#101326] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between bg-[#151933]/90">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-purple-950/60 border border-purple-400/30">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white">{patient.name}</h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    patient.riskCategory === 'High'
                      ? 'bg-rose-500/20 text-pink-300 border border-rose-500/40'
                      : patient.riskCategory === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}
                >
                  {patient.riskCategory} Risk
                </span>
                <span className="text-xs text-purple-300/80 font-mono">ID: {patient.id}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>Age: {patient.age}</span>
                <span>•</span>
                <span>Gender: {patient.gender}</span>
                <span>•</span>
                <span>Phone: {patient.phone}</span>
                <span>•</span>
                <span className="font-semibold text-teal-300">{patient.primaryCondition}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nudge Confirmation Toast */}
        {nudgeMessage && (
          <div className="bg-teal-950/80 border-b border-teal-500/30 px-6 py-2 text-xs text-teal-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{nudgeMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-white/10 bg-[#0c0e1e] text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'medicines', label: `Medicines (${patientMeds.length})` },
            { id: 'appointments', label: `Appointments (${patientAppts.length})` },
            { id: 'followups', label: 'Follow-ups & Clinical Notes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-400 text-purple-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Two columns: Patient Information & AI Attention Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Patient Information */}
                <div className="p-4 rounded-2xl border border-white/10 bg-[#141830]/80">
                  <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    Patient Information
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Blood Group</span>
                      <span className="font-semibold text-white">{patient.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Discharge Date</span>
                      <span className="font-semibold text-white">{patient.dischargeDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Attending Doctor</span>
                      <span className="font-semibold text-white">{patient.assignedDoctor}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Address</span>
                      <span className="font-medium text-white text-right">{patient.address}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Emergency Contact</span>
                      <span className="font-medium text-white text-right">{patient.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                {/* AI Attention Status */}
                <div className="p-4 rounded-2xl border border-white/10 bg-[#141830]/80">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      AI Attention Status
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        patient.riskCategory === 'High'
                          ? 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                          : patient.riskCategory === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      }`}
                    >
                      {patient.riskCategory === 'Low' ? 'Stable Condition' : `${patient.riskCategory} Priority`}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#191e3d] border border-white/5 mb-3">
                    <p className="text-[11px] font-semibold text-purple-300 uppercase tracking-wide">
                      Clinical AI Reason
                    </p>
                    <p className="text-white font-medium mt-1 leading-relaxed">
                      {patient.riskReason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Calculated Risk Index:</span>
                    <span className="font-bold text-white font-mono text-sm">
                      {patient.riskScore} / 100
                    </span>
                  </div>
                  <div className="w-full bg-[#1b2042] h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        patient.riskScore > 70
                          ? 'bg-rose-500'
                          : patient.riskScore > 40
                          ? 'bg-amber-500'
                          : 'bg-teal-400'
                      }`}
                      style={{ width: `${patient.riskScore}%` }}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleSendQuickNudge}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5 text-pink-300" />
                      <span>Dispatch Alert</span>
                    </button>
                    <button
                      onClick={() => onOpenScheduleAppt(patient.id)}
                      className="py-2 px-3 rounded-xl border border-purple-500/30 hover:bg-white/5 text-slate-200 font-semibold text-xs transition-colors"
                    >
                      Schedule Appt
                    </button>
                  </div>
                </div>
              </div>

              {/* Care Timeline */}
              <div className="p-4 rounded-2xl border border-white/10 bg-[#141830]/80">
                <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  Post-Discharge Timeline
                </h3>

                <div className="relative border-l-2 border-purple-500/30 ml-4 space-y-5 py-1">
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-[#141830] shadow-xs"></div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Discharged from Hospital</span>
                        <span className="text-slate-400 text-[11px]">{patient.dischargeDate}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Inpatient stay completed. Care transitioned to PulseCare AI digital follow-up.
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-teal-400 border-2 border-[#141830] shadow-xs"></div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">First Digital Check-in</span>
                        <span className="text-slate-400 text-[11px]">Day 3 Post-Discharge</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Patient enrolled, medication schedule synchronized.
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-pink-400 border-2 border-[#141830] shadow-xs"></div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Next Scheduled Follow-up</span>
                        <span className="font-bold text-teal-300 text-[11px]">{patient.nextFollowUpDate}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        OPD clinical consultation and vital sign check.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medicines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Prescribed Medicine Schedule</h3>
                <button
                  onClick={() => onOpenAddMedicine(patient.id)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-purple-500 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-pink-300" />
                  <span>Add Medicine</span>
                </button>
              </div>

              {patientMeds.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white/5 rounded-2xl border border-white/5">
                  No medicines prescribed yet for this patient.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {patientMeds.map(m => (
                    <div key={m.id} className="p-3.5 rounded-2xl border border-white/10 bg-[#141830]/80 shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <span className="ml-1 text-purple-300 font-semibold">{m.dosage}</span>
                          <p className="text-slate-400 text-[11px] mt-0.5">{m.instructions}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === 'Taken'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : m.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Timing: <strong className="text-white">{m.timing}</strong></span>
                        <span>Adherence: <strong className="text-teal-300">{m.adherenceRate}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Scheduled Appointments</h3>
                <button
                  onClick={() => onOpenScheduleAppt(patient.id)}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-teal-500 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>

              {patientAppts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white/5 rounded-2xl border border-white/5">
                  No appointments booked for this patient yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {patientAppts.map(a => (
                    <div key={a.id} className="p-3.5 rounded-2xl border border-white/10 bg-[#141830]/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{a.department}</span>
                          <span className="text-slate-400">with {a.doctorName}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {a.date} at {a.time} • {a.type}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          a.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : a.status === 'Missed'
                            ? 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'followups' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Clinical Notes & Follow-up Log</h3>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Record doctor / nurse follow-up notes, patient phone call summary, or medication adjustments..."
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl border border-purple-500/25 bg-[#161a33] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition"
                  >
                    Save Clinical Note
                  </button>
                </div>
              </form>

              <div className="space-y-2 mt-4">
                {patient.notes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#141830] border border-white/5 text-xs text-slate-300">
                    <p className="leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
