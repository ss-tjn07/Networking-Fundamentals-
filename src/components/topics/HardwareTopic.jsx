import React, { useState } from 'react';
import {
  CreditCard,
  Radio,
  Boxes,
  Compass,
  Activity,
  Cpu,
  Play,
  RotateCw,
  Eye,
  Info,
  CheckCircle2
} from 'lucide-react';

const hardwareList = [
  {
    id: 'nic',
    title: 'NIC (Network Card)',
    layer: 'LAYER 1 & 2',
    layerBadgeClass: 'text-cyan-400 bg-cyan-950 border-cyan-800/60',
    borderColor: 'border-slate-800 hover:border-cyan-500/60',
    accentColor: 'text-cyan-400',
    activeGlow: 'shadow-cyan-500/20',
    icon: CreditCard,
    frontDesc: 'Hardware component connecting a PC to the physical network medium.',
    codeNote: 'Hardcoded 48-bit MAC address: 00:1A:2B:3C:4D:5E',
    image: '/images/nic.jpg',
    deviceType: 'PCIe Gigabit Ethernet Adapter',
    specs: [
      { label: 'Bus Interface', val: 'PCIe 3.0 x1 / x4 Slot' },
      { label: 'Physical Port', val: 'RJ-45 8P8C Connector' },
      { label: 'Speed Ratings', val: '1 Gbps / 2.5 Gbps / 10 GbE' },
      { label: 'LED Indicators', val: 'Green (Link) & Amber (Activity)' }
    ]
  },
  {
    id: 'hub',
    title: 'Network Hub',
    layer: 'LAYER 1 (PHYSICAL)',
    layerBadgeClass: 'text-amber-400 bg-amber-950 border-amber-800/60',
    borderColor: 'border-slate-800 hover:border-amber-500/60',
    accentColor: 'text-amber-400',
    activeGlow: 'shadow-amber-500/20',
    icon: Radio,
    frontDesc: 'Dumb repeater. Blindly broadcasts incoming packets out of ALL other ports.',
    codeNote: '1 Collision Domain · High collision risk & low security',
    image: '/images/hub.jpg',
    deviceType: 'Legacy Multiport Repeater',
    specs: [
      { label: 'Port Density', val: '4 to 16 × RJ-45 Fast Ethernet' },
      { label: 'Transmission', val: 'Half-Duplex (CSMA/CD)' },
      { label: 'Collision LED', val: 'Flashes amber during packet collisions' },
      { label: 'Architecture', val: 'Shared Electrical Bus Medium' }
    ]
  },
  {
    id: 'switch',
    title: 'Network Switch',
    layer: 'LAYER 2 (DATA LINK)',
    layerBadgeClass: 'text-purple-400 bg-purple-950 border-purple-800/60',
    borderColor: 'border-slate-800 hover:border-purple-500/60',
    accentColor: 'text-purple-400',
    activeGlow: 'shadow-purple-500/20',
    icon: Boxes,
    frontDesc: 'Intelligent bridge. Builds a dynamic MAC Table to forward frames only to destination port.',
    codeNote: 'Splits Collision Domains · Unicast micro-segmentation',
    image: '/images/switch.jpg',
    deviceType: '16/24-Port Managed Gigabit Switch',
    specs: [
      { label: 'Forwarding', val: 'Hardware ASIC Wire-Speed' },
      { label: 'Transmission', val: 'Full-Duplex (Simultaneous TX/RX)' },
      { label: 'MAC Memory', val: 'Dynamic CAM Table (8K-16K entries)' },
      { label: 'Uplink Ports', val: '2 × 10G SFP+ Optical Fiber Slots' }
    ]
  },
  {
    id: 'router',
    title: 'Router',
    layer: 'LAYER 3 (NETWORK)',
    layerBadgeClass: 'text-emerald-400 bg-emerald-950 border-emerald-800/60',
    borderColor: 'border-slate-800 hover:border-emerald-500/60',
    accentColor: 'text-emerald-400',
    activeGlow: 'shadow-emerald-500/20',
    icon: Compass,
    frontDesc: 'Inspects destination IP addresses to route packets between different subnets/WANs.',
    codeNote: 'Breaks Broadcast Domains · Determines Best Path (OSPF/BGP)',
    image: '/images/router.jpg',
    deviceType: 'Enterprise Gateway & Wi-Fi 6 Router',
    specs: [
      { label: 'WAN Port', val: '1 × 2.5 Gbps Ethernet (Blue Jack)' },
      { label: 'LAN Ports', val: '4 × Gigabit Switch Ports' },
      { label: 'Wireless', val: 'Dual-Band 2.4GHz & 5GHz (4 Antennas)' },
      { label: 'Services', val: 'NAT Engine, Firewall, DHCP Server' }
    ]
  },
  {
    id: 'modem',
    title: 'Modem (MO-DEM)',
    layer: 'SIGNAL CONVERTER',
    layerBadgeClass: 'text-rose-400 bg-rose-950 border-rose-800/60',
    borderColor: 'border-slate-800 hover:border-rose-500/60',
    accentColor: 'text-rose-400',
    activeGlow: 'shadow-rose-500/20',
    icon: Activity,
    frontDesc: 'MOdulator-DEModulator. Converts digital binary PC pulses to analog ISP waves (DSL/Fiber/Cable).',
    codeNote: 'Digital ↔ Analog Translation · Last-mile ISP bridge',
    image: '/images/modem.jpg',
    deviceType: 'Broadband DOCSIS 3.1 / Fiber ONT Gateway',
    specs: [
      { label: 'Input Signal', val: 'Coaxial Cable (F-Type) / Optical SC' },
      { label: 'Output Signal', val: 'Baseband Ethernet Digital Pulses' },
      { label: 'Standard', val: 'DOCSIS 3.1 / GPON (Gigabit Speeds)' },
      { label: 'Status LEDs', val: 'Power, Downstream, Upstream, Online' }
    ]
  }
];

