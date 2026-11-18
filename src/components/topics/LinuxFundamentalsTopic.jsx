import React, { useState } from 'react';
import {
  FolderTree,
  Lock,
  Sliders,
  Terminal,
  FileCode,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Eye,
  Layers,
  Sparkles,
  Command,
  ArrowRight,
  Zap,
  HelpCircle,
  Cpu,
  HardDrive,
  Globe,
  Activity,
  Server
} from 'lucide-react';


// ============================================================
// LINUX ARCHITECTURE: 4 CORE LAYERS (APPLICATION, SHELL, KERNEL, HARDWARE)
// ============================================================
const LINUX_ARCH_LAYERS = [
  {
    id: 'application',
    name: '1. Applications (User Space)',
    shortName: 'Application',
    level: 'Layer 1 (Top Level)',
    privilege: 'User Mode (Ring 3)',
    ring: 3,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    icon: Globe,
    summary: 'User-facing software, system utilities, servers, and scripts that humans and services interact with.',
    description: 'Applications run in unprivileged User Space (Ring 3). They have zero direct access to physical memory or hardware. When an application needs to read a file, send network packets, or allocate memory, it MUST make a System Call (syscall) to the Linux Kernel.',
    subsystems: [
      { name: 'Core Utilities', details: 'ls, cat, grep, cp, chmod, curl, nmap, tar, find' },
      { name: 'Network & Web Servers', details: 'Apache (httpd), Nginx, OpenSSH (sshd), MySQL, Bind9' },
      { name: 'Desktop & GUIs', details: 'GNOME, KDE Plasma, X11, Wayland, Firefox, LibreOffice' },
      { name: 'Development Runtimes', details: 'Python, GCC/G++, Node.js, OpenJDK, Rust, Go, Perl' }
    ],
    commands: [
      { cmd: 'ps aux', desc: 'List all running application processes and their resource consumption' },
      { cmd: 'which <app>', desc: 'Locate the exact binary executable path in $PATH' },
      { cmd: 'strace -c <app>', desc: 'Count and profile all system calls made by an application' },
      { cmd: 'ldd <binary>', desc: 'Print shared library dependencies (e.g. libc.so.6) required by binary' }
    ],
    security: {
      concept: 'Process Isolation & Least Privilege',
      attacks: 'SUID binary abuse (GTFOBins), buffer overflow exploits, web shell uploads, dependency confusion.',
      mitigation: 'Run services under unprivileged dedicated service accounts (www-data, nobody), enforce AppArmor / SELinux mandatory access controls, and strip SUID bits.'
    }
  },
  {
    id: 'shell',
    name: '2. Shell (Command Interpreter)',
    shortName: 'Shell',
    level: 'Layer 2 (User-to-Kernel Interface)',
    privilege: 'User Space Interface (Ring 3)',
    ring: 3,
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    icon: Terminal,
    summary: 'The command-line interpreter that translates user instructions into kernel system calls.',
    description: 'The shell is an interface and scripting environment. It parses commands typed by the user, handles environment variables ($PATH, $HOME), performs wildcard expansion, manages standard streams (stdin, stdout, stderr), and triggers the kernel to launch processes via fork() and execve().',
    subsystems: [
      { name: 'Bash (Bourne Again Shell)', details: 'The default standard GNU shell across most Linux distributions (/bin/bash)' },
      { name: 'Zsh (Z Shell)', details: 'Modern, highly customizable interactive shell with smart tab completion; default on Kali Linux & macOS' },
      { name: 'Sh (Bourne Shell)', details: 'Minimal POSIX-compliant standard shell (/bin/sh), typically symlinked to dash on Debian/Ubuntu' },
      { name: 'Specialized Shells', details: 'Fish (Friendly Interactive Shell), Ksh (Korn), Csh / Tcsh (C syntax shell)' }
    ],
    commands: [
      { cmd: 'echo $SHELL', desc: 'Display the path of the current active logon shell' },
      { cmd: 'cat /etc/shells', desc: 'Display all valid installed login shells on the system' },
      { cmd: 'type -a <command>', desc: 'Determine whether a command is a shell builtin, alias, or external binary' },
      { cmd: 'env (or printenv)', desc: 'Print all exported shell environment variables ($PATH, $USER)' }
    ],
    security: {
      concept: 'Command Execution & Path Hijacking',
      attacks: 'Reverse shell payloads, command injection (; && |), $PATH variable poisoning, Shellshock (CVE-2014-6271), restricted shell escapes (rbash).',
      mitigation: 'Sanitize user inputs in web apps to block shell metacharacters, avoid relative paths in cron jobs, and enforce hardcoded absolute $PATH variables.'
    }
  },
  {
    id: 'kernel',
    name: '3. Kernel (Core of the Operating System)',
    shortName: 'Kernel (Kernal)',
    level: 'Layer 3 (Heart of Linux)',
    privilege: 'Kernel Mode (Ring 0 / Supervisor)',
    ring: 0,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    icon: Cpu,
    summary: 'The master monolithic core managing CPU scheduling, memory allocation, device drivers, and system calls.',
    description: 'The Linux Kernel runs with unrestricted CPU privileges in Ring 0. It controls every hardware resource, enforces memory boundaries between processes, manages virtual memory (paging), executes system calls, schedules CPU time across threads, and interfaces with hardware via drivers.',
    subsystems: [
      { name: 'Process Scheduler (CFS)', details: 'Completely Fair Scheduler manages CPU execution slices across all running processes and threads' },
      { name: 'Memory Management (MMU)', details: 'Virtual memory mapping, demand paging, swapping, slab allocation, and process address isolation' },
      { name: 'Virtual File System (VFS)', details: 'Unified filesystem abstraction handling ext4, XFS, Btrfs, NFS, as well as pseudo-filesystems (/proc, /sys)' },
      { name: 'Device Drivers & LKMs', details: 'Loadable Kernel Modules (.ko) communicating directly with peripheral hardware controllers' },
      { name: 'Network Stack (Netfilter)', details: 'Kernel TCP/IP processing, packet filtering, routing tables, and firewall engines (iptables/nftables)' }
    ],
    commands: [
      { cmd: 'uname -a (or uname -r)', desc: 'Display complete Linux kernel release, architecture, and build date' },
      { cmd: 'dmesg | head -n 30', desc: 'Inspect kernel ring buffer boot messages and hardware driver detection' },
      { cmd: 'lsmod', desc: 'List all currently loaded Loadable Kernel Modules (.ko drivers)' },
      { cmd: 'sysctl -a', desc: 'Inspect and tune live runtime kernel parameters (e.g. net.ipv4.ip_forward)' }
    ],
    security: {
      concept: 'Ring 0 Compromise & Privilege Escalation',
      attacks: 'Kernel exploit attacks: Dirty COW (CVE-2016-5195), Dirty Pipe (CVE-2022-0847), eBPF bypasses, Loadable Kernel Module (LKM) rootkits that hide processes and files.',
      mitigation: 'Apply live kernel patching (kpatch), enable Kernel Address Space Layout Randomization (KASLR), disable unprivileged eBPF, and secure boot module signing.'
    }
  },
  {
    id: 'hardware',
    name: '4. Hardware (Physical Machinery)',
    shortName: 'Hardware',
    level: 'Layer 4 (Physical Layer)',
    privilege: 'Physical Electronics & Silicon',
    ring: -1,
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    icon: HardDrive,
    summary: 'The physical silicon and computing components: CPU, RAM, NVMe/SATA disks, NICs, and buses.',
    description: 'Hardware encompasses the physical computing devices. The CPU contains hardware rings (Ring 0 to Ring 3) enforcing privilege levels. The Memory Management Unit (MMU) translates virtual addresses to physical RAM chips. Network interfaces convert digital packets into physical Ethernet voltages or radio waves.',
    subsystems: [
      { name: 'Processor (CPU)', details: 'x86_64, ARM64, RISC-V executing machine instructions; registers, L1/L2/L3 caches, Ring privilege switches' },
      { name: 'Main Memory (RAM)', details: 'Volatile physical memory holding the kernel image, page tables, buffers, and active process code' },
      { name: 'Secondary Storage', details: 'NVMe SSDs, SATA hard drives, eMMC flash holding filesystems and partition tables (GPT/MBR)' },
      { name: 'Network Interface (NIC)', details: 'Physical Ethernet ports and Wi-Fi chipsets transmitting and receiving L1 bits and L2 frames' },
      { name: 'Motherboard & Bus', details: 'PCI-Express buses, USB controllers, DMA channels, BIOS/UEFI firmware initializing hardware' }
    ],
    commands: [
      { cmd: 'lscpu', desc: 'Display detailed CPU architecture, core counts, cache sizes, and hardware flags' },
      { cmd: 'free -h', desc: 'Display physical RAM total, used, free, shared, buffer/cache, and swap memory' },
      { cmd: 'lsblk', desc: 'List all block storage devices, partitions, mount points, and drive sizes' },
      { cmd: 'lspci -v (or lsusb)', desc: 'Enumerate all peripheral component interconnect (PCIe) and USB devices' }
    ],
    security: {
      concept: 'Physical Security & Silicon Vulnerabilities',
      attacks: 'Spectre & Meltdown (CPU speculative execution flaws), Rowhammer (DRAM bit flipping), BadUSB microcontroller injection, Direct Memory Access (DMA) attacks over Thunderbolt.',
      mitigation: 'Deploy Secure Boot with UEFI password, enable IOMMU to isolate DMA devices, enable Full Disk Encryption (LUKS), and lock down physical chassis and USB ports.'
    }
  }
];

