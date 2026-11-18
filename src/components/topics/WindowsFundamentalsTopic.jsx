import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  FolderTree,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  Server,
  Terminal,
  CheckSquare,
  Square,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Play,
  RotateCcw,
  HelpCircle,
  Activity,
  Sparkles,
  Command,
  Globe,
  Sliders,
  Calendar,
  Clock,
  Laptop,
  HardDrive,
  Search,
  Award,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function WindowsFundamentalsTopic() {
  // Main Module Navigation Tab
  const [activeTab, setActiveTab] = useState('overview');

  // ============================================================
  // INTERACTIVE SIMULATOR STATES
  // ============================================================

  // 1. Module 2: CMD vs PowerShell User Management
  const [mgmtShell, setMgmtShell] = useState('cmd'); // 'cmd' | 'powershell'
  const [activeUserCmd, setActiveUserCmd] = useState('net user');

  // 2. Module 4 & 5: Effective Permissions Calculator (Share vs NTFS)
  const [selectedSharePerm, setSelectedSharePerm] = useState('Change'); // 'Read' | 'Change' | 'Full' | 'None'
  const [selectedNtfsPerm, setSelectedNtfsPerm] = useState('Read'); // 'Read' | 'Modify' | 'Full' | 'Deny'

  // Calculate Effective Access (Most Restrictive Rule)
  const calculateEffectiveAccess = () => {
    if (selectedNtfsPerm === 'Deny') {
      return { access: 'No Access (Blocked)', color: 'text-rose-400 bg-rose-950/60 border-rose-800', note: 'Explicit Deny on NTFS completely overrides all other permissions.' };
    }
    if (selectedSharePerm === 'None') {
      return { access: 'No Access (Blocked)', color: 'text-rose-400 bg-rose-950/60 border-rose-800', note: 'Share permissions do not grant any network access.' };
    }
    if (selectedSharePerm === 'Read' || selectedNtfsPerm === 'Read') {
      return { access: 'Read Only (View Files)', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800', note: 'Most Restrictive Rule: User can view files but cannot modify, save, or delete them.' };
    }
    if (selectedSharePerm === 'Change' && (selectedNtfsPerm === 'Modify' || selectedNtfsPerm === 'Full')) {
      return { access: 'Read & Modify (Edit/Delete Files)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', note: 'User can read, write, edit, and delete files, but cannot change NTFS ACL security.' };
    }
    if (selectedSharePerm === 'Full' && selectedNtfsPerm === 'Full') {
      return { access: 'Full Control (Unrestricted Access)', color: 'text-purple-400 bg-purple-950/60 border-purple-800', note: 'Full access: Read, Write, Delete, and Manage Permissions/Ownership.' };
    }
    return { access: 'Read & Modify', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', note: 'Standard read and write access.' };
  };

  // 3. Module 4: ICACLS Interactive Generator
  const [icaclsUser, setIcaclsUser] = useState('student1');
  const [icaclsPerm, setIcaclsPerm] = useState('(M)');
  const [icaclsInherit, setIcaclsInherit] = useState('(OI)(CI)');

  // 4. Module 7: Event Viewer Simulator State
  const [eventFilter, setEventFilter] = useState('all'); // 'all' | '4624' | '4625' | '4663' | '4720'

  // 5. Section 24: MCQ Assessment State
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // 6. Section 25: Short Answer Toggles
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // 7. Section 28: Trainer Preparation Checklist State
  const [checkedItems, setCheckedItems] = useState({
    0: false, 1: false, 2: false, 3: false, 4: false,
    5: false, 6: false, 7: false, 8: false, 9: false, 10: false
  });

  const toggleChecklist = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedChecklistCount = Object.values(checkedItems).filter(Boolean).length;

  // Toggle short answer solution
  const toggleAnswerReveal = (id) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // MCQ Data
  const mcqQuestions = [
    {
      id: 1,
      q: 'What is the primary purpose of a Windows user account?',
      options: ['Increase RAM', 'Identify and authenticate a user', 'Format a hard disk', 'Install drivers'],
      correct: 1,
      explanation: 'A Windows user account represents a unique identity used to authenticate a person or service and determine which resources they can access.'
    },
    {
      id: 2,
      q: 'Which command displays local Windows users?',
      options: ['ipconfig', 'net user', 'ping', 'tracert'],
      correct: 1,
      explanation: 'The "net user" command displays a list of all local accounts stored in the SAM database.'
    },
    {
      id: 3,
      q: 'Which account generally has the highest local administrative privileges?',
      options: ['Guest', 'Standard User', 'Administrator', 'Anonymous'],
      correct: 2,
      explanation: 'The built-in Administrator account (RID 500) has unrestricted rights to manage all system configuration, services, and security policies.'
    },
    {
      id: 4,
      q: 'Which PowerShell command creates a local user?',
      options: ['New-LocalUser', 'Get-LocalUser', 'Remove-LocalUser', 'Disable-LocalUser'],
      correct: 0,
      explanation: 'New-LocalUser is the modern PowerShell cmdlet used to create local user accounts.'
    },
    {
      id: 5,
      q: 'What does NTFS stand for?',
      options: ['Network Transfer File System', 'New Technology File System', 'Network Text Format System', 'New Transfer Format Storage'],
      correct: 1,
      explanation: 'NTFS stands for New Technology File System, introduced by Microsoft to provide security permissions, file compression, and journaling.'
    },
    {
      id: 6,
      q: 'Which command manages NTFS ACLs?',
      options: ['netstat', 'icacls', 'nslookup', 'hostname'],
      correct: 1,
      explanation: 'ICACLS is the native Windows command-line utility used to view, backup, and modify Access Control Lists on files and folders.'
    },
    {
      id: 7,
      q: 'Which permission allows users to read and modify files?',
      options: ['Read', 'Modify', 'List only', 'No access'],
      correct: 1,
      explanation: 'The Modify permission includes Read, Write, Execute, and Delete permissions.'
    },
    {
      id: 8,
      q: 'What is Active Directory primarily used for?',
      options: ['Video editing', 'Centralized identity and resource management', 'Disk formatting', 'Web browsing'],
      correct: 1,
      explanation: 'Active Directory Domain Services (AD DS) centralizes the management of user identities, computers, group policies, and enterprise security boundaries.'
    },
    {
      id: 9,
      q: 'Which tool opens Active Directory Users and Computers?',
      options: ['diskmgmt.msc', 'dsa.msc', 'taskmgr', 'msconfig'],
      correct: 1,
      explanation: 'dsa.msc (Directory Service Administration) opens the Active Directory Users and Computers management console.'
    },
    {
      id: 10,
      q: 'Which Windows event ID represents a failed logon?',
      options: ['4624', '4625', '4720', '4663'],
      correct: 1,
      explanation: 'Event ID 4625 logs every failed logon attempt, making it the most critical event for detecting brute-force and password-spraying attacks.'
    },
    {
      id: 11,
      q: 'What is a Domain Controller?',
      options: ['A USB controller', 'A server hosting AD DS', 'A printer server only', 'A desktop application'],
      correct: 1,
      explanation: 'A Domain Controller is a Windows Server running the Active Directory Domain Services role that stores directory data and manages user authentications.'
    },
    {
      id: 12,
      q: 'What does the principle of least privilege mean?',
      options: ['Give everyone admin rights', 'Provide only the access necessary for a task', 'Disable every account', 'Share all folders publicly'],
      correct: 1,
      explanation: 'Least Privilege mandates granting users and processes only the minimum access rights essential to fulfill their assigned role.'
    }
  ];

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const score = mcqQuestions.reduce((acc, q) => (userAnswers[q.id] === q.correct ? acc + 1 : acc), 0);

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* TOP CURRICULUM NAVIGATION BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-300" />
              <span>1. Course & Lab Setup</span>
            </button>

            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-300" />
              <span>2. Mod 1: User Accounts (GUI)</span>
            </button>

            <button
              onClick={() => setActiveTab('cli-mgmt')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'cli-mgmt'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-300" />
              <span>3. Mod 2: CMD & PowerShell</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderTree className="w-4 h-4 text-amber-300" />
              <span>4. Mod 3: File Management</span>
            </button>

            <button
              onClick={() => setActiveTab('ntfs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'ntfs'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Lock className="w-4 h-4 text-purple-300" />
              <span>5. Mod 4: NTFS & ICACLS</span>
            </button>

            <button
              onClick={() => setActiveTab('shares')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'shares'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4 text-teal-300" />
              <span>6. Mod 5: Shared Folders (SMB)</span>
            </button>

            <button
              onClick={() => setActiveTab('ad')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'ad'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Server className="w-4 h-4 text-indigo-300" />
              <span>7. Mod 6: Active Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('auditing')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'auditing'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-300" />
              <span>8. Mod 7: Security Auditing</span>
            </button>

            <button
              onClick={() => setActiveTab('labs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'labs'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-300" />
              <span>9. Student Labs & Challenge</span>
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'assessment'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-purple-300" />
              <span>10. Assessment MCQ</span>
            </button>

            <button
              onClick={() => setActiveTab('trainer')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'trainer'
                  ? 'bg-amber-600 text-black font-extrabold shadow-lg shadow-amber-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>11. Trainer Toolkit</span>
            </button>
          </div>

          <span className="hidden xl:inline text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 font-bold">
            TRAINER MODULE: WINDOWS CLIENT + SERVER
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: COURSE OVERVIEW, LAB SETUP & SCHEDULE */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-inner">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Windows User Account & File Management: Complete Trainer Module
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive 8-hour curriculum for cybersecurity students and beginner system administrators covering Windows Client & Server.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  TRAINING: Beginner to Intermediate
                </span>
                <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  DURATION: 8 Hours (Two 4h Sessions)
                </span>
              </div>
            </div>

            {/* Core Objective & Learning Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-cyan-400 font-mono mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> MAIN OBJECTIVE
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Teach students how to create and manage user accounts, configure permissions, organize files, secure folders, and audit user activities on Windows Client and Windows Server.
                </p>
                <div className="mt-3 text-[11px] text-slate-400 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  <strong>Teaching Method:</strong> Theory + Live Trainer Demonstrations + Hands-on CLI/GUI Student Practice.
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-emerald-400 font-mono mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> LEARNING OUTCOMES
                </h3>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Understand Windows user accounts, authentication & SIDs.</li>
                  <li>Create, modify, disable and delete accounts via GUI, CMD & PowerShell.</li>
                  <li>Master NTFS permissions, inheritance flags, and ICACLS utility.</li>
                  <li>Configure SMB shared folders and evaluate effective network access.</li>
                  <li>Deploy Active Directory Domain Services (AD DS) and manage domain users.</li>
                  <li>Audit security events and investigate logon failures in Event Viewer.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Lab Environment & Requirements */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-purple-400" />
              LAB ENVIRONMENT & VIRTUAL MACHINE TOPOLOGY
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40">
                <span className="font-bold text-blue-300 text-sm block">VM 1: Client Workstation</span>
                <span className="text-slate-400 block mt-1">OS: Windows 11 Pro / Enterprise</span>
                <p className="text-slate-300 text-[11px] mt-2 font-sans">
                  Used for client-side local user administration, GUI/CMD/PowerShell demonstrations, testing shared folder access, and joining the enterprise domain.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40">
                <span className="font-bold text-purple-300 text-sm block">VM 2: Windows Server 2022</span>
                <span className="text-slate-400 block mt-1">OS: Windows Server 2022 with Desktop Experience</span>
                <p className="text-slate-300 text-[11px] mt-2 font-sans">
                  Server administration, hosting SMB file shares (`C:\Shares\Training`), and hosting Active Directory Domain Services (AD DS) as the Domain Controller (`corp.example`).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300 text-sm block">Recommended VM Specs</span>
                <ul className="text-slate-400 text-[11px] mt-2 space-y-1 font-sans">
                  <li><strong>RAM:</strong> 4 GB minimum (8 GB preferred for Server with GUI)</li>
                  <li><strong>CPU:</strong> 2 Virtual Processors</li>
                  <li><strong>Storage:</strong> 60 GB or more</li>
                  <li><strong>Network:</strong> VMware NAT or Host-only isolated network</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Important Preparation Note for Trainers:</strong> Always take a VM snapshot prior to student exercises. Windows Home has limitations with Local Users & Groups (`lusrmgr.msc`) and Group Policies; ensure students use Windows Pro or Enterprise.
              </div>
            </div>
          </div>

          {/* Section 3: Training Schedule Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              8-SESSION TRAINING SCHEDULE (8 HOURS TOTAL)
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Session</th>
                    <th className="p-3">Topic Title</th>
                    <th className="p-3">Focus Area</th>
                    <th className="p-3">Allocated Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 1</td>
                    <td className="p-3 font-bold text-blue-300">Windows User Account Fundamentals</td>
                    <td className="p-3 text-slate-400">Authentication, SIDs, Tokens & UAC</td>
                    <td className="p-3 text-cyan-400">45 min</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 2</td>
                    <td className="p-3 font-bold text-blue-300">Local Users & Groups Management</td>
                    <td className="p-3 text-slate-400">Settings GUI & Computer Management (`compmgmt.msc`)</td>
                    <td className="p-3 text-cyan-400">60 min</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 3</td>
                    <td className="p-3 font-bold text-emerald-300">CMD and PowerShell Administration</td>
                    <td className="p-3 text-slate-400">`net user`, `net localgroup`, `Get-LocalUser`, `New-LocalUser`</td>
                    <td className="p-3 text-cyan-400">60 min</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 4</td>
                    <td className="p-3 font-bold text-amber-300">Windows File and Folder Management</td>
                    <td className="p-3 text-slate-400">File systems (NTFS vs FAT32), CLI operations, Robocopy</td>
                    <td className="p-3 text-cyan-400">45 min</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 5</td>
                    <td className="p-3 font-bold text-purple-300">NTFS Permissions and Security</td>
                    <td className="p-3 text-slate-400">ACLs, Allow vs Deny, Inheritance, Advanced Security, ICACLS</td>
                    <td className="p-3 text-cyan-400">90 min</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 6</td>
                    <td className="p-3 font-bold text-teal-300">Shared Folders & Network Permissions</td>
                    <td className="p-3 text-slate-400">SMB Sharing, Effective Access rule, Network drive mapping</td>
                    <td className="p-3 text-cyan-400">60 min</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 7</td>
                    <td className="p-3 font-bold text-indigo-300">Windows Server & Active Directory</td>
                    <td className="p-3 text-slate-400">AD DS role, Forest, Tree, OUs, Domain Joining</td>
                    <td className="p-3 text-cyan-400">60 min</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">Session 8</td>
                    <td className="p-3 font-bold text-rose-300">Event Logs & Practical Assessment</td>
                    <td className="p-3 text-slate-400">Event IDs 4624/4625, Auditing, Student Labs & Final Challenge</td>
                    <td className="p-3 text-cyan-400">60 min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULE 1: USER ACCOUNT FUNDAMENTALS & GUI MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'accounts' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section 4: What is a Windows User Account? */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Module 1: What is a Windows User Account?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Understanding identity, authentication, authorization, and Security Identifiers (SIDs).
              </p>
            </div>

            <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3">
              <p className="leading-relaxed">
                A Windows user account is an identity used to authenticate a person or service and determine what resources they can access. Every user account has a unique <strong>Security Identifier (SID)</strong>. Windows associates permissions with SIDs rather than usernames.
              </p>

              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-200">
                <strong className="font-mono text-cyan-300">Trainer Explanation to Students:</strong>
                <p className="mt-1 italic">
                  "When you log in to Windows, the operating system checks your credentials and creates an Access Token. This token contains your user SID and group SIDs. Windows references this access token on every single file read or system call to decide whether access is granted."
                </p>
              </div>
            </div>

            {/* Types of Windows Accounts Table */}
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold block mb-3">
              Types of Windows Accounts:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-400 font-mono block mb-1">Administrator</span>
                <p className="text-slate-300 text-[11px]">Can perform privileged system operations, install software, manage services, and bypass standard restrictions.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-blue-400 font-mono block mb-1">Standard User</span>
                <p className="text-slate-300 text-[11px]">Has limited permissions to run approved software and save files in their own profile; cannot alter system files.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-400 font-mono block mb-1">Guest Account</span>
                <p className="text-slate-300 text-[11px]">Restricted built-in temporary account, disabled by default across modern Windows installations.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 font-mono block mb-1">Local Account</span>
                <p className="text-slate-300 text-[11px]">Stored in the local Security Account Manager (SAM) database; valid only on that specific computer.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 font-mono block mb-1">Microsoft Account</span>
                <p className="text-slate-300 text-[11px]">Consumer identity connected to cloud services (OneDrive, Microsoft 365, Outlook.com).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-purple-400 font-mono block mb-1">Domain Account</span>
                <p className="text-slate-300 text-[11px]">Centrally managed through Active Directory Domain Services (AD DS) on a Domain Controller.</p>
              </div>
            </div>
          </div>

          {/* Section 5: GUI Account Demonstrations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Command className="w-4 h-4 text-emerald-400" />
              LIVE TRAINER DEMONSTRATIONS: LOCAL ACCOUNT CREATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Demo 1: Settings App */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300 font-mono block mb-2">
                  Demonstration 1: Create a Local User via Settings
                </span>
                <ol className="space-y-1.5 text-slate-300 list-decimal list-inside text-[11px]">
                  <li>Press <strong>Win + I</strong> to open Settings.</li>
                  <li>Navigate to <strong>Accounts</strong> &rarr; <strong>Other users</strong>.</li>
                  <li>Click <strong>Add account</strong>.</li>
                  <li>Select <em>"I don't have this person's sign-in information"</em>.</li>
                  <li>Select <em>"Add a user without a Microsoft account"</em>.</li>
                  <li>Enter username (e.g. <code>student1</code>) and strong password.</li>
                  <li>Finish account creation and verify it appears under Other Users.</li>
                </ol>
              </div>

              {/* Demo 2: Computer Management */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-purple-300 font-mono block mb-2">
                  Demonstration 2: Using Computer Management (`compmgmt.msc`)
                </span>
                <ol className="space-y-1.5 text-slate-300 list-decimal list-inside text-[11px]">
                  <li>Press <strong>Win + R</strong>, type <code>compmgmt.msc</code>, and hit Enter.</li>
                  <li>Expand <strong>System Tools</strong> &rarr; <strong>Local Users and Groups</strong> &rarr; <strong>Users</strong>.</li>
                  <li>Right-click in the middle pane and select <strong>New User...</strong></li>
                  <li>Enter Username: <code>student2</code>, Full Name, and Password.</li>
                  <li>Configure options: <em>"User must change password at next logon"</em>.</li>
                  <li>Click <strong>Create</strong> and inspect user properties.</li>
                </ol>
              </div>
            </div>

            {/* Trainer Discussion Box */}
            <div className="mt-5 p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs">
              <span className="font-bold text-blue-300 font-mono block mb-2">
                Trainer Classroom Discussion Questions:
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
                <li><strong>What is the difference between an Administrator and a Standard User?</strong> (Admins possess unrestricted privileges; standard users cannot modify system configuration).</li>
                <li><strong>Why should we avoid using Administrator accounts for daily work?</strong> (Malware or browser exploits running under an admin session immediately gain full system compromise).</li>
                <li><strong>What happens if an account is disabled?</strong> (The user cannot authenticate, but their SID, profile data, and file permissions remain intact).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULE 2: CMD & POWERSHELL USER MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'cli-mgmt' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  Module 2: User & Group Management via CMD & PowerShell
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute native administrative commands to create, modify, inspect, disable, and delete security accounts.
                </p>
              </div>

              {/* Shell Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setMgmtShell('cmd');
                    setActiveUserCmd('net user');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    mgmtShell === 'cmd' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CMD (Command Prompt)
                </button>
                <button
                  onClick={() => {
                    setMgmtShell('powershell');
                    setActiveUserCmd('Get-LocalUser');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    mgmtShell === 'powershell' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PowerShell 7
                </button>
              </div>
            </div>

            {/* Quick Command Selector */}
            <div className="my-4">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                Click a demonstration command to inspect its output:
              </span>
              <div className="flex flex-wrap gap-2">
                {mgmtShell === 'cmd' ? (
                  <>
                    <button
                      onClick={() => setActiveUserCmd('net user')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'net user'
                          ? 'border-emerald-500 bg-emerald-950 text-emerald-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      Step 1: net user
                    </button>
                    <button
                      onClick={() => setActiveUserCmd('net user student1 * /add')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'net user student1 * /add'
                          ? 'border-emerald-500 bg-emerald-950 text-emerald-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      Step 2: net user student1 * /add
                    </button>
                    <button
                      onClick={() => setActiveUserCmd('net user student1')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'net user student1'
                          ? 'border-emerald-500 bg-emerald-950 text-emerald-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      Step 3: net user student1 (Details)
                    </button>
                    <button
                      onClick={() => setActiveUserCmd('net user student1 /active:no')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'net user student1 /active:no'
                          ? 'border-emerald-500 bg-emerald-950 text-emerald-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      Step 4: net user student1 /active:no
                    </button>
                    <button
                      onClick={() => setActiveUserCmd('net localgroup Administrators student1 /add')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'net localgroup Administrators student1 /add'
                          ? 'border-emerald-500 bg-emerald-950 text-emerald-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      Step 5: net localgroup Administrators student1 /add
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveUserCmd('Get-LocalUser')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'Get-LocalUser'
                          ? 'border-blue-500 bg-blue-950 text-blue-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      1. Get-LocalUser
                    </button>
                    <button
                      onClick={() => setActiveUserCmd('New-LocalUser -Name "student2"')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'New-LocalUser -Name "student2"'
                          ? 'border-blue-500 bg-blue-950 text-blue-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      2. New-LocalUser
                    </button>
                    <button
                      onClick={() => setActiveUserCmd('Add-LocalGroupMember -Group "Users" -Member "student2"')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'Add-LocalGroupMember -Group "Users" -Member "student2"'
                          ? 'border-blue-500 bg-blue-950 text-blue-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      3. Add-LocalGroupMember
                    </button>
                    <button
                      onClick={() => setActiveUserCmd('Disable-LocalUser -Name "student2"')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeUserCmd === 'Disable-LocalUser -Name "student2"'
                          ? 'border-blue-500 bg-blue-950 text-blue-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      4. Disable-LocalUser
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Terminal Window */}
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black font-mono text-xs">
              <div
                className={`px-4 py-2 flex items-center justify-between text-slate-300 border-b ${
                  mgmtShell === 'cmd' ? 'bg-slate-900 border-slate-800' : 'bg-[#012456] border-blue-800 text-white'
                }`}
              >
                <span>{mgmtShell === 'cmd' ? 'Administrator: Command Prompt' : 'Administrator: Windows PowerShell'}</span>
                <span className="text-[10px]">High Integrity Elevation</span>
              </div>

              <div className="p-4 space-y-2 text-slate-200 min-h-[180px]">
                <div className="text-emerald-400">
                  {mgmtShell === 'cmd' ? 'C:\\Windows\\system32>' : 'PS C:\\Windows\\system32>'}{' '}
                  <span className="text-white font-bold">{activeUserCmd}</span>
                </div>

                {activeUserCmd === 'net user' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`User accounts for \\\\WORKSTATION-01

-------------------------------------------------------------------------------
Administrator            DefaultAccount           Guest
student1                 WDAGUtilityAccount
The command completed successfully.`}
                  </pre>
                )}

                {activeUserCmd === 'net user student1 * /add' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`Type a password for the user: ********
Retype the password to confirm: ********
The command completed successfully.`}
                  </pre>
                )}

                {activeUserCmd === 'net user student1' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`User name                    student1
Full Name                    Cyber Training Account
Account active               Yes
Account expires              Never
Password last set            11/4/2026 10:00:15 AM
Password required            Yes
User may change password     Yes
Local Group Memberships      *Users
Global Group memberships     *None
The command completed successfully.`}
                  </pre>
                )}

                {activeUserCmd === 'net user student1 /active:no' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`The command completed successfully.
Account status updated: Inactive (Disabled).`}
                  </pre>
                )}

                {activeUserCmd === 'net localgroup Administrators student1 /add' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`The command completed successfully.
[!] Trainer Note: For security training, remove student accounts from Administrators group after testing.`}
                  </pre>
                )}

                {activeUserCmd === 'Get-LocalUser' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`Name               Enabled Description
----               ------- -----------
Administrator      False   Built-in account for administering the computer/domain
DefaultAccount     False   A user account managed by the system.
Guest              False   Built-in account for guest access to the computer/domain
student2           True    Training Lab Account`}
                  </pre>
                )}

                {activeUserCmd === 'New-LocalUser -Name "student2"' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`$password = Read-Host "Enter password" -AsSecureString
New-LocalUser -Name "student2" -FullName "Cyber Student" -Description "Training Lab Account" -Password $password

Name     Enabled Description
----     ------- -----------
student2 True    Training Lab Account`}
                  </pre>
                )}

                {activeUserCmd === 'Add-LocalGroupMember -Group "Users" -Member "student2"' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`Add-LocalGroupMember -Group "Users" -Member "student2"
# Verified membership:
Get-LocalGroupMember -Group "Users"

ObjectClass Name                 PrincipalSource
----------- ----                 ---------------
User        WORKSTATION\\student2 Local`}
                  </pre>
                )}

                {activeUserCmd === 'Disable-LocalUser -Name "student2"' && (
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`Disable-LocalUser -Name "student2"
# To re-enable:
Enable-LocalUser -Name "student2"`}
                  </pre>
                )}
              </div>
            </div>

            {/* Section 8: Windows Client vs Windows Server Comparison Table */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                WINDOWS CLIENT VS WINDOWS SERVER USER MANAGEMENT
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Feature</th>
                      <th className="p-3 text-blue-400">Windows Client (10/11 Pro)</th>
                      <th className="p-3 text-purple-400">Windows Server (2019/2022)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-white">Local Users & Groups</td>
                      <td className="p-2.5">Yes (Windows Pro/Enterprise)</td>
                      <td className="p-2.5">Yes (All editions)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Domain Account Management</td>
                      <td className="p-2.5">Can authenticate using domain credentials</td>
                      <td className="p-2.5 font-bold text-emerald-400">Can host AD DS & centrally manage all accounts</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Group Policy (GPO)</td>
                      <td className="p-2.5">Can receive and enforce policies</td>
                      <td className="p-2.5 font-bold text-emerald-400">Can author & deploy domain GPOs via GPMC</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Enterprise File Sharing</td>
                      <td className="p-2.5">Basic peer-to-peer sharing</td>
                      <td className="p-2.5 font-bold text-emerald-400">Advanced SMB File Server with Quotas & DFS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULE 3: WINDOWS FILE AND FOLDER MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'files' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-amber-400" />
                Module 3: Windows File and Folder Management
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                File system architectures, directory hierarchies, and operations using GUI, CMD, PowerShell, and Robocopy.
              </p>
            </div>

            {/* File Systems Overview */}
            <div className="my-5 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/40">
                <span className="font-bold text-blue-300 block">NTFS</span>
                <span className="text-[10px] text-slate-500 block">System Drives</span>
                <p className="text-slate-300 text-[11px] mt-1 font-sans">
                  Granular permissions, EFS encryption, disk quotas, auditing, and USN journaling.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300 block">FAT32</span>
                <span className="text-[10px] text-slate-500 block">Legacy & USB</span>
                <p className="text-slate-300 text-[11px] mt-1 font-sans">
                  Broad compatibility across devices. Maximum individual file size limit of <strong>4 GB</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300 block">exFAT</span>
                <span className="text-[10px] text-slate-500 block">External Storage</span>
                <p className="text-slate-300 text-[11px] mt-1 font-sans">
                  Supports modern large files (&gt;4 GB) with cross-platform macOS/Linux compatibility.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/40">
                <span className="font-bold text-purple-300 block">ReFS</span>
                <span className="text-[10px] text-slate-500 block">Server Storage Spaces</span>
                <p className="text-slate-300 text-[11px] mt-1 font-sans">
                  Resilient File System with automatic data scrubbing and protection against bit rot.
                </p>
              </div>
            </div>

            {/* CMD & PowerShell File Management Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 font-mono block mb-2">
                  1. File Management Using CMD:
                </span>
                <pre className="font-mono text-[11px] text-slate-300 bg-black/60 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`:: Create folder structure
mkdir C:\\Cybersecurity
cd C:\\Cybersecurity
mkdir Students Reports Projects

:: Create text file
echo Windows Training > welcome.txt

:: Copy and rename
copy welcome.txt Students
ren welcome.txt introduction.txt

:: View tree hierarchy
tree C:\\Cybersecurity

:: Delete file and directory
del introduction.txt
rmdir C:\\Cybersecurity\\Students`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 font-mono block mb-2">
                  2. PowerShell File Cmdlets & Robocopy:
                </span>
                <pre className="font-mono text-[11px] text-slate-300 bg-black/60 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`# Create folder and subfolders
New-Item -Path "C:\\Cybersecurity" -ItemType Directory
New-Item -Path "C:\\Cybersecurity\\Students" -ItemType Directory

# Create file & write content
Set-Content -Path "C:\\Cybersecurity\\welcome.txt" -Value "Windows Admin Lab"
Get-Content "C:\\Cybersecurity\\welcome.txt"

# Copy and list files recursively
Copy-Item "C:\\Cybersecurity\\welcome.txt" "C:\\Cybersecurity\\Reports"
Get-ChildItem "C:\\Cybersecurity" -Recurse

# Advanced Backup using Robocopy:
mkdir C:\\LabBackup
robocopy C:\\Cybersecurity C:\\LabBackup /E /R:2 /W:2 /LOG:C:\\LabBackup.log`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULE 4: NTFS PERMISSIONS & ACCESS CONTROL */}
      {/* ============================================================ */}
      {activeTab === 'ntfs' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Module 4: NTFS Permissions and Access Control
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Discretionary Access Control Lists (DACLs), permission inheritance, explicit permissions, and ICACLS.
              </p>
            </div>

            {/* Permission Types Grid */}
            <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/40">
                <span className="font-bold text-purple-300 font-mono block">Full Control</span>
                <p className="text-slate-300 text-[11px] mt-1">Full access including modifying permissions and taking ownership.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-300 font-mono block">Modify</span>
                <p className="text-slate-300 text-[11px] mt-1">Read, write, execute, create, and delete files and subfolders.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300 font-mono block">Read & Execute</span>
                <p className="text-slate-300 text-[11px] mt-1">View file contents, folder structures, and execute scripts/programs.</p>
              </div>
            </div>

            {/* Inheritance Explanation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-amber-400 font-mono block">Permission Inheritance Rule:</span>
              <p className="leading-relaxed">
                By default, child files and subfolders automatically inherit permissions from their parent container. If permissions are granted on <code>C:\Company</code>, they flow down to <code>HR</code>, <code>IT</code>, and <code>Finance</code> unless inheritance is explicitly disabled.
              </p>
              <div className="font-mono text-[11px] bg-black/60 p-2.5 rounded text-slate-400">
                C:\Company<br />
                &nbsp;&nbsp;|-- HR &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Inherits permissions from Company unless blocked]<br />
                &nbsp;&nbsp;|-- IT<br />
                &nbsp;&nbsp;|-- Finance
              </div>
            </div>

            {/* ICACLS Interactive Generator Studio */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                ICACLS PERMISSION COMMAND GENERATOR
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Account:</label>
                  <input
                    type="text"
                    value={icaclsUser}
                    onChange={(e) => setIcaclsUser(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Permission Level:</label>
                  <select
                    value={icaclsPerm}
                    onChange={(e) => setIcaclsPerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="(RX)">Read and Execute (RX)</option>
                    <option value="(M)">Modify (M)</option>
                    <option value="(F)">Full Control (F)</option>
                    <option value="(W)">Write Only (W)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Inheritance Flags:</label>
                  <select
                    value={icaclsInherit}
                    onChange={(e) => setIcaclsInherit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="(OI)(CI)">(OI)(CI) - Files & Subfolders</option>
                    <option value="(OI)">(OI) - Files Only (Object Inherit)</option>
                    <option value="(CI)">(CI) - Folders Only (Container Inherit)</option>
                    <option value="">None (Current Object Only)</option>
                  </select>
                </div>
              </div>

              {/* Generated Command Box */}
              <div className="p-3.5 rounded-xl bg-black border border-emerald-500/50 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Generated ICACLS Command:</span>
                  <code className="text-emerald-400 font-bold text-sm">
                    icacls C:\Company /grant {icaclsUser}:{icaclsInherit}{icaclsPerm}
                  </code>
                </div>
                <div className="text-[10px] text-slate-400">
                  <span>To view permissions: </span>
                  <code className="text-cyan-400">icacls C:\Company</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULE 5: SHARED FOLDERS & SMB NETWORK PERMISSIONS */}
      {/* ============================================================ */}
      {activeTab === 'shares' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-400" />
                Module 5: Shared Folders and Network File Management (SMB)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand Server Message Block (SMB), Share permissions vs NTFS permissions, and drive mapping.
              </p>
            </div>

            {/* Share vs NTFS Core Concept */}
            <div className="my-5 p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200">
              <strong className="font-mono text-cyan-300">CRITICAL SYSTEM ADMINISTRATION PRINCIPLE:</strong>
              <p className="mt-1 leading-relaxed">
                When a user connects to a folder over the network via SMB, <strong>both Share permissions and NTFS permissions apply simultaneously</strong>. The resulting access is always the <strong>MOST RESTRICTIVE</strong> combination of the two!
              </p>
            </div>

            {/* Interactive Effective Permissions Calculator */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                INTERACTIVE EFFECTIVE PERMISSION SIMULATOR:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-xs text-blue-300 font-mono block mb-2">
                    1. Configured Share Permission (Sharing Tab):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {['Read', 'Change', 'Full', 'None'].map((perm) => (
                      <button
                        key={perm}
                        onClick={() => setSelectedSharePerm(perm)}
                        className={`p-2 rounded border transition cursor-pointer ${
                          selectedSharePerm === perm
                            ? 'border-blue-500 bg-blue-950 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        Share: {perm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-xs text-purple-300 font-mono block mb-2">
                    2. Configured NTFS Permission (Security Tab):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {['Read', 'Modify', 'Full', 'Deny'].map((perm) => (
                      <button
                        key={perm}
                        onClick={() => setSelectedNtfsPerm(perm)}
                        className={`p-2 rounded border transition cursor-pointer ${
                          selectedNtfsPerm === perm
                            ? 'border-purple-500 bg-purple-950 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        NTFS: {perm}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Evaluated Result */}
              {(() => {
                const res = calculateEffectiveAccess();
                return (
                  <div className={`p-4 rounded-xl border ${res.color} text-xs font-mono shadow-inner`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold uppercase tracking-wide">
                        EFFECTIVE NETWORK ACCESS: {res.access}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/60">MOST RESTRICTIVE APPLIED</span>
                    </div>
                    <p className="mt-2 text-[11px] opacity-90 font-sans">{res.note}</p>
                  </div>
                );
              })()}
            </div>

            {/* Practical Setup Guide */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 font-mono block mb-2">
                  Create Share via PowerShell on Windows Server:
                </span>
                <pre className="font-mono text-[11px] text-slate-300 bg-black/60 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`# Create folder
New-Item -Path "C:\\Shares\\Training" -ItemType Directory -Force

# Create SMB share
New-SmbShare -Name "Training" \`
  -Path "C:\\Shares\\Training" \`
  -ChangeAccess "CORP\\CyberStudents" \`
  -FullAccess "CORP\\Domain Admins"

# Inspect share
Get-SmbShareAccess -Name "Training"`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 font-mono block mb-2">
                  Client-Side Access & Network Drive Mapping:
                </span>
                <pre className="font-mono text-[11px] text-slate-300 bg-black/60 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`:: Direct UNC Path access via Run (Win+R):
\\\\SERVER2022\\Training

:: Map network drive permanently to Z:
net use Z: \\\\SERVER2022\\Training /persistent:yes

:: Disconnect mapped drive:
net use Z: /delete`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULE 6: WINDOWS SERVER & ACTIVE DIRECTORY */}
      {/* ============================================================ */}
      {activeTab === 'ad' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" />
                Module 6: Windows Server and Active Directory User Management
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized identity with AD DS, Domains, Forests, Trees, Organizational Units (OUs), and Domain Joining.
              </p>
            </div>

            {/* AD Topology Visual Card */}
            <div className="my-5 p-5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono uppercase text-indigo-400 font-bold block mb-3 text-center">
                ACTIVE DIRECTORY DOMAIN SERVICES HIERARCHY
              </span>

              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-slate-900 border border-indigo-500/50 text-xs font-mono">
                <div className="text-indigo-300 font-bold flex items-center justify-between pb-2 border-b border-slate-800">
                  <span>ROOT DOMAIN: corp.example</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400">DOMAIN CONTROLLER: \\\\SERVER2022</span>
                </div>

                <div className="mt-3 pl-4 space-y-2 border-l-2 border-indigo-500/40 text-[11px] text-slate-300">
                  <div>
                    <strong className="text-cyan-300">OU=Students</strong> (Organizational Unit)
                    <div className="pl-4 text-slate-400 space-y-1 mt-1">
                      <div>&bull; User: <strong>student1</strong> (student1@corp.example)</div>
                      <div>&bull; Security Group: <strong>CyberStudents</strong> (Member: student1)</div>
                      <div>&bull; Linked GPO: Enforce screen lock after 10 minutes</div>
                    </div>
                  </div>

                  <div>
                    <strong className="text-purple-300">OU=Computers</strong>
                    <div className="pl-4 text-slate-400 mt-1">
                      &bull; Workstation: <strong>CLIENT-01</strong> (Joined to corp.example domain)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Installation & Administration Code Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-indigo-300 font-mono block mb-2">
                  1. Install AD DS & Promote Domain Controller:
                </span>
                <pre className="font-mono text-[11px] text-slate-300 bg-black/60 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`# Install AD DS role via PowerShell
Install-WindowsFeature AD-Domain-Services \`
  -IncludeManagementTools

# Promote to Domain Controller (Creates Forest)
Install-ADDSForest \`
  -DomainName "corp.example" \`
  -DomainNetbiosName "CORP" \`
  -InstallDNS

# Server restarts automatically upon completion.`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-300 font-mono block mb-2">
                  2. Create OU, User & Security Group:
                </span>
                <pre className="font-mono text-[11px] text-slate-300 bg-black/60 p-3 rounded-lg overflow-x-auto leading-relaxed">
{`Import-Module ActiveDirectory

# Create OU
New-ADOrganizationalUnit -Name "Students" \`
  -Path "DC=corp,DC=example"

# Create User
$pw = Read-Host "Password" -AsSecureString
New-ADUser -Name "Student One" -SamAccountName "student1" \`
  -UserPrincipalName "student1@corp.example" \`
  -Path "OU=Students,DC=corp,DC=example" \`
  -AccountPassword $pw -Enabled $true

# Join Client to Domain:
Add-Computer -DomainName "corp.example" \`
  -Credential "CORP\\Administrator" -Restart`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULE 7: SECURITY AUDITING & EVENT VIEWER */}
      {/* ============================================================ */}
      {activeTab === 'auditing' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  Module 7: Windows Security Auditing & Event Logs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Record and investigate logon events, account modifications, privilege use, and object access.
                </p>
              </div>

              {/* Event Filter Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setEventFilter('all')}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    eventFilter === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Logs
                </button>
                <button
                  onClick={() => setEventFilter('4624')}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    eventFilter === '4624' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4624 (Logon)
                </button>
                <button
                  onClick={() => setEventFilter('4625')}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    eventFilter === '4625' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4625 (Failed)
                </button>
              </div>
            </div>

            {/* Critical Security Event IDs Table */}
            <div className="my-5 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Event ID</th>
                    <th className="p-2.5">Activity Description</th>
                    <th className="p-2.5">Cybersecurity Relevance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-emerald-400">4624</td>
                    <td className="p-2.5 font-bold text-white">An account was successfully logged on</td>
                    <td className="p-2.5 text-slate-400">Establishes legitimate user baseline; check Logon Type (Type 2=Interactive, Type 3=Network, Type 10=RDP).</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-rose-400">4625</td>
                    <td className="p-2.5 font-bold text-white">An account failed to log on</td>
                    <td className="p-2.5 text-slate-400">Crucial indicator of brute-force password attacks or compromised credentials.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">4663</td>
                    <td className="p-2.5 font-bold text-white">An attempt was made to access an object</td>
                    <td className="p-2.5 text-slate-400">Generated when auditing is configured on a confidential folder to detect unauthorized read/write.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-400">4720</td>
                    <td className="p-2.5 font-bold text-white">A user account was created</td>
                    <td className="p-2.5 text-slate-400">Detects backdoor rogue accounts created by adversaries for persistence.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-purple-400">4728</td>
                    <td className="p-2.5 font-bold text-white">A member was added to a security group</td>
                    <td className="p-2.5 text-slate-400">Alerts when a standard user is elevated into Domain Admins or local Administrators.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interactive Simulated Event Log Viewer */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black font-mono text-xs">
              <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-slate-300 border-b border-slate-800">
                <span className="text-cyan-400 font-bold">Event Viewer (`eventvwr.msc`) - Windows Logs &rarr; Security</span>
                <span className="text-[10px] text-slate-500">Live Audit Simulation</span>
              </div>

              <div className="p-4 space-y-2 text-slate-300">
                {(eventFilter === 'all' || eventFilter === '4624') && (
                  <div className="p-2.5 rounded bg-slate-900 border border-emerald-900/60">
                    <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                      <span>Event 4624, Microsoft-Windows-Security-Auditing</span>
                      <span className="text-slate-400">11/4/2026 10:14:02 AM</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Account Name: <strong>student1</strong> | Domain: CORP | Logon Type: 2 (Interactive Console) | Status: Success
                    </p>
                  </div>
                )}

                {(eventFilter === 'all' || eventFilter === '4625') && (
                  <div className="p-2.5 rounded bg-slate-900 border border-rose-900/60">
                    <div className="flex items-center justify-between text-rose-400 font-bold text-[11px]">
                      <span>Event 4625, Microsoft-Windows-Security-Auditing</span>
                      <span className="text-slate-400">11/4/2026 10:15:30 AM</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Account Name: <strong>Administrator</strong> | Failure Reason: Unknown user name or bad password (0xC000006A) | Source IP: 192.168.1.150
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 9: STUDENT PRACTICAL WORKBOOK (LABS 1 - 8) */}
      {/* ============================================================ */}
      {activeTab === 'labs' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Labs 1 to 8 Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Student Practical Workbook: Labs 1 Through 8
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hands-on guided laboratory exercises for students to complete in client and server environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {/* Lab 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-blue-300 font-mono">Lab 1 – Create and Manage Windows Users</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono">BEGINNER</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Create student1 & student2, inspect details, disable, re-enable, and delete student2.</p>
                <code className="text-[11px] font-mono text-cyan-300 block bg-black/60 p-2 rounded">
                  net user student1 * /add<br />
                  net user student2 * /add<br />
                  net user student2 /active:no<br />
                  net user student2 /delete
                </code>
              </div>

              {/* Lab 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-emerald-300 font-mono">Lab 2 – Administrator vs Standard User</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">BEGINNER</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Create adminlab and userlab, assign adminlab to Administrators, compare permissions.</p>
                <code className="text-[11px] font-mono text-emerald-300 block bg-black/60 p-2 rounded">
                  net localgroup Administrators adminlab /add<br />
                  net localgroup Administrators
                </code>
              </div>

              {/* Lab 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-amber-300 font-mono">Lab 3 – Create Folders and Manage Files</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono">CLIENT + SERVER</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Create C:\Company with HR, IT, Finance subfolders and copy files.</p>
                <code className="text-[11px] font-mono text-amber-300 block bg-black/60 p-2 rounded">
                  New-Item -Path "C:\Company\HR" -ItemType Directory<br />
                  Set-Content "C:\Company\HR\employee.txt" "HR Data"<br />
                  Get-ChildItem C:\Company -Recurse
                </code>
              </div>

              {/* Lab 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-purple-300 font-mono">Lab 4 – Configure NTFS Permissions</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-mono">INTERMEDIATE</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Create C:\Confidential, grant employee1 Read access, test, then upgrade to Modify.</p>
                <code className="text-[11px] font-mono text-purple-300 block bg-black/60 p-2 rounded">
                  icacls C:\Confidential /grant employee1:(RX)<br />
                  icacls C:\Confidential /grant employee1:(M)
                </code>
              </div>

              {/* Lab 5 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-teal-300 font-mono">Lab 5 – Shared Folder Configuration</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-400 font-mono">SERVER + CLIENT</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Share C:\Shares\Department as Department and map to Z: on client.</p>
                <code className="text-[11px] font-mono text-teal-300 block bg-black/60 p-2 rounded">
                  net use Z: \\SERVER2022\Department<br />
                  net use Z: /delete
                </code>
              </div>

              {/* Lab 6 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-indigo-300 font-mono">Lab 6 – Active Directory User Administration</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono">DOMAIN LAB</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Install AD DS, create Students OU, CyberStudents group, and join Windows Client.</p>
                <code className="text-[11px] font-mono text-indigo-300 block bg-black/60 p-2 rounded">
                  New-ADUser -Name "student1" -Path "OU=Students,DC=corp,DC=example"<br />
                  Add-Computer -DomainName "corp.example" -Restart
                </code>
              </div>

              {/* Lab 7 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-rose-300 font-mono">Lab 7 – Security Log Investigation</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-mono">AUDITING</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Generate successful and failed logins, filter Event Viewer for IDs 4624 and 4625.</p>
                <code className="text-[11px] font-mono text-rose-300 block bg-black/60 p-2 rounded">
                  auditpol /set /subcategory:"Logon" /success:enable /failure:enable<br />
                  {"Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624,4625}"}
                </code>
              </div>

              {/* Lab 8 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-xs text-cyan-300 font-mono">Lab 8 – File Access Auditing</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono">OBJECT ACCESS</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Enable File System auditing, configure folder Auditing tab, and inspect Event ID 4663.</p>
                <code className="text-[11px] font-mono text-cyan-300 block bg-black/60 p-2 rounded">
                  auditpol /set /subcategory:"File System" /success:enable /failure:enable
                </code>
              </div>
            </div>
          </div>

          {/* Section 23: Complete Final Practical Challenge */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              SECTION 23: COMPLETE FINAL PRACTICAL CHALLENGE (100 MARKS)
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3">
              <p>
                <strong>Scenario:</strong> You are appointed as the Windows System Administrator for a corporate network with three departments: <strong>HR</strong>, <strong>IT</strong>, and <strong>Finance</strong>.
              </p>

              <div className="overflow-x-auto rounded-lg border border-slate-800 mt-2">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2">Department</th>
                      <th className="p-2">Assigned User</th>
                      <th className="p-2">Required Permission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-2 font-bold text-white">HR</td>
                      <td className="p-2 text-cyan-300">hruser</td>
                      <td className="p-2">Modify C:\Company\HR folder only</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-white">IT</td>
                      <td className="p-2 text-cyan-300">ituser</td>
                      <td className="p-2">Modify C:\Company\IT folder only</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-white">Finance</td>
                      <td className="p-2 text-cyan-300">financeuser</td>
                      <td className="p-2">Modify C:\Company\Finance folder only</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-white">Administrator</td>
                      <td className="p-2 text-purple-300">adminlab</td>
                      <td className="p-2 font-bold text-emerald-400">Full Control over all folders</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Evaluation Rubric */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Assessment Criteria</th>
                    <th className="p-2.5 text-right">Max Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  <tr><td className="p-2">User Account Creation (4 users)</td><td className="p-2 text-right font-bold text-cyan-400">10</td></tr>
                  <tr><td className="p-2">Group Management (Department groups)</td><td className="p-2 text-right font-bold text-cyan-400">10</td></tr>
                  <tr><td className="p-2">Folder Creation Structure</td><td className="p-2 text-right font-bold text-cyan-400">10</td></tr>
                  <tr><td className="p-2">NTFS Permission Configuration</td><td className="p-2 text-right font-bold text-cyan-400">20</td></tr>
                  <tr><td className="p-2">Network Sharing Configuration</td><td className="p-2 text-right font-bold text-cyan-400">15</td></tr>
                  <tr><td className="p-2">Security Auditing (Event log verification)</td><td className="p-2 text-right font-bold text-cyan-400">15</td></tr>
                  <tr><td className="p-2">Troubleshooting & Live Demonstration</td><td className="p-2 text-right font-bold text-cyan-400">20</td></tr>
                  <tr className="bg-slate-950 font-bold text-white"><td className="p-2.5">TOTAL SCORE</td><td className="p-2.5 text-right text-emerald-400">100</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 10: STUDENT ASSESSMENT MCQ (12 QUESTIONS) */}
      {/* ============================================================ */}
      {activeTab === 'assessment' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-purple-400" />
                  Section 24: Student Assessment – Multiple Choice Questions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluate student mastery of accounts, permissions, Active Directory, and event logging.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                  {answeredCount} / {mcqQuestions.length} ANSWERED
                </span>
                {showResults && (
                  <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    SCORE: {score} / {mcqQuestions.length} ({Math.round((score / mcqQuestions.length) * 100)}%)
                  </span>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="my-6 space-y-6">
              {mcqQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const selectedOption = userAnswers[q.id];
                const isCorrect = selectedOption === q.correct;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition ${
                      showResults
                        ? isCorrect
                          ? 'border-emerald-500/80 bg-emerald-950/20'
                          : 'border-rose-500/80 bg-rose-950/20'
                        : isAnswered
                        ? 'border-purple-500/60 bg-slate-950'
                        : 'border-slate-800 bg-slate-950/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h4 className="text-xs font-bold text-white font-mono">
                        Q{idx + 1}. {q.q}
                      </h4>
                      {showResults && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {isCorrect ? 'CORRECT' : 'INCORRECT'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        let btnStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';

                        if (showResults) {
                          if (optIdx === q.correct) {
                            btnStyle = 'border-emerald-500 bg-emerald-950 text-emerald-300 font-bold';
                          } else if (isSelected) {
                            btnStyle = 'border-rose-500 bg-rose-950 text-rose-300';
                          }
                        } else if (isSelected) {
                          btnStyle = 'border-purple-500 bg-purple-950 text-purple-200 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-2.5 rounded-lg border text-left transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isSelected && <span className="text-[10px] font-bold">&bull;</span>}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <p className="mt-3 text-[11px] text-slate-300 font-sans border-t border-slate-800/80 pt-2 leading-relaxed">
                        <strong className="text-cyan-400 font-mono">Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setUserAnswers({});
                  setShowResults(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition cursor-pointer"
              >
                Reset Assessment
              </button>

              <button
                onClick={() => setShowResults(true)}
                disabled={answeredCount === 0}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition cursor-pointer disabled:opacity-40 shadow-lg shadow-purple-900/40"
              >
                Submit & Grade Assessment &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 11: TRAINER TOOLKIT, PREPARATION & QUICK REFERENCE */}
      {/* ============================================================ */}
      {activeTab === 'trainer' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section 28: Trainer Preparation Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                  Section 28: Trainer Preparation Checklist (Before Starting Class)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify your virtual machines, credentials, networking, and demonstrations before welcoming students.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
                {completedChecklistCount} / 11 COMPLETED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-5 text-xs font-mono">
              {[
                'Prepare Windows 11 Pro VM (Client Workstation)',
                'Prepare Windows Server 2022 VM (Domain Controller & File Server)',
                'Configure isolated lab network (Host-only or internal switch)',
                'Create clean VM snapshots prior to demonstrations',
                'Prepare test users (student1, student2) and passwords',
                'Verify elevated CMD and PowerShell terminal access',
                'Verify NTFS permissions demonstration folders (C:\\Company)',
                'Prepare shared folder SMB demonstration (C:\\Shares\\Training)',
                'Prepare AD DS installation & promote DC demonstration',
                'Verify Event Viewer security logging & auditpol activation',
                'Prepare MCQ and practical final challenge assessment rubrics'
              ].map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 transition cursor-pointer select-none ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className="text-xs">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 25: Short-Answer Review Questions with Revealable Answers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              SECTION 25: SHORT-ANSWER QUESTIONS FOR STUDENTS (WITH MODEL ANSWERS)
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 1,
                  q: 'Explain the difference between local and domain accounts.',
                  a: 'A local account resides in the computer\'s local SAM database and can only authenticate to that specific machine. A domain account is centrally managed by Active Directory on a Domain Controller and can authenticate to any authorized domain-joined workstation or server across the enterprise.'
                },
                {
                  id: 2,
                  q: 'What is the purpose of a Security Identifier (SID)?',
                  a: 'A SID is a unique, immutable string (e.g. S-1-5-21-...) assigned by Windows to uniquely identify each security principal (user, group, computer). Windows associates permissions with SIDs rather than account names, so renaming a user does not alter their access rights.'
                },
                {
                  id: 3,
                  q: 'Explain NTFS permissions.',
                  a: 'NTFS permissions control which users and groups have access to files and folders on an NTFS volume, providing granular rights such as Full Control, Modify, Read & Execute, Read, and Write, operating regardless of whether access is local or over the network.'
                },
                {
                  id: 4,
                  q: 'What is permission inheritance?',
                  a: 'Permission inheritance allows child files and subfolders to automatically inherit permissions configured on their parent container, ensuring uniform security administration across deep folder trees.'
                },
                {
                  id: 5,
                  q: 'Differentiate between share and NTFS permissions.',
                  a: 'Share permissions only apply when accessing a folder across the network via SMB, whereas NTFS permissions apply to both local and network access. When accessing a share over the network, Windows evaluates both sets of permissions and enforces the MOST RESTRICTIVE combination.'
                },
                {
                  id: 6,
                  q: 'What is the purpose of Active Directory?',
                  a: 'Active Directory Domain Services (AD DS) provides a centralized, scalable directory service for managing user identities, computers, group policies, and security authorization across an entire enterprise network.'
                },
                {
                  id: 7,
                  q: 'Explain the role of a Domain Controller.',
                  a: 'A Domain Controller is a Windows Server running AD DS that stores a replica of the directory database, handles Kerberos and NTLM authentications, replicates directory changes to peer DCs, and enforces Group Policy Objects.'
                },
                {
                  id: 8,
                  q: 'What is the purpose of Event Viewer?',
                  a: 'Event Viewer is a centralized logging utility used by administrators and SOC analysts to monitor system health, audit security events (logons, account changes, file access), and troubleshoot operational issues.'
                },
                {
                  id: 9,
                  q: 'Explain the principle of least privilege.',
                  a: 'The principle of least privilege mandates granting users and processes only the bare minimum permissions necessary to accomplish their assigned business tasks, drastically reducing the blast radius of compromised credentials.'
                },
                {
                  id: 10,
                  q: 'Why is security auditing important?',
                  a: 'Security auditing creates an immutable forensic audit trail of activities (such as brute force login attempts, privilege escalation, or unauthorized confidential file access), enabling incident response and regulatory compliance.'
                }
              ].map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleAnswerReveal(item.id)}>
                    <span className="font-bold text-xs text-white font-mono">
                      Q{item.id}. {item.q}
                    </span>
                    <button className="text-[11px] font-mono text-cyan-400 hover:underline">
                      {revealedAnswers[item.id] ? 'Hide Answer' : 'Reveal Model Answer'}
                    </button>
                  </div>
                  {revealedAnswers[item.id] && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded">
                      <strong className="text-emerald-400 font-mono">Trainer Solution:</strong> {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 26: Troubleshooting Situations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              SECTION 26: COMMON CLASSROOM TROUBLESHOOTING MATRIX
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Problem Encountered</th>
                    <th className="p-3">Possible Cause</th>
                    <th className="p-3">Trainer Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  <tr>
                    <td className="p-3 font-bold text-rose-300">Access Denied on Folder</td>
                    <td className="p-3">Missing NTFS rights or Deny entry</td>
                    <td className="p-3 text-slate-400">Check Effective Access tab; remove conflicting Deny entries.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-rose-300">Cannot create local user</td>
                    <td className="p-3">Terminal running in standard user context</td>
                    <td className="p-3 text-slate-400">Right-click CMD/PowerShell and select "Run as Administrator".</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-rose-300">Cannot join domain (`Add-Computer` fails)</td>
                    <td className="p-3">Client DNS pointing to public router instead of DC</td>
                    <td className="p-3 text-slate-400">Run `Set-DnsClientServerAddress` to point client DNS to DC IP address.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-rose-300">Cannot access shared folder over network</td>
                    <td className="p-3">Firewall blocking SMB or restrictive share ACL</td>
                    <td className="p-3 text-slate-400">Enable File & Printer Sharing in Windows Defender Firewall; verify share permissions.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-rose-300">No file audit events in Event Viewer</td>
                    <td className="p-3">File System subcategory auditing not enabled</td>
                    <td className="p-3 text-slate-400">Run `auditpol /set /subcategory:"File System" /success:enable` and set folder Auditing tab.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 27: Quick Commands Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Command className="w-4 h-4 text-emerald-400" />
              SECTION 27: TRAINER QUICK COMMAND REFERENCE TABLE
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">List local users:</span>
                <code className="text-cyan-400">net user</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Create user:</span>
                <code className="text-cyan-400">net user user1 * /add</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Disable user:</span>
                <code className="text-cyan-400">net user user1 /active:no</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">List PowerShell users:</span>
                <code className="text-blue-400">Get-LocalUser</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Display ACLs:</span>
                <code className="text-emerald-400">icacls C:\Company</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Create SMB Share:</span>
                <code className="text-teal-400">New-SmbShare</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Display AD Users:</span>
                <code className="text-indigo-400">Get-ADUser -Filter *</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Open Event Viewer:</span>
                <code className="text-rose-400">eventvwr.msc</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Computer Management:</span>
                <code className="text-purple-400">compmgmt.msc</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Active Directory Users:</span>
                <code className="text-indigo-400">dsa.msc</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Enable Logon Audit:</span>
                <code className="text-rose-400">auditpol /set ...</code>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Map Network Drive:</span>
                <code className="text-teal-400">net use Z: \\server\share</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
