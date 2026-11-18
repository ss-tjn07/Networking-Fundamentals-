import React, { useState, useEffect } from 'react';
import {
  Layers,
  Package,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Play,
  Pause,
  RotateCcw,
  Lock,
  Unlock,
  Cpu,
  Globe,
  Server,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Activity,
  FileText,
  Zap,
  ChevronRight,
  Check,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';

// ==========================================
// OSI 7-LAYER DATA DEFINITIONS
// ==========================================
const osiLayers = [
  {
    num: 7,
    name: 'Application',
    shortName: 'L7 Application',
    pdu: 'Data (User Request)',
    color: 'from-purple-500 to-indigo-600',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/50',
    badgeColor: 'bg-purple-500 text-black',
    role: 'Provides network services directly to end-user software applications (browsers, email clients, SSH terminals).',
    protocols: ['HTTP / HTTPS', 'DNS', 'SMTP', 'SSH', 'FTP', 'DHCP', 'SNMP'],
    devices: ['Application Gateways', 'Web Application Firewalls (WAF)', 'Reverse Proxies (NGINX)'],
    securityThreats: 'SQL Injection, Cross-Site Scripting (XSS), CSRF, HTTP Request Smuggling, API credential leakage.',
    sampleHeader: {
      title: 'HTTP/2 Application Header',
      fields: [
        { key: 'Method', value: 'GET' },
        { key: 'Path', value: '/secure/dashboard' },
        { key: 'Host', value: 'api.cybersec.org' },
        { key: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; x64)' },
        { key: 'Accept', value: 'application/json' }
      ]
    },
    encapsulationDesc: 'User application generates the initial plain data payload. No transport or routing headers attached yet.',
    decapsulationDesc: 'Payload is presented directly to user application process (e.g. Browser renders HTML, JSON is parsed).'
  },
  {
    num: 6,
    name: 'Presentation',
    shortName: 'L6 Presentation',
    pdu: 'Data (Formatted & Encrypted)',
    color: 'from-fuchsia-500 to-pink-600',
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-500/50',
    badgeColor: 'bg-pink-500 text-white',
    role: 'Translates data between application format and network format. Handles cryptographic encryption/decryption (TLS/SSL) and data compression.',
    protocols: ['TLS / SSL 1.3', 'ASCII / Unicode', 'JPEG / PNG', 'GZIP / Brotli', 'MIME'],
    devices: ['SSL/TLS Offloaders', 'Cryptographic Hardware Accelerators', 'Encoding Proxies'],
    securityThreats: 'Weak cipher suites (e.g. DES/RC4), SSL Stripping, Heartbleed, Malicious decompression bombs.',
    sampleHeader: {
      title: 'TLS 1.3 Record Header & Encryption',
      fields: [
        { key: 'Content Type', value: 'Application Data (23)' },
        { key: 'TLS Version', value: 'TLS 1.3 (0x0304)' },
        { key: 'Cipher Suite', value: 'TLS_AES_256_GCM_SHA384' },
        { key: 'Ciphertext', value: '0x9E 0x4B 0x7F 0x21 0xA0 0x88 0xC3...' },
        { key: 'Auth Tag', value: '16-byte Poly1305 MAC Integrity' }
      ]
    },
    encapsulationDesc: 'Data is serialized, compressed, and encrypted using modern cryptographic ciphers (e.g. TLS 1.3 AES-GCM).',
    decapsulationDesc: 'Cryptographic payload is decrypted using session keys and decoded from wire syntax to system format.'
  },
  {
    num: 5,
    name: 'Session',
    shortName: 'L5 Session',
    pdu: 'Data (Session Managed)',
    color: 'from-violet-500 to-purple-700',
    textColor: 'text-violet-400',
    bgColor: 'bg-violet-950/40',
    borderColor: 'border-violet-500/50',
    badgeColor: 'bg-violet-600 text-white',
    role: 'Establishes, maintains, synchronizes, checkpoints, and terminates long-lived conversational dialogs between two endpoints.',
    protocols: ['NetBIOS', 'RPC (Remote Procedure Call)', 'Sockets API', 'PPTP', 'SMB'],
    devices: ['Session Border Controllers (SBC)', 'Authentication Brokers', 'RPC Endpoint Mappers'],
    securityThreats: 'Session Hijacking, Session Fixation, Man-in-the-Middle (MitM) token injection, Replay attacks.',
    sampleHeader: {
      title: 'Session Dialog Token Header',
      fields: [
        { key: 'Session ID', value: '0x88FA_9901_E42B' },
        { key: 'Dialog Mode', value: 'Full-Duplex Synchronous' },
        { key: 'Sync Checkpoint', value: 'Checkpoint #14 (Stream offset 65536)' },
        { key: 'Keep-Alive', value: 'Heartbeat interval 30s' }
      ]
    },
    encapsulationDesc: 'Attaches dialogue control parameters, session authentication cookies/tokens, and synchronization checkpoints.',
    decapsulationDesc: 'Verifies session ID matches active state table; coordinates retransmission checkpoints if stream was interrupted.'
  },
  {
    num: 4,
    name: 'Transport',
    shortName: 'L4 Transport',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    color: 'from-blue-500 to-cyan-600',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/50',
    badgeColor: 'bg-blue-500 text-black',
    role: 'Provides reliable end-to-end communication, port multiplexing, flow control (sliding window), segmentation, and retransmission.',
    protocols: ['TCP (Reliable, Handshake)', 'UDP (Fast, Datagram)', 'SCTP', 'QUIC (UDP+TLS)'],
    devices: ['Layer 4 Firewalls', 'Stateful Packet Filters', 'Load Balancers (HAProxy, F5)'],
    securityThreats: 'TCP SYN Flooding (DDoS), Port Scanning (Nmap SYN scan), Sequence Number Guessing, UDP amplification.',
    sampleHeader: {
      title: 'TCP Segment Header (20 Bytes)',
      fields: [
        { key: 'Source Port', value: '52840 (Dynamic Ephemeral)' },
        { key: 'Destination Port', value: '443 (HTTPS Web Server)' },
        { key: 'Sequence Number', value: '184920401' },
        { key: 'Acknowledgment', value: '729104882' },
        { key: 'Control Flags', value: '[ACK, PSH] (Data delivery push)' },
        { key: 'Window Size', value: '64,240 Bytes (Flow Control)' },
        { key: 'Checksum', value: '0x3F8A (Payload verification)' }
      ]
    },
    encapsulationDesc: 'Chunks application stream into segments, assigns source/dest ports, sequence numbers, and transport checksums.',
    decapsulationDesc: 'Reassembles segments in order using sequence numbers, validates TCP checksum, dispatches to destination port socket.'
  },
  {
    num: 3,
    name: 'Network',
    shortName: 'L3 Network',
    pdu: 'Packet / Datagram',
    color: 'from-cyan-500 to-teal-600',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/50',
    badgeColor: 'bg-cyan-400 text-black',
    role: 'Handles logical addressing (IP), path routing between disparate networks across the globe, packet fragmentation, and TTL management.',
    protocols: ['IPv4', 'IPv6', 'ICMP (Ping/Traceroute)', 'BGP', 'OSPF', 'IPsec'],
    devices: ['Routers', 'Layer 3 Multilayer Switches', 'Network Gateways'],
    securityThreats: 'IP Address Spoofing, Route Hijacking (BGP Leaks), Smurf Amplification, Ping of Death, Fragmentation attacks.',
    sampleHeader: {
      title: 'IPv4 Packet Header (20 Bytes)',
      fields: [
        { key: 'Version / IHL', value: 'IPv4 / 20 Bytes' },
        { key: 'Source IP', value: '192.168.1.104 (Local Client)' },
        { key: 'Destination IP', value: '104.21.5.88 (Cloudflare CDN)' },
        { key: 'Time-to-Live (TTL)', value: '64 Hops (Loop prevention)' },
        { key: 'Protocol ID', value: '0x06 (TCP Transport)' },
        { key: 'Header Checksum', value: '0x8C12' }
      ]
    },
    encapsulationDesc: 'Prepends IP header with logical source/destination IP addresses, sets TTL, and routes towards next-hop gateway.',
    decapsulationDesc: 'Verifies destination IP matches host or router interface, decrements TTL, strips IP header, passes payload up.'
  },
  {
    num: 2,
    name: 'Data Link',
    shortName: 'L2 Data Link',
    pdu: 'Frame',
    color: 'from-emerald-500 to-green-600',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/50',
    badgeColor: 'bg-emerald-400 text-black',
    role: 'Provides node-to-node framing across local physical links, hardware MAC addressing, and frame check sequence (FCS/CRC) error detection.',
    protocols: ['Ethernet (IEEE 802.3)', 'Wi-Fi (IEEE 802.11)', 'ARP (Address Resolution)', 'PPP', 'VLAN (802.1Q)'],
    devices: ['Network Switches (Layer 2)', 'Network Interface Cards (NIC)', 'Wireless Access Points (WAP)', 'Bridges'],
    securityThreats: 'ARP Spoofing/Poisoning, MAC Address Flooding (CAM Table Overflow), VLAN Hopping, STP Root Bridge Hijacking.',
    sampleHeader: {
      title: 'Ethernet II Frame Header + CRC Trailer',
      fields: [
        { key: 'Preamble + SFD', value: '7 Bytes (10101010) + 1 Byte (10101011)' },
        { key: 'Destination MAC', value: 'A4:83:E7:22:11:00 (Gateway Router NIC)' },
        { key: 'Source MAC', value: '00:1A:2B:3C:4D:5E (Client Local NIC)' },
        { key: 'EtherType', value: '0x0800 (Carrying IPv4 Packet)' },
        { key: 'Trailer FCS / CRC32', value: '0xD4A29B81 (Cyclic Redundancy Check)' }
      ]
    },
    encapsulationDesc: 'Wraps packet inside a Frame. Prepends physical MAC addresses and appends a CRC-32 trailer to detect bit corruption.',
    decapsulationDesc: 'Recalculates CRC-32 checksum. If corrupted, drops frame silently; if valid, strips MAC header/trailer and forwards up.'
  },
  {
    num: 1,
    name: 'Physical',
    shortName: 'L1 Physical',
    pdu: 'Bits (Raw Binary Pulses)',
    color: 'from-amber-500 to-yellow-600',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/50',
    badgeColor: 'bg-amber-400 text-black',
    role: 'Converts digital frames into raw physical electrical voltages, optical light flashes, or RF radio waves across the physical transmission medium.',
    protocols: ['Manchester Encoding', 'NRZ / PAM-4', '1000BASE-T', '10GBASE-LR', '802.11 RF Frequencies'],
    devices: ['Network Hubs', 'Repeaters', 'Cables (Cat6/Fiber)', 'RJ-45 Connectors', 'SFP Transceivers', 'Modems'],
    securityThreats: 'Physical Wiretapping, Optical Fiber macrobending taps, RF Jamming / DoS, Physical cable destruction.',
    sampleHeader: {
      title: 'Physical Layer Signal Specification',
      fields: [
        { key: 'Medium Type', value: 'Cat6 UTP Copper Cable / 1000BASE-T' },
        { key: 'Signaling Technique', value: 'PAM-5 (Pulse Amplitude Modulation 5-level)' },
        { key: 'Clock Frequency', value: '125 MHz across 4 twisted pairs' },
        { key: 'Bitstream Stream', value: '01001000 01100101 01111000 00100000 01010011...' }
      ]
    },
    encapsulationDesc: 'Frame bits are encoded into electrical voltage pulses or optical laser flashes and emitted onto the transmission medium.',
    decapsulationDesc: 'Transceiver samples physical line voltage/light pulses, performs clock recovery, and reconstitutes raw bitstream.'
  }
];

// Sample payloads user can choose from
const samplePayloads = [
  {
    id: 'web',
    name: 'Secure Web Request (HTTPS)',
    icon: Globe,
    desc: 'Browser fetching encrypted dashboard HTML/JSON',
    raw: 'GET /api/v2/user/profile HTTP/1.1\\r\\nHost: secure.corp.net\\r\\nAuthorization: Bearer sec_tok_9918a',
    encrypted: '[TLS 1.3 AES-256 Ciphertext: 8e4a7c29b4f01d83ae99cc40fa1e...]'
  },
  {
    id: 'email',
    name: 'Encrypted SMTP Email',
    icon: FileText,
    desc: 'Confidential corporate alert being dispatched',
    raw: 'MAIL FROM:<admin@cybersec.org>\\r\\nRCPT TO:<ciso@defense.gov>\\r\\nSubject: Threat Alert #4920',
    encrypted: '[TLS 1.3 AES-256 Ciphertext: 3f19ab0044efc8910248ad6319bc...]'
  },
  {
    id: 'payment',
    name: 'Banking API Transaction',
    icon: ShieldCheck,
    desc: 'PCI-DSS compliant financial settlement request',
    raw: 'POST /v1/settlements HTTP/1.1\\r\\n{"account": "ACC-89104", "amount": 14500.00, "currency": "USD"}',
    encrypted: '[TLS 1.3 AES-256 Ciphertext: 7a884cd9103e22ffbb0091ca3490...]'
  }
];

// TCP/IP 4-Layer definitions
const tcpipLayers = [
  {
    num: 4,
    name: 'Application',
    osiSpan: 'Maps to OSI Layers 7, 6 & 5',
    pdu: 'Application Message / Data',
    color: 'border-purple-500 bg-purple-950/40 text-purple-300',
    protocols: ['HTTP / HTTPS', 'DNS', 'SSH', 'SMTP', 'DHCP', 'FTP', 'Telnet'],
    desc: 'Combines all application, presentation syntax formatting, encryption, and session conversation state into application software space.'
  },
  {
    num: 3,
    name: 'Transport',
    osiSpan: 'Maps to OSI Layer 4',
    pdu: 'TCP Segment / UDP Datagram',
    color: 'border-blue-500 bg-blue-950/40 text-blue-300',
    protocols: ['TCP (Transmission Control Protocol)', 'UDP (User Datagram Protocol)', 'SCTP', 'QUIC'],
    desc: 'Provides host-to-host process multiplexing via Port numbers, connection handshakes, flow control, and end-to-end reliability.'
  },
  {
    num: 2,
    name: 'Internet',
    osiSpan: 'Maps to OSI Layer 3',
    pdu: 'IP Datagram / Packet',
    color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
    protocols: ['IPv4', 'IPv6', 'ICMP (Internet Control Message Protocol)', 'ARP', 'IPsec', 'IGMP'],
    desc: 'Handles global routing, logical packet addressing across networks, packet fragmentation, and path determination.'
  },
  {
    num: 1,
    name: 'Network Access (Link)',
    osiSpan: 'Maps to OSI Layers 2 & 1',
    pdu: 'Ethernet Frame & Physical Bits',
    color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
    protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'PPP', 'MAC Addressing', 'Fiber / Copper physical media'],
    desc: 'Combines local hardware MAC framing, collision avoidance, and raw physical bit transmission over copper, fiber, or radio.'
  }
];

