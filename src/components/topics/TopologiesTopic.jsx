import React, { useState } from 'react';
import { Scissors, Play, Check, AlertTriangle } from 'lucide-react';

const topoMeta = {
  star: {
    title: 'Star Topology',
    badge: 'STAR TOPOLOGY',
    desc: 'All peripheral devices link directly to a central hub/switch via point-to-point connections. Dominant LAN standard worldwide.',
    pros: 'Failure of one cable leaves the rest intact. Plug-and-play expansion without network halt.',
    cons: 'Central device is a single point of failure (SPOF). High cabling consumption.',
    formula: 'N cables',
    risk: 'Central Switch',
    breakLabel: 'Break Central Switch'
  },
  bus: {
    title: 'Bus Topology',
    badge: 'BUS TOPOLOGY',
    desc: 'Single shared backbone cable (coaxial trunk) with terminators at both ends. T-connectors tap nodes into the common bus.',
    pros: 'Minimal cable needed. Cheap and simple for very small legacy networks.',
    cons: 'A single break in the main backbone halts the entire network! Signal reflection if terminators fail. Prone to data collisions.',
    formula: '1 Backbone + N Drop Cables',
    risk: 'Backbone Cut / Terminators',
    breakLabel: 'Cut Backbone Cable'
  },
  ring: {
    title: 'Ring Topology',
    badge: 'RING TOPOLOGY',
    desc: 'Nodes connected in a closed circular loop. Packets travel unidirectionally (or bidirectional in dual-ring like FDDI) via token passing.',
    pros: 'Deterministic traffic flow. No data packet collisions due to token passing.',
    cons: 'One broken node or cut cable severs the ring loop for everyone unless an expensive dual-counter-rotating ring is deployed.',
    formula: 'N cables',
    risk: 'Any Single Link Break',
    breakLabel: 'Break Ring Link'
  },
  mesh: {
    title: 'Full Mesh Topology',
    badge: 'FULL MESH TOPOLOGY',
    desc: 'Every single node has a dedicated point-to-point physical link to every other node in the network. Used in mission-critical telecom cores.',
    pros: 'Ultimate redundancy and fault tolerance. Simultaneous parallel traffic without bottlenecks or interference.',
    cons: 'Massive exponential cabling costs: N*(N-1)/2 cables. Port count explosion on network cards.',
    formula: 'N*(N-1)/2 cables',
    risk: 'Extremely Low',
    breakLabel: 'Sever Link A-B'
  },
  tree: {
    title: 'Tree (Hierarchical) Topology',
    badge: 'TREE TOPOLOGY',
    desc: 'Branching star topologies organized in parent-child levels (Core, Distribution, and Access layers).',
    pros: 'Organized hierarchy, highly scalable across large enterprise campuses.',
    cons: 'If a root trunk or parent switch fails, its entire sub-branch is cut off.',
    formula: 'Hierarchical Trunks',
    risk: 'Root Hub Failure',
    breakLabel: 'Break Root Switch'
  },
  hybrid: {
    title: 'Hybrid Topology (Star-Ring)',
    badge: 'HYBRID TOPOLOGY',
    desc: 'Combines two distinct topologies (e.g. Star branches interconnected across an optical Ring backbone). Standard for modern metropolitan backbones.',
    pros: 'Tailored flexibility; high performance where needed and cost-effective at branch edges.',
    cons: 'Complex configuration and specialized multi-protocol hardware.',
    formula: 'Custom',
    risk: 'Architectural Specific',
    breakLabel: 'Sever Backbone Interlink'
  }
};

