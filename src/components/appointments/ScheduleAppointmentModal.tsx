import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import { X, Calendar, Plus, Clock, Stethoscope } from 'lucide-react';

interface ScheduleAppointmentModalProps {
  initialPatientId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  initialPatientId,
  onClose,
  onSuccess
}) => {
  const { patients, scheduleAppointment } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState(
    initialPatientId || (patients[0]?.id ?? '')
  );
  const [doctorName, setDoctorName] = useState('Dr. Sharma');
  const [department, setDepartment] = useState('Cardiology Follow-up');
  const [date, setDate] = useState('2026-10-16');
  const [time, setTime] = useState('10:30 AM');
  const [type, setType] = useState<'In-person follow-up' | 'Virtual consultation' | 'Post-Discharge Review' | 'Lab Review'>('In-person follow-up');
  const [notes, setNotes] = useState('Routine post-discharge clinical status inspection.');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setErrors({ patient: 'Please select a patient' });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    scheduleAppointment({
      patientId: selectedPatientId,
      patientName: patient.name,
      doctorName,
      department,
      date,
      time,
      type,
      status: 'Upcoming',
      reminderSent: true,
      notes
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#101326] rounded-3xl max-w-lg w-full shadow-2xl border border-purple-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151933]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-950/60 border border-teal-400/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Schedule Patient Appointment</h2>
              <p className="text-xs text-slate-400">Book post-discharge clinic follow-up or virtual visit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Patient <span className="text-pink-400">*</span>
            </label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#161a33] text-white"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id} className="bg-[#101326] text-white">
                  {p.name} ({p.id}) – {p.primaryCondition}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Doctor</label>
              <select
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#161a33] text-white"
              >
                <option value="Dr. Sharma">Dr. Sharma (Cardiology Lead)</option>
                <option value="Dr. Mehra">Dr. Mehra (Internal Medicine)</option>
                <option value="Dr. Patel">Dr. Patel (Endocrinology)</option>
                <option value="Dr. Deshmukh">Dr. Deshmukh (General Surgery)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Department / Clinic</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Cardiology OPD"
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#161a33] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#161a33] text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Time</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#161a33] text-white"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:45 AM">11:45 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:45 PM">04:45 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Consultation Format</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#161a33] text-white"
            >
              <option value="In-person follow-up">In-person Hospital OPD</option>
              <option value="Virtual consultation">Telehealth Video Consult</option>
              <option value="Post-Discharge Review">Post-Discharge Nurse Review</option>
              <option value="Lab Review">Laboratory / ECG Review</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Clinical Notes & Preparation</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Fasting required for blood work, bring medication strips"
              className="w-full p-2.5 rounded-xl border border-purple-500/20 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#161a33] text-white"
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-semibold text-xs transition shadow-lg shadow-teal-950/60 border border-teal-400/30"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