const ARCH_COMMAND_TRACES = {
  cat: {
    command: 'cat /etc/passwd',
    purpose: 'Reading a text file from storage into terminal standard output',
    steps: [
      {
        layer: 'Application',
        role: 'Terminal Emulator (e.g. Alacritty / GNOME Terminal)',
        action: 'User inputs "cat /etc/passwd". Terminal process captures keyboard input and transmits text stream to shell stdin.'
      },
      {
        layer: 'Shell',
        role: 'Command Interpreter (Bash / Zsh)',
        action: 'Bash parses string into command "cat" and argument "/etc/passwd". Searches $PATH for /usr/bin/cat. Executes fork() to spawn child process and execve() to pass execution to the Kernel.'
      },
      {
        layer: 'Kernel',
        role: 'Kernel Core & Virtual File System (VFS)',
        action: 'Kernel switches CPU from Ring 3 to Ring 0. Checks Discretionary Access Control (DAC) permissions on /etc/passwd. Resolves ext4 filesystem inode, checks page cache, and calls disk device driver via read() syscall.'
      },
      {
        layer: 'Hardware',
        role: 'Storage Controller (NVMe / SATA) & RAM',
        action: 'NVMe controller reads raw disk blocks from storage flash cells into physical RAM using Direct Memory Access (DMA). Triggers CPU interrupt (IRQ) signaling data is loaded.'
      }
    ],
    returnFlow: 'Kernel copies file buffer from kernel memory to user-space memory buffer. cat writes data to stdout (File Descriptor 1). Terminal renders user accounts onto physical display.'
  },
  ping: {
    command: 'ping -c 1 8.8.8.8',
    purpose: 'Transmitting an ICMP Echo Request packet over network socket',
    steps: [
      {
        layer: 'Application',
        role: 'ping Utility (/bin/ping)',
        action: 'User launches ping. Application constructs an ICMP Echo Request payload (Type 8, Code 0) with a 64-byte timestamp.'
      },
      {
        layer: 'Shell',
        role: 'Bash Process Manager',
        action: 'Shell verifies binary exists, assigns file descriptors, sets process group, and invokes kernel via socket(AF_INET, SOCK_RAW, IPPROTO_ICMP).'
      },
      {
        layer: 'Kernel',
        role: 'Network Stack (Netfilter / IP Layer)',
        action: 'Kernel builds IP packet with source/dest IP, calculates IP header checksum, determines routing interface via FIB routing table, resolves gateway MAC via ARP table, and prepares Ethernet frame.'
      },
      {
        layer: 'Hardware',
        role: 'Network Interface Card (NIC - Ethernet/Wi-Fi)',
        action: 'NIC transceiver converts digital frame bits into physical voltages (CAT6) or RF radio waves (Wi-Fi) and transmits packet across physical wire.'
      }
    ],
    returnFlow: 'Google DNS server responds with ICMP Echo Reply (Type 0). Physical NIC receives voltage, triggers interrupt (IRQ). Kernel validates checksum, notifies ping process, and outputs round-trip time (RTT) to screen.'
  },
  mkdir: {
    command: 'mkdir /tmp/cyber_lab',
    purpose: 'Creating a new filesystem directory inode in temporary storage',
    steps: [
      {
        layer: 'Application',
        role: 'mkdir Binary (/usr/bin/mkdir)',
        action: 'Utility processes flags (e.g. -p or default 0777 modified by umask) and target path string "/tmp/cyber_lab".'
      },
      {
        layer: 'Shell',
        role: 'Shell Environment',
        action: 'Expands any environment variables, executes fork(), and invokes kernel system call mkdirat(AT_FDCWD, "/tmp/cyber_lab", 0777).'
      },
      {
        layer: 'Kernel',
        role: 'Virtual File System (VFS) & Filesystem Driver',
        action: 'Kernel enters Ring 0, verifies parent directory /tmp write permissions, allocates a free inode on the storage block group, writes directory entry (".", ".."), and updates directory block pointers.'
      },
      {
        layer: 'Hardware',
        role: 'SSD Controller & Flash Memory',
        action: 'Controller writes updated inode table entry and directory block to flash memory cells via NVMe write commands.'
      }
    ],
    returnFlow: 'Kernel updates disk journal for metadata consistency, returns integer status 0 (Success) to mkdir process, and shell prompt re-appears ready for next command.'
  }
};

