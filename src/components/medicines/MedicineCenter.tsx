import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine, ReminderStatus } from '../../types';
import {
  Pill,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Sparkles,
  TrendingUp,
  Filter
} from 'lucide-react';

interface MedicineCenterProps {
  onOpenAddMedicine: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const MedicineCenter: React.FC<MedicineCenterProps> = ({
  onOpenAddMedicine,
  onSelectPatient
}) => {
  const { medicines, updateMedicineStatus, addNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nudgedId, setNudgedId] = useState<string | null>(null);

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dosage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || m.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleNudge = (med: Medicine) => {
    setNudgedId(med.id);
    addNotification({
      type: 'medicine',
      title: 'Reminder Dispatched',
      message: `PulseCare automated SMS & WhatsApp reminder sent to ${med.patientName} for ${med.name} ${med.dosage}.`,
      read: false,
      severity: 'normal',
      patientId: med.patientId,
      patientName: med.patientName
    });
    setTimeout(() => setNudgedId(null), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white font-sans tracking-tight">Medicine Center</h1>
          <p className="text-xs text-slate-400">
            Manage prescriptions, track patient adherence and configure reminder triggers
          </p>
        </div>

        <button
          onClick={onOpenAddMedicine}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-purple-950/60 border border-purple-400/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-pink-300" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-4 rounded-3xl border border-purple-900/30 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search medicine, patient, or dosage..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-500/20 bg-[#161a33] text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filter medicines by reminder status"
          className="py-2 px-3 rounded-xl border border-purple-500/20 text-xs text-slate-200 bg-[#161a33] focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
        >
          <option value="all" className="bg-[#121528] text-white">All Reminder Statuses</option>
          <option value="pending" className="bg-[#121528] text-amber-300">Pending</option>
          <option value="taken" className="bg-[#121528] text-teal-300">Taken</option>
          <option value="missed" className="bg-[#121528] text-pink-300">Missed</option>
        </select>
      </div>

      {/* Medicine Table */}
      <div className="bg-[#121528]/80 backdrop-blur-xl rounded-3xl border border-purple-900/30 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#171b35]/70 border-b border-white/10 text-slate-400 font-semibold text-[11px]">
                <th className="py-3 px-4">Medicine</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Dosage</th>
                <th className="py-3 px-3">Timing</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Adherence Rate</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No medicines matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map(med => (
                  <tr key={med.id} className="hover:bg-white/5 transition-colors group">
                    {/* Medicine */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{med.name}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {med.foodRelation} • {med.instructions}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => onSelectPatient(med.patientId)}
                        className="font-medium text-slate-200 hover:text-purple-300 transition-colors text-left"
                      >
                        {med.patientName}
                      </button>
                    </td>

                    {/* Dosage */}
                    <td className="py-3.5 px-3 font-medium text-purple-200">
                      {med.dosage}
                    </td>

                    {/* Timing */}
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                      {med.timing}
                    </td>

                    {/* Frequency */}
                    <td className="py-3.5 px-3 text-slate-300">
                      {med.frequency}
                    </td>

                    {/* Adherence */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#1a2040] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              med.adherenceRate >= 90
                                ? 'bg-teal-400'
                                : med.adherenceRate >= 75
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${med.adherenceRate}%` }}
                          />
                        </div>
                        <span
                          className={`font-bold font-mono text-xs ${
                            med.adherenceRate >= 90
                              ? 'text-teal-300'
                              : med.adherenceRate >= 75
                              ? 'text-amber-300'
                              : 'text-pink-400'
                          }`}
                        >
                          {med.adherenceRate}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          med.status === 'Taken'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : med.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-pink-300 border border-rose-500/30'
                        }`}
                      >
                        {med.status === 'Taken' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : med.status === 'Pending' ? (
                          <Clock className="w-3 h-3 text-amber-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                        )}
                        {med.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleNudge(med)}
                          disabled={nudgedId === med.id}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-teal-300 hover:text-white bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 transition-colors flex items-center gap-1"
                          title="Send instant WhatsApp/SMS nudge"
                        >
                          <Send className="w-3 h-3" />
                          <span>{nudgedId === med.id ? 'Sent!' : 'Nudge'}</span>
                        </button>

                        {med.status !== 'Taken' && (
                          <button
                            onClick={() => updateMedicineStatus(med.id, 'Taken')}
                            className="px-2 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                            title="Staff mark as taken"
                          >
                            Mark Taken
                          </button>
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
