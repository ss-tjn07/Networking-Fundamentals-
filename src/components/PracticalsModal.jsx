import React, { useState, useEffect } from 'react';
import {
  Terminal,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  CheckSquare,
  Square,
  Clock,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Copy,
  Check,
  Award,
  ArrowRight
} from 'lucide-react';
import PracticalCard from './PracticalCard';
import { practicals } from '../data/practicalsData';
import { assignmentTasks } from '../data/assignmentsData';

export default function PracticalsModal({ isOpen, onClose, onSelectTopic }) {
  const [activeMainTab, setActiveMainTab] = useState('tasks'); // 'tasks' | 'tryhackme'
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all'); // 'all' | 'Networking' | 'Windows' | 'Linux'
  const [expandedTaskId, setExpandedTaskId] = useState('task-1-tcp-udp');
  const [copiedCmd, setCopiedCmd] = useState(null);

  // LocalStorage progress tracking for 12 assignment tasks
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cybersec_assignment_tasks_progress');
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const toggleTaskCompletion = (taskId) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    try {
      localStorage.setItem('cybersec_assignment_tasks_progress', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (!isOpen) return null;

  const filteredTasks = taskCategoryFilter === 'all'
    ? assignmentTasks
    : assignmentTasks.filter((t) => t.category === taskCategoryFilter);

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / assignmentTasks.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0b1120] border border-red-500/40 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 text-white">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  STUDENT ASSIGNMENTS & PRACTICAL LABS
                </h3>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded font-bold">
                  12 CORE TASKS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official curriculum assignments covering Networking, Windows Server Active Directory & Linux System Administration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Tab Bar & Progress Header */}
        <div className="px-4 sm:px-5 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMainTab('tasks')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeMainTab === 'tasks'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Assignment Tasks ({assignmentTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab('tryhackme')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeMainTab === 'tryhackme'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>TryHackMe Virtual Cloud Labs ({practicals.length})</span>
            </button>
          </div>

          {/* Progress Indicator */}
          {activeMainTab === 'tasks' && (
            <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Progress:</span>
                <span className="text-emerald-400 font-bold">{completedCount} / {assignmentTasks.length} Completed</span>
              </div>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: 12 ASSIGNMENT TASKS */}
        {activeMainTab === 'tasks' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Category Filter Pills */}
            <div className="px-4 sm:px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-slate-500 text-[11px] mr-1">CATEGORY:</span>
                {[
                  { id: 'all', label: `All Tasks (${assignmentTasks.length})` },
                  { id: 'Networking', label: 'Networking (6)' },
                  { id: 'Windows', label: 'Windows Admin (4)' },
                  { id: 'Linux', label: 'Linux (2)' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTaskCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      taskCategoryFilter === cat.id
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-sm'
                        : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-mono text-slate-500 hidden md:inline">
                Click tasks to view detailed instructions, commands & deliverables
              </span>
            </div>

            {/* Scrollable Tasks List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              {filteredTasks.map((task, idx) => {
                const isCompleted = !!completedTasks[task.id];
                const isExpanded = expandedTaskId === task.id;

                const categoryColors = {
                  Networking: 'text-cyan-400 border-cyan-800/60 bg-cyan-950/40',
                  Windows: 'text-purple-400 border-purple-800/60 bg-purple-950/40',
                  Linux: 'text-amber-400 border-amber-800/60 bg-amber-950/40'
                }[task.category] || 'text-slate-400 border-slate-800 bg-slate-900';

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border transition-all duration-200 ${
                      isCompleted
                        ? 'border-emerald-500/40 bg-slate-900/90 shadow-md shadow-emerald-950/20'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    {/* Task Card Header */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Interactive Completion Toggle */}
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition cursor-pointer shrink-0"
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded">
                              {task.badge}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${categoryColors}`}>
                              {task.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {task.estimatedTime}
                            </span>
                          </div>

                          <h4
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className={`text-sm sm:text-base font-bold cursor-pointer transition ${
                              isCompleted ? 'line-through text-slate-400' : 'text-white hover:text-cyan-300'
                            }`}
                          >
                            {task.title}
                          </h4>

                          <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            {task.summary}
                          </p>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {onSelectTopic && (
                          <button
                            onClick={() => {
                              onSelectTopic(task.topicIndex);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:border-cyan-500 hover:text-white transition cursor-pointer flex items-center gap-1"
                            title="Navigate to related classroom topic"
                          >
                            <span>Topic View</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Task Instructions & Details Drawer */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-4 text-xs font-mono bg-black/40 rounded-b-2xl animate-fadeIn">
                        {/* Objective */}
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                            Learning Objective:
                          </span>
                          <p className="text-slate-300 font-sans leading-relaxed">
                            {task.objective}
                          </p>
                        </div>

                        {/* Step-by-Step Instructions */}
                        <div className="space-y-2">
                          <span className="text-[11px] text-amber-400 uppercase font-bold block">
                            Step-by-Step Task Instructions:
                          </span>
                          <div className="space-y-1.5 font-sans text-slate-300 text-xs">
                            {task.instructions.map((inst, i) => (
                              <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800/60">
                                <span className="w-5 h-5 rounded-md bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="leading-relaxed whitespace-pre-wrap">{inst}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Concepts to Document */}
                        <div className="space-y-2">
                          <span className="text-[11px] text-purple-400 uppercase font-bold block">
                            Key Theoretical & Architectural Points to Include:
                          </span>
                          <ul className="space-y-1 text-slate-300 font-sans text-xs list-disc list-inside bg-slate-950/80 p-3 rounded-xl border border-slate-800/60">
                            {task.keyConcepts.map((kc, i) => (
                              <li key={i} className="leading-relaxed">{kc}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Commands & Terminal Snippets (If Applicable) */}
                        {task.commands && task.commands.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[11px] text-cyan-400 uppercase font-bold block">
                              Diagnostic Commands & Scripts:
                            </span>
                            <div className="space-y-2">
                              {task.commands.map((c, i) => {
                                const copyId = `${task.id}-cmd-${i}`;
                                const isCopied = copiedCmd === copyId;
                                return (
                                  <div key={i} className="p-2.5 rounded-xl bg-black border border-slate-800 space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                                      <span>{c.label}:</span>
                                      <button
                                        onClick={() => handleCopy(c.cmd, copyId)}
                                        className="text-slate-400 hover:text-cyan-400 transition cursor-pointer flex items-center gap-1"
                                      >
                                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                      </button>
                                    </div>
                                    <pre className="text-cyan-300 text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                      <code>{c.cmd}</code>
                                    </pre>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Deliverables */}
                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                          <span className="text-[11px] text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            Expected Student Deliverables for Submission:
                          </span>
                          <ul className="text-slate-300 font-sans text-xs space-y-1 list-disc list-inside">
                            {task.keyDeliverables.map((kd, i) => (
                              <li key={i}>{kd}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TRYHACKME PRACTICALS */}
        {activeMainTab === 'tryhackme' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Interactive cloud-hosted cyber simulation virtual machines:</span>
              <span className="text-red-400 font-bold">{practicals.length} Cloud Labs Available</span>
            </div>

            {practicals.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-400 font-mono">
                    Associated Module: <span className="text-cyan-400 font-bold">{item.topicTitle}</span>
                  </span>
                  {onSelectTopic && (
                    <button
                      onClick={() => {
                        onSelectTopic(item.topicId === 'intro' ? 0 : item.topicId === 'scope' ? 2 : 9);
                        onClose();
                      }}
                      className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] cursor-pointer"
                    >
                      Jump to Topic View &rarr;
                    </button>
                  )}
                </div>
                <PracticalCard practical={item} />
              </div>
            ))}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Progress automatically saved to local browser storage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
