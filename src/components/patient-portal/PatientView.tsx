import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine, ReminderStatus } from '../../types';
import confetti from 'canvas-confetti';
import {
  Heart,
  Pill,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bell,
  Sparkles,
  PhoneCall,
  User,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const PatientView: React.FC = () => {
  const {
    selectedPatientId,
    setSelectedPatientId,
    patients,
    medicines,
    appointments,
    updateMedicineStatus,
    setRole,
    setActiveTab
  } = useApp();

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patientMeds = medicines.filter(m => m.patientId === currentPatient.id);
  const patientAppts = appointments.filter(a => a.patientId === currentPatient.id);

  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'medicines' | 'appointments' | 'profile'>('home');
  const [responseModalMed, setResponseModalMed] = useState<Medicine | null>(null);
  const [skipReason, setSkipReason] = useState('Feeling nauseous / stomach upset');
  const [customReason, setCustomReason] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Take medicine action
  const handleMarkTaken = (med: Medicine) => {
    updateMedicineStatus(med.id, 'Taken');
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
    setFeedbackToast(`Great job! You logged ${med.name} ${med.dosage} as taken.`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Skip medicine action
  const handleConfirmSkip = () => {
    if (!responseModalMed) return;
    const finalReason = customReason.trim() || skipReason;
    updateMedicineStatus(responseModalMed.id, 'Missed', finalReason);
    setResponseModalMed(null);
    setFeedbackToast(`Notice recorded. Dr. Sharma's care team has been alerted of your report.`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Next medicine
  const nextMedicine = patientMeds.find(m => m.status === 'Pending') || patientMeds[0];

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-16">
      {/* Patient Perspective Switcher */}
      <div className="bg-[#121528]/80 backdrop-blur-xl border border-teal-500/30 p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-xl">
        <div className="flex items-center gap-2 text-teal-300">
          <User className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            Viewing as patient: <strong className="text-white">{currentPatient.name}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currentPatient.id}
            onChange={e => setSelectedPatientId(e.target.value)}
            aria-label="Switch patient view"
            className="text-xs p-1 rounded-xl border border-teal-500/40 bg-[#161b36] text-teal-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id} className="bg-[#101326] text-white">
                {p.name} ({p.riskCategory} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toast */}
      {feedbackToast && (
        <div className="p-3.5 rounded-2xl bg-[#0f2a2e] border border-teal-500/40 text-teal-200 flex items-center gap-2 text-xs shadow-2xl animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Patient Card with Glowing Gradients */}
      <div className="bg-gradient-to-br from-[#121528] via-[#1a1c38] to-[#121730] text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-purple-500/30 glow-purple">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-52 h-52 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm border border-teal-400/40 shadow-lg shadow-teal-950/60">
              {currentPatient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold">Hello, {currentPatient.name.split(' ')[0]} 👋</h1>
              <p className="text-xs text-slate-300">Take care of your health today!</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
            {currentPatient.primaryCondition.slice(0, 22)}...
          </span>
        </div>

        {/* Next Medicine Card */}
        {nextMedicine ? (
          <div className="bg-[#181d3d]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-purple-500/30 mt-5 shadow-inner">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-950/60 border border-purple-400/30">
                  <Pill className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                    Next Medicine Reminder
                  </span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {nextMedicine.name} {nextMedicine.dosage}
                  </p>
                  <p className="text-xs text-slate-300">
                    {nextMedicine.timing} • {nextMedicine.frequency}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  nextMedicine.status === 'Taken'
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40'
                    : 'bg-amber-500/25 text-amber-200 border border-amber-500/40 animate-pulse'
                }`}
              >
                {nextMedicine.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-white/10">
              Instruction: {nextMedicine.instructions}
            </p>

            <div className="mt-4 flex items-center gap-2">
              {nextMedicine.status !== 'Taken' ? (
                <>
                  <button
                    onClick={() => handleMarkTaken(nextMedicine)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-teal-950/60"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Took This Medicine</span>
                  </button>
                  <button
                    onClick={() => setResponseModalMed(nextMedicine)}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/20 transition"
                  >
                    Feeling Unwell / Skip
                  </button>
                </>
              ) : (
                <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold text-center border border-emerald-500/30 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dose logged for today. Well done!</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-300 mt-4">No active prescriptions assigned.</p>
        )}
      </div>

      {/* Upcoming Appointments Card */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>Upcoming Appointments</span>
          </h2>
          <button
            onClick={() => setActiveMobileTab('appointments')}
            className="text-xs font-semibold text-teal-300 hover:text-white"
          >
            View All
          </button>
        </div>

        {patientAppts.length > 0 ? (
          <div className="p-3.5 rounded-2xl bg-[#161a33]/90 border border-teal-500/30 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-white">
                {patientAppts[0].date} • {patientAppts[0].time}
              </p>
              <p className="text-xs text-teal-300 font-semibold mt-0.5">
                {patientAppts[0].department}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Attending: {patientAppts[0].doctorName}
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {patientAppts[0].status}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 text-center">No upcoming appointments booked.</p>
        )}
      </div>

      {/* Follow-up Status */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Follow-up Status
          </h2>
          <p className="text-xs text-slate-300">
            Next clinical milestone on <strong className="text-teal-300">{currentPatient.nextFollowUpDate}</strong>
          </p>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            currentPatient.followUpStatus === 'On track'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
          }`}
        >
          {currentPatient.followUpStatus}
        </span>
      </div>

      {/* All Today's Medicines Checklist */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Today's Medicine Schedule</span>
          <span className="text-xs font-normal text-slate-400 font-mono">
            {patientMeds.filter(m => m.status === 'Taken').length}/{patientMeds.length} taken
          </span>
        </h2>

        <div className="space-y-2.5">
          {patientMeds.map(med => (
            <div
              key={med.id}
              className="p-3.5 rounded-2xl bg-[#161a33]/90 border border-white/5 flex items-center justify-between hover:border-purple-500/30 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    med.status === 'Taken'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}
                >
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">
                    {med.name} {med.dosage}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {med.timing} • {med.foodRelation}
                  </p>
                </div>
              </div>

              {med.status === 'Taken' ? (
                <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Taken
                </span>
              ) : (
                <button
                  onClick={() => handleMarkTaken(med)}
                  className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-950/60"
                >
                  Mark Taken
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Nurse Contact Card */}
      <div className="p-4 rounded-2xl bg-[#1d1633]/90 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between shadow-xl">
        <div>
          <p className="font-bold text-white">Need assistance with your medicines?</p>
          <p className="text-purple-300 text-[11px]">Dr. Sharma's nursing desk is available 24/7</p>
        </div>
        <button
          onClick={() => alert(`Calling PulseCare 24/7 Care Desk for ${currentPatient.name}...`)}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-purple-950/60"
        >
          <PhoneCall className="w-3.5 h-3.5 text-pink-300" />
          <span>Call Desk</span>
        </button>
      </div>

      {/* Skip / Unwell Response Modal */}
      {responseModalMed && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101326] rounded-3xl max-w-md w-full p-5 shadow-2xl border border-purple-500/30 text-xs space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-pink-400" />
                Report Medicine Difficulty
              </h3>
              <button
                onClick={() => setResponseModalMed(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Why are you unable to take <strong>{responseModalMed.name} {responseModalMed.dosage}</strong>? This information helps the AI & medical team adjust your care plan.
            </p>

            <div className="space-y-2">
              {[
                'Feeling nauseous / stomach upset',
                'Experiencing dizziness or lightheadedness',
                'Ran out of medication at home',
                'Away from home / forgot to bring strip',
                'Other symptoms (describe below)'
              ].map(reason => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    skipReason === reason
                      ? 'bg-purple-950/60 border-purple-400 text-purple-200 font-semibold'
                      : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="skipReason"
                    checked={skipReason === reason}
                    onChange={() => setSkipReason(reason)}
                    className="text-purple-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {skipReason.includes('Other') && (
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                placeholder="Describe your symptoms or reason..."
                className="w-full p-2.5 rounded-xl border border-purple-500/20 bg-[#161a33] text-white focus:ring-2 focus:ring-purple-500"
                rows={2}
              />
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setResponseModalMed(null)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/60"
              >
                Submit Report to Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