export default function TopologiesTopic() {
  const [currentTopo, setCurrentTopo] = useState('star');
  const [isLinkBroken, setIsLinkBroken] = useState(false);
  const [trafficStatus, setTrafficStatus] = useState({
    text: 'Status: All links operational.',
    isError: false,
    isActive: false
  });

  const meta = topoMeta[currentTopo];

  const handleSelectTopo = (topoKey) => {
    setCurrentTopo(topoKey);
    setIsLinkBroken(false);
    setTrafficStatus({
      text: 'Status: All links operational.',
      isError: false,
      isActive: false
    });
  };

  const handleToggleBreak = () => {
    const nextBroken = !isLinkBroken;
    setIsLinkBroken(nextBroken);
    if (nextBroken) {
      setTrafficStatus({
        text: 'WARNING: Link failure injected! Network integrity compromised.',
        isError: true,
        isActive: false
      });
    } else {
      setTrafficStatus({
        text: 'Status: Links repaired and healthy.',
        isError: false,
        isActive: false
      });
    }
  };

  const handleSimulateTraffic = () => {
    if (isLinkBroken && (currentTopo === 'star' || currentTopo === 'bus' || currentTopo === 'ring')) {
      setTrafficStatus({
        text: 'TRANSMISSION FAILED: Broken link prevented packet arrival!',
        isError: true,
        isActive: false
      });
      return;
    }

    setTrafficStatus({
      text: 'TRANSMITTING: Packet successfully routed across active topological pathways!',
      isError: false,
      isActive: true
    });

    setTimeout(() => {
      setTrafficStatus({
        text: 'SUCCESS: Acknowledgment returned without packet loss.',
        isError: false,
        isActive: false
      });
    }, 1200);
  };

  const renderTopologySVG = () => {
    if (currentTopo === 'star') {
      const center = { x: 300, y: 160 };
      const nodes = [
        { x: 140, y: 70, label: 'PC 1' },
        { x: 460, y: 70, label: 'PC 2' },
        { x: 140, y: 250, label: 'PC 3' },
        { x: 460, y: 250, label: 'PC 4' },
        { x: 300, y: 40, label: 'Server' }
      ];

      return (
        <svg className="w-full h-full" viewBox="0 0 600 320">
          {nodes.map((n, i) => {
            const broken = isLinkBroken && i === 0;
            return (
              <line
                key={`link-${i}`}
                x1={center.x}
                y1={center.y}
                x2={n.x}
                y2={n.y}
                stroke={broken ? '#f43f5e' : isLinkBroken ? '#e11d48' : '#06b6d4'}
                strokeWidth={broken ? 2 : 3}
                strokeDasharray={broken ? '4,4' : 'none'}
              />
            );
          })}
          {/* Center Switch */}
          <circle
            cx={center.x}
            cy={center.y}
            r="28"
            fill={isLinkBroken ? '#450a0a' : '#083344'}
            stroke={isLinkBroken ? '#f43f5e' : '#06b6d4'}
            strokeWidth="3"
          />
          <text
            x={center.x}
            y={center.y + 4}
            fill="#e0f2fe"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            {isLinkBroken ? 'OFFLINE' : 'SWITCH'}
          </text>
          {/* Nodes */}
          {nodes.map((n, i) => (
            <g key={`node-${i}`}>
              <circle cx={n.x} cy={n.y} r="20" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x={n.x} y={n.y + 4} fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      );
    }

    if (currentTopo === 'bus') {
      const broken = isLinkBroken;
      const taps = [
        { x: 140, y: 70, label: 'Node A' },
        { x: 260, y: 250, label: 'Node B' },
        { x: 380, y: 70, label: 'Node C' },
        { x: 470, y: 250, label: 'Node D' }
      ];

      return (
        <svg className="w-full h-full" viewBox="0 0 600 320">
          {/* Terminators */}
          <rect x="60" y="140" width="12" height="40" fill="#f59e0b" rx="2" />
          <rect x="528" y="140" width="12" height="40" fill="#f59e0b" rx="2" />
          <text x="66" y="195" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">TERM</text>
          <text x="534" y="195" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">TERM</text>

          {/* Main Backbone */}
          <line
            x1="72"
            y1="160"
            x2={broken ? '280' : '528'}
            y2="160"
            stroke={broken ? '#ef4444' : '#f59e0b'}
            strokeWidth="6"
          />
          {broken && (
            <>
              <line x1="320" y1="160" x2="528" y2="160" stroke="#ef4444" strokeWidth="6" strokeDasharray="4,4" />
              <text x="300" y="145" fill="#f43f5e" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                CUT
              </text>
            </>
          )}

          {taps.map((tap, i) => (
            <g key={`tap-${i}`}>
              <line x1={tap.x} y1="160" x2={tap.x} y2={tap.y} stroke="#64748b" strokeWidth="2" strokeDasharray="2,2" />
              <circle cx={tap.x} cy="160" r="5" fill="#f59e0b" />
              <circle cx={tap.x} cy={tap.y} r="18" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              <text x={tap.x} y={tap.y + 4} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                {tap.label}
              </text>
            </g>
          ))}
        </svg>
      );
    }

    if (currentTopo === 'ring') {
      const center = { x: 300, y: 160 };
      const r = 100;
      const count = 5;
      const coords = [];
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
        coords.push({
          x: center.x + r * Math.cos(angle),
          y: center.y + r * Math.sin(angle),
          label: `N${i + 1}`
        });
      }

      return (
        <svg className="w-full h-full" viewBox="0 0 600 320">
          {coords.map((c, i) => {
            const next = coords[(i + 1) % count];
            const broken = isLinkBroken && i === 1;
            return (
              <g key={`ring-seg-${i}`}>
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={broken ? '#f43f5e' : '#a855f7'}
                  strokeWidth={broken ? 2 : 4}
                  strokeDasharray={broken ? '4,4' : 'none'}
                />
                {broken && (
                  <text
                    x={(c.x + next.x) / 2}
                    y={(c.y + next.y) / 2}
                    fill="#f43f5e"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    BREAK
                  </text>
                )}
              </g>
            );
          })}
          {coords.map((c, i) => (
            <g key={`ring-node-${i}`}>
              <circle cx={c.x} cy={c.y} r="18" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2" />
              <text x={c.x} y={c.y + 4} fill="#f3e8ff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {c.label}
              </text>
            </g>
          ))}
          <text x={center.x} y={center.y} fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle">
            TOKEN RING
          </text>
        </svg>
      );
    }

    if (currentTopo === 'mesh') {
      const nodes = [
        { x: 200, y: 70, label: 'R1' },
        { x: 400, y: 70, label: 'R2' },
        { x: 470, y: 220, label: 'R3' },
        { x: 300, y: 280, label: 'R4' },
        { x: 130, y: 220, label: 'R5' }
      ];

      const lines = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const broken = isLinkBroken && i === 0 && j === 1;
          lines.push(
            <line
              key={`mesh-${i}-${j}`}
              x1={nodes[i].x}
              y1={nodes[i].y}
              x2={nodes[j].x}
              y2={nodes[j].y}
              stroke={broken ? '#f43f5e' : '#10b981'}
              strokeWidth={broken ? 1 : 2}
              strokeOpacity={broken ? 0.4 : 0.6}
              strokeDasharray={broken ? '4,4' : 'none'}
            />
          );
        }
      }

      return (
        <svg className="w-full h-full" viewBox="0 0 600 320">
          {lines}
          {nodes.map((n, i) => (
            <g key={`mesh-node-${i}`}>
              <circle cx={n.x} cy={n.y} r="18" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
              <text x={n.x} y={n.y + 4} fill="#ecfdf5" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      );
    }

    // Tree or Hybrid
    return (
      <svg className="w-full h-full" viewBox="0 0 600 320">
        <circle cx="300" cy="50" r="20" fill={isLinkBroken ? '#450a0a' : '#0c4a6e'} stroke="#38bdf8" strokeWidth="2" />
        <text x="300" y="55" fill="#e0f2fe" fontSize="10" fontFamily="monospace" textAnchor="middle">Root Hub</text>

        <line x1="300" y1="70" x2="180" y2="150" stroke={isLinkBroken ? '#f43f5e' : '#38bdf8'} strokeWidth="3" />
        <line x1="300" y1="70" x2="420" y2="150" stroke="#38bdf8" strokeWidth="3" />

        <circle cx="180" cy="150" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <text x="180" y="154" fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">Dist A</text>

        <circle cx="420" cy="150" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <text x="420" y="154" fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">Dist B</text>

        <line x1="180" y1="168" x2="130" y2="240" stroke="#64748b" strokeWidth="2" />
        <line x1="180" y1="168" x2="230" y2="240" stroke="#64748b" strokeWidth="2" />
        <line x1="420" y1="168" x2="370" y2="240" stroke="#64748b" strokeWidth="2" />
        <line x1="420" y1="168" x2="470" y2="240" stroke="#64748b" strokeWidth="2" />

        <circle cx="130" cy="240" r="14" fill="#020617" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="230" cy="240" r="14" fill="#020617" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="370" cy="240" r="14" fill="#020617" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="470" cy="240" r="14" fill="#020617" stroke="#94a3b8" strokeWidth="1.5" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Topology Selector Nav */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
        <span className="text-xs font-mono text-slate-400 font-bold px-2">TOPOLOGIES:</span>
        {Object.keys(topoMeta).map((key) => {
          const isSelected = currentTopo === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectTopo(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {key === 'hybrid' ? 'Hybrid (Star-Ring)' : key === 'tree' ? 'Tree (Hierarchical)' : key === 'mesh' ? 'Full Mesh' : key}
            </button>
          );
        })}
      </div>

      {/* Topologies Simulator Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 grid-bg flex flex-col justify-between relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                {meta.badge}
              </span>
              <span className="text-xs text-slate-400">Click "Simulate Traffic" or toggle "Break Central Link"</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleBreak}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                  isLinkBroken
                    ? 'bg-rose-600 border-rose-500 text-white'
                    : 'bg-rose-950/80 border-rose-800 text-rose-300 hover:bg-rose-900'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{meta.breakLabel}</span>
              </button>
              <button
                onClick={handleSimulateTraffic}
                className="px-4 py-1 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Simulate Traffic
              </button>
            </div>
          </div>

          {/* SVG Topology Graph Canvas */}
          <div className="relative w-full h-80 flex items-center justify-center my-4 overflow-hidden">
            {renderTopologySVG()}
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs flex items-center justify-between">
            <span
              className={`font-mono ${
                trafficStatus.isError
                  ? 'text-rose-400 font-bold animate-pulse'
                  : trafficStatus.isActive
                  ? 'text-cyan-400 font-bold'
                  : 'text-emerald-400'
              }`}
            >
              {trafficStatus.text}
            </span>
            <span className="text-slate-500 text-[11px]">Green: Healthy | Red: Broken | Pulsing: Packet transit</span>
          </div>
        </div>

        {/* Topology Theory & Pros/Cons Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white">{meta.title}</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {meta.desc}
            </p>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Advantages:
                </span>
                <p className="text-[11px] text-slate-300 mt-1">
                  {meta.pros}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Disadvantages:
                </span>
                <p className="text-[11px] text-slate-300 mt-1">
                  {meta.cons}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Cabling formula: <span className="text-cyan-400 font-bold">{meta.formula}</span></span>
            <span>Failure Risk: <span className="text-amber-400 font-bold">{meta.risk}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

