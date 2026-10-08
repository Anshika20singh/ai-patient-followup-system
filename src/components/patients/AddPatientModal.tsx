import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, RiskLevel } from '../../types';
import { X, UserPlus, HeartPulse, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AddPatientModalProps {
  onClose: () => void;
  onSuccess?: (patientId: string) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onSuccess }) => {
  const { addPatient } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    bloodGroup: 'B+',
    primaryCondition: '',
    address: '',
    emergencyContact: '',
    assignedDoctor: 'Dr. Sharma',
    riskCategory: 'Low' as RiskLevel,
    riskReason: 'New post-discharge intake. Awaiting initial check-in.',
    nextFollowUpDate: '2026-10-18',
    notes: 'Initial discharge enrollment completed.'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Patient name is required';
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      errs.age = 'Valid age (1-120) is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Valid phone number is required';
    }
    if (!formData.primaryCondition.trim()) {
      errs.primaryCondition = 'Primary condition/diagnosis is required';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const created = addPatient({
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      bloodGroup: formData.bloodGroup,
      dischargeDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      primaryCondition: formData.primaryCondition.trim(),
      address: formData.address.trim() || 'New Delhi, India',
      emergencyContact: formData.emergencyContact.trim() || '+91 98000 11223 (Family)',
      assignedDoctor: formData.assignedDoctor,
      riskCategory: formData.riskCategory,
      riskReason: formData.riskReason,
      riskScore: formData.riskCategory === 'High' ? 80 : formData.riskCategory === 'Medium' ? 50 : 20,
      medicineCount: 0,
      nextFollowUpDate: formData.nextFollowUpDate,
      appointmentStatus: 'Upcoming',
      reminderStatus: 'On track',
      followUpStatus: 'On track',
      notes: [formData.notes]
    });

    if (onSuccess) onSuccess(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#101326] rounded-3xl max-w-2xl w-full shadow-2xl border border-purple-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151933]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-950/60 border border-purple-400/30">
              <UserPlus className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Add New Patient</h2>
              <p className="text-xs text-slate-400">Enroll post-discharge patient into PulseCare AI follow-up</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Full Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Ramesh Kumar"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white ${
                  errors.name ? 'border-rose-500 bg-rose-950/20' : 'border-purple-500/20'
                }`}
              />
              {errors.name && <p className="text-[11px] text-pink-400 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Age <span className="text-pink-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  placeholder="e.g. 45"
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white ${
                    errors.age ? 'border-rose-500 bg-rose-950/20' : 'border-purple-500/20'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-pink-400 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Phone Number <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="+91 98765 43210"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white ${
                  errors.phone ? 'border-rose-500 bg-rose-950/20' : 'border-purple-500/20'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-pink-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh.k@example.com"
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Primary Diagnosis / Discharge Condition <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={formData.primaryCondition}
                onChange={e => {
                  setFormData({ ...formData, primaryCondition: e.target.value });
                  if (errors.primaryCondition) setErrors({ ...errors, primaryCondition: '' });
                }}
                placeholder="e.g. Post-Percutaneous Coronary Intervention"
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white ${
                  errors.primaryCondition ? 'border-rose-500 bg-rose-950/20' : 'border-purple-500/20'
                }`}
              />
              {errors.primaryCondition && (
                <p className="text-[11px] text-pink-400 mt-1">{errors.primaryCondition}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Initial Risk Triage Level</label>
              <select
                value={formData.riskCategory}
                onChange={e => setFormData({ ...formData, riskCategory: e.target.value as RiskLevel })}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              >
                <option value="Low">Low Attention (Stable)</option>
                <option value="Medium">Medium Attention (Monitor Closely)</option>
                <option value="High">High Attention (Urgent Review)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">First Scheduled Follow-up Date</label>
              <input
                type="date"
                value={formData.nextFollowUpDate}
                onChange={e => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#161a33] text-white"
              />
            </div>
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
              Enroll Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
