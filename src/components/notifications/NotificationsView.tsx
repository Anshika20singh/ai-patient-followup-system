import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  Clock,
  Calendar,
  ShieldAlert,
  Info,
  CheckCircle2,
  Trash2,
  Send,
  Plus
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    setSelectedPatientId,
    setRole,
    setActiveTab
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'medicine' | 'appointment' | 'alert' | 'system'>('all');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const filtered = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const handleSendTestNotification = () => {
    addNotification({
      type: 'medicine',
      title: 'Automated Medicine Push Reminder',
      message: 'Aarav Singh: Scheduled dose of Atorvastatin 20mg due at 08:00 PM.',
      read: false,
      severity: 'normal',
      patientName: 'Aarav Singh'
    });
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white font-sans tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-400">
            Real-time feed of medicine reminders, appointment reminders, and clinical staff alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendTestNotification}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold transition shadow-lg shadow-purple-950/60 border border-purple-400/30"
          >
            <Send className="w-3.5 h-3.5 text-pink-300" />
            <span>{testNotificationSent ? 'Dispatched!' : 'Send Test Reminder'}</span>
          </button>

          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-semibold transition"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#121528]/80 backdrop-blur-xl p-2 rounded-2xl border border-purple-900/30 shadow-2xl flex items-center gap-1.5 text-xs overflow-x-auto">
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'medicine', label: 'Medicine Reminders' },
          { id: 'appointment', label: 'Appointment Reminders' },
          { id: 'alert', label: 'Staff Escalations' },
          { id: 'system', label: 'System Logs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`py-1.5 px-3.5 rounded-xl font-medium transition-colors ${
              filterType === tab.id
                ? 'bg-purple-600/30 text-purple-200 font-bold border border-purple-400/40 glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="bg-[#121528]/80 backdrop-blur-xl rounded-3xl border border-purple-900/30 shadow-2xl divide-y divide-white/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !item.read ? 'bg-purple-950/30 hover:bg-purple-900/30' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.severity === 'urgent'
                      ? 'bg-rose-500/20 text-pink-300 border-rose-500/40'
                      : item.type === 'medicine'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : item.type === 'appointment'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  }`}
                >
                  {item.severity === 'urgent' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  ) : item.type === 'medicine' ? (
                    <Clock className="w-5 h-5" />
                  ) : item.type === 'appointment' ? (
                    <Calendar className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xs sm:text-sm text-white">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0"></span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>

                  {item.patientName && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-purple-300 bg-purple-900/50 border border-purple-500/30 px-2 py-0.5 rounded-md">
                        Patient: {item.patientName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    markNotificationRead(item.id);
                  }}
                  className="text-xs text-slate-400 hover:text-purple-300 font-medium shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
