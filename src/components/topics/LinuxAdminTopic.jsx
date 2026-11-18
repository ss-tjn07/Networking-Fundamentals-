import React, { useState } from 'react';
import {
  Server,
  Terminal,
  FileText,
  FileCode,
  ShieldAlert,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Command,
  ChevronRight,
  Zap,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';

export default function LinuxAdminTopic() {
  const [activeTab, setActiveTab] = useState('directories'); // 'directories' | 'editors' | 'pentest-cli'

  // Pentesting Terminal State
  const [pentestCategory, setPentestCategory] = useState('recon'); // 'recon' | 'network' | 'suid' | 'processes'
  const [activeCommand, setActiveCommand] = useState('id');

  // Vim Simulator State
  const [vimMode, setVimMode] = useState('normal'); // 'normal' | 'insert' | 'command'
  const [vimBuffer, setVimBuffer] = useState(
    `# /etc/nginx/sites-available/default\nserver {\n    listen 80;\n    server_name target.corp.net;\n    root /var/www/html;\n    index index.html;\n}`
  );

  // Simulated command outputs for pentesting toolkit
  const pentestOutputs = {
    'id': `uid=1001(alice) gid=1001(alice) groups=1001(alice),27(sudo),110(docker)
[+] ALERT: User belongs to group 'docker' and 'sudo'! Immediate privilege escalation vector available.`,

    'uname -a': `Linux victim-box 5.15.0-89-generic #99-Ubuntu SMP Mon Oct 30 20:42:41 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
[i] Architecture: 64-bit x86_64 | Kernel 5.15.0-89 | OS: Ubuntu 22.04 LTS`,

    'cat /etc/os-release': `NAME="Ubuntu"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 22.04.3 LTS"
VERSION_ID="22.04"
HOME_URL="https://www.ubuntu.com/"`,

    'sudo -l': `Matching Defaults entries for alice on victim-box:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin

User alice may run the following commands on victim-box:
    (ALL : ALL) NOPASSWD: /usr/bin/find
    (ALL : ALL) NOPASSWD: /usr/bin/python3
[!] EXPLOIT: /usr/bin/find has NOPASSWD! Run: 'sudo find . -exec /bin/sh \\; -quit' for instant root shell!`,

    'ip a': `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:9c:88:fe brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.105/24 brd 192.168.1.255 scope global dynamic eth0`,

    'ss -tulpn': `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*     users:(("sshd",pid=712,fd=3))
tcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*     users:(("nginx",pid=842,fd=6))
tcp   LISTEN 0      128        127.0.0.1:3306       0.0.0.0:*     users:(("mysqld",pid=915,fd=24))
tcp   LISTEN 0      128        127.0.0.1:6379       0.0.0.0:*     users:(("redis-server",pid=1020,fd=6))
[i] NOTE: MySQL (3306) and Redis (6379) are listening locally on 127.0.0.1 (Internal pivot targets).`,

    'curl -I http://127.0.0.1:80': `HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Wed, 04 Nov 2026 10:15:20 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Tue, 03 Nov 2026 14:10:00 GMT
Connection: keep-alive
ETag: "6363a0a0-264"
Accept-Ranges: bytes`,

    'nc -lvnp 4444': `listening on [any] 4444 ...
connect to [192.168.1.105] from (UNKNOWN) [192.168.1.150] 51240
bash: cannot set terminal process group (4920): Inappropriate ioctl for device
bash: no job control in this shell
root@target:~# whoami
root
[+] SUCCESS: Netcat listener caught incoming root reverse shell connection!`,

    'find / -perm -u=s -type f 2>/dev/null': `/usr/bin/passwd
/usr/bin/chfn
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/pkexec
/usr/bin/bash
/opt/backup/custom_suid
[!] CRITICAL: /usr/bin/bash has SUID bit set (4755)! Run: '/usr/bin/bash -p' to obtain root shell!`,

    'grep -rnw "/var/www" -e "password" 2>/dev/null': `/var/www/html/config.php:14: $db_user = 'root';
/var/www/html/config.php:15: $db_password = 'P@ssw0rd_DB_Admin_2026!';
/var/www/html/api/auth.php:48: // TODO: Remove hardcoded fallback password 'secret_master_key'
[+] LOOT: Discovered plaintext database credentials in /var/www/html/config.php!`,

    'find / -writable -type d 2>/dev/null | head -n 5': `/tmp
/var/tmp
/dev/shm
/run/lock
/var/www/html/uploads
[+] Discovered 5 world-writable directories suitable for dropping staging payloads.`,

    'ps aux | grep root | head -n 6': `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.2 168420 11400 ?        Ss   09:00   0:02 /sbin/init
root         2  0.0  0.0      0     0 ?        S    09:00   0:00 [kthreadd]
root       712  0.0  0.1  15420  7800 ?        Ss   09:00   0:00 sshd: /usr/sbin/sshd -D [listener]
root       915  0.2  2.1 1842000 84200 ?       Ssl  09:00   0:15 /usr/sbin/mysqld
root      1420  0.0  0.0   6840  2400 ?        S    09:12   0:00 /usr/bin/python3 /opt/automation/backup.py`,

    'crontab -l': `# Edit this file to introduce tasks to be run by cron.
# m h  dom mon dow   command
*/5 * * * * /opt/automation/backup.sh >/dev/null 2>&1
0 0 * * * /usr/bin/logrotate /etc/logrotate.conf
[i] NOTE: Inspect /opt/automation/backup.sh write permissions. If writable, inject reverse shell for scheduled root execution!`,

    'history | tail -n 8': `  101  git clone https://github.com/corp/portal.git
  102  cd portal && npm install
  103  mysql -u root -p'SuperSecretSQL2026!' database_prod < dump.sql
  104  ssh -i ~/.ssh/id_rsa admin@10.0.0.5
  105  sudo systemctl restart nginx
  106  history
[+] LOOT: Command history leaked root MySQL password 'SuperSecretSQL2026!' and SSH login target!`
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* TOP VIEW NAVIGATION */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('directories')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'directories'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-4 h-4 text-rose-300" />
              <span>Common Directories & Sensitive Files</span>
            </button>

            <button
              onClick={() => setActiveTab('editors')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'editors'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Terminal Text Editors (Vim vs Nano)</span>
            </button>

            <button
              onClick={() => setActiveTab('pentest-cli')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'pentest-cli'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-cyan-300" />
              <span>Linux Pentesting Commands Toolkit</span>
            </button>
          </div>

          <span className="hidden xl:inline text-[10px] font-mono text-rose-400 bg-rose-950 px-2.5 py-1 rounded border border-rose-800">
            ADMINISTRATION & RECON
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: COMMON DIRECTORIES & SENSITIVE FILES */}
      {/* ============================================================ */}
      {activeTab === 'directories' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-inner">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Linux Administration: Common Directories & High-Value Target Files
                  </h2>
                  <p className="text-xs text-slate-400">
                    Deep dive into Linux configuration files, password databases, authentication logs, and cron tasks.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded border border-rose-800/60">
                  /etc/passwd & /etc/shadow
                </span>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/60">
                  /var/log/auth.log
                </span>
              </div>
            </div>
          </div>

          {/* 4 Deep-Dive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: /etc/passwd */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-cyan-300 font-mono">1. /etc/passwd (User Database)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400">WORLD READABLE</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Stores user account definitions. Every user on the system can read this file. Each line represents one account separated by 7 colon-delimited fields:
                </p>

                <div className="my-3 p-2.5 rounded-lg bg-black/80 font-mono text-xs text-cyan-300 border border-cyan-800/50">
                  root : x : 0 : 0 : root : /root : /bin/bash<br />
                  alice : x : 1001 : 1001 : Alice Dev : /home/alice : /bin/bash
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-400">
                  <div><strong className="text-white">Field 1:</strong> Username (e.g. root, alice)</div>
                  <div><strong className="text-white">Field 2:</strong> Password placeholder ('x' indicates hash is in /etc/shadow)</div>
                  <div><strong className="text-white">Field 3:</strong> User ID (UID 0 is superuser root, 1000+ are regular users)</div>
                  <div><strong className="text-white">Field 4:</strong> Group ID (GID)</div>
                  <div><strong className="text-white">Field 5:</strong> Comment / User Description (GECOS)</div>
                  <div><strong className="text-white">Field 6:</strong> User Home Directory (/home/alice)</div>
                  <div><strong className="text-white">Field 7:</strong> Login Shell (/bin/bash, /usr/sbin/nologin)</div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong className="font-mono">Pentester Insight:</strong> If /etc/passwd is accidentally writable, an attacker can append a new UID 0 account with a known password hash for instant root!
              </div>
            </div>

            {/* Card 2: /etc/shadow */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-rose-300 font-mono">2. /etc/shadow (Password Hashes)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400">ROOT-ONLY (0600)</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Holds cryptographic salted password hashes and password aging parameters. Readable ONLY by superuser root (permissions <code>-rw-r-----</code> or <code>0600</code>):
                </p>

                <div className="my-3 p-2.5 rounded-lg bg-black/80 font-mono text-xs text-rose-300 border border-rose-800/50 break-all">
                  root : $6$rounds=5000$saltsalt$H8F9a... : 19724 : 0 : 90 : 7 : : :
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-400">
                  <div><strong className="text-white">$6$:</strong> Hash Algorithm ($1$=MD5, $5$=SHA-256, $6$=SHA-512, $y$=yescrypt)</div>
                  <div><strong className="text-white">Salt:</strong> Random string added to thwart precomputed Rainbow Tables</div>
                  <div><strong className="text-white">Hash:</strong> The one-way irreversible cryptographic digest</div>
                  <div><strong className="text-white">Aging Fields:</strong> Last change date, min days, max days, warning days</div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-200">
                <strong className="font-mono">Offline Cracking:</strong> If an attacker steals /etc/shadow and /etc/passwd, they run <code>unshadow</code> and crack hashes offline with <code>John the Ripper</code> or <code>Hashcat</code>.
              </div>
            </div>

            {/* Card 3: /etc/sudoers */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-amber-300 font-mono">3. /etc/sudoers (Sudo Privileges)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400">VISUDO ONLY</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Dictates which users and groups can elevate privileges via the <code>sudo</code> binary, and what commands they are permitted to run:
                </p>

                <div className="my-3 p-2.5 rounded-lg bg-black/80 font-mono text-xs text-amber-300 border border-amber-800/50">
                  %sudo ALL=(ALL:ALL) ALL<br />
                  alice ALL=(ALL) NOPASSWD: /usr/bin/python3
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p>
                    Always edit with <code>visudo</code>! Editing directly with nano/vim without syntax checking can lock administrators out of root access if a typo occurs.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200">
                <strong className="font-mono">GTFOBins:</strong> If a user can run binaries like python, find, vim, or less via sudo NOPASSWD, they can break out into a root shell immediately!
              </div>
            </div>

            {/* Card 4: /var/log/auth.log */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-emerald-300 font-mono">4. /var/log/auth.log (Audit Trails)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">INCIDENT RESPONSE</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  The primary security audit ledger on Debian/Ubuntu systems (on RHEL/CentOS, this is <code>/var/log/secure</code>). Logs all authentication activity:
                </p>

                <div className="my-3 p-2.5 rounded-lg bg-black/80 font-mono text-xs text-emerald-300 border border-emerald-800/50 space-y-1">
                  <div>Nov 4 10:14:02 box sshd[812]: Accepted publickey for alice from 192.168.1.50 port 52140</div>
                  <div>Nov 4 10:15:10 box sudo: alice : TTY=pts/0 ; PWD=/home/alice ; USER=root ; COMMAND=/bin/bash</div>
                  <div className="text-rose-400">Nov 4 10:16:44 box sshd[901]: Failed password for invalid user admin from 45.33.32.1</div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200">
                <strong className="font-mono">Log Tampering:</strong> Attackers often try to wipe <code>/var/log/auth.log</code> or use <code>history -c</code> to erase forensic evidence before disconnecting.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: TERMINAL TEXT EDITORS (VIM VS NANO) */}
      {/* ============================================================ */}
      {activeTab === 'editors' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Terminal Text Editors Studio: Mastering Vim & Nano
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Headless servers lack graphical interfaces. Terminal text editors are required for editing configs, scripts, and code.
              </p>
            </div>

            {/* Interactive Vim Simulator Canvas */}
            <div className="my-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                    VIM MODAL SIMULATOR
                  </span>
                  <span className="text-xs text-slate-400">Experience Vim's 3 core modes:</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setVimMode('normal')}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                      vimMode === 'normal' ? 'bg-emerald-600 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Normal Mode (ESC)
                  </button>
                  <button
                    onClick={() => setVimMode('insert')}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                      vimMode === 'insert' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Insert Mode (i)
                  </button>
                  <button
                    onClick={() => setVimMode('command')}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                      vimMode === 'command' ? 'bg-amber-600 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Command Mode (:)
                  </button>
                </div>
              </div>

              {/* Simulated Vim Terminal Screen */}
              <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black font-mono text-xs">
                {/* Title */}
                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-slate-400 border-b border-slate-800">
                  <span>vim /etc/nginx/sites-available/default</span>
                  <span className="text-[10px]">UTF-8 | UNIX</span>
                </div>

                {/* Buffer Lines */}
                <div className="p-4 space-y-1 text-slate-300 min-h-[160px]">
                  {vimBuffer.split('\n').map((line, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="text-slate-600 select-none w-6 text-right">{idx + 1}</span>
                      <span className={line.startsWith('#') ? 'text-slate-500 italic' : 'text-slate-200'}>
                        {line}
                      </span>
                    </div>
                  ))}
                  <div className="text-slate-700 select-none">~</div>
                  <div className="text-slate-700 select-none">~</div>
                </div>

                {/* Bottom Status Line */}
                <div
                  className={`px-4 py-1.5 flex items-center justify-between font-bold select-none text-[11px] ${
                    vimMode === 'insert'
                      ? 'bg-blue-600 text-white'
                      : vimMode === 'command'
                      ? 'bg-amber-500 text-black'
                      : 'bg-emerald-600 text-black'
                  }`}
                >
                  <span>
                    {vimMode === 'insert' && '-- INSERT --'}
                    {vimMode === 'normal' && '-- NORMAL MODE (Commands: dd=cut, yy=copy, p=paste) --'}
                    {vimMode === 'command' && ':wq (Save and Exit)'}
                  </span>
                  <span>Line 1, Col 1</span>
                </div>
              </div>
            </div>

            {/* Comparison Cards: Nano vs Vim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Nano */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-sm text-cyan-400 font-mono">GNU Nano (Beginner Friendly)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">MODEL-LESS</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Nano operates like a standard notepad. What you type appears immediately on screen. Keyboard shortcuts are shown at the bottom (<code>^</code> = Ctrl key):
                </p>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>Ctrl + O</span>
                    <span className="text-cyan-400">WriteOut (Save file)</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>Ctrl + X</span>
                    <span className="text-rose-400">Exit editor</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>Ctrl + W</span>
                    <span className="text-amber-400">Where Is (Search keyword)</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>Ctrl + K / Ctrl + U</span>
                    <span className="text-purple-400">Cut line / Uncut (Paste)</span>
                  </div>
                </div>
              </div>

              {/* Vim */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-sm text-emerald-400 font-mono">Vim / Vi (Ubiquitous Standard)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">MODAL (FAST)</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Installed by default on 99% of Linux boxes, BSD, and macOS. Essential commands for your terminal toolkit:
                </p>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>i</span>
                    <span className="text-emerald-400">Enter Insert mode (start typing text)</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>ESC</span>
                    <span className="text-cyan-400">Return to Normal mode</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>:w / :q / :q!</span>
                    <span className="text-amber-400">Save / Quit / Force Quit without saving</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 text-slate-300 flex justify-between">
                    <span>:wq or :x</span>
                    <span className="text-purple-400">Save and Exit in one step</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: BASIC LINUX COMMANDS FOR PENTESTING TOOLKIT */}
      {/* ============================================================ */}
      {activeTab === 'pentest-cli' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Linux Pentesting & Reconnaissance Command Toolkit
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live executable commands used by ethical hackers and penetration testers to discover privileges, open ports, and SUID binaries.
                  </p>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setPentestCategory('recon');
                    setActiveCommand('id');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pentestCategory === 'recon' ? 'bg-cyan-600 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  System & User Recon
                </button>
                <button
                  onClick={() => {
                    setPentestCategory('network');
                    setActiveCommand('ip a');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pentestCategory === 'network' ? 'bg-cyan-600 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Network Discovery
                </button>
                <button
                  onClick={() => {
                    setPentestCategory('suid');
                    setActiveCommand('find / -perm -u=s -type f 2>/dev/null');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pentestCategory === 'suid' ? 'bg-cyan-600 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SUID & File Looting
                </button>
                <button
                  onClick={() => {
                    setPentestCategory('processes');
                    setActiveCommand('ps aux | grep root | head -n 6');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pentestCategory === 'processes' ? 'bg-cyan-600 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Processes & Cron
                </button>
              </div>
            </div>

            {/* Quick Command Selector */}
            <div className="my-4">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                Click any reconnaissance command to run in terminal:
              </span>
              <div className="flex flex-wrap gap-2">
                {pentestCategory === 'recon' && (
                  <>
                    <button
                      onClick={() => setActiveCommand('id')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'id'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; id
                    </button>
                    <button
                      onClick={() => setActiveCommand('uname -a')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'uname -a'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; uname -a
                    </button>
                    <button
                      onClick={() => setActiveCommand('cat /etc/os-release')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'cat /etc/os-release'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; cat /etc/os-release
                    </button>
                    <button
                      onClick={() => setActiveCommand('sudo -l')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'sudo -l'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; sudo -l
                    </button>
                  </>
                )}

                {pentestCategory === 'network' && (
                  <>
                    <button
                      onClick={() => setActiveCommand('ip a')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'ip a'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; ip a
                    </button>
                    <button
                      onClick={() => setActiveCommand('ss -tulpn')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'ss -tulpn'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; ss -tulpn
                    </button>
                    <button
                      onClick={() => setActiveCommand('curl -I http://127.0.0.1:80')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'curl -I http://127.0.0.1:80'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; curl -I http://127.0.0.1:80
                    </button>
                    <button
                      onClick={() => setActiveCommand('nc -lvnp 4444')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'nc -lvnp 4444'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; nc -lvnp 4444 (Catch Shell)
                    </button>
                  </>
                )}

                {pentestCategory === 'suid' && (
                  <>
                    <button
                      onClick={() => setActiveCommand('find / -perm -u=s -type f 2>/dev/null')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand.includes('-perm -u=s')
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; find / -perm -u=s (SUID Binaries)
                    </button>
                    <button
                      onClick={() => setActiveCommand('grep -rnw "/var/www" -e "password" 2>/dev/null')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand.includes('grep -rnw')
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; grep -rnw password (Web Configs)
                    </button>
                    <button
                      onClick={() => setActiveCommand('find / -writable -type d 2>/dev/null | head -n 5')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand.includes('-writable')
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; find writable dirs
                    </button>
                  </>
                )}

                {pentestCategory === 'processes' && (
                  <>
                    <button
                      onClick={() => setActiveCommand('ps aux | grep root | head -n 6')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand.includes('ps aux')
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; ps aux | grep root
                    </button>
                    <button
                      onClick={() => setActiveCommand('crontab -l')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand === 'crontab -l'
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; crontab -l
                    </button>
                    <button
                      onClick={() => setActiveCommand('history | tail -n 8')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                        activeCommand.includes('history')
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; history (Leak Passwords)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Simulated Kali Terminal */}
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
              {/* Title bar */}
              <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-slate-300 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                  <span className="ml-2 text-cyan-400">kali@recon-terminal: ~ (pts/1)</span>
                </div>
                <span className="text-[10px] text-slate-500">BASH 5.2.15</span>
              </div>

              {/* Console Body */}
              <div className="p-5 font-mono text-xs text-slate-200 overflow-x-auto min-h-[250px]">
                <div className="text-slate-500 mb-2">
                  Linux kali 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.1.27-1kali1 (2023-05-12) x86_64
                </div>

                <div className="flex items-start gap-1 text-emerald-400 mt-2">
                  <span>┌──(kali㉿victim-box)-[~]</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <span>└─$</span>
                  <span className="text-white font-bold ml-1">{activeCommand}</span>
                </div>

                <pre className="mt-2 text-cyan-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {pentestOutputs[activeCommand] || 'Executing...'}
                </pre>

                <div className="flex items-center gap-1 text-emerald-400 mt-4">
                  <span>└─$</span>
                  <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block ml-1"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

