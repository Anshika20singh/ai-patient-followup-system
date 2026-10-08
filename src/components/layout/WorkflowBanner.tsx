import React, { useState } from 'react';
import {
  User,
  CalendarCheck,
  BellRing,
  CheckCircle2,
  Brain,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  Info
} from 'lucide-react';

export const WorkflowBanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      step: 1,
      title: 'Patient Data',
      icon: User,
      desc: 'Discharge diagnosis, contacts, baseline risk and care plan enrolled.'
    },
    {
      step: 2,
      title: 'Medicine & Schedule',
      icon: CalendarCheck,
      desc: 'Dosages, frequency timings, and clinical appointment dates configured.'
    },
    {
      step: 3,
      title: 'Automated Reminder',
      icon: BellRing,
      desc: 'Multi-channel timed notifications sent to patient phone/portal.'
    },
    {
      step: 4,
      title: 'Reminder Response',
      icon: CheckCircle2,
      desc: 'Patient confirms dose taken, logs delay, or reports side-effects.'
    },
    {
      step: 5,
      title: 'AI Analysis',
      icon: Brain,
      desc: 'Real-time adherence trend analysis, pattern detection & risk scoring.'
    },
    {
      step: 6,
      title: 'Attention / Risk Status',
      icon: AlertTriangle,
      desc: 'Triaged into High, Medium, or Low attention cohorts automatically.'
    },
    {
      step: 7,
      title: 'Staff Follow-up',
      icon: Stethoscope,
      desc: 'Doctors & nurses act with tele-triage, prescription tweak, or emergency outreach.'
    }
  ];

  return (
    <div className="bg-[#0c0e1e]/90 backdrop-blur-xl border-t border-purple-900/30 py-3 px-4 sm:px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950/70 border border-purple-500/30 px-2 py-0.5 rounded-md shadow-xs">
            Main Workflow
          </span>
          <span className="text-[11px] text-slate-400 hidden xl:inline">
            Closed-Loop Care Cycle:
          </span>
        </div>

        {/* Horizontal steps with connector arrows */}
        <div className="flex items-center overflow-x-auto w-full md:w-auto py-1 scrollbar-none gap-1 sm:gap-2">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = activeStep === idx;
            return (
              <React.Fragment key={item.step}>
                <div
                  onMouseEnter={() => setActiveStep(idx)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 border ${
                    isHovered
                      ? 'bg-purple-900/50 border-purple-500/50 text-purple-200 shadow-md shadow-purple-950/40'
                      : 'bg-[#14182e]/80 border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isHovered ? 'text-teal-300' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-medium whitespace-nowrap">{item.title}</span>

                  {/* Popover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-[#14172f]/95 border border-purple-500/40 text-white text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
                      <div className="font-semibold text-purple-300 mb-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                        Step {item.step}: {item.title}
                      </div>
                      <div className="text-slate-300 text-[10px] leading-relaxed">{item.desc}</div>
                    </div>
                  )}
                </div>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-purple-900/60 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="shrink-0 text-right hidden lg:block">
          <span className="text-xs font-semibold text-purple-300 italic flex items-center gap-1">
            <span>Better Follow-ups</span>
            <span className="text-pink-400">·</span>
            <span className="text-teal-300">Healthier Lives</span>
            <span className="text-pink-400">♥</span>
          </span>
        </div>
      </div>
    </div>
  );
};
