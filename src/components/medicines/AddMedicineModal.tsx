import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine, ReminderStatus } from '../../types';
import { X, Pill, Plus, CheckCircle2 } from 'lucide-react';

interface AddMedicineModalProps {
  initialPatientId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  initialPatientId,
  onClose,
  onSuccess
}) => {
  const { patients, addMedicine } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState(
    initialPatientId || (patients[0]?.id ?? '')
  );
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('500mg');
  const [timing, setTiming] = useState('08:00 AM');
  const [frequency, setFrequency] = useState('2 times/day');
  const [foodRelation, setFoodRelation] = useState<'Before food' | 'After food' | 'With food' | 'Anytime'>('After food');
  const [instructions, setInstructions] = useState('Take with plenty of water after breakfast.');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonMeds = [
    { name: 'Paracetamol', defaultDose: '500mg' },
    { name: 'Metformin', defaultDose: '850mg' },
    { name: 'Amoxicillin', defaultDose: '500mg' },
    { name: 'Atorvastatin', defaultDose: '20mg' },
    { name: 'Vitamin D3', defaultDose: '1000 IU' },
    { name: 'Lisinopril', defaultDose: '10mg' },
    { name: 'Pantoprazole', defaultDose: '40mg' },
    { name: 'Clopidogrel', defaultDose: '75mg' }
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedPatientId) errs.patient = 'Please select a patient';
    if (!name.trim()) errs.name = 'Medicine name is required';
    if (!dosage.trim()) errs.dosage = 'Dosage is required';
    if (!timing.trim()) errs.timing = 'Timing is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    addMedicine({
      patientId: selectedPatientId,
      patientName: patient.name,
      name: name.trim(),
      dosage: dosage.trim(),
      timing: timing.trim(),
      frequency,
      foodRelation,
      status: 'Pending',
      totalPrescribedDays: 30,
      completedDoses: 0,
      missedDoses: 0,
      adherenceRate: 100,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      instructions: instructions.trim()
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#101326] rounded-3xl max-w-lg w-full shadow-2xl border border-purple-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151933]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-950/60 border border-purple-400/30">
              <Pill className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Add Medicine Prescription</h2>
              <p className="text-xs text-slate-400">Configure dosage schedule and reminder triggers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Patient <span className="text-pink-400">*</span>
            </label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id} className="bg-[#101326] text-white">
                  {p.name} ({p.id}) – {p.primaryCondition}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Common Prescriptions (Quick Select):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonMeds.map(m => (
                <button
                  type="button"
                  key={m.name}
                  onClick={() => {
                    setName(m.name);
                    setDosage(m.defaultDose);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    name === m.name
                      ? 'bg-purple-900/60 text-pink-300 border-purple-400'
                      : 'bg-[#161a33] text-slate-300 border-white/5 hover:border-purple-500/40'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Medicine Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Metformin"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white ${
                  errors.name ? 'border-rose-500 bg-rose-950/20' : 'border-purple-500/20'
                }`}
              />
              {errors.name && <p className="text-[11px] text-pink-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Dosage <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder="e.g. 500mg, 1 tablet"
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Timing</label>
              <select
                value={timing}
                onChange={e => setTiming(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              >
                <option value="08:00 AM">08:00 AM (Morning)</option>
                <option value="10:00 AM">10:00 AM (Mid-morning)</option>
                <option value="12:00 PM">12:00 PM (Noon)</option>
                <option value="02:00 PM">02:00 PM (Afternoon)</option>
                <option value="06:00 PM">06:00 PM (Evening)</option>
                <option value="08:00 PM">08:00 PM (Night)</option>
                <option value="10:00 PM">10:00 PM (Bedtime)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              >
                <option value="Once daily">Once daily</option>
                <option value="2 times/day">2 times/day</option>
                <option value="3 times/day">3 times/day</option>
                <option value="Every 4 hours">Every 4 hours</option>
                <option value="Weekly once">Weekly once</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Meal Relation</label>
              <select
                value={foodRelation}
                onChange={e => setFoodRelation(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              >
                <option value="After food">After food</option>
                <option value="Before food">Before food</option>
                <option value="With food">With food</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Clinical Instructions</label>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. Take strictly after meal. Do not crush."
              className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 font-semibold text-xs hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs transition shadow-lg shadow-purple-950/60 border border-purple-400/30"
            >
              Prescribe & Activate Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
