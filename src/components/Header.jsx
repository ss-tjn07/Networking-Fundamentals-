import React from 'react';
import { Network, Presentation, Layers, ChevronLeft, ChevronRight, Terminal, ClipboardList } from 'lucide-react';

export default function Header({
  presentationMode,
  setPresentationMode,
  drawerOpen,
  setDrawerOpen,
  onOpenPracticals,
  currentTopicIndex,
  topicsCount,
  onPrevSlide,
  onNextSlide,
  setStatusMessage
}) {
  const handleTogglePresentation = () => {
    const nextState = !presentationMode;
    setPresentationMode(nextState);
    if (nextState) {
      setStatusMessage("Presentation fullscreen mode enabled. Use arrow keys to step through.");
    } else {
      setStatusMessage("Explorer / Lab sandbox mode active.");
    }
  };

  const formattedIndex = String(currentTopicIndex + 1).padStart(2, '0');
  const formattedTotal = String(topicsCount).padStart(2, '0');

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Network className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm md:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-300 to-emerald-400">
            NETWORKING FUNDAMENTALS <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded ml-1">LIVE LAB</span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">Interactive Visual Classroom & Simulator</p>
        </div>
      </div>

      {/* Mode & Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Assignments & Practicals Modal Button */}
        <button
          onClick={onOpenPracticals}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-red-950/70 via-rose-950/50 to-slate-900 border border-red-700/80 hover:border-red-400 text-red-200 transition-all cursor-pointer shadow-sm"
        >
          <ClipboardList className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden md:inline">Assignments & Tasks</span>
          <span className="md:hidden">Assignments</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">12</span>
        </button>

        {/* Presentation Fullscreen Toggle */}
        <button
          onClick={handleTogglePresentation}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700 hover:border-cyan-500 text-slate-200 transition-all cursor-pointer"
        >
          <Presentation className="w-3.5 h-3.5 text-cyan-400" />
          <span>{presentationMode ? "Exit Fullscreen" : "Presentation"}</span>
        </button>

        {/* Quick Index Drawer Toggle */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700 hover:border-purple-500 text-slate-200 transition-all cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Syllabus ({topicsCount} Topics)</span>
          <span className="sm:hidden">Syllabus</span>
        </button>

        {/* Slides Navigation */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={onPrevSlide}
            disabled={currentTopicIndex === 0}
            title="Previous Topic [Left Arrow]"
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-2 text-cyan-400 font-semibold select-none">
            {formattedIndex} / {formattedTotal}
          </span>
          <button
            onClick={onNextSlide}
            disabled={currentTopicIndex === topicsCount - 1}
            title="Next Topic [Right Arrow]"
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
