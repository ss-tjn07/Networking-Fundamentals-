import React from 'react';

export default function FooterBar({
  statusMessage,
  onPrevSlide,
  onNextSlide,
  currentTopicIndex,
  topicsCount
}) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Interactive Sandbox Active</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 font-mono text-[11px]">{statusMessage}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onPrevSlide}
          disabled={currentTopicIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          &larr; Previous Topic
        </button>
        <button
          onClick={onNextSlide}
          disabled={currentTopicIndex === topicsCount - 1}
          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition shadow-lg shadow-cyan-600/20 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Next Topic &rarr;
        </button>
      </div>
    </footer>
  );
}

