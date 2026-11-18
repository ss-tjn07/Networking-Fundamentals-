import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Clock, ShieldCheck, Terminal, BookOpen } from 'lucide-react';

export default function PracticalCard({ practical, inline = false }) {
  const storageKey = `thm_completed_${practical.id}`;
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'true') {
        setIsCompleted(true);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [storageKey]);

  const toggleCompleted = () => {
    const next = !isCompleted;
    setIsCompleted(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch (e) {}
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isCompleted
          ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
          : 'bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-[#0c1322] border-red-500/30 hover:border-red-500/60 shadow-xl'
      } ${inline ? 'p-5 sm:p-6' : 'p-6'}`}
    >
      {/* Decorative Cyber Accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top Meta Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* TryHackMe Red Brand Pill */}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/60 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            TRYHACKME ROOM
          </span>
          <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
            {practical.badge}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {practical.estimatedTime}
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-300">{practical.difficulty}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-400 shrink-0" />
            <h4 className="text-lg font-extrabold text-white tracking-wide">
              {practical.title}
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {practical.description}
          </p>

          {/* Key Skills Checklist */}
          <div className="pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
              Hands-on Lab Exercises:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {practical.keySkills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-mono text-slate-300 truncate">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch justify-center gap-2.5 shrink-0 min-w-[200px]">
          {/* Direct TryHackMe Launch Link */}
          <a
            href={practical.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch TryHackMe Lab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Completion Toggle */}
          <button
            onClick={toggleCompleted}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