export default function HardwareTopic({ setStatusMessage }) {
  const [flippedCards, setFlippedCards] = useState({});
  const [currentHwMode, setCurrentHwMode] = useState('switch');
  const [hostStates, setHostStates] = useState({
    h1: 'idle',
    h2: 'idle',
    h3: 'idle',
    h4: 'idle'
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const toggleCardFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const areAllFlipped = hardwareList.every((h) => flippedCards[h.id]);

  const toggleFlipAll = () => {
    const nextState = !areAllFlipped;
    const updated = {};
    hardwareList.forEach((h) => {
      updated[h.id] = nextState;
    });
    setFlippedCards(updated);
  };

  const handleModeChange = (mode) => {
    setCurrentHwMode(mode);
    setHostStates({ h1: 'idle', h2: 'idle', h3: 'idle', h4: 'idle' });
  };

  const triggerTransmission = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    setHostStates({
      h1: 'sending',
      h2: 'idle',
      h3: 'idle',
      h4: 'idle'
    });
    setStatusMessage(`Packet leaving Host 1 towards ${currentHwMode.toUpperCase()}...`);

    setTimeout(() => {
      if (currentHwMode === 'hub') {
        setHostStates({
          h1: 'idle',
          h2: 'flooded',
          h3: 'accepted',
          h4: 'flooded'
        });
        setStatusMessage("HUB FLOODED: Host 2 and Host 4 discarded irrelevant packet; Host 3 accepted.");
      } else if (currentHwMode === 'switch') {
        setHostStates({
          h1: 'idle',
          h2: 'idle',
          h3: 'accepted-target',
          h4: 'idle'
        });
        setStatusMessage("SWITCH UNICAST: Clean delivery to Host 3 only via Port 3 MAC mapping.");
      } else {
        setHostStates({
          h1: 'idle',
          h2: 'idle',
          h3: 'routed-target',
          h4: 'idle'
        });
        setStatusMessage("ROUTER ROUTED: Subnet traversal validated. Next hop IP delivered.");
      }
    }, 700);

    setTimeout(() => {
      setHostStates({
        h1: 'idle',
        h2: 'idle',
        h3: 'idle',
        h4: 'idle'
      });
      setIsSimulating(false);
    }, 2200);
  };

  const getExplanation = () => {
    if (currentHwMode === 'hub') {
      return (
        <>
          <strong>Mode: Hub (Repeater)</strong> — Replicates raw electrical signal to EVERY connected port. Host 2 and Host 4 receive unwanted traffic, creating security hazards and collisions.
        </>
      );
    }
    if (currentHwMode === 'switch') {
      return (
        <>
          <strong>Mode: Switch</strong> — Reads Destination MAC (CC). Forwards packet solely along Port 3. Eliminates collision domains for Host 2 & 4.
        </>
      );
    }
    return (
      <>
        <strong>Mode: Router</strong> — Decapsulates frame, verifies IP routing table, decrements TTL, re-encapsulates frame, and sends to target subnet.
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar for Hardware Cards: Title & Flip-All Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" /> Core Networking Devices
          </h3>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            (Click any card to flip and view physical hardware photo)
          </span>
        </div>
        <button
          onClick={toggleFlipAll}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/60 transition cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{areAllFlipped ? 'Flip All to Theory' : 'Flip All to Photos'}</span>
        </button>
      </div>

      {/* 3D Flip Hardware Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {hardwareList.map((hw) => {
          const isFlipped = !!flippedCards[hw.id];
          const IconComp = hw.icon;

          return (
            <div
              key={hw.id}
              className="perspective-1000 h-[370px] select-none"
            >
              <div
                className={`relative w-full h-full rounded-xl transition-transform duration-700 transform-style-3d cursor-pointer ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => toggleCardFlip(hw.id)}
              >
                {/* FRONT FACE (Theory & Concept) */}
                <div
                  className={`absolute inset-0 w-full h-full bg-slate-900 border ${hw.borderColor} p-4 rounded-xl flex flex-col justify-between backface-hidden shadow-lg transition-all`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${hw.layerBadgeClass}`}>
                        {hw.layer}
                      </span>
                      <IconComp className={`w-4 h-4 ${hw.accentColor}`} />
                    </div>

                    <h4 className="font-bold text-sm text-white mt-2.5 flex items-center justify-between">
                      <span>{hw.title}</span>
                    </h4>

                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      {hw.frontDesc}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 font-mono">
                      {hw.codeNote}
                    </div>

                    {/* Flip Trigger Button */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
                      <span className="flex items-center gap-1 group-hover:text-cyan-300">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" /> View Hardware Photo
                      </span>
                      <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* BACK FACE (Hardware Photo & Physical Specs) */}
                <div
                  className={`absolute inset-0 w-full h-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl overflow-hidden`}
                >
                  <div>
                    {/* Header with Title and Flip Back hint */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-white font-mono">{hw.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        PHOTO
                      </span>
                    </div>

                    {/* Hardware Image Showcase */}
                    <div className="mt-2.5 relative w-full h-36 rounded-lg overflow-hidden border border-slate-800 bg-black/60 group">
                      <img
                        src={hw.image}
                        alt={hw.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback graceful placeholder if image is delayed
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 text-[10px] font-mono text-slate-300">
                        {hw.deviceType}
                      </div>
                    </div>

                    {/* Physical Hardware Specs Table */}
                    <div className="mt-2.5 space-y-1 text-[10px] font-mono">
                      {hw.specs.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-400 border-b border-slate-900 pb-0.5">
                          <span className="text-slate-500">{s.label}:</span>
                          <span className="text-slate-200 font-semibold text-right truncate max-w-[140px]">{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Return to Theory Hint */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-purple-400">
                    <span className="flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5" /> Flip to Concept
                    </span>
                    <span className="text-[10px] text-slate-500">Tap Card</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Hardware Simulator: HUB vs SWITCH vs ROUTER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 grid-bg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Interactive Traffic Flow Simulator: Hub vs Switch vs Router
            </h3>
            <p className="text-xs text-slate-400">Simulate sending a packet from Host 1 to Host 3 under different intermediate devices.</p>
          </div>

          {/* Device Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleModeChange('hub')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentHwMode === 'hub'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hub (L1 Broadcast)
            </button>
            <button
              onClick={() => handleModeChange('switch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentHwMode === 'switch'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Switch (L2 Smart Unicast)
            </button>
            <button
              onClick={() => handleModeChange('router')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentHwMode === 'router'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Router (L3 Subnet Gateway)
            </button>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="relative py-12 flex flex-col items-center">
          {/* Central Device Icon */}
          <div
            className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center z-20 shadow-xl transition-all ${
              currentHwMode === 'hub'
                ? 'bg-amber-950/80 border-2 border-amber-400 shadow-amber-500/20'
                : currentHwMode === 'switch'
                ? 'bg-cyan-950/80 border-2 border-cyan-400 shadow-cyan-500/20'
                : 'bg-emerald-950/80 border-2 border-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {currentHwMode === 'hub' ? (
              <Radio className="w-10 h-10 text-amber-300" />
            ) : currentHwMode === 'switch' ? (
              <Boxes className="w-10 h-10 text-cyan-300" />
            ) : (
              <Compass className="w-10 h-10 text-emerald-300" />
            )}
            <span className="text-xs font-bold mt-1 font-mono text-white">
              {currentHwMode === 'hub' ? 'HUB (L1)' : currentHwMode === 'switch' ? 'SWITCH (L2)' : 'ROUTER (L3)'}
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              {currentHwMode === 'hub' ? 'Blind Broadcast' : currentHwMode === 'switch' ? 'MAC Unicast' : 'IP Forwarding'}
            </span>
          </div>

          {/* 4 Surrounding Hosts */}
          <div className="w-full max-w-2xl grid grid-cols-4 gap-4 mt-12 z-10">
            {/* Host 1 (Sender) */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-14 h-14 rounded-xl bg-slate-800 border-2 flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all duration-300 ${
                  hostStates.h1 === 'sending'
                    ? 'border-cyan-400 scale-110 ring-2 ring-cyan-400 text-cyan-300'
                    : 'border-cyan-500 text-cyan-400'
                }`}
              >
                PC 1
              </div>
              <span className="text-[11px] font-bold text-cyan-400 mt-1">Sender</span>
              <span className="text-[9px] font-mono text-slate-500">Port 1 (MAC: AA)</span>
            </div>

            {/* Host 2 */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-14 h-14 rounded-xl bg-slate-800 border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                  hostStates.h2 === 'flooded'
                    ? 'border-amber-400 shadow-amber-500/50 scale-105 text-amber-400'
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                PC 2
              </div>
              <span className="text-[11px] text-slate-400 mt-1">
                {hostStates.h2 === 'flooded' ? 'Collision Discard' : 'Idle Node'}
              </span>
              <span className="text-[9px] font-mono text-slate-500">Port 2 (MAC: BB)</span>
            </div>

            {/* Host 3 (Target) */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-14 h-14 rounded-xl bg-slate-800 border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                  hostStates.h3 === 'accepted' || hostStates.h3 === 'accepted-target' || hostStates.h3 === 'routed-target'
                    ? 'border-emerald-400 shadow-emerald-500/50 scale-110 text-emerald-300 ring-2 ring-emerald-400'
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                PC 3
              </div>
              <span className="text-[11px] font-bold text-purple-400 mt-1">
                {hostStates.h3 !== 'idle' ? 'Frame Accepted!' : 'Target'}
              </span>
              <span className="text-[9px] font-mono text-slate-500">Port 3 (MAC: CC)</span>
            </div>

            {/* Host 4 */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-14 h-14 rounded-xl bg-slate-800 border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                  hostStates.h4 === 'flooded'
                    ? 'border-amber-400 shadow-amber-500/50 scale-105 text-amber-400'
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                PC 4
              </div>
              <span className="text-[11px] text-slate-400 mt-1">
                {hostStates.h4 === 'flooded' ? 'Collision Discard' : 'Idle Node'}
              </span>
              <span className="text-[9px] font-mono text-slate-500">Port 4 (MAC: DD)</span>
            </div>
          </div>
        </div>

        {/* Action & Log Bar */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-300 font-mono">
            {getExplanation()}
          </div>
          <button
            onClick={triggerTransmission}
            disabled={isSimulating}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> Dispatch Frame (Host 1 &rarr; Host 3)
          </button>
        </div>
      </div>
    </div>
  );
}
