export const assignmentTasks = [
  {
    id: 'task-1-tcp-udp',
    title: 'Difference Between TCP & UDP',
    category: 'Networking',
    topicIndex: 9, // Topic 10: Ports & Protocols
    topicName: 'Topic 10: Ports & Core Protocols',
    estimatedTime: '45 mins',
    badge: 'NETWORKING TASK 01',
    summary: 'Compare connection-oriented TCP vs. connectionless UDP transport protocols, reliability mechanisms, and application use cases.',
    objective: 'Analyze how Layer 4 Transport protocols manage network sessions, comparing the overhead, speed, and error recovery of TCP vs UDP.',
    keyConcepts: [
      'TCP: Connection-oriented 3-way handshake (SYN, SYN-ACK, ACK), sequence numbers, acknowledgements, sliding window flow control, retransmission of lost packets.',
      'UDP: Connectionless fire-and-forget datagrams, zero handshakes, no acknowledgements, minimal header overhead (8 bytes vs 20–60 bytes).',
      'Protocol mappings: HTTP/S (443), SSH (22), FTP (21) use TCP. DNS queries (53), DHCP (67/68), VoIP (SIP/RTP), TFTP (69) use UDP.'
    ],
    instructions: [
      'Document the 3-Way Handshake mechanism for TCP session establishment and the 4-way teardown (FIN/ACK).',
      'Compare packet headers: Contrast TCP header fields (Source/Dest Port, Sequence #, Ack #, Flags, Window Size, Checksum) with UDP header fields (Source/Dest Port, Length, Checksum).',
      'Explain when real-world applications mandate UDP (e.g. live video streaming, DNS lookups, online gaming) despite lack of delivery guarantees.',
      'Simulate a Wireshark capture comparing a TCP handshake (HTTP/HTTPS) against a UDP query (DNS lookup).'
    ],
    keyDeliverables: [
      'Comprehensive comparison matrix table (Connection, Speed, Reliability, Header Size, Error Checking, Handshake).',
      'Packet header anatomy diagram illustrating TCP vs UDP field structures.',
      'Wireshark packet capture screenshot identifying TCP SYN/ACK flags vs UDP stateless datagram.'
    ],
    commands: [
      { label: 'Inspect active TCP connections on Windows', cmd: 'netstat -ano | findstr TCP' },
      { label: 'Inspect active listening UDP ports on Linux', cmd: 'ss -u -a -n' },
      { label: 'Capture TCP vs UDP traffic with tcpdump', cmd: 'sudo tcpdump -i any "tcp or udp" -nn -c 20' }
    ]
  },
  {
    id: 'task-2-osi-tcpip',
    title: 'Difference Between OSI & TCP/IP Model',
    category: 'Networking',
    topicIndex: 5, // Topic 06: OSI vs TCP/IP
    topicName: 'Topic 06: OSI 7-Layer vs TCP/IP 4-Layer Model',
    estimatedTime: '45 mins',
    badge: 'NETWORKING TASK 02',
    summary: 'Deep-dive comparison between the theoretical 7-Layer OSI Reference Model and the practical 4-Layer TCP/IP Internet Architecture.',
    objective: 'Understand how modular network layering facilitates interoperability, hardware-software abstraction, and systematic troubleshooting.',
    keyConcepts: [
      'OSI 7 Layers: Physical (L1), Data Link (L2), Network (L3), Transport (L4), Session (L5), Presentation (L6), Application (L7).',
      'TCP/IP 4 Layers: Network Access / Link, Internet, Transport, Application.',
      'Mapping: OSI Layers 5, 6, and 7 combine into TCP/IP Application layer. OSI Layers 1 and 2 combine into Network Access layer.',
      'Protocol Data Units (PDUs): Bits (L1) -> Frames (L2) -> Packets (L3) -> Segments (L4) -> Data (L5-L7).'
    ],
    instructions: [
      'Construct a side-by-side mapping diagram showing each of the 7 OSI layers mapped to the 4 TCP/IP layers.',
      'Document the PDU (Protocol Data Unit) and primary hardware device at each layer (e.g., L1: Hub/Cable, L2: Switch/NIC, L3: Router).',
      'Explain the step-by-step encapsulation process (adding headers going down) and decapsulation process (stripping headers going up).',
      'Explain why TCP/IP became the commercial de facto standard for the Internet while OSI remained a conceptual model.'
    ],
    keyDeliverables: [
      'Full layer comparison table detailing Layer Name, Layer Number, PDU, Core Protocols, and Hardware Devices.',
      'Diagram illustrating packet encapsulation from Application data down to physical transmission bits.',
      'Written troubleshooting scenario: How network engineers isolate network faults using the bottom-up approach (L1 -> L2 -> L3).'
    ],
    commands: [
      { label: 'Inspect Layer 2 MAC address and Layer 3 IP on Linux', cmd: 'ip addr show' },
      { label: 'Inspect Layer 2 ARP cache table on Windows', cmd: 'arp -a' },
      { label: 'Trace Layer 3 network path across hops', cmd: 'tracert 8.8.8.8' }
    ]
  },
  {
    id: 'task-3-loopback-apipa',
    title: 'Loopback & APIPA Addressing',
    category: 'Networking',
    topicIndex: 6, // Topic 07: IPv4 vs IPv6
    topicName: 'Topic 07: IPv4 vs IPv6 Architecture',
    estimatedTime: '30 mins',
    badge: 'NETWORKING TASK 03',
    summary: 'Analyze reserved IPv4 address spaces: Loopback (127.0.0.0/8) for internal stack testing and APIPA (169.254.0.0/16) for DHCP failure fallback.',
    objective: 'Master diagnostic verification of the local operating system network stack and identify automated DHCP failover states.',
    keyConcepts: [
      'Loopback Address: 127.0.0.1 (Range 127.0.0.0/8, localhost). Used to test local TCP/IP protocol stack functionality without transmitting signals to the physical network adapter.',
      'APIPA (Automatic Private IP Addressing): Range 169.254.0.1 to 169.254.255.254 (169.254.0.0/16 with mask 255.255.0.0).',
      'APIPA Trigger: When a client is set to Obtain IP automatically (DHCP) but receives no DORA response within the discovery timeout window.',
      'APIPA Limitation: Link-local only; permits communication with adjacent devices on the same physical switch segment but CANNOT route to the Internet.'
    ],
    instructions: [
      'Perform a local loopback ping test on your workstation (ping 127.0.0.1) and explain what passing/failing this test signifies.',
      'Disconnect your network adapter from DHCP or assign an invalid DHCP scope on a test VM to force an APIPA state.',
      'Inspect ipconfig or ip addr to observe the 169.254.x.x allocation.',
      'Document a 4-step troubleshooting procedure when an enterprise employee reports receiving a 169.254.x.x address.'
    ],
    keyDeliverables: [
      'Terminal screenshot verifying ping 127.0.0.1 response.',
      'Screenshot or log showing a network interface assigned a 169.254.x.x APIPA address.',
      'Flowchart outlining troubleshooting steps: Cable check -> Switch port link -> DHCP Server scope exhaustion -> Static IP assignment.'
    ],
    commands: [
      { label: 'Test local TCP/IP stack integrity', cmd: 'ping 127.0.0.1' },
      { label: 'Release and renew DHCP lease on Windows', cmd: 'ipconfig /release && ipconfig /renew' },
      { label: 'Check APIPA interface details on Windows', cmd: 'ipconfig /all | findstr "Autoconfiguration IPv4"' }
    ]
  },
  {
    id: 'task-4-imap-pop3',
    title: 'IMAP & POP3 Email Protocols',
    category: 'Networking',
    topicIndex: 9, // Topic 10: Ports & Protocols
    topicName: 'Topic 10: Ports & Core Protocols',
    estimatedTime: '30 mins',
    badge: 'NETWORKING TASK 04',
    summary: 'Compare email retrieval protocols: POP3 (local download and purge) vs. IMAP (centralized multi-device synchronization).',
    objective: 'Understand how application-layer mail protocols function, their standard/encrypted port assignments, and corporate mail storage strategies.',
    keyConcepts: [
      'POP3 (Post Office Protocol v3): Port 110 (Cleartext), Port 995 (POP3S over SSL/TLS). Designed for single-computer access; downloads mail to local client storage.',
      'IMAP (Internet Message Access Protocol): Port 143 (Cleartext), Port 993 (IMAPS over SSL/TLS). Keeps messages on the server; synchronizes folders, read flags, and drafts across phones, laptops, and webmail.',
      'SMTP Contrast: SMTP (Ports 25, 587, 465) is used for SENDING email, whereas POP3/IMAP are used for RETRIEVING email.'
    ],
    instructions: [
      'Create a comparison table contrasting POP3 vs. IMAP across 6 metrics: Port numbers, Server retention, Multi-device sync, Bandwidth usage, Offline access, and Server storage impact.',
      'Explain the security risks of legacy unencrypted POP3 (Port 110) and IMAP (Port 143) on public Wi-Fi networks (credential sniffing).',
      'Explain why modern enterprise cloud email suites (Microsoft 365, Google Workspace) utilize IMAP/MAPI/Exchange ActiveSync rather than POP3.'
    ],
    keyDeliverables: [
      'Comparison matrix table detailing POP3 vs IMAP ports, encryption, synchronization, and usage scenarios.',
      'Architecture diagram illustrating the full email journey: Sender -> SMTP -> Mail Transfer Agent -> IMAP/POP3 -> Recipient Client.'
    ],
    commands: [
      { label: 'Test encrypted IMAPS connection via OpenSSL', cmd: 'openssl s_client -connect imap.gmail.com:993 -quiet' },
      { label: 'Test encrypted POP3S connection via OpenSSL', cmd: 'openssl s_client -connect pop.gmail.com:995 -quiet' }
    ]
  },
  {
    id: 'task-5-port-numbers',
    title: 'Common Port Numbers & Protocols Master Sheet',
    category: 'Networking',
    topicIndex: 9, // Topic 10: Ports & Protocols
    topicName: 'Topic 10: Ports & Core Protocols',
    estimatedTime: '40 mins',
    badge: 'NETWORKING TASK 05',
    summary: 'Memorize, classify, and audit well-known, registered, and dynamic port numbers across TCP and UDP services.',
    objective: 'Master port identification for security auditing, firewall configuration, and vulnerability assessment.',
    keyConcepts: [
      'Port Ranges: Well-Known (0–1023), Registered (1024–49151), Dynamic / Private / Ephemeral (49152–65535).',
      'Core Web: HTTP (80 TCP), HTTPS (443 TCP).',
      'Remote Administration: SSH (22 TCP), Telnet (23 TCP), RDP (3389 TCP).',
      'File & Mail: FTP (20/21 TCP), SMB (445 TCP), SMTP (25 TCP), POP3 (110/995 TCP), IMAP (143/993 TCP).',
      'Network Services: DNS (53 UDP/TCP), DHCP (67/68 UDP), NTP (123 UDP), SNMP (161/162 UDP), LDAP (389 TCP), LDAPS (636 TCP), Kerberos (88 TCP/UDP).'
    ],
    instructions: [
      'Compile a categorized master reference sheet covering the 20 most critical networking and cybersecurity port numbers.',
      'Execute terminal port audit commands (netstat on Windows, ss on Linux) to discover which ports are actively listening on your machine.',
      'Identify which ports transmit data in cleartext vs. which enforce TLS/SSL cryptographic protection.'
    ],
    keyDeliverables: [
      'Categorized Master Port Reference Sheet with Protocol Name, Port Number, Transport Layer (TCP/UDP), Cleartext/Encrypted status, and Purpose.',
      'Terminal transcript showing active listening ports and established connections on your lab machine.'
    ],
    commands: [
      { label: 'List all listening TCP & UDP ports on Linux', cmd: 'sudo ss -tulpn' },
      { label: 'List listening ports with PID on Windows', cmd: 'netstat -ano | findstr LISTENING' },
      { label: 'Scan open ports on a target host with Nmap', cmd: 'nmap -sS -sV -p 21,22,25,53,80,443,445,3389 127.0.0.1' }
    ]
  },
  {
    id: 'task-6-cisco-packet-tracer',
    title: 'Static vs Dynamic IP & Cisco Packet Tracer Network Diagram',
    category: 'Networking',
    topicIndex: 7, // Topic 08: DHCP & DORA
    topicName: 'Topic 08: Static IP vs Dynamic IP (DHCP & DORA)',
    estimatedTime: '60 mins',
    badge: 'NETWORKING TASK 06',
    summary: 'Analyze static vs dynamic addressing, and build a complete multi-device network topology in Cisco Packet Tracer with a DHCP server.',
    objective: 'Design, wire, and configure a simulated enterprise LAN topology, observing DHCP DORA address allocation and packet routing.',
    keyConcepts: [
      'Static IP: Manually entered; reserved for default gateways, DNS servers, web servers, and domain controllers.',
      'Dynamic IP: Automatically assigned by DHCP server via DORA handshake (Discover, Offer, Request, Acknowledge).',
      'Cisco Packet Tracer Architecture: Routers (L3), Switches (L2), End Devices (PCs, Laptops, Servers).'
    ],
    instructions: [
      'Open Cisco Packet Tracer and build a network topology containing: 1 Router (Cisco 2911), 1 Switch (Cisco 2960), 1 Dedicated Server, and 3 Client PCs.',
      'Configure Router GigabitEthernet0/0 interface with Static IP: 192.168.10.1 / 255.255.255.0.',
      'Configure Dedicated Server with Static IP: 192.168.10.2 / 255.255.255.0 and enable the DHCP Service.',
      'Configure DHCP Pool: Pool Name: Corporate_Pool, Default Gateway: 192.168.10.1, DNS Server: 8.8.8.8, Start IP: 192.168.10.50, Subnet Mask: 255.255.255.0, Max Users: 50.',
      'Set all 3 Client PCs to DHCP. Switch to Simulation Mode in Packet Tracer and trace the DORA broadcast/unicast packets.',
      'Verify full end-to-end connectivity using ping commands between PC0 and the Router/Server.'
    ],
    keyDeliverables: [
      'Cisco Packet Tracer saved file (.pkt) or detailed diagram screenshot showing all green link lights.',
      'IP configuration table detailing Device Name, Interface, IP Address, Subnet Mask, and Default Gateway.',
      'Packet Tracer Simulation Mode event list screenshot showing the DHCP Discover, Offer, Request, and ACK packets.'
    ],
    commands: [
      { label: 'Cisco IOS Router Interface Config', cmd: 'Router(config)# interface g0/0\nRouter(config-if)# ip address 192.168.10.1 255.255.255.0\nRouter(config-if)# no shutdown' },
      { label: 'Verify connectivity from PC terminal', cmd: 'ping 192.168.10.1' }
    ]
  },
  {
    id: 'task-7-windows-vs-linux',
    title: 'Windows vs. Linux Architectural Comparison',
    category: 'Windows',
    topicIndex: 10, // Topic 11: Windows Fundamentals
    topicName: 'Topic 11: Windows User Account & File Management',
    estimatedTime: '45 mins',
    badge: 'OS ADMIN TASK 01',
    summary: 'Compare core architecture, filesystem paradigms, user permission security models, and management methodologies between Windows and Linux.',
    objective: 'Develop cross-platform fluency by analyzing how Windows NT and Linux systems handle kernel modes, filesystems, users, and automation.',
    keyConcepts: [
      'Kernel Model: Windows Hybrid Kernel (ntoskrnl.exe) vs. Linux Monolithic Kernel (vmlinuz).',
      'Filesystem: Windows drive letters (C:\\, D:\\) on NTFS vs. Linux single hierarchical tree (/) on ext4/XFS.',
      'Security Principals: Windows Security Identifiers (SIDs) and Access Tokens vs. Linux UIDs, GIDs, and rwx permission bits.',
      'Configuration: Windows Registry (HKLM, HKCU) vs. Linux plaintext configuration files (/etc/*.conf).',
      'Shell & Automation: Windows PowerShell (Object-oriented pipeline) vs. Linux Bash/Zsh (Text-stream piping).'
    ],
    instructions: [
      'Create a comprehensive comparison chart evaluating Windows vs. Linux across: Kernel Architecture, File System Standard, Permission System, Package Management, Service Management, and Default Remote Access.',
      'Compare permission evaluation: Contrast Windows NTFS DACLs/SACLs with Linux POSIX Read/Write/Execute and SUID/SGID/Sticky bits.',
      'Explain the security implications of the Windows Registry vs. Linux plaintext /etc files regarding privilege escalation and credential hunting.'
    ],
    keyDeliverables: [
      'Detailed Windows vs Linux Architectural Comparison Document.',
      'Side-by-side CLI command comparison cheat sheet (e.g. dir vs ls, ipconfig vs ip a, tasklist vs ps aux, net start vs systemctl).'
    ],
    commands: [
      { label: 'Inspect Windows OS Version & Kernel Info', cmd: 'systeminfo | findstr /B /C:"OS Name" /C:"OS Version"' },
      { label: 'Inspect Linux Kernel Architecture & Release', cmd: 'uname -a' }
    ]
  },
  {
    id: 'task-8-disk-management',
    title: 'Windows Disk Management: Analysis, Defragmentation & Volume Shrinking',
    category: 'Windows',
    topicIndex: 10, // Topic 11: Windows User Accounts
    topicName: 'Topic 11: Windows User Account & File Management',
    estimatedTime: '50 mins',
    badge: 'WINDOWS TASK 02',
    summary: 'Perform hands-on storage management in Windows: Analyze fragmentation, perform volume defragmentation/optimization, and safely shrink partitions.',
    objective: 'Master GUI (diskmgmt.msc) and CLI (diskpart, defrag) storage administration, partition resizing, and filesystem maintenance.',
    keyConcepts: [
      'Fragmentation: As files are modified and deleted on spinning HDDs, non-contiguous sectors create fragmentation, slowing seek times.',
      'Defragmentation vs. TRIM: HDDs require file defragmentation; SSDs must NOT be defragmented (causes wear). SSDs use TRIM (/O command in defrag).',
      'Volume Shrinking: Safely reduces an existing NTFS volume to create Unallocated Space for new partitions or dual-booting without data loss.',
      'Unmovable Files: Windows pagefile.sys, hiberfil.sys, and System Volume Information can limit maximum shrinkable space.'
    ],
    instructions: [
      'Launch Windows Disk Management via Run dialog: diskmgmt.msc.',
      'Open Command Prompt as Administrator and analyze volume C: fragmentation using defrag C: /A.',
      'Execute optimization using defrag C: /O /U /V and record the resulting report.',
      'Shrink a partition: Open diskmgmt.msc, right-click an unreserved partition (or secondary drive), select "Shrink Volume", specify 2048 MB (2 GB), and complete the shrink operation.',
      'Alternative CLI: Execute the same volume query and shrink using diskpart.'
    ],
    keyDeliverables: [
      'Command prompt screenshot showing defrag C: /A analysis output with percentage of fragmentation.',
      'Disk Management (diskmgmt.msc) screenshot displaying the newly created Unallocated Space after shrinking.',
      'Diskpart CLI transcript detailing list volume, select volume, and shrink querymax.'
    ],
    commands: [
      { label: 'Analyze volume fragmentation status', cmd: 'defrag C: /A' },
      { label: 'Perform media-optimized defragmentation/TRIM', cmd: 'defrag C: /O /U /V' },
      { label: 'Query maximum shrinkable bytes via Diskpart', cmd: 'diskpart\nlist volume\nselect volume C\nshrink querymax' }
    ]
  },
  {
    id: 'task-9-active-directory-lab',
    title: 'Active Directory Lab: Create 2 OUs, 5 Users & Assign TL to Group Manager',
    category: 'Windows',
    topicIndex: 11, // Topic 12: Windows Server
    topicName: 'Topic 12: Windows Server Active Directory & GPO',
    estimatedTime: '60 mins',
    badge: 'WINDOWS SERVER TASK 01',
    summary: 'Deploy an enterprise Active Directory structure: Create 2 Organizational Units (OUs), provision 5 domain user accounts, create security groups, and delegate Team Lead management.',
    objective: 'Build foundational Active Directory directory management skills using both GUI (dsa.msc) and PowerShell ActiveDirectory module.',
    keyConcepts: [
      'Organizational Unit (OU): Logical container inside Active Directory used to organize users/computers and link Group Policy Objects (GPOs).',
      'Security Groups: Used to assign access permissions across shared folders, printers, and network resources.',
      'ManagedBy Property: Active Directory attribute designating an account as the group owner/manager for access delegation.'
    ],
    instructions: [
      'Open Active Directory Users and Computers (dsa.msc) on Windows Server Domain Controller.',
      'Create 2 Organizational Units under domain root (corp.example): OU=Engineering and OU=Marketing.',
      'Inside OU=Engineering, create 3 user accounts: eng_user1, eng_user2, and eng_lead (Team Lead).',
      'Inside OU=Marketing, create 2 user accounts: mkt_user1 and mkt_user2.',
      'Inside OU=Engineering, create a Global Security Group named Managers_Group.',
      'Add eng_lead as a member of Managers_Group.',
      'Right-click Managers_Group, open Properties -> Managed By tab -> Click Change -> Select eng_lead -> Check "Manager can update membership list".',
      'Perform the entire process via PowerShell script using New-ADOrganizationalUnit, New-ADUser, New-ADGroup, and Add-ADGroupMember.'
    ],
    keyDeliverables: [
      'ADUC GUI screenshot displaying the new OUs (Engineering, Marketing), the 5 user accounts, and Managers_Group.',
      'Group Properties screenshot showing eng_lead designated under the "Managed By" tab.',
      'PowerShell command script and execution transcript validating group membership.'
    ],
    commands: [
      { label: 'Create OUs via PowerShell', cmd: 'New-ADOrganizationalUnit -Name "Engineering" -Path "DC=corp,DC=example"\nNew-ADOrganizationalUnit -Name "Marketing" -Path "DC=corp,DC=example"' },
      { label: 'Create User & Group in OU', cmd: '$pwd = ConvertTo-SecureString "P@ssw0rd2026!" -AsPlainText -Force\nNew-ADUser -Name "eng_lead" -AccountPassword $pwd -Enabled $true -Path "OU=Engineering,DC=corp,DC=example"\nNew-ADGroup -Name "Managers_Group" -GroupScope Global -Path "OU=Engineering,DC=corp,DC=example"\nAdd-ADGroupMember -Identity "Managers_Group" -Members "eng_lead"' },
      { label: 'Verify group membership', cmd: 'Get-ADGroupMember -Identity "Managers_Group" | Select-Object Name, SamAccountName' }
    ]
  },
  {
    id: 'task-10-common-group-policies',
    title: 'Enterprise Group Policies: Common GPOs & Creation Steps',
    category: 'Windows',
    topicIndex: 11, // Topic 12: Windows Server
    topicName: 'Topic 12: Windows Server Active Directory & GPO',
    estimatedTime: '60 mins',
    badge: 'WINDOWS SERVER TASK 02',
    summary: 'Identify the top 5 most common enterprise Group Policy Objects, document step-by-step creation procedures, and verify GPO enforcement on client workstations.',
    objective: 'Master Group Policy Management Console (gpmc.msc), policy inheritance rules (LSDOU), and client policy updating (gpupdate, gpresult).',
    keyConcepts: [
      'GPO Hierarchy: Local -> Site -> Domain -> Organizational Unit (OU). Later applied policies override earlier ones.',
      'Computer Configuration: Applies to physical workstation at boot (Windows Defender, Firewall, USB restrictions).',
      'User Configuration: Applies to user profile at logon (Control Panel prohibition, Wallpaper lock, Folder redirection).',
      'Enforcement Tools: gpupdate /force (Client refresh), gpresult /r (RSOP report verification).'
    ],
    instructions: [
      'Open Group Policy Management Console (gpmc.msc) on Domain Controller.',
      'Document the 5 Most Common Enterprise GPOs:\n  1. Account Password Policy (Min 12 chars, complexity enabled, 5-attempt lockout)\n  2. Prohibit Access to Control Panel and PC Settings\n  3. Block Removable USB Storage Devices\n  4. Restrict Command Prompt and PowerShell for standard users\n  5. Screen Saver Timeout & Mandatory Lock after 5 minutes of inactivity.',
      'Create and Link a GPO: Right-click OU=Marketing -> Select "Create a GPO in this domain, and Link it here..." -> Name: Marketing_ControlPanel_Block.',
      'Edit GPO: User Configuration -> Policies -> Administrative Templates -> Control Panel -> Enable "Prohibit access to Control Panel and PC settings".',
      'Log into domain client workstation as mkt_user1. Open cmd and run gpupdate /force.',
      'Verify: Attempt to launch control.exe or Windows Settings app -> Confirm administrative restriction block dialog appears.',
      'Run gpresult /r to confirm Marketing_ControlPanel_Block appears under Applied Group Policy Objects.'
    ],
    keyDeliverables: [
      'GPMC screenshot displaying the linked GPO under OU=Marketing.',
      'Client workstation screenshot displaying the restriction notice when attempting to open Control Panel.',
      'gpresult /r command output verifying policy compilation and application.'
    ],
    commands: [
      { label: 'Force immediate GPO refresh on client PC', cmd: 'gpupdate /force' },
      { label: 'Generate Summary Group Policy Results (RSOP)', cmd: 'gpresult /r' },
      { label: 'Export full HTML Group Policy diagnostic report', cmd: 'gpresult /h C:\\GPReport.html' }
    ]
  },
  {
    id: 'task-11-linux-commands-list',
    title: 'Master Categorized Linux Commands Reference',
    category: 'Linux',
    topicIndex: 13, // Topic 14: Linux Administration
    topicName: 'Topic 14: Linux Administration & Pentesting Commands',
    estimatedTime: '60 mins',
    badge: 'LINUX ADMIN TASK 01',
    summary: 'Compile, categorize, and document the complete spectrum of essential Linux commands for system administration, diagnostic troubleshooting, and cybersecurity.',
    objective: 'Build terminal muscle memory and a production-grade reference manual covering all foundational Linux CLI commands.',
    keyConcepts: [
      'File Operations: Navigation, directory manipulation, file creation, searching, archiving.',
      'System & Process Management: Monitoring CPU/RAM, inspecting running processes, service control with systemctl.',
      'User & Privilege Management: User and group creation, permission modification, sudo privilege checking.',
      'Network Reconnaissance: Interface inspection, socket listening ports, network route tracing, socket communication.'
    ],
    instructions: [
      'Compile a categorized master reference list of Linux commands including syntax, common flags, and usage examples across 6 categories:\n  1. File & Directory: ls, cd, pwd, mkdir, touch, cp, mv, rm, find, locate\n  2. File Content & Editing: cat, less, head, tail, grep, nano, vim, sed, awk\n  3. Permissions & Ownership: chmod, chown, chgrp, umask\n  4. System & Processes: uname, top, htop, ps, kill, pkill, systemctl, df, du, free\n  5. User & Identity Management: whoami, id, useradd, usermod, userdel, groupadd, passwd, su, sudo\n  6. Networking & Diagnostics: ip, ping, ss, netstat, traceroute, dig, curl, wget, nc (netcat).',
      'Test at least 3 commands from each of the 6 categories in your Linux lab VM and record the live outputs.'
    ],
    keyDeliverables: [
      'Categorized Master Linux Command Reference Guide with descriptions, flags, and real-world syntax.',
      'Terminal transcript validating practical execution of commands across all categories.'
    ],
    commands: [
      { label: 'File Search for SUID Binaries', cmd: 'find / -perm -u=s -type f 2>/dev/null' },
      { label: 'Inspect active listening network sockets', cmd: 'ss -tulpn' },
      { label: 'Inspect user privileges & groups', cmd: 'id && sudo -l' }
    ]
  },
  {
    id: 'task-12-linux-hands-on-lab',
    title: 'Linux Hands-on: Directories, Files, Permissions & Group Management',
    category: 'Linux',
    topicIndex: 12, // Topic 13: Linux Fundamentals
    topicName: 'Topic 13: Linux Fundamentals (FHS & Permissions)',
    estimatedTime: '50 mins',
    badge: 'LINUX ADMIN TASK 02',
    summary: 'Execute a practical Linux system administration workflow: Create directory trees, generate files, assign octal permissions (chmod 770), create groups, and verify access restrictions.',
    objective: 'Master terminal-based directory creation, file creation, user provisioning, secondary group assignment, and strict Discretionary Access Control (DAC).',
    keyConcepts: [
      'POSIX Permissions: Read (4), Write (2), Execute (1) across Owner, Group, and Others.',
      'Chmod Octal: 770 gives Owner rwx (7), Group rwx (7), and completely blocks Others (0).',
      'Group Association: Creating dedicated groups to delegate department file access without granting full root privileges.'
    ],
    instructions: [
      'Step 1: Create Directories & Files\n  mkdir -p /opt/finance_records /opt/audit_vault\n  touch /opt/finance_records/q1_budget.txt /opt/finance_records/payroll.csv',
      'Step 2: Create Group & Provision Users\n  groupadd finance_dept\n  useradd -m -s /bin/bash alice_fin\n  useradd -m -s /bin/bash bob_fin\n  useradd -m -s /bin/bash charlie_guest\n  usermod -aG finance_dept alice_fin\n  usermod -aG finance_dept bob_fin',
      'Step 3: Configure Ownership & Permissions\n  chown -R root:finance_dept /opt/finance_records\n  chmod 770 /opt/finance_records\n  chmod 660 /opt/finance_records/*',
      'Step 4: Verification & Access Testing\n  Verify permissions using ls -la /opt/finance_records\n  Switch to alice_fin (su - alice_fin) and verify she can read and write to payroll.csv\n  Switch to charlie_guest (su - charlie_guest) and verify he is blocked (Permission denied) when attempting to access /opt/finance_records.'
    ],
    keyDeliverables: [
      'Terminal transcript showing directory creation, groupadd, useradd, and usermod commands.',
      'Output of ls -la /opt/finance_records validating root:finance_dept ownership and rwxrwx--- permissions.',
      'Proof of authorization test showing alice_fin successfully reading the file and charlie_guest receiving "Permission denied".'
    ],
    commands: [
      { label: 'Create Directory Tree & Files', cmd: 'sudo mkdir -p /opt/finance_records && sudo touch /opt/finance_records/q1_budget.txt /opt/finance_records/payroll.csv' },
      { label: 'Create Group and Add Users', cmd: 'sudo groupadd finance_dept\nsudo useradd -m -s /bin/bash alice_fin\nsudo usermod -aG finance_dept alice_fin' },
      { label: 'Set Permissions (770 folder, 660 files)', cmd: 'sudo chown -R root:finance_dept /opt/finance_records\nsudo chmod 770 /opt/finance_records\nsudo chmod 660 /opt/finance_records/*' },
      { label: 'Verify Access Control Enforcement', cmd: 'ls -la /opt/finance_records\nsu - alice_fin -c "cat /opt/finance_records/payroll.csv"\nsu - charlie_guest -c "cat /opt/finance_records/payroll.csv"' }
    ]
  }
];
