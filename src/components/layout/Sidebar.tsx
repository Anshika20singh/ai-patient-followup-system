import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Pill,
  Calendar,
  AlertTriangle,
  BarChart3,
  Bell,
  Settings,
  Activity,
  HeartPulse,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { activeTab, setActiveTab, stats, notifications } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: Users,
      badge: stats.activePatients
    },
    {
      id: 'medicines',
      label: 'Medicines',
      icon: Pill,
      badge: stats.todayPendingReminders > 0 ? `${stats.todayPendingReminders} due` : null,
      badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: stats.upcomingAppointmentsCount
    },
    {
      id: 'ai-attention',
      label: 'AI Attention',
      icon: AlertTriangle,
      badge: stats.aiAttentionCases.high > 0 ? `${stats.aiAttentionCases.high} High` : null,
      badgeColor: 'bg-rose-500/25 text-pink-300 border border-rose-500/40 animate-pulse'
    },
    {
      id: 'analytics',
      label: 'Reports',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: notifications.filter(n => !n.read).length || null,
      badgeColor: 'bg-purple-500/25 text-purple-300 border border-purple-500/40'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1021]/95 backdrop-blur-xl text-slate-300 flex flex-col border-r border-purple-900/25 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-purple-900/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-purple-950/60 border border-purple-400/30">
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight font-sans">
              PulseCare <span className="text-purple-400">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Healthcare Staff Portal</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-500">
          Main Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-lg shadow-purple-950/50 font-semibold border border-purple-400/30 glow-purple'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || (isActive ? 'bg-purple-900/60 text-purple-200 border border-purple-400/40' : 'bg-white/5 text-slate-400')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Assistive AI Note at Bottom */}
      <div className="p-3 border-t border-purple-900/20 bg-[#090b17]/60">
        <div className="p-3 rounded-xl bg-[#141830]/80 border border-purple-500/25 text-[11px] text-slate-300 shadow-md">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Assistive Engine</span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            Continuous telemetry analysis of reminder logs & clinical milestones.
          </p>
        </div>
      </div>
    </aside>
  );
};
