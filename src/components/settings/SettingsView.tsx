import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Bell,
  Sliders,
  Shield,
  Smartphone,
  Hospital,
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { resetToSampleData } = useApp();

  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: true,
    push: true,
    email: false
  });

  const [triageSensitivity, setTriageSensitivity] = useState<'Standard' | 'High Sensitivity' | 'Conservative'>('Standard');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-[#1b1436] text-white flex items-center gap-2 text-xs shadow-2xl border border-purple-500/40">
          <CheckCircle2 className="w-4 h-4 text-pink-400" />
          <span>System configuration saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white font-sans tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-400">Configure reminder channels, clinical thresholds and notification automation</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Healthcare Facility Profile */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl space-y-3">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Hospital className="w-4 h-4 text-purple-400" />
            Healthcare Facility Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hospital / Clinic Name</label>
              <input
                type="text"
                defaultValue="PulseCare Post-Discharge Clinical Network"
                className="w-full p-2.5 rounded-xl border border-purple-500/20 bg-[#161a33] text-white text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Attending Clinician</label>
              <input
                type="text"
                defaultValue="Dr. Sharma, MD, DM (Cardiology)"
                className="w-full p-2.5 rounded-xl border border-purple-500/20 bg-[#161a33] text-white text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Multi-Channel Reminder Dispatch */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl space-y-3">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-teal-400" />
            Automated Reminder Delivery Channels
          </h2>
          <p className="text-slate-400 text-[11px]">
            Choose which channels PulseCare AI uses to dispatch medicine reminders and follow-up alerts to patients.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-[#161a33]/80 cursor-pointer hover:border-purple-500/30 transition">
              <div>
                <p className="font-bold text-white">WhatsApp Automated Prompts</p>
                <p className="text-[11px] text-slate-400">Interactive quick-reply buttons (Taken / Delayed / Help)</p>
              </div>
              <input
                type="checkbox"
                checked={channels.whatsapp}
                onChange={e => setChannels({ ...channels, whatsapp: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-[#161a33]/80 cursor-pointer hover:border-purple-500/30 transition">
              <div>
                <p className="font-bold text-white">SMS Direct Alerts</p>
                <p className="text-[11px] text-slate-400">Carrier SMS fallback for low-connectivity regions</p>
              </div>
              <input
                type="checkbox"
                checked={channels.sms}
                onChange={e => setChannels({ ...channels, sms: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-[#161a33]/80 cursor-pointer hover:border-purple-500/30 transition">
              <div>
                <p className="font-bold text-white">Web & PWA Push Notifications</p>
                <p className="text-[11px] text-slate-400">Direct mobile lockscreen reminder sounds</p>
              </div>
              <input
                type="checkbox"
                checked={channels.push}
                onChange={e => setChannels({ ...channels, push: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-[#161a33]/80 cursor-pointer hover:border-purple-500/30 transition">
              <div>
                <p className="font-bold text-white">Email Summaries</p>
                <p className="text-[11px] text-slate-400">Weekly clinical audit sent to patient caregiver</p>
              </div>
              <input
                type="checkbox"
                checked={channels.email}
                onChange={e => setChannels({ ...channels, email: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* AI Triage Engine Configuration */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl space-y-3">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            AI Attention Sensitivity & Safeguards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Standard', desc: 'Escalates to High after 2 missed doses or 1 missed OPD visit' },
              { id: 'High Sensitivity', desc: 'Escalates immediately on 1 missed dose for cardiac patients' },
              { id: 'Conservative', desc: 'Allows 24-hour grace window before staff alert' }
            ].map(mode => (
              <div
                key={mode.id}
                onClick={() => setTriageSensitivity(mode.id as any)}
                className={`p-3 rounded-2xl border cursor-pointer transition ${
                  triageSensitivity === mode.id
                    ? 'border-purple-500 bg-purple-950/60 text-white font-bold'
                    : 'border-white/5 bg-[#161a33]/60 text-slate-300 hover:border-purple-500/30'
                }`}
              >
                <p className="font-bold text-xs text-white">{mode.id}</p>
                <p className="text-[11px] text-slate-400 font-normal mt-1 leading-snug">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Management & Reset */}
        <div className="bg-[#121528]/80 backdrop-blur-xl p-5 rounded-3xl border border-purple-900/30 shadow-2xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">Demonstration Reset</h3>
            <p className="text-[11px] text-slate-400">Reset patient records, adherence counters and schedules back to factory sample state</p>
          </div>
          <button
            type="button"
            onClick={resetToSampleData}
            className="px-3.5 py-2 rounded-xl border border-purple-500/30 hover:bg-white/5 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-950/60 transition border border-purple-400/30"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