export default function LinuxFundamentalsTopic() {
  const [activeTab, setActiveTab] = useState('architecture'); // 'architecture' | 'filesystem' | 'permissions' | 'flags' | 'operators'

  // Linux Architecture Layer Explorer State
  const [selectedArchLayer, setSelectedArchLayer] = useState('kernel'); // 'application' | 'shell' | 'kernel' | 'hardware'
  const [activeSyscallDemo, setActiveSyscallDemo] = useState('cat'); // 'cat' | 'ping' | 'mkdir'

  // Filesystem Explorer State
  const [selectedDir, setSelectedDir] = useState('/etc');

  // Chmod Calculator State
  // Owner, Group, Others permissions: [Read (4), Write (2), Execute (1)]
  const [perms, setPerms] = useState({
    uR: true, uW: true, uX: true, // User/Owner = 7
    gR: true, gW: false, gX: true, // Group = 5
    oR: true, oW: false, oX: true, // Others = 5 -> default 755
    suid: false,
    sgid: false,
    sticky: false
  });

  // Toggle specific permission
  const togglePerm = (key) => {
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate Octal code
  const uVal = (perms.uR ? 4 : 0) + (perms.uW ? 2 : 0) + (perms.uX ? 1 : 0);
  const gVal = (perms.gR ? 4 : 0) + (perms.gW ? 2 : 0) + (perms.gX ? 1 : 0);
  const oVal = (perms.oR ? 4 : 0) + (perms.oW ? 2 : 0) + (perms.oX ? 1 : 0);
  const specialVal = (perms.suid ? 4 : 0) + (perms.sgid ? 2 : 0) + (perms.sticky ? 1 : 0);

  const octalStr = specialVal > 0 ? `${specialVal}${uVal}${gVal}${oVal}` : `${uVal}${gVal}${oVal}`;

  // Calculate symbolic string (e.g. -rwxr-xr-x)
  const getSymbolicStr = () => {
    let s = '-';
    // User
    s += perms.uR ? 'r' : '-';
    s += perms.uW ? 'w' : '-';
    if (perms.suid) {
      s += perms.uX ? 's' : 'S';
    } else {
      s += perms.uX ? 'x' : '-';
    }
    // Group
    s += perms.gR ? 'r' : '-';
    s += perms.gW ? 'w' : '-';
    if (perms.sgid) {
      s += perms.gX ? 's' : 'S';
    } else {
      s += perms.gX ? 'x' : '-';
    }
    // Others
    s += perms.oR ? 'r' : '-';
    s += perms.oW ? 'w' : '-';
    if (perms.sticky) {
      s += perms.oX ? 't' : 'T';
    } else {
      s += perms.oX ? 'x' : '-';
    }
    return s;
  };

  // Directory metadata dictionary
  const dirDetails = {
    '/': {
      name: '/ (Root Directory)',
      desc: 'The single top-level root of the entire Linux filesystem hierarchy. Every single file, mounted disk, network share, and device begins here.',
      defaultPerms: 'drwxr-xr-x (755) owned by root:root',
      subdirs: ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'media', 'mnt', 'opt', 'proc', 'root', 'sbin', 'sys', 'tmp', 'usr', 'var'],
      securityNote: 'Only root has write privileges to /. Standard users cannot create files or directories here.'
    },
    '/etc': {
      name: '/etc (System Configuration Files)',
      desc: 'Contains host-specific system-wide configuration files, startup scripts, and security credentials. "Etcetera" or "Editable Text Configurations".',
      defaultPerms: 'drwxr-xr-x (755) owned by root:root',
      subdirs: ['passwd', 'shadow', 'sudoers', 'hosts', 'resolv.conf', 'ssh/', 'crontab', 'network/'],
      securityNote: 'CRITICAL SECURITY TARGET: /etc/passwd holds all user account names. /etc/shadow holds cryptographic password hashes (only readable by root). Misconfigured permissions on /etc/sudoers allow immediate root takeover!'
    },
    '/var': {
      name: '/var (Variable Data & Logs)',
      desc: 'Contains data that changes dynamically during system operation: system logs, spool directories, temporary mail queues, and web server document roots.',
      defaultPerms: 'drwxr-xr-x (755) owned by root:root',
      subdirs: ['log/ (auth.log, syslog)', 'www/html (Web server)', 'mail/', 'spool/cron/', 'backups/'],
      securityNote: '/var/log/auth.log records all SSH login attempts, sudo executions, and failed brute force attacks. Essential for incident response.'
    },
    '/home': {
      name: '/home (Standard User Personal Folders)',
      desc: 'Houses standard user personal directories (e.g. /home/alice, /home/bob), their documents, desktop items, and user-specific dotfiles (~/.bashrc, ~/.ssh/id_rsa).',
      defaultPerms: 'drwxr-xr-x (755), subfolders 700 or 750',
      subdirs: ['alice/', 'bob/', 'charlie/'],
      securityNote: 'Look for weak permissions on /home/user/.ssh/id_rsa (SSH private keys) or bash history files containing plaintext passwords!'
    },
    '/root': {
      name: '/root (Superuser Home Directory)',
      desc: 'The personal home directory for the root superuser. Unlike standard users located in /home, root has its own dedicated directory at /root so it remains accessible even if /home is on a separate unmounted partition.',
      defaultPerms: 'drwx------ (700) owned exclusively by root:root',
      subdirs: ['.bash_history', '.ssh/authorized_keys', 'scripts/'],
      securityNote: 'Accessible only by root. Standard users receive "Permission denied".'
    },
    '/tmp': {
      name: '/tmp (Temporary Shared Directory)',
      desc: 'A global scratchpad directory for applications and users to write temporary files. Emptied automatically on system reboot.',
      defaultPerms: 'drwxrwxrwt (1777) with Sticky Bit enabled!',
      subdirs: ['systemd-private-...', 'ssh-agent-sockets', 'custom-scripts'],
      securityNote: 'WORLD-WRITABLE! Anyone can write here. The Sticky Bit (t) ensures only the file owner or root can delete files, preventing users from erasing each other\'s files. Pentesters frequently download exploit payloads to /tmp.'
    },
    '/dev': {
      name: '/dev (Device Hardware Files)',
      desc: 'Linux philosophy: "Everything is a file". Hardware devices (hard drives, terminals, random number generators) are exposed as special block or character files here.',
      defaultPerms: 'drwxr-xr-x (755) managed by udev',
      subdirs: ['sda (Hard disk)', 'tty (Terminals)', 'null (Bit bucket)', 'urandom (Crypto entropy)'],
      securityNote: '/dev/null discards all input sent to it. /dev/urandom provides cryptographic pseudo-random bytes. Raw disk access to /dev/sda grants direct access to unencrypted partitions.'
    },
    '/proc': {
      name: '/proc (Virtual Kernel Process Filesystem)',
      desc: 'A pseudo-filesystem residing entirely in RAM (not on disk). Exposes live kernel internal states, hardware specs, and every running process represented by its PID folder.',
      defaultPerms: 'dr-xr-xr-x (555) Virtual RAM filesystem',
      subdirs: ['cpuinfo', 'version', 'net/tcp', '[PID]/cmdline', '[PID]/environ', '[PID]/fd/'],
      securityNote: 'Inspect /proc/version for kernel exploit targeting (Dirty COW). Reading /proc/[PID]/environ can leak API tokens and database passwords passed as environment variables!'
    },
    '/bin': {
      name: '/bin & /usr/bin (Essential User Binaries)',
      desc: 'Contains executable system binaries and command-line programs accessible to all users (ls, cat, bash, grep, cp, chmod, python).',
      defaultPerms: 'drwxr-xr-x (755) owned by root:root',
      subdirs: ['bash', 'cat', 'cp', 'ls', 'grep', 'mkdir', 'chmod', 'ping', 'tar'],
      securityNote: 'Binaries here with SUID permissions (chmod 4755) run as root! Pentesters scan /bin for exploitable SUID binaries using GTFOBins.'
    }
  };

  const activeDirData = dirDetails[selectedDir] || dirDetails['/etc'];

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* TOP VIEW SELECTOR BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Linux Architecture (Layers)</span>
            </button>

            <button
              onClick={() => setActiveTab('filesystem')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'filesystem'
                  ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Linux File System Tree</span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'permissions'
                  ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>File Permissions (Chmod Calculator)</span>
            </button>

            <button
              onClick={() => setActiveTab('flags')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'flags'
                  ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Flags & Command Switches</span>
            </button>

            <button
              onClick={() => setActiveTab('operators')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'operators'
                  ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Shell Operators & Redirection</span>
            </button>
          </div>

          <span className="hidden xl:inline text-[10px] font-mono text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
            UNIX/LINUX ARCHITECTURE
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 0: LINUX ARCHITECTURE (APPLICATION, SHELL, KERNEL, HARDWARE) */}
      {/* ============================================================ */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Linux System Architecture: The 4 Core Layers
                  </h2>
                  <p className="text-xs text-slate-400">
                    The Linux operating system is structured into four distinct hierarchical layers: <strong>Application &rarr; Shell &rarr; Kernel (Kernal) &rarr; Hardware</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/60 font-bold">
                  4-LAYER ARCHITECTURE
                </span>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/60">
                  Ring 3 vs Ring 0
                </span>
              </div>
            </div>

            {/* Conceptual Intro Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
              Unlike monolithic user-mode programs, Linux isolates execution into distinct security domains: 
              <strong> User Space (Ring 3)</strong> where Applications and Shells execute safely without direct hardware access, and 
              <strong> Kernel Space (Ring 0)</strong> where the monolithic Linux Kernel possesses supervisor-level access to physical hardware through privileged device drivers.
            </div>
          </div>

          {/* Interactive 4-Layer Stack Visualizer & Layer Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Interactive 4-Layer Hierarchy Stack */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Hierarchical Layer Stack
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    TOP-DOWN EXECUTION
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {LINUX_ARCH_LAYERS.map((layer) => {
                    const isSelected = selectedArchLayer === layer.id;
                    const IconComp = layer.icon;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setSelectedArchLayer(layer.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative select-none ${
                          isSelected
                            ? `${layer.borderColor} ${layer.bgColor} shadow-lg ring-1 ${layer.borderColor}`
                            : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isSelected ? layer.borderColor : 'border-slate-800 bg-slate-900'}`}>
                              <IconComp className={`w-4 h-4 ${isSelected ? layer.textColor : 'text-slate-400'}`} />
                            </div>
                            <div>
                              <strong className={`block text-xs ${isSelected ? 'text-white font-bold' : 'text-slate-300'}`}>
                                {layer.name}
                              </strong>
                              <span className="text-[10px] text-slate-400 block font-sans">
                                {layer.level} &bull; {layer.privilege}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? `rotate-90 ${layer.textColor}` : 'text-slate-600'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Privilege Ring Legend */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Ring 3 (User Space):
                  </span>
                  <span className="text-amber-300">Applications & Shell</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Ring 0 (Supervisor):
                  </span>
                  <span className="text-emerald-300">Kernel & Drivers</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Physical Layer:
                  </span>
                  <span className="text-rose-300">Silicon, CPU, RAM, NIC</span>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Layer Inspector */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              {(() => {
                const currentLayer = LINUX_ARCH_LAYERS.find((l) => l.id === selectedArchLayer) || LINUX_ARCH_LAYERS[0];
                const IconComp = currentLayer.icon;
                return (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${currentLayer.borderColor} ${currentLayer.bgColor}`}>
                          <IconComp className={`w-5 h-5 ${currentLayer.textColor}`} />
                        </div>
                        <div>
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${currentLayer.textColor}`}>
                            LAYER INSPECTOR
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white">{currentLayer.name}</h3>
                        </div>
                      </div>
                      <span className={`text-[11px] font-mono px-2.5 py-1 rounded border ${currentLayer.borderColor} ${currentLayer.bgColor} ${currentLayer.textColor} font-bold`}>
                        {currentLayer.privilege}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                        Core Role & Operational Architecture:
                      </span>
                      <p className="text-slate-300 font-sans leading-relaxed">
                        {currentLayer.description}
                      </p>
                    </div>

                    {/* Subsystems & Components */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                        Key Components & Subsystems:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        {currentLayer.subsystems.map((sub, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                            <strong className="text-cyan-400 block text-[11px] mb-0.5">&bull; {sub.name}</strong>
                            <p className="text-slate-400 text-[10px] font-sans">{sub.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Standard Administrative & Recon Commands */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                        Standard Diagnostic & Inspection Commands:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        {currentLayer.commands.map((cmdItem, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-black/60 border border-slate-800 flex flex-col justify-between">
                            <code className="text-amber-300 text-[11px] font-bold block mb-1">{cmdItem.cmd}</code>
                            <span className="text-slate-400 text-[10px] font-sans">{cmdItem.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cybersecurity & Pentest Relevance */}
                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-xs font-mono space-y-1">
                      <span className="text-red-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                        Cybersecurity Angle: {currentLayer.security.concept}
                      </span>
                      <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                        <strong className="text-red-300">Attack Vectors:</strong> {currentLayer.security.attacks}
                      </p>
                      <p className="text-slate-400 font-sans text-[10px] leading-relaxed pt-1 border-t border-red-900/30">
                        <strong className="text-emerald-400">Hardening & Defense:</strong> {currentLayer.security.mitigation}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ============================================================ */}
          {/* INTERACTIVE DATA FLOW: COMMAND TRACE ACROSS ALL 4 LAYERS */}
          {/* ============================================================ */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block mb-0.5">
                  SYSTEM CALL DATA FLOW SIMULATOR
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-cyan-400 fill-current" />
                  Tracing Execution Across Application &rarr; Shell &rarr; Kernel &rarr; Hardware
                </h3>
              </div>

              {/* Command Demo Selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                <span className="text-slate-400 text-[11px] hidden md:inline">Select Command:</span>
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {[
                    { id: 'cat', label: 'cat /etc/passwd' },
                    { id: 'ping', label: 'ping 8.8.8.8' },
                    { id: 'mkdir', label: 'mkdir /tmp/lab' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveSyscallDemo(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer font-bold ${
                        activeSyscallDemo === c.id
                          ? 'bg-cyan-600 text-black shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <code>{c.label}</code>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trace Pathway */}
            {(() => {
              const trace = ARCH_COMMAND_TRACES[activeSyscallDemo] || ARCH_COMMAND_TRACES.cat;
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Trigger Command:</span>
                      <code className="text-cyan-300 font-bold bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                        {trace.command}
                      </code>
                    </div>
                    <span className="text-slate-400 text-[11px] hidden sm:inline font-sans">
                      {trace.purpose}
                    </span>
                  </div>

                  {/* 4 Steps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                    {trace.steps.map((step, idx) => {
                      const colors = [
                        { border: 'border-amber-500/50', badge: 'bg-amber-950 text-amber-300', text: 'text-amber-400' },
                        { border: 'border-purple-500/50', badge: 'bg-purple-950 text-purple-300', text: 'text-purple-400' },
                        { border: 'border-emerald-500/50', badge: 'bg-emerald-950 text-emerald-300', text: 'text-emerald-400' },
                        { border: 'border-rose-500/50', badge: 'bg-rose-950 text-rose-300', text: 'text-rose-400' }
                      ][idx];
                      return (
                        <div key={idx} className={`p-3.5 rounded-xl bg-slate-950 border ${colors.border} space-y-2 flex flex-col justify-between`}>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${colors.badge}`}>
                                STAGE {idx + 1}: {step.layer.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {idx === 0 || idx === 1 ? 'Ring 3' : idx === 2 ? 'Ring 0' : 'Physical'}
                              </span>
                            </div>
                            <strong className={`block text-xs ${colors.text}`}>{step.role}</strong>
                            <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                              {step.action}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Return Flow Summary */}
                  <div className="p-3 rounded-xl bg-black border border-cyan-900/60 font-mono text-xs text-slate-300 flex items-start gap-2.5">
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300 block mb-0.5">Return Data Path (Hardware &rarr; Screen stdout):</strong>
                      <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                        {trace.returnFlow}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ============================================================ */}
          {/* USER SPACE (RING 3) VS KERNEL SPACE (RING 0) COMPARISON */}
          {/* ============================================================ */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 overflow-x-auto">
            <span className="text-xs uppercase text-amber-400 font-bold block mb-1">
              ARCHITECTURAL BOUNDARY: USER SPACE (RING 3) VS. KERNEL SPACE (RING 0)
            </span>
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 pr-3">Attribute</th>
                  <th className="py-2 px-3 text-amber-400">User Space (Ring 3)</th>
                  <th className="py-2 pl-3 text-emerald-400">Kernel Space (Ring 0)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                <tr>
                  <td className="py-2 pr-3 font-bold text-slate-400">Residing Layers:</td>
                  <td className="py-2 px-3 text-amber-300">Layer 1 (Applications) & Layer 2 (Shell)</td>
                  <td className="py-2 pl-3 text-emerald-300">Layer 3 (Kernel Core & Device Drivers)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-bold text-slate-400">CPU Execution Privilege:</td>
                  <td className="py-2 px-3">Unprivileged (Restricted instruction set)</td>
                  <td className="py-2 pl-3">Supervisor / Master (Full CPU instruction access)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-bold text-slate-400">Memory Access:</td>
                  <td className="py-2 px-3">Restricted virtual address space (cannot access kernel memory)</td>
                  <td className="py-2 pl-3">Unrestricted direct physical & virtual memory access</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-bold text-slate-400">Hardware Access:</td>
                  <td className="py-2 px-3">Prohibited; must make a System Call (syscall)</td>
                  <td className="py-2 pl-3">Direct control via hardware registers and IRQs</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-bold text-slate-400">Crash Impact:</td>
                  <td className="py-2 px-3">Process crashes with SIGSEGV; OS remains stable</td>
                  <td className="py-2 pl-3">System halts with Kernel Panic / Blue Screen equivalent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 1: LINUX FILE SYSTEM HIERARCHY TREE */}
      {/* ============================================================ */}
      {activeTab === 'filesystem' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Linux Filesystem Hierarchy Standard (FHS)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Unlike Windows drive letters (C:\, D:\), Linux organizes all devices, partitions, and storage under a single unified root directory (/).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/60">
                  FHS 3.0 Standard
                </span>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/60">
                  "Everything is a File"
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Tree & Directory Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Tree Nodes */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  Select Root Directory Node
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                  CLICK TO INSPECT
                </span>
              </div>

              <div className="mt-4 space-y-1.5 font-mono text-xs">
                {Object.keys(dirDetails).map((dirKey) => {
                  const isSelected = selectedDir === dirKey;
                  return (
                    <button
                      key={dirKey}
                      onClick={() => setSelectedDir(dirKey)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-950/50 text-white ring-1 ring-amber-400 shadow-md'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-300">{dirKey}</span>
                        <span className="text-[11px] text-slate-400 font-sans truncate">
                          {dirDetails[dirKey].name.split('(')[1]?.replace(')', '') || ''}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Directory Inspector */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
                      INSPECTOR: {selectedDir}
                    </span>
                    <h3 className="text-sm font-bold text-white">{activeDirData.name}</h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4 text-xs">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Role & Description:
                    </span>
                    <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {activeDirData.desc}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Typical Permissions:</span>
                      <strong className="text-cyan-300">{activeDirData.defaultPerms}</strong>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1">
                        Notable Subdirectories & Key Files:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1 font-mono text-[11px]">
                        {activeDirData.subdirs.map((sub, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Security Alert Callout */}
                  <div className="bg-rose-950/30 border border-rose-800/50 p-3 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-rose-300 font-mono">
                        CYBERSECURITY & PENTESTING RELEVANCE:
                      </span>
                      <p className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">
                        {activeDirData.securityNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>View directory tree in terminal:</span>
                <code className="text-amber-400 bg-black/60 px-2 py-0.5 rounded">
                  tree -L 1 /
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: FILE PERMISSIONS (INTERACTIVE CHMOD CALCULATOR) */}
      {/* ============================================================ */}
      {activeTab === 'permissions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Linux File Permissions & Chmod Calculator Studio
                  </h2>
                  <p className="text-xs text-slate-400">
                    Master the permission triad: User (Owner), Group, and Others with Read (4), Write (2), Execute (1) & Special Bits.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPerms({
                      uR: true, uW: true, uX: true,
                      gR: true, gW: false, gX: true,
                      oR: true, oW: false, oX: true,
                      suid: false, sgid: false, sticky: false
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition cursor-pointer"
                >
                  Standard 755
                </button>
                <button
                  onClick={() =>
                    setPerms({
                      uR: true, uW: true, uX: false,
                      gR: true, gW: false, gX: false,
                      oR: true, oW: false, oX: false,
                      suid: false, sgid: false, sticky: false
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition cursor-pointer"
                >
                  File 644
                </button>
                <button
                  onClick={() =>
                    setPerms({
                      uR: true, uW: true, uX: false,
                      gR: false, gW: false, gX: false,
                      oR: false, oW: false, oX: false,
                      suid: false, sgid: false, sticky: false
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition cursor-pointer"
                >
                  Key 600
                </button>
                <button
                  onClick={() =>
                    setPerms({
                      uR: true, uW: true, uX: true,
                      gR: true, gW: false, gX: true,
                      oR: true, oW: false, oX: true,
                      suid: true, sgid: false, sticky: false
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-700 text-xs text-rose-300 font-mono transition cursor-pointer"
                >
                  SUID 4755
                </button>
              </div>
            </div>

            {/* Live Interactive Permissions Matrix */}
            <div className="my-6 p-6 rounded-xl bg-slate-950 border border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. USER (OWNER) */}
                <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/50 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="font-bold text-xs text-purple-300 font-mono">1. USER / OWNER (u)</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-400">
                      Value: {uVal}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Read (r = 4)</span>
                      <input
                        type="checkbox"
                        checked={perms.uR}
                        onChange={() => togglePerm('uR')}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Write (w = 2)</span>
                      <input
                        type="checkbox"
                        checked={perms.uW}
                        onChange={() => togglePerm('uW')}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Execute (x = 1)</span>
                      <input
                        type="checkbox"
                        checked={perms.uX}
                        onChange={() => togglePerm('uX')}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* 2. GROUP */}
                <div className="p-4 rounded-xl bg-slate-900 border border-blue-500/50 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="font-bold text-xs text-blue-300 font-mono">2. GROUP (g)</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400">
                      Value: {gVal}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Read (r = 4)</span>
                      <input
                        type="checkbox"
                        checked={perms.gR}
                        onChange={() => togglePerm('gR')}
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Write (w = 2)</span>
                      <input
                        type="checkbox"
                        checked={perms.gW}
                        onChange={() => togglePerm('gW')}
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Execute (x = 1)</span>
                      <input
                        type="checkbox"
                        checked={perms.gX}
                        onChange={() => togglePerm('gX')}
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* 3. OTHERS */}
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="font-bold text-xs text-cyan-300 font-mono">3. OTHERS (o)</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400">
                      Value: {oVal}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Read (r = 4)</span>
                      <input
                        type="checkbox"
                        checked={perms.oR}
                        onChange={() => togglePerm('oR')}
                        className="w-4 h-4 accent-cyan-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Write (w = 2)</span>
                      <input
                        type="checkbox"
                        checked={perms.oW}
                        onChange={() => togglePerm('oW')}
                        className="w-4 h-4 accent-cyan-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-slate-800/60 cursor-pointer">
                      <span className="text-xs text-slate-300">Execute (x = 1)</span>
                      <input
                        type="checkbox"
                        checked={perms.oX}
                        onChange={() => togglePerm('oX')}
                        className="w-4 h-4 accent-cyan-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Special Bits (SUID, SGID, Sticky) Row */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-mono uppercase text-rose-400 font-bold block mb-2">
                  Special Permissions (Privilege Escalation Vectors):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-rose-600/60">
                    <div>
                      <span className="font-bold text-xs text-rose-300 font-mono block">SUID (Set User ID = 4)</span>
                      <span className="text-[10px] text-slate-400">Executes with file OWNER privileges (e.g. root)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={perms.suid}
                      onChange={() => togglePerm('suid')}
                      className="w-4 h-4 accent-rose-500 cursor-pointer"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-600/60">
                    <div>
                      <span className="font-bold text-xs text-amber-300 font-mono block">SGID (Set Group ID = 2)</span>
                      <span className="text-[10px] text-slate-400">Executes with file GROUP privileges</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={perms.sgid}
                      onChange={() => togglePerm('sgid')}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-600/60">
                    <div>
                      <span className="font-bold text-xs text-emerald-300 font-mono block">Sticky Bit (1)</span>
                      <span className="text-[10px] text-slate-400">Only file owner can delete (Used in /tmp)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={perms.sticky}
                      onChange={() => togglePerm('sticky')}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Dynamic Live Result Bar */}
              <div className="mt-6 p-4 rounded-xl bg-black/80 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono shadow-inner">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Symbolic String:</span>
                  <span className="text-xl font-black text-amber-400 tracking-widest">{getSymbolicStr()}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Octal Mode:</span>
                  <span className="text-xl font-black text-cyan-400">{octalStr}</span>
                </div>

                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Run Command:</span>
                  <code className="text-xs font-bold text-emerald-400">
                    chmod {octalStr} target_file
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: FLAGS & SWITCHES SYNTAX DISSECTOR */}
      {/* ============================================================ */}
      {activeTab === 'flags' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                Command Syntax: Command vs Options/Flags vs Arguments
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Linux commands follow a predictable structure. Options modify command behavior, while arguments specify targets.
              </p>
            </div>

            {/* Visual Dissection Diagram */}
            <div className="my-6 p-6 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-4 text-center">
                ANATOMY OF A LINUX COMMAND
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm">
                <div className="p-3 rounded-xl bg-purple-950 border border-purple-500 text-center">
                  <span className="font-bold text-purple-300 block">grep</span>
                  <span className="text-[10px] text-purple-400 block mt-1 font-sans">Command Binary</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-950 border border-amber-500 text-center">
                  <span className="font-bold text-amber-300 block">-inr</span>
                  <span className="text-[10px] text-amber-400 block mt-1 font-sans">Combined Flags (-i -n -r)</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-950 border border-blue-500 text-center">
                  <span className="font-bold text-blue-300 block">"password"</span>
                  <span className="text-[10px] text-blue-400 block mt-1 font-sans">Search Pattern (Arg 1)</span>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500 text-center">
                  <span className="font-bold text-cyan-300 block">/var/www/</span>
                  <span className="text-[10px] text-cyan-400 block mt-1 font-sans">Target Directory (Arg 2)</span>
                </div>
              </div>
            </div>

            {/* Explanation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 font-mono block mb-1">
                  1. Short Flags (Single Dash)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Single letters preceded by a hyphen. Multiple flags can be clustered together:
                </p>
                <code className="text-[11px] font-mono text-amber-300 block mt-2 bg-black/60 p-2 rounded">
                  ls -l -a -h  &lt;=&gt;  ls -lah
                </code>
                <ul className="text-slate-400 space-y-1 mt-2 text-[11px] list-disc list-inside">
                  <li><code>-l</code>: Long detailed listing (perms, owner, size).</li>
                  <li><code>-a</code>: Show all files including hidden dotfiles.</li>
                  <li><code>-h</code>: Human-readable file sizes (MB, GB).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 font-mono block mb-1">
                  2. Long Flags (Double Dash)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Descriptive full-word options preceded by two hyphens. More readable in automation scripts:
                </p>
                <code className="text-[11px] font-mono text-cyan-300 block mt-2 bg-black/60 p-2 rounded">
                  ls --all --human-readable
                </code>
                <ul className="text-slate-400 space-y-1 mt-2 text-[11px] list-disc list-inside">
                  <li><code>--help</code>: Display built-in usage instructions.</li>
                  <li><code>--version</code>: Print software release version.</li>
                  <li><code>--recursive</code>: Recurse into directories.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 font-mono block mb-1">
                  3. Built-In Help Systems
                </span>
                <p className="text-slate-300 leading-relaxed">
                  When you don't know the flags for a command, Linux provides three built-in documentation tools:
                </p>
                <div className="space-y-1.5 mt-2 font-mono text-[11px]">
                  <div className="p-1 rounded bg-black/40 text-slate-300">
                    <strong className="text-emerald-400">man command:</strong> Full manual page
                  </div>
                  <div className="p-1 rounded bg-black/40 text-slate-300">
                    <strong className="text-emerald-400">command --help:</strong> Quick syntax summary
                  </div>
                  <div className="p-1 rounded bg-black/40 text-slate-300">
                    <strong className="text-emerald-400">which command:</strong> Shows path to binary
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: SHELL OPERATORS & REDIRECTION */}
      {/* ============================================================ */}
      {activeTab === 'operators' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                Shell Redirection, Pipelines & Logical Control Operators
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chaining commands, redirecting standard input/output/error streams, and conditional execution.
              </p>
            </div>

            {/* Operator Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {/* Pipe | */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-xs text-purple-300 font-mono">1. PIPELINE ( | )</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400">STDOUT &rarr; STDIN</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Channels the standard output of the left command directly into the standard input of the right command.
                </p>
                <code className="text-xs font-mono text-purple-300 block mt-2 bg-black/60 p-2 rounded">
                  cat /etc/passwd | grep "/bin/bash" | cut -d: -f1
                </code>
                <span className="text-[11px] text-slate-400 block mt-1 italic">
                  Filters users with an interactive bash shell and outputs just their usernames.
                </span>
              </div>

              {/* Redirection > and >> */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-xs text-cyan-300 font-mono">2. OUTPUT REDIRECTION ( &gt; vs &gt;&gt; )</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400">OVERWRITE vs APPEND</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  <code>&gt;</code> overwrites the destination file completely. <code>&gt;&gt;</code> appends data to the end without deleting existing contents.
                </p>
                <code className="text-xs font-mono text-cyan-300 block mt-2 bg-black/60 p-2 rounded">
                  echo "nameserver 1.1.1.1" &gt; /etc/resolv.conf<br />
                  echo "nameserver 8.8.8.8" &gt;&gt; /etc/resolv.conf
                </code>
              </div>

              {/* Error Redirection 2>/dev/null */}
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-xs text-rose-300 font-mono">3. SUPPRESS ERRORS ( 2&gt;/dev/null )</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400">STDERR MUTE</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Stream 1 is standard output (stdout), stream 2 is standard error (stderr). Pentesters redirect stream 2 to <code>/dev/null</code> to silence "Permission denied" errors.
                </p>
                <code className="text-xs font-mono text-rose-300 block mt-2 bg-black/60 p-2 rounded">
                  find / -perm -u=s -type f 2&gt;/dev/null
                </code>
              </div>

              {/* Conditional Operators && and || */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-xs text-emerald-300 font-mono">4. LOGICAL EXECUTION ( &amp;&amp; vs || )</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">EXIT STATUS CHECK</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  <code>&amp;&amp;</code> executes the second command ONLY if the first command returned exit code 0 (success). <code>||</code> executes ONLY if the first command failed.
                </p>
                <code className="text-xs font-mono text-emerald-300 block mt-2 bg-black/60 p-2 rounded">
                  ping -c 1 10.0.0.1 &amp;&amp; echo "UP" || echo "DOWN"
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

