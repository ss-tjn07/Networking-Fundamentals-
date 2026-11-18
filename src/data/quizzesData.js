export const topicQuizzes = {
  0: {
    q: "Which architectural network model treats every computing node as both a service consumer AND a service provider?",
    options: ["Client-Server Model", "Peer-to-Peer (P2P)", "Master-Worker Hierarchy", "Token Ring"],
    correct: 1,
    explanation: "In Peer-to-Peer (P2P) systems (like BitTorrent or Bitcoin), every peer node can act as both a client and a server simultaneously."
  },
  1: {
    q: "A network device receives a frame and blindly broadcasts it out of ALL its other ports. What device is this?",
    options: ["Layer 2 Switch", "Hardware Router", "Hub (Layer 1)", "Modem"],
    correct: 2,
    explanation: "Hubs operate at Layer 1 and lack MAC learning capability, blindly repeating signals to all connected ports and creating a single shared collision domain."
  },
  2: {
    q: "Which Ethernet cable wiring arrangement is required to connect two like devices directly (e.g., PC to PC or Switch to Switch) without Auto-MDIX by crossing Transmit and Receive pairs?",
    options: ["Straight-Through Cable (T568B to T568B)", "Rollover / Console Cable", "Crossover Cable (T568A to T568B)", "Single-Mode Fiber Cable"],
    correct: 2,
    explanation: "A Crossover Cable wires one end as T568A and the opposite end as T568B, crossing Pins 1 & 2 (Transmit) with Pins 3 & 6 (Receive) so the two devices' TX and RX pairs match up directly."
  },
  3: {
    q: "What is the typical geographic span of a Metropolitan Area Network (MAN)?",
    options: ["Under 10 meters", "Inside one room", "An entire city or large campus (5 - 50 km)", "Intercontinental oceans"],
    correct: 2,
    explanation: "MANs span citywide areas (5 to 50 km), such as cable TV networks, municipal fiber loops, or interconnected university campuses."
  },
  4: {
    q: "In which network topology does a single severed link in the main backbone bring down communication for ALL connected nodes?",
    options: ["Full Mesh", "Star Topology", "Bus Topology", "Dual Tree"],
    correct: 2,
    explanation: "Bus topology relies on one central backbone cable with terminators at both ends. Any cut in that backbone disrupts the entire circuit."
  },
  5: {
    q: "At which OSI Layer do IP addresses exist and path routing take place?",
    options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
    correct: 1,
    explanation: "Layer 3 (Network Layer) is home to IP addressing, subnets, routers, and logical path determination."
  },
  6: {
    q: "How many total addressable bits make up a standard IPv6 address?",
    options: ["32 bits", "64 bits", "128 bits", "256 bits"],
    correct: 2,
    explanation: "IPv6 uses 128-bit addresses (yielding ~3.4 x 10^38 addresses) compared to IPv4's 32-bit limit (~4.29 billion)."
  },
  7: {
    q: "What is the correct chronological sequence of the DHCP DORA process?",
    options: [
      "Discover → Offer → Request → Acknowledge",
      "Deliver → Obtain → Release → Allocate",
      "Direct → Open → Route → Authorize",
      "Discover → Request → Offer → Acknowledge"
    ],
    correct: 0,
    explanation: "The DHCP sequence is Discover (broadcast search), Offer (server proposed IP), Request (client accepts), and Acknowledge (server locks lease)."
  },
  8: {
    q: "What is the default subnet mask for a standard Class B IPv4 network address?",
    options: ["255.0.0.0 (/8)", "255.255.0.0 (/16)", "255.255.255.0 (/24)", "255.255.255.255 (/32)"],
    correct: 1,
    explanation: "Class B default mask is 255.255.0.0 (/16), dividing the 32 bits into 16 network bits and 16 host bits (supporting 65,534 usable hosts)."
  },
  9: {
    q: "Which well-known port is reserved for secure HTTPS web traffic?",
    options: ["Port 21", "Port 22", "Port 80", "Port 443"],
    correct: 3,
    explanation: "Port 443 is universally dedicated to encrypted HTTPS (HTTP over TLS/SSL), whereas Port 80 is unencrypted HTTP."
  },
  10: {
    q: "When a user accesses a shared folder over the network where the Share Permission is configured as 'Full Control' but the underlying NTFS Permission is 'Read-Only', what is the user's effective permission?",
    options: ["Full Control", "Read-Only (Most restrictive wins)", "Write-Only", "Access Denied"],
    correct: 1,
    explanation: "When accessing files across the network, Windows evaluates both Share and NTFS permissions, and the most restrictive permission always wins (Read-Only)."
  },
  11: {
    q: "In Windows Active Directory, which authentication protocol relies on Ticket Granting Tickets (TGTs) issued by the Key Distribution Center (KDC) on port 88 to authenticate users without sending password hashes across the wire?",
    options: ["NTLMv2", "Kerberos", "RADIUS", "LDAP Simple Bind"],
    correct: 1,
    explanation: "Kerberos uses mutual ticket-based authentication where the client obtains a TGT from the KDC Authentication Service (AS) and uses it to request Service Tickets without transmitting password hashes."
  },
  12: {
    q: "Which special Linux file permission bit allows an executable binary to run with the privileges of the file OWNER (such as root) rather than the user launching it?",
    options: ["Sticky Bit (1000)", "SGID (2000)", "SUID - Set User ID (4000)", "ACL Mask"],
    correct: 2,
    explanation: "The SUID (Set User ID) bit (octal 4000) causes an executable (like /usr/bin/passwd) to run with the privileges of its owner (root), making misconfigured SUID binaries a major privilege escalation vector."
  },
  13: {
    q: "Which sensitive Linux system file contains cryptographic salted password hashes and is readable strictly by superuser root (permissions 0600)?",
    options: ["/etc/passwd", "/etc/shadow", "/etc/sudoers", "/var/log/auth.log"],
    correct: 1,
    explanation: "/etc/shadow stores salted password hashes (e.g. SHA-512) and password expiration parameters, accessible only by root to protect against offline dictionary and rainbow table cracking."
  }
};
