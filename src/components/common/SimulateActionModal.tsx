import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Pill,
  Send,
  Zap
} from 'lucide-react';

interface SimulateActionModalProps {
  onClose: () => void;
}

export const SimulateActionModal: React.FC<SimulateActionModalProps> = ({ onClose }) => {
  const {
    updateMedicineStatus,
    updateAppointmentStatus,
    runAiTriage,
    resetToSampleData,
    medicines,
    appointments,
    setRole,
    setActiveTab,
    setSelectedPatientId
  } = useApp();

  const handleSimulateAaravDose = () => {
    const aaravMed = medicines.find(m => m.patientId === 'P001');
    if (aaravMed) {
      updateMedicineStatus(aaravMed.id, 'Taken');
    }
    onClose();
  };

  const handleSimulateRohanMiss = () => {
    const rohanMed = medicines.find(m => m.patientId === 'P003');
    if (rohanMed) {
      updateMedicineStatus(rohanMed.id, 'Missed', 'Reported severe stomach cramp and stopped taking tablet.');
    }
    onClose();
  };

  const handleSimulatePoojaMissedAppt = () => {
    const poojaAppt = appointments.find(a => a.patientId === 'P007');
    if (poojaAppt) {
      updateAppointmentStatus(poojaAppt.id, 'Missed');
    }
    onClose();
  };

  const handleRunFullTriage = () => {
    runAiTriage();
    setActiveTab('ai-attention');
    setRole('staff');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101326] rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-purple-500/30 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-950/60 border border-purple-400/30">
              <Zap className="w-4 h-4 text-pink-300" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Interactive Workflow Simulator</h2>
              <p className="text-[11px] text-slate-400">Live trigger demo for presentation evaluation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-300 leading-relaxed text-[11px]">
          Click any event below to demonstrate how patient responses flow into the AI Risk Triage engine and notify the healthcare staff in real time.
        </p>

        <div className="space-y-2.5">
          {/* Action 1 */}
          <div
            onClick={handleSimulateAaravDose}
            className="p-3 rounded-2xl border border-white/10 bg-[#161a33]/90 hover:border-teal-400/60 hover:bg-[#1a2040] transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Simulate: Aarav Singh takes scheduled medicine</p>
                <p className="text-[10px] text-slate-400">Marks Paracetamol taken, logs high adherence, maintains Low Risk.</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-teal-300 bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 rounded-md">Trigger</span>
          </div>

          {/* Action 2 */}
          <div
            onClick={handleSimulateRohanMiss}
            className="p-3 rounded-2xl border border-white/10 bg-[#161a33]/90 hover:border-rose-400/60 hover:bg-[#1a2040] transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Simulate: Rohan Verma reports missed dose with side-effect</p>
                <p className="text-[10px] text-slate-400">Auto-triggers High Attention escalation and creates urgent staff alert.</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-pink-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md">Escalate</span>
          </div>

          {/* Action 3 */}
          <div
            onClick={handleSimulatePoojaMissedAppt}
            className="p-3 rounded-2xl border border-white/10 bg-[#161a33]/90 hover:border-amber-400/60 hover:bg-[#1a2040] transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Simulate: Pooja Mehta misses follow-up clinic visit</p>
                <p className="text-[10px] text-slate-400">Escalates appointment status to 'Missed' and alerts cardiology nurse.</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md">Trigger</span>
          </div>

          {/* Action 4 */}
          <div
            onClick={handleRunFullTriage}
            className="p-3 rounded-2xl border border-white/10 bg-[#161a33]/90 hover:border-purple-400/60 hover:bg-[#1a2040] transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Recalculate AI Risk Triage across all patients</p>
                <p className="text-[10px] text-slate-400">Reruns clinical algorithm and opens the AI Attention Center.</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-md">Run AI</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              resetToSampleData();
              onClose();
            }}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-purple-400" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
