import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Circle, Check, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizModal({
  isOpen,
  onClose,
  quizData
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Reset state when a new quiz is opened or topic changes
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setFeedback(null);
    }
  }, [isOpen, quizData]);

  if (!isOpen || !quizData) return null;

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    const isCorrect = idx === quizData.correct;
    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        text: quizData.explanation
      });
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully if canvas context fails
      }
    } else {
      setFeedback({
        isCorrect: false,
        text: quizData.explanation
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative neon-border-cyan animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckCircle className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-white text-base">Quick Knowledge Check</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            {quizData.q}
          </p>

          <div className="space-y-2">
            {quizData.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isOptionCorrect = i === quizData.correct;
              let borderClass = 'border-slate-700 hover:border-cyan-500 bg-slate-800/80 hover:bg-slate-700';

              if (selectedOption !== null) {
                if (isSelected && isOptionCorrect) {
                  borderClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                } else if (isSelected && !isOptionCorrect) {
                  borderClass = 'border-rose-500 bg-rose-950/40 text-rose-200';
                } else if (isOptionCorrect) {
                  borderClass = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium text-slate-200 transition flex items-center justify-between cursor-pointer ${borderClass}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null ? (
                    isOptionCorrect ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isSelected ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-mono animate-in fade-in duration-200 border ${
                feedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}
            >
              {feedback.isCorrect ? (
                <>✓ <strong>CORRECT!</strong> {feedback.text}</>
              ) : (
                <>✕ <strong>NOT QUITE:</strong> {feedback.text}</>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

