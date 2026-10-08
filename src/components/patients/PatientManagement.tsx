import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, RiskLevel } from '../../types';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Pill,
  ChevronRight,
  Eye,
  Trash2,
  UserCheck
} from 'lucide-react';

interface PatientManagementProps {
  onSelectPatient: (patientId: string) => void;
  onOpenAddPatient: () => void;
  onOpenAddMedicine: (patientId: string) => void;
  onOpenScheduleAppt: (patientId: string) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  onSelectPatient,
  onOpenAddPatient,
  onOpenAddMedicine,
  onOpenScheduleAppt
}) => {
  const { patients, deletePatient } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [menuPatientId, setMenuPatientId] = useState<string | null>(null);

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'all' || p.riskCategory.toLowerCase() === riskFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' ||
      p.followUpStatus.toLowerCase().includes(statusFilter.toLowerCase()) ||
      p.appointmentStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white font-sans tracking-tight">Patient Management</h1>
          <p className="text-xs text-slate-400">
            Search, filter and manage post-discharge care trajectories
          </p>
        </div>

        <button
          onClick={onOpenAddPatient}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-purple-950/60 border border-purple-400/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-pink-300" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-4 rounded-3xl border border-purple-900/30 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID or condition..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-500/20 bg-[#161a33] text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-2">
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            aria-label="Filter by risk category"
            className="py-2 px-3 rounded-xl border border-purple-500/20 text-xs text-slate-200 bg-[#161a33] focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          >
            <option value="all" className="bg-[#121528] text-white">All Risk Levels</option>
            <option value="high" className="bg-[#121528] text-pink-300">High Attention</option>
            <option value="medium" className="bg-[#121528] text-amber-300">Medium Attention</option>
            <option value="low" className="bg-[#121528] text-teal-300">Low Attention</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by follow-up and appointment status"
            className="py-2 px-3 rounded-xl border border-purple-500/20 text-xs text-slate-200 bg-[#161a33] focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          >
            <option value="all" className="bg-[#121528] text-white">All Status</option>
            <option value="on track" className="bg-[#121528] text-white">On Track</option>
            <option value="action needed" className="bg-[#121528] text-white">Action Needed</option>
            <option value="missed" className="bg-[#121528] text-white">Missed Appointments</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-[#121528]/80 backdrop-blur-xl rounded-3xl border border-purple-900/30 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#171b35]/70 border-b border-white/10 text-slate-400 font-semibold text-[11px]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-3">Patient ID</th>
                <th className="py-3 px-3">Medicine Schedule</th>
                <th className="py-3 px-3">Follow-up Date</th>
                <th className="py-3 px-3">Appointment</th>
                <th className="py-3 px-3">Reminder</th>
                <th className="py-3 px-3">Risk Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No patients matching the selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr
                    key={patient.id}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => onSelectPatient(patient.id)}
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/30">
                          {patient.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {patient.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {patient.primaryCondition}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="py-3.5 px-3 font-mono text-purple-300/80 font-medium">
                      {patient.id}
                    </td>

                    {/* Medicine Schedule */}
                    <td className="py-3.5 px-3 text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-teal-400" />
                        <span>{patient.medicineCount || 2} meds</span>
                      </span>
                    </td>

                    {/* Follow-up Date */}
                    <td className="py-3.5 px-3 text-slate-300 font-medium">
                      {patient.nextFollowUpDate}
                    </td>

                    {/* Appointment */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          patient.appointmentStatus === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : patient.appointmentStatus === 'Missed'
                            ? 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {patient.appointmentStatus}
                      </span>
                    </td>

                    {/* Reminder */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          patient.reminderStatus === 'On track'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : patient.reminderStatus === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                        }`}
                      >
                        {patient.reminderStatus}
                      </span>
                    </td>

                    {/* Risk Category */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          patient.riskCategory === 'High'
                            ? 'bg-rose-500/25 text-pink-200 border border-rose-500/40 shadow-xs'
                            : patient.riskCategory === 'Medium'
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40'
                            : 'bg-teal-500/25 text-teal-200 border border-teal-500/40'
                        }`}
                      >
                        {patient.riskCategory}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setMenuPatientId(menuPatientId === patient.id ? null : patient.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {menuPatientId === patient.id && (
                          <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-[#141830]/95 backdrop-blur-xl shadow-2xl border border-purple-500/30 py-1.5 z-30">
                            <button
                              onClick={() => {
                                onSelectPatient(patient.id);
                                setMenuPatientId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-left text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-purple-400" />
                              <span>View Profile</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenAddMedicine(patient.id);
                                setMenuPatientId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-left text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2"
                            >
                              <Pill className="w-3.5 h-3.5 text-teal-400" />
                              <span>Add Medicine</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenScheduleAppt(patient.id);
                                setMenuPatientId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-left text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2"
                            >
                              <Calendar className="w-3.5 h-3.5 text-pink-400" />
                              <span>Book Appointment</span>
                            </button>
                            <div className="my-1 border-t border-white/10" />
                            <button
                              onClick={() => {
                                deletePatient(patient.id);
                                setMenuPatientId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-left text-pink-400 hover:bg-rose-500/15 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Patient</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
