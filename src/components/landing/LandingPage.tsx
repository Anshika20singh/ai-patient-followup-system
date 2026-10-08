import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Heart,
  ShieldCheck,
  Calendar,
  BellRing,
  Brain,
  Stethoscope,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Sparkles,
  HeartPulse,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setRole, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121528] via-[#0d101f] to-[#090b14] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-purple-900/30 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 text-pink-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>AI-Powered Post-Discharge Care</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-sans tracking-tight leading-tight">
              Your Health <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-teal-300 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              PulseCare AI is an intelligent patient follow-up and medicine reminder system designed to help patients stay on track after hospital discharge — with the power of assistive AI and compassionate clinical care.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setRole('staff');
                  setActiveTab('dashboard');
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:opacity-95 text-white font-bold text-sm transition-all shadow-xl shadow-purple-950/60 flex items-center gap-2 group border border-purple-400/30"
              >
                <span>Launch Staff Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setRole('patient');
                }}
                className="px-6 py-3 rounded-2xl border border-purple-500/40 hover:border-purple-400 text-purple-200 bg-[#141830]/80 font-bold text-sm transition-all hover:bg-[#1a2040]"
              >
                Try Patient Mobile Portal
              </button>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-br from-[#121630] via-[#1a1f42] to-[#111428] rounded-3xl p-6 shadow-2xl text-white overflow-hidden border border-purple-500/30 glow-purple">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Floating Reminder Card */}
              <div className="bg-[#181d3d]/90 backdrop-blur-md text-white p-4.5 rounded-2xl shadow-xl border border-purple-500/30 animate-soft-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold shrink-0">
                    <BellRing className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-pink-300 uppercase tracking-wide">
                      Time for your medicine!
                    </p>
                    <p className="font-bold text-sm text-white mt-0.5">Paracetamol 500mg</p>
                    <p className="text-[11px] text-slate-300">2 times a day • After meal</p>
                  </div>
                </div>
              </div>

              {/* Smarter Reminders, Healthier Tomorrow */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
                  <Activity className="w-4 h-4" />
                  <span>Smarter Reminders · Healthier Tomorrow</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time synchronization between patient medicine logs, missed dose detection, and hospital nurse triage.
                </p>
              </div>

              {/* Active metrics */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-xl font-black font-mono text-teal-300">86%</span>
                  <p className="text-[10px] text-slate-400">Adherence Rate</p>
                </div>
                <div>
                  <span className="text-xl font-black font-mono text-pink-300">&lt; 15m</span>
                  <p className="text-[10px] text-slate-400">Triage Escalation</p>
                </div>
                <div>
                  <span className="text-xl font-black font-mono text-emerald-300">Zero</span>
                  <p className="text-[10px] text-slate-400">Lost Follow-ups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Cards Grid: The Problem, Key Benefits, How It Works, SDG 3 */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: The Problem */}
          <div className="bg-[#121528]/80 backdrop-blur-xl p-6 rounded-3xl border border-rose-500/30 shadow-2xl space-y-3 hover:border-rose-400/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-pink-300 border border-rose-500/30 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="font-bold text-base text-white">The Problem</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Many patients miss their medicines, appointments, and follow-ups after discharge, leading to preventable complications and hospital readmissions.
            </p>
          </div>

          {/* Card 2: Key Benefits */}
          <div className="bg-[#121528]/80 backdrop-blur-xl p-6 rounded-3xl border border-purple-500/30 shadow-2xl space-y-3 hover:border-purple-400/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-base text-white">Key Benefits</h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Timely medicine reminders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Better patient adherence</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Fewer hospital readmissions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Improved recovery outcomes</span>
              </li>
            </ul>
          </div>

          {/* Card 3: How It Works */}
          <div className="bg-[#121528]/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-3 hover:border-indigo-400/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-base text-white">How It Works</h3>
            <ol className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[10px] flex items-center justify-center shrink-0 border border-purple-500/40">1</span>
                <span>Patient Data Enrolled</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[10px] flex items-center justify-center shrink-0 border border-purple-500/40">2</span>
                <span>Medicine & Schedule Sync</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[10px] flex items-center justify-center shrink-0 border border-purple-500/40">3</span>
                <span>Reminder & Response</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[10px] flex items-center justify-center shrink-0 border border-purple-500/40">4</span>
                <span>AI Analysis & Risk Status</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[10px] flex items-center justify-center shrink-0 border border-purple-500/40">5</span>
                <span>Healthcare Staff Follow-up</span>
              </li>
            </ol>
          </div>

          {/* Card 4: SDG 3 Connection */}
          <div className="bg-gradient-to-br from-teal-900/90 to-emerald-950/90 text-white p-6 rounded-3xl shadow-2xl border border-teal-500/40 space-y-3 flex flex-col justify-between glow-teal">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-black text-teal-300">3</span>
                <HeartPulse className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="font-extrabold text-base uppercase tracking-tight text-white">
                Good Health and Well-being
              </h3>
            </div>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              Supports United Nations Sustainable Development Goal 3 by ensuring healthy lives and promoting well-being for post-discharge patients of all ages.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-gradient-to-r from-[#0c0f24] via-[#161432] to-[#0c0f24] text-white py-14 px-4 sm:px-6 lg:px-8 text-center mt-auto border-t border-purple-900/30">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            Trusted by Patients. Supported by Healthcare Professionals.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Because better follow-ups create healthier tomorrows.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setRole('staff');
                setActiveTab('dashboard');
              }}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-950/60 transition border border-purple-400/30"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                setRole('patient');
              }}
              className="px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition"
            >
              Patient Portal Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
