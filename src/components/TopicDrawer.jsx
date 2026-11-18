import React from 'react';
import { BookOpen, X, ChevronRight, Terminal, ExternalLink, ClipboardList } from 'lucide-react';
import { practicals } from '../data/practicalsData';

export default function TopicDrawer({
  isOpen,
  onClose,
  topics,
  currentTopicIndex,
  onSelectTopic,
  onOpenPracticals
}) {
  return (
    <>
      {/* Drawer Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-50 w-80 md:w-96 bg-[#0a101f] border-l border-slate-800 p-5 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="overflow-hidden flex flex-col flex-1">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-sm tracking-wide text-white">CURRICULUM TOPICS</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 overflow-y-auto space-y-4 pr-1 flex-1">
            {/* Curriculum Topics List */}
            <nav className="space-y-1.5">
              {topics.map((t, idx) => {
                const isActive = idx === currentTopicIndex;
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTopic(idx);
                      onClose();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-[10px] text-cyan-400 font-bold">{numStr}</span>
                      <span className="truncate font-medium">{t.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  </button>
                );
              })}
            </nav>

            {/* Assignments & Practicals Section */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5" /> Assignments & Tasks
                </span>
                {onOpenPracticals && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPracticals();
                    }}
                    className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    View All (12 Tasks) &rarr;
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {practicals.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-red-950 hover:border-red-600/60 flex items-center justify-between text-xs transition group"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="font-bold text-white text-[11px] group-hover:text-red-300 truncate">
                          {p.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block truncate">
                        TryHackMe · {p.estimatedTime}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Use <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded border border-slate-700">←</kbd> <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded border border-slate-700">→</kbd> to browse slides</span>
          <span className="text-cyan-400 font-mono">React v2.4 Live</span>
        </div>
      </aside>
    </>
  );
}
