export const topics = [
  {
    id: 'intro',
    title: 'Introduction to Networking',
    subtitle: 'Foundations: Nodes, Transmission Media, Protocols, and Data Flow',
    badge: 'TOPIC 01',
    icon: 'Network',
    notes: 'Emphasize that a network is simply two or more computing nodes sharing resources over a transmission medium governed by mutually understood protocols. Point out the difference between Client-Server vs Peer-to-Peer models.'
  },
  {
    id: 'hardware',
    title: 'Hardware: NIC, Hub, Switch, Router & Modem',
    subtitle: 'L1 to L3 Devices & The Collision vs Broadcast Domain comparison',
    badge: 'TOPIC 02',
    icon: 'Cpu',
    notes: 'Key teaching point: Hubs are dumb repeaters (1 collision domain, 1 broadcast domain). Switches are smart Layer 2 devices learning MAC addresses (split collision domains). Routers connect different subnets/networks (Layer 3, breaks broadcast domains).'
  },
  {
    id: 'media',
    title: 'Transmission Media: Guided vs. Unguided',
    subtitle: 'Coaxial, Fibre Optics, Twisted (Straight-Through & Crossover), Radiowaves, Microwaves, Infrared',
    badge: 'TOPIC 03',
    icon: 'Cable',
    notes: 'Key teaching point: Transmission media divides into Guided (Coaxial, Fibre Optics, Twisted Pair) and Unguided (Radiowaves, Microwaves, Infrared). Straight-Through cables connect dissimilar devices (Switch-Router, Switch-PC, Switch-Server, Hub-PC, Hub-Server, Router-PC) while Crossover cables connect like devices (Switch-Switch, Switch-Hub, Hub-Hub, Router-Router, PC-PC).'
  },
  {
    id: 'scope',
    title: 'Network Scope: LAN vs MAN vs WAN',
    subtitle: 'Geographical Scale, Ownership, Latency & Transmission Infrastructure',
    badge: 'TOPIC 04',
    icon: 'Globe',
    notes: 'Compare LAN (home/office, high speed 10Gbps, private), MAN (metropolitan citywide fiber, cable TV systems, campus loops), and WAN (global internet, telecomm carriers, high latency, undersea cables).'
  },
  {
    id: 'topologies',
    title: 'Network Topologies',
    subtitle: 'Star, Bus, Ring, Mesh, Tree & Hybrid - Interactive Fault & Traffic Simulator',
    badge: 'TOPIC 05',
    icon: 'GitFork',
    notes: 'Interactive exercise: Ask students why Star is preferred in modern offices (single point failure is only switch, easily isolatable) while Mesh is standard for ISP backbones despite its high O(n^2) cable cost.'
  },
  {
    id: 'osi-tcpip',
    title: 'OSI 7-Layer vs TCP/IP 4-Layer Model',
    subtitle: 'Layer mapping and Step-by-Step Packet Encapsulation & Decapsulation',
    badge: 'TOPIC 06',
    icon: 'Layers',
    notes: 'Mnemonic: "Please Do Not Throw Sausage Pizza Away" (Physical, Data Link, Network, Transport, Session, Presentation, Application). Demonstrate header prepending (encapsulation) going down, and header stripping going up.'
  },
  {
    id: 'ipv4-ipv6',
    title: 'IPv4 vs IPv6 Architecture',
    subtitle: '32-Bit vs 128-Bit Addressing, Address Depletion, Header Simplicity & Binary Explorer',
    badge: 'TOPIC 07',
    icon: 'Binary',
    notes: '4.29 billion vs 3.4 x 10^38 addresses (enough to assign an IP to every grain of sand on Earth). Explain why IPv6 eliminated NAT necessity, checksum overheads, and integrated mandatory IPSec capability.'
  },
  {
    id: 'dhcp-dora',
    title: 'Static IP vs Dynamic IP (DHCP & DORA)',
    subtitle: 'Interactive Packet Handshake: Discover, Offer, Request, Acknowledge',
    badge: 'TOPIC 08',
    icon: 'Repeat',
    notes: 'Explain DORA: Broadcast Discover (Who is the DHCP server?), Unicast/Broadcast Offer (Take this IP), Broadcast Request (I choose your IP), Unicast ACK (You own this lease for X hours).'
  },
  {
    id: 'classes',
    title: 'IPv4 Address Classes (A, B, C, D, E)',
    subtitle: 'Leading bits, Default Subnet Masks, Network vs Host IDs, and Live Calculator',
    badge: 'TOPIC 09',
    icon: 'Calculator',
    notes: 'Remind students of class boundaries: Class A (1-126), Class B (128-191), Class C (192-223), Class D Multicast (224-239), Class E Experimental (240-254). Point out 127.0.0.1 is reserved for loopback.'
  },
  {
    id: 'ports-protocols',
    title: 'Common Ports & Core Protocols',
    subtitle: 'HTTP/S, DNS, SSH, FTP, SMTP, SNMP with interactive 3-Way Handshake & DNS Resolver',
    badge: 'TOPIC 10',
    icon: 'ShieldCheck',
    notes: 'Ports act like apartment numbers in a high-rise building (IP is the building street address). Explain why well-known ports are 0-1023, registered 1024-49151, and dynamic 49152-65535.'
  },
  {
    id: 'windows-fundamentals',
    title: 'Windows User Account & File Management',
    subtitle: 'Complete Trainer Module: Windows Client + Windows Server Administration',
    badge: 'TOPIC 11',
    icon: 'Shield',
    notes: 'Complete 8-session training module covering Windows Client and Server user accounts, NTFS permissions, SMB shared folders, Active Directory Domain Services, Security Auditing, Student Labs (1-8), Final Practical Challenge, and 12-question MCQ assessment.'
  },
  {
    id: 'windows-server',
    title: 'Windows Server: Active Directory & GPO',
    subtitle: 'AD DS Architecture, Domains, Forests, DCs, Group Policies & Kerberos Authentication',
    badge: 'TOPIC 12',
    icon: 'Server',
    notes: 'Comprehensive enterprise module covering Active Directory Domain Services (AD DS), Domains, Trees, Multi-Domain Forests, Domain Controllers, Group Policy Objects (GPO / LSDOU), Kerberos vs NTLM authentication, and hands-on administrative toolkits.'
  },
  {
    id: 'linux-fundamentals',
    title: 'Linux Fundamentals',
    subtitle: 'Linux Architecture (Application, Shell, Kernel, Hardware), FHS Tree, Permissions, Flags & Operators',
    badge: 'TOPIC 13',
    icon: 'Terminal',
    notes: 'Covers the 4-layer Linux Architecture (Application, Shell, Kernel, Hardware), User Space vs Kernel Space (Ring 3 vs Ring 0), Filesystem Hierarchy (FHS), permissions (chmod/SUID), command flags, and shell operators.'
  },
  {
    id: 'linux-admin',
    title: 'Linux Administration & Pentesting Commands',
    subtitle: 'Sensitive Files (/etc/passwd, shadow, sudoers), Text Editors (Vim vs Nano) & Pentest Toolkit',
    badge: 'TOPIC 14',
    icon: 'Terminal',
    notes: 'Break down the structure of /etc/passwd and /etc/shadow. Compare Vim modes (Normal, Insert, Command) against Nano. Walk through essential pentest commands: user recon (id, sudo -l), network discovery (ip a, ss -tulpn), searching for SUID binaries (find -perm -u=s), and catching reverse shells with Netcat.'
  }
];
