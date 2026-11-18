import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function PresenterNotes({ isOpen, notes }) {
  if (!isOpen) return null;

  return (
    <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4 text-xs md:text-sm text-purple-200 animate-in fade-in duration-200">
      <div className="flex items-start gap-2">
        <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-purple-300 uppercase tracking-wider text-[11px]">
            Instructor Talking Points & Real-World Analogies:
          </span>
          <p className="text-purple-200/90 leading-relaxed">
            {notes}
          </p>
        </div>
      </div>
    </div>
  );
}