export default function OsiTcpTopic() {
  // Main view tab: 'osi' | 'tcpip' | 'comparison'
  const [activeTab, setActiveTab] = useState('osi');

  // OSI Simulation State
  const [simDirection, setSimDirection] = useState('encapsulation'); // 'encapsulation' (7->1) or 'decapsulation' (1->7)
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 to 6
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPayloadId, setSelectedPayloadId] = useState('web');
  const [inspectedLayerNum, setInspectedLayerNum] = useState(7);

  // TCP/IP Simulator State
  const [tcpMode, setTcpMode] = useState('tcp'); // 'tcp' or 'udp'
  const [handshakeStep, setHandshakeStep] = useState(0); // 0: Closed, 1: SYN, 2: SYN-ACK, 3: ACK, 4: Established/Data

  // Comparison State
  const [hoveredOsiLayer, setHoveredOsiLayer] = useState(null);
  const [hoveredTcpLayer, setHoveredTcpLayer] = useState(null);

  // Active payload
  const currentPayload = samplePayloads.find((p) => p.id === selectedPayloadId) || samplePayloads[0];

  // Auto-play timer for OSI simulation
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return 6;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Determine which OSI layer is currently active in simulation
  // Encapsulation: step 0 = Layer 7, step 1 = Layer 6, ..., step 6 = Layer 1
  // Decapsulation: step 0 = Layer 1, step 1 = Layer 2, ..., step 6 = Layer 7
  const activeSimLayerNum = simDirection === 'encapsulation' ? 7 - currentStepIndex : 1 + currentStepIndex;

  // Keep inspected layer updated with simulation unless manually clicked
  useEffect(() => {
    setInspectedLayerNum(activeSimLayerNum);
  }, [activeSimLayerNum]);

  // Handle changing simulation direction
  const handleDirectionChange = (newDir) => {
    setSimDirection(newDir);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < 6) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleJumpToLayer = (layerNum) => {
    setIsPlaying(false);
    if (simDirection === 'encapsulation') {
      setCurrentStepIndex(7 - layerNum);
    } else {
      setCurrentStepIndex(layerNum - 1);
    }
    setInspectedLayerNum(layerNum);
  };

  const activeInspectedLayer = osiLayers.find((l) => l.num === inspectedLayerNum) || osiLayers[0];

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* TOP VIEW MODE SWITCHER */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('osi')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'osi'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-300" />
              <span>OSI 7-Layer Reference Model</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-purple-200 uppercase font-semibold">
                Dedicated Simulation
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tcpip')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'tcpip'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/40 ring-1 ring-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-300" />
              <span>TCP/IP 4-Layer Internet Suite</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-cyan-200 uppercase font-semibold">
                Architecture & Handshake
              </span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-300" />
              <span>Side-by-Side Model Comparison</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-emerald-200 uppercase font-semibold">
                Cross-Layer Mapping
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 px-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>TOPIC 06: ARCHITECTURE & PACKET DISSECTOR</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: DEDICATED OSI 7-LAYER MODEL & SIMULATION */}
      {/* ============================================================ */}
      {activeTab === 'osi' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Simulation Header & Control Dashboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-inner">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      OSI 7-Layer Protocol Simulation Studio
                      <span className="text-[10px] font-mono uppercase bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700/60">
                        {simDirection === 'encapsulation' ? 'Sender TX: L7 → L1' : 'Receiver RX: L1 → L7'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {simDirection === 'encapsulation'
                        ? 'Simulate data moving DOWN the 7-layer stack, prepending protocol headers and CRC trailers.'
                        : 'Simulate data moving UP the 7-layer stack, validating checksums and stripping headers.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode Toggle & Control Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Direction Mode Toggle */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => handleDirectionChange('encapsulation')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      simDirection === 'encapsulation'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Encapsulation (TX)</span>
                  </button>
                  <button
                    onClick={() => handleDirectionChange('decapsulation')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      simDirection === 'decapsulation'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Decapsulation (RX)</span>
                  </button>
                </div>

                {/* Play / Step / Reset controls */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-600 text-black hover:bg-amber-500'
                        : 'bg-cyan-600 text-black hover:bg-cyan-500'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                  </button>

                  <button
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:hover:bg-slate-800 cursor-pointer transition"
                    title="Previous Layer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextStep}
                    disabled={currentStepIndex === 6}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:hover:bg-slate-800 cursor-pointer transition"
                    title="Next Layer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition"
                    title="Reset Simulation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Payload Selector Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-300">Choose Application Payload:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {samplePayloads.map((payload) => {
                  const Icon = payload.icon;
                  const isSelected = selectedPayloadId === payload.id;
                  return (
                    <button
                      key={payload.id}
                      onClick={() => setSelectedPayloadId(payload.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left border transition cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/60 text-white ring-1 ring-purple-400'
                          : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-purple-300' : 'text-slate-500'}`} />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{payload.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{payload.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main 2-Column Simulation Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 Cols): The 7-Layer Interactive Stack */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">OSI 7-Layer Architecture Stack</h3>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/50">
                    CLICK ANY LAYER
                  </span>
                </div>

                {/* Direction flow banner */}
                <div className="my-3 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Current Flow Direction:</span>
                  <span
                    className={`flex items-center gap-1.5 font-bold ${
                      simDirection === 'encapsulation' ? 'text-purple-400' : 'text-emerald-400'
                    }`}
                  >
                    {simDirection === 'encapsulation' ? (
                      <>
                        <span>L7 (Top) &darr; L1 (Bottom)</span>
                        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                      </>
                    ) : (
                      <>
                        <span>L1 (Bottom) &uarr; L7 (Top)</span>
                        <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
                      </>
                    )}
                  </span>
                </div>

                {/* 7 Vertical Stack Cards */}
                <div className="space-y-2 mt-2">
                  {osiLayers.map((layer) => {
                    const isCurrentSimLayer = activeSimLayerNum === layer.num;
                    const isInspected = inspectedLayerNum === layer.num;

                    // Compute whether layer is already processed, processing now, or pending
                    let stageStatus = 'pending';
                    if (simDirection === 'encapsulation') {
                      if (layer.num > activeSimLayerNum) stageStatus = 'processed';
                      else if (layer.num === activeSimLayerNum) stageStatus = 'active';
                      else stageStatus = 'pending';
                    } else {
                      if (layer.num < activeSimLayerNum) stageStatus = 'processed';
                      else if (layer.num === activeSimLayerNum) stageStatus = 'active';
                      else stageStatus = 'pending';
                    }

                    return (
                      <div
                        key={layer.num}
                        onClick={() => handleJumpToLayer(layer.num)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                          isCurrentSimLayer
                            ? 'border-purple-400 bg-purple-900/40 ring-2 ring-purple-400/80 shadow-lg shadow-purple-950'
                            : isInspected
                            ? 'border-slate-600 bg-slate-800/50'
                            : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 hover:border-slate-700'
                        }`}
                      >
                        {/* Glow indicator if active */}
                        {isCurrentSimLayer && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-400 to-cyan-400"></div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shadow-md ${layer.badgeColor}`}
                            >
                              L{layer.num}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-white">{layer.name}</span>
                                {isCurrentSimLayer && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500 text-black font-extrabold animate-pulse">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-mono text-slate-400 block">
                                PDU: <strong className={layer.textColor}>{layer.pdu}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                                stageStatus === 'active'
                                  ? 'bg-purple-950 text-purple-300 border-purple-700 animate-pulse'
                                  : stageStatus === 'processed'
                                  ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                                  : 'bg-slate-900 text-slate-500 border-slate-800'
                              }`}
                            >
                              {stageStatus === 'active' ? '● In Progress' : stageStatus === 'processed' ? '✓ Processed' : '○ Queued'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Memory Mnemonics Box */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="text-[11px] font-mono text-purple-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OSI LAYER MNEMONICS FOR EXAMS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                    <span className="text-emerald-400 font-bold font-mono block">Bottom &rarr; Top (1 to 7):</span>
                    <span className="italic">"<strong>P</strong>lease <strong>D</strong>o <strong>N</strong>ot <strong>T</strong>hrow <strong>S</strong>ausage <strong>P</strong>izza <strong>A</strong>way"</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                    <span className="text-purple-400 font-bold font-mono block">Top &rarr; Bottom (7 to 1):</span>
                    <span className="italic">"<strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Live Packet Visualizer & Protocol Dissector */}
            <div className="lg:col-span-7 space-y-6">
              {/* Dynamic PDU Visualizer Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Live Protocol Data Unit (PDU) Dissector</h3>
                      <p className="text-[11px] text-slate-400">
                        {simDirection === 'encapsulation'
                          ? 'Visualizing header encapsulation as data moves down to the physical wire.'
                          : 'Visualizing header decapsulation and checksum stripping as data moves up to the host app.'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                      STEP {currentStepIndex + 1} OF 7
                    </span>
                  </div>
                </div>

                {/* Packet Construction Canvas */}
                <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[170px]">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>
                      ACTIVE STATE: {osiLayers.find((l) => l.num === activeSimLayerNum)?.shortName.toUpperCase()}
                    </span>
                  </div>

                  {/* Dynamic Visual Packet Bar */}
                  <div className="w-full overflow-x-auto p-3 flex items-center justify-center">
                    {/* Render different header packages based on activeSimLayerNum */}
                    {activeSimLayerNum === 1 ? (
                      // Physical Layer: Raw Bits
                      <div className="w-full max-w-lg p-4 rounded-xl bg-amber-500/10 border-2 border-amber-400/80 text-center space-y-2 animate-pulse">
                        <div className="flex items-center justify-center gap-2 text-amber-400 font-mono font-bold text-xs">
                          <Radio className="w-4 h-4 animate-spin" />
                          <span>PHYSICAL TRANSMISSION MEDIUM (WIRE / FIBER / RADIO FREQUENCY)</span>
                        </div>
                        <div className="font-mono text-amber-300 font-black tracking-widest text-xs break-all bg-black/60 p-2.5 rounded border border-amber-500/40">
                          01001000 01100101 01111000 00100000 01010011 01100101 01100011 01110101 01110010 01100101 00100001
                        </div>
                        <p className="text-[10px] text-amber-200/70">
                          Electrical voltage changes (Cat6 copper), photon laser flashes (fiber), or RF modulation (802.11 Wi-Fi).
                        </p>
                      </div>
                    ) : (
                      // Encapsulated Frames / Packets / Segments / Data
                      <div className="flex items-stretch shadow-2xl rounded-xl overflow-hidden border border-slate-700 text-xs font-mono font-bold">
                        {/* Layer 2 MAC Header (Shown if activeSimLayerNum <= 2) */}
                        {activeSimLayerNum <= 2 && (
                          <div className="px-3 py-3 bg-emerald-500 text-black flex flex-col items-center justify-center border-r border-black/40 animate-slideIn">
                            <span className="text-[9px] uppercase tracking-tighter text-emerald-950 font-black">L2 Frame</span>
                            <span>MAC Hdr</span>
                            <span className="text-[9px] font-normal opacity-80">14 Bytes</span>
                          </div>
                        )}

                        {/* Layer 3 IP Header (Shown if activeSimLayerNum <= 3) */}
                        {activeSimLayerNum <= 3 && (
                          <div className="px-3 py-3 bg-cyan-400 text-black flex flex-col items-center justify-center border-r border-black/40 animate-slideIn">
                            <span className="text-[9px] uppercase tracking-tighter text-cyan-950 font-black">L3 Packet</span>
                            <span>IP Hdr</span>
                            <span className="text-[9px] font-normal opacity-80">20 Bytes</span>
                          </div>
                        )}

                        {/* Layer 4 TCP Header (Shown if activeSimLayerNum <= 4) */}
                        {activeSimLayerNum <= 4 && (
                          <div className="px-3 py-3 bg-blue-500 text-black flex flex-col items-center justify-center border-r border-black/40 animate-slideIn">
                            <span className="text-[9px] uppercase tracking-tighter text-blue-950 font-black">L4 Segment</span>
                            <span>TCP Hdr</span>
                            <span className="text-[9px] font-normal opacity-80">20 Bytes</span>
                          </div>
                        )}

                        {/* Layer 5 Session Token (Shown if activeSimLayerNum <= 5) */}
                        {activeSimLayerNum <= 5 && (
                          <div className="px-2.5 py-3 bg-violet-500 text-white flex flex-col items-center justify-center border-r border-black/40 animate-slideIn">
                            <span className="text-[9px] uppercase tracking-tighter text-violet-200 font-black">L5 Session</span>
                            <span>Token</span>
                            <span className="text-[9px] font-normal opacity-80">Sync ID</span>
                          </div>
                        )}

                        {/* Layer 6 Presentation Encryption Envelope (Shown if activeSimLayerNum <= 6) */}
                        {activeSimLayerNum <= 6 && (
                          <div className="px-3 py-3 bg-pink-600 text-white flex flex-col items-center justify-center border-r border-black/40 animate-slideIn">
                            <span className="text-[9px] uppercase tracking-tighter text-pink-200 font-black">L6 TLS 1.3</span>
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Encrypted
                            </span>
                            <span className="text-[9px] font-normal opacity-80">AES-GCM</span>
                          </div>
                        )}

                        {/* Layer 7 Application Data Payload (Always Present) */}
                        <div className="px-4 py-3 bg-purple-600 text-white flex flex-col items-center justify-center min-w-[150px]">
                          <span className="text-[9px] uppercase tracking-tighter text-purple-200 font-black">L7 User Data</span>
                          <span className="truncate max-w-[200px] text-center font-mono">
                            {activeSimLayerNum <= 6 ? '[Ciphertext Data]' : currentPayload.name}
                          </span>
                          <span className="text-[9px] font-normal opacity-80">Payload</span>
                        </div>

                        {/* Layer 2 CRC / FCS Trailer (Shown if activeSimLayerNum <= 2) */}
                        {activeSimLayerNum <= 2 && (
                          <div className="px-3 py-3 bg-rose-500 text-white flex flex-col items-center justify-center border-l border-black/40 animate-slideIn">
                            <span className="text-[9px] uppercase tracking-tighter text-rose-200 font-black">L2 Trailer</span>
                            <span>CRC-32</span>
                            <span className="text-[9px] font-normal opacity-80">4 Bytes</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Explanation of current simulation step */}
                  <div className="mt-3 text-center max-w-lg">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Current PDU: {osiLayers.find((l) => l.num === activeSimLayerNum)?.pdu}
                    </span>
                    <p className="text-xs text-slate-300 mt-1">
                      {simDirection === 'encapsulation'
                        ? osiLayers.find((l) => l.num === activeSimLayerNum)?.encapsulationDesc
                        : osiLayers.find((l) => l.num === activeSimLayerNum)?.decapsulationDesc}
                    </p>
                  </div>
                </div>

                {/* Live Header Field Inspector Table */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{activeInspectedLayer.sampleHeader.title}</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      Layer {activeInspectedLayer.num} Header Fields
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {activeInspectedLayer.sampleHeader.fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                      >
                        <span className="text-slate-400">{field.key}:</span>
                        <span className="font-bold text-cyan-300 text-right truncate ml-2">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Layer Deep-Dive & Cyber Security Exploits Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Layer {activeInspectedLayer.num} Deep Dive: Role, Hardware & Security Exploits
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${activeInspectedLayer.badgeColor}`}>
                    LAYER {activeInspectedLayer.num}
                  </span>
                </div>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Primary Function:
                    </span>
                    <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {activeInspectedLayer.role}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-mono uppercase text-purple-400 font-bold block mb-1">
                        Operating Protocols:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activeInspectedLayer.protocols.map((proto, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300 font-mono text-[10px]"
                          >
                            {proto}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                        Hardware & Devices:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activeInspectedLayer.devices.map((device, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-mono text-[10px]"
                          >
                            {device}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Security Threat Alert Callout */}
                  <div className="bg-rose-950/30 border border-rose-800/50 p-3 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-rose-300 font-mono">
                        CYBERSECURITY THREATS & ATTACK VECTORS AT LAYER {activeInspectedLayer.num}:
                      </span>
                      <p className="text-xs text-rose-200/90 mt-0.5">{activeInspectedLayer.securityThreats}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: DEDICATED TCP/IP 4-LAYER INTERNET MODEL */}
      {/* ============================================================ */}
      {activeTab === 'tcpip' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Architecture Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-inner">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    TCP/IP 4-Layer Internet Architecture Model
                    <span className="text-[10px] font-mono bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/60">
                      RFC 1122 STANDARD
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Designed by DARPA and the Department of Defense (DoD). The pragmatic foundation of the global internet.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Layers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {tcpipLayers.map((layer) => (
                <div
                  key={layer.num}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${layer.color} shadow-lg`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-black/40 border border-white/10">
                        LAYER {layer.num}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{layer.osiSpan}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{layer.name} Layer</h3>
                    <span className="text-xs font-mono text-cyan-300 block mt-1">PDU: {layer.pdu}</span>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{layer.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Key Protocols:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {layer.protocols.map((p, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-200"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive TCP 3-Way Handshake Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Interactive TCP 3-Way Handshake Connection Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Understand how Layer 3 (Transport) establishes a reliable stateful connection before exchanging data.
                </p>
              </div>

              {/* Handshake Stepper Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHandshakeStep(0)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setHandshakeStep((prev) => Math.min(3, prev + 1))}
                  disabled={handshakeStep === 3}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Advance Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Handshake Visual Stage */}
            <div className="my-6 p-6 rounded-xl bg-slate-950 border border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Client Node */}
                <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-500 mx-auto flex items-center justify-center text-blue-400 mb-2">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Client (Initiator)</h4>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">IP: 192.168.1.104</span>
                  <span className="text-[10px] font-mono text-slate-400 block">Port: 52840</span>

                  <div className="mt-3 py-1 px-2 rounded-lg bg-black/60 font-mono text-xs font-bold">
                    State:{' '}
                    <span
                      className={
                        handshakeStep === 0
                          ? 'text-slate-500'
                          : handshakeStep === 1
                          ? 'text-amber-400 animate-pulse'
                          : handshakeStep >= 2
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }
                    >
                      {handshakeStep === 0
                        ? 'CLOSED'
                        : handshakeStep === 1
                        ? 'SYN_SENT'
                        : handshakeStep >= 2
                        ? 'ESTABLISHED'
                        : ''}
                    </span>
                  </div>
                </div>

                {/* Handshake Message Packets in Flight */}
                <div className="md:col-span-6 space-y-3">
                  {/* Step 1: SYN */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      handshakeStep >= 1
                        ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-200'
                        : 'border-slate-800/60 bg-slate-900/30 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">1</span>
                        <span>Client &rarr; Server: SYN (Synchronize)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40">Seq = 100</span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-300">
                      "Hello Server, let's open a connection. My initial sequence number is 100."
                    </p>
                  </div>

                  {/* Step 2: SYN-ACK */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      handshakeStep >= 2
                        ? 'border-purple-500/80 bg-purple-950/40 text-purple-200'
                        : 'border-slate-800/60 bg-slate-900/30 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">2</span>
                        <span>Server &rarr; Client: SYN-ACK</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40">Seq = 300, Ack = 101</span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-300">
                      "I acknowledge your seq 100 (+1 = 101). My sequence number is 300. Ready!"
                    </p>
                  </div>

                  {/* Step 3: ACK */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      handshakeStep >= 3
                        ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800/60 bg-slate-900/30 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px]">3</span>
                        <span>Client &rarr; Server: ACK (Acknowledge)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40">Seq = 101, Ack = 301</span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-300">
                      "Got your seq 300 (+1 = 301). Connection is now live, transmitting payload!"
                    </p>
                  </div>
                </div>

                {/* Server Node */}
                <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500 mx-auto flex items-center justify-center text-purple-400 mb-2">
                    <Server className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Server (Listener)</h4>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">IP: 104.21.5.88</span>
                  <span className="text-[10px] font-mono text-slate-400 block">Port: 443 (HTTPS)</span>

                  <div className="mt-3 py-1 px-2 rounded-lg bg-black/60 font-mono text-xs font-bold">
                    State:{' '}
                    <span
                      className={
                        handshakeStep === 0
                          ? 'text-slate-400'
                          : handshakeStep === 1
                          ? 'text-amber-400 animate-pulse'
                          : handshakeStep >= 3
                          ? 'text-emerald-400'
                          : 'text-purple-400'
                      }
                    >
                      {handshakeStep === 0
                        ? 'LISTEN'
                        : handshakeStep === 1
                        ? 'SYN_RCVD'
                        : handshakeStep === 2
                        ? 'SYN_RCVD'
                        : 'ESTABLISHED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TCP vs UDP Comparison Matrix */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  TCP vs UDP: The Transport Layer Showdown
                </h4>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setTcpMode('tcp')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      tcpMode === 'tcp' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    TCP (Reliable)
                  </button>
                  <button
                    onClick={() => setTcpMode('udp')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      tcpMode === 'udp' ? 'bg-amber-600 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    UDP (Low Latency)
                  </button>
                </div>
              </div>

              {tcpMode === 'tcp' ? (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-blue-300 font-mono block mb-1">Connection-Oriented</span>
                    <p className="text-slate-300">
                      Requires full 3-Way Handshake before sending data. Guarantees packet delivery, sequencing, and flow control.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-blue-300 font-mono block mb-1">Header Overhead</span>
                    <p className="text-slate-300">
                      20 to 60 Bytes per segment (Sequence #, Ack #, Window size, Checksum, Flags).
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-blue-300 font-mono block mb-1">Real-World Protocols</span>
                    <p className="text-slate-300">
                      HTTP/HTTPS (Web), SSH (Shell), SMTP (Email), FTP (File transfer), MySQL.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-amber-300 font-mono block mb-1">Connectionless (Fire & Forget)</span>
                    <p className="text-slate-300">
                      Zero handshake. No delivery guarantees, retransmissions, or ordering. Ideal for speed and live streams.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-amber-300 font-mono block mb-1">Ultra-Light Header</span>
                    <p className="text-slate-300">
                      Only 8 Bytes (Source Port, Dest Port, Length, Checksum). Extremely minimal network latency.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-amber-300 font-mono block mb-1">Real-World Protocols</span>
                    <p className="text-slate-300">
                      DNS Queries, VoIP / Zoom audio, Video Streaming (RTP), Online Multiplayer Gaming, DHCP.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: OSI vs TCP/IP COMPARISON & CROSS-MAPPING MATRIX */}
      {/* ============================================================ */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Visual Cross-Layer Mapping Tool */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Interactive Layer Mapping: OSI 7-Layer vs TCP/IP 4-Layer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hover or click any layer to observe how the theoretical OSI layers fold into practical TCP/IP layers.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                ACTIVE MAPPER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
              {/* Left Column: OSI 7 Layers */}
              <div className="md:col-span-5 space-y-2">
                <div className="text-xs font-mono uppercase text-purple-400 font-bold mb-2 flex items-center justify-between">
                  <span>OSI 7-Layer Reference Model (ISO)</span>
                  <span className="text-[10px] text-slate-500">7 LAYERS</span>
                </div>

                {osiLayers.map((layer) => {
                  const isHovered = hoveredOsiLayer === layer.num;
                  const isMapped =
                    (hoveredTcpLayer === 4 && layer.num >= 5) ||
                    (hoveredTcpLayer === 3 && layer.num === 4) ||
                    (hoveredTcpLayer === 2 && layer.num === 3) ||
                    (hoveredTcpLayer === 1 && layer.num <= 2);

                  return (
                    <div
                      key={layer.num}
                      onMouseEnter={() => setHoveredOsiLayer(layer.num)}
                      onMouseLeave={() => setHoveredOsiLayer(null)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                        isHovered || isMapped
                          ? 'border-purple-400 bg-purple-900/60 ring-2 ring-purple-400 shadow-lg scale-[1.02]'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded font-mono font-bold text-[11px] flex items-center justify-center ${layer.badgeColor}`}>
                          {layer.num}
                        </span>
                        <span className="font-bold text-slate-200">{layer.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">PDU: {layer.pdu}</span>
                    </div>
                  );
                })}
              </div>

              {/* Center Connectors */}
              <div className="md:col-span-2 hidden md:flex flex-col items-center justify-center space-y-4 text-xs font-mono text-slate-500">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <ArrowRight className="w-5 h-5 text-cyan-400 mx-auto animate-pulse" />
                  <span className="text-[10px] font-bold block mt-1 text-slate-400">Maps Into</span>
                </div>
              </div>

              {/* Right Column: TCP/IP 4 Layers */}
              <div className="md:col-span-5 space-y-3">
                <div className="text-xs font-mono uppercase text-blue-400 font-bold mb-2 flex items-center justify-between">
                  <span>TCP/IP 4-Layer Internet Suite (DARPA)</span>
                  <span className="text-[10px] text-slate-500">4 LAYERS</span>
                </div>

                {tcpipLayers.map((layer) => {
                  const isHovered = hoveredTcpLayer === layer.num;
                  const isMapped =
                    (hoveredOsiLayer && hoveredOsiLayer >= 5 && layer.num === 4) ||
                    (hoveredOsiLayer === 4 && layer.num === 3) ||
                    (hoveredOsiLayer === 3 && layer.num === 2) ||
                    (hoveredOsiLayer && hoveredOsiLayer <= 2 && layer.num === 1);

                  return (
                    <div
                      key={layer.num}
                      onMouseEnter={() => setHoveredTcpLayer(layer.num)}
                      onMouseLeave={() => setHoveredTcpLayer(null)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        isHovered || isMapped
                          ? 'border-cyan-400 bg-cyan-900/60 ring-2 ring-cyan-400 shadow-lg scale-[1.02]'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">
                          Layer {layer.num}: {layer.name}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold">
                          {layer.osiSpan}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">{layer.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deep Architectural Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Structural Comparison Matrix: OSI vs TCP/IP
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">DIMENSION</th>
                    <th className="py-2.5 px-3 text-purple-400">OSI 7-LAYER MODEL</th>
                    <th className="py-2.5 px-3 text-cyan-400">TCP/IP 4-LAYER SUITE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-white">Origin & Creator</td>
                    <td className="py-3 px-3">International Organization for Standardization (ISO) in 1984</td>
                    <td className="py-3 px-3">DARPA / United States Department of Defense (DoD) in 1970s</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-white">Nature of Model</td>
                    <td className="py-3 px-3">Theoretical reference model; never fully implemented as a commercial stack</td>
                    <td className="py-3 px-3">Practical, operational protocol stack powering 100% of the world's internet</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-white">Layer Count</td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-300">7 Distinct Layers</td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-300">4 Practical Layers</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-white">Session & Presentation</td>
                    <td className="py-3 px-3">Strictly partitioned into independent layers (L5 and L6)</td>
                    <td className="py-3 px-3">Folded directly into user-space Application protocols (HTTP/TLS)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-white">Transport Reliability</td>
                    <td className="py-3 px-3">Only connection-oriented reliable communication</td>
                    <td className="py-3 px-3">Supports both reliable (TCP) and fast connectionless (UDP)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-white">Network Layer (L3)</td>
                    <td className="py-3 px-3">Supports both connectionless (CLNS) and connection-oriented (CONS)</td>
                    <td className="py-3 px-3">Purely connectionless (IP handles packet delivery independently)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-white">Current Industry Role</td>
                    <td className="py-3 px-3">The gold standard for cybersecurity certifications, troubleshooting, and teaching</td>
                    <td className="py-3 px-3">The actual software and kernel implementation executed on your device</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
