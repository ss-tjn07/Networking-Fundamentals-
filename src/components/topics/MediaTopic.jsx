import React, { useState } from 'react';
import {
  Cable,
  Radio,
  Wifi,
  RotateCw,
  Eye,
  Info,
  ArrowRightLeft,
  ShieldCheck,
  Check,
  Server,
  Laptop,
  Boxes,
  Compass,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

// Media cards defined strictly based on Image 1
const mediaList = [
  // GUIDED MEDIA
  {
    id: 'coaxial',
    title: 'Coaxial Cable',
    branch: 'coaxial',
    mediumType: 'GUIDED MEDIA',
    typeBadgeClass: 'text-cyan-400 bg-cyan-950 border-cyan-800/60',
    borderColor: 'border-slate-800 hover:border-cyan-500/60',
    accentColor: 'text-cyan-400',
    frontDesc: 'Central copper conductor surrounded by dielectric insulation, metallic braided shield, and plastic jacket.',
    standard: 'Impedance: 75 Ω (RG-6) / 50 Ω (RG-58)',
    useCase: 'Used for: Cable Internet (DOCSIS 3.1) · Cable TV · Legacy 10Base2',
    image: '/images/coaxial_cable.jpg',
    category: 'Copper Core + Foil & Braided Metallic Shield',
    specs: [
      { label: 'Shielding', val: 'High EMI & RF noise immunity' },
      { label: 'Connectors', val: 'F-Type (Threaded) & BNC (Bayonet)' },
      { label: 'Standards', val: '10Base5 (500m), 10Base2 (185m), DOCSIS' },
      { label: 'Structure', val: 'Core, Dielectric, Foil, Braid, Jacket' }
    ]
  },
  {
    id: 'fibre_optics',
    title: 'Fibre Optics',
    branch: 'fibre_optics',
    mediumType: 'GUIDED MEDIA',
    typeBadgeClass: 'text-cyan-400 bg-cyan-950 border-cyan-800/60',
    borderColor: 'border-slate-800 hover:border-cyan-500/60',
    accentColor: 'text-cyan-400',
    frontDesc: 'Transmits pulses of light through a flexible glass silica core via Total Internal Reflection at light speed.',
    standard: 'Modes: Single-Mode (SMF) & Multi-Mode (MMF)',
    useCase: 'Used for: ISP Backbones · Undersea Cables · Data Center 100G links',
    image: '/images/fiber_optic.jpg',
    category: 'Silica Glass Core + Cladding (Zero EMI)',
    specs: [
      { label: 'Single-Mode (SMF)', val: '9 µm core · Laser · 100+ km reach' },
      { label: 'Multi-Mode (MMF)', val: '50/62.5 µm core · LED/VCSEL · 550m' },
      { label: 'EMI Resistance', val: '100% immune (Zero electrical noise)' },
      { label: 'Connectors', val: 'LC, SC, ST, SFP+ optical transceivers' }
    ]
  },
  {
    id: 'twisted',
    title: 'Twisted Pair Cable',
    branch: 'twisted',
    mediumType: 'GUIDED MEDIA',
    typeBadgeClass: 'text-cyan-400 bg-cyan-950 border-cyan-800/60',
    borderColor: 'border-slate-800 hover:border-cyan-500/60',
    accentColor: 'text-cyan-400',
    frontDesc: 'Color-coded insulated copper wires twisted in pairs to cancel out electromagnetic interference (EMI) & crosstalk.',
    standard: 'Variants: Straight-Through (T568B) & Crossover (T568A/B)',
    useCase: 'Used for: LAN Workstations · Switches · Patch Panels · Routers',
    image: '/images/twisted_pair_straight.jpg',
    category: 'Copper / Cat5e / Cat6 / Cat6a (UTP & STP)',
    specs: [
      { label: 'Straight-Through', val: 'T568B to T568B (Unlike devices)' },
      { label: 'Crossover', val: 'T568A to T568B (Like devices)' },
      { label: 'Max Distance', val: '100 meters (328 ft)' },
      { label: 'Connector', val: 'RJ-45 (8P8C modular plug)' }
    ]
  },

  // UNGUIDED MEDIA
  {
    id: 'radiowaves',
    title: 'Radiowaves',
    branch: 'radiowaves',
    mediumType: 'UNGUIDED MEDIA',
    typeBadgeClass: 'text-blue-400 bg-blue-950 border-blue-800/60',
    borderColor: 'border-slate-800 hover:border-blue-500/60',
    accentColor: 'text-blue-400',
    frontDesc: 'Omnidirectional electromagnetic radio waves propagating through the atmosphere, capable of penetrating walls.',
    standard: 'Spectrum: 3 kHz to 1 GHz (Wi-Fi 2.4/5/6 GHz, Cellular)',
    useCase: 'Used for: Laptops, Smartphones, Smart Home IoT, 4G/5G LTE',
    image: '/images/radio_waves.jpg',
    category: 'Omnidirectional Electromagnetic Radio Waves',
    specs: [
      { label: 'Propagation', val: 'Omnidirectional (All directions)' },
      { label: 'Obstacles', val: 'Penetrates walls; absorbed by concrete/metal' },
      { label: '2.4 GHz Band', val: 'Longer range, high penetration' },
      { label: '5/6 GHz Bands', val: 'Ultra-fast throughput, shorter reach' }
    ]
  },
  {
    id: 'microwaves',
    title: 'Microwaves',
    branch: 'microwaves',
    mediumType: 'UNGUIDED MEDIA',
    typeBadgeClass: 'text-blue-400 bg-blue-950 border-blue-800/60',
    borderColor: 'border-slate-800 hover:border-blue-500/60',
    accentColor: 'text-blue-400',
    frontDesc: 'Focused unidirectional line-of-sight parabolic microwave beams and orbital satellite communication relays.',
    standard: 'Spectrum: 1 GHz to 300 GHz (Terrestrial & Satellite)',
    useCase: 'Used for: Cellular Tower Backhaul · Starlink LEO · Remote Maritime',
    image: '/images/satellite_microwave.jpg',
    category: 'Unidirectional Line-of-Sight Parabolic Beam',
    specs: [
      { label: 'Terrestrial Range', val: 'Up to 50 km (requires clear line-of-sight)' },
      { label: 'LEO Satellites', val: 'Starlink (~550 km altitude, 25-40ms latency)' },
      { label: 'GEO Satellites', val: 'Geostationary (35,786 km, ~600ms latency)' },
      { label: 'Interference', val: 'Atmospheric attenuation & rain fade' }
    ]
  },
  {
    id: 'infrared',
    title: 'Infrared',
    branch: 'infrared',
    mediumType: 'UNGUIDED MEDIA',
    typeBadgeClass: 'text-blue-400 bg-blue-950 border-blue-800/60',
    borderColor: 'border-slate-800 hover:border-blue-500/60',
    accentColor: 'text-blue-400',
    frontDesc: 'High-frequency optical wireless signals that cannot penetrate solid walls, ensuring strict containment.',
    standard: 'Spectrum: 300 GHz to 400 THz (Short-range line-of-sight)',
    useCase: 'Used for: TV Remote Controls · IrDA Transceivers · Secure Rooms',
    image: '/images/infrared.jpg',
    category: 'Line-of-Sight Optical Wireless Radiation',
    specs: [
      { label: 'Propagation', val: 'Line-of-sight only (cannot penetrate walls)' },
      { label: 'Range', val: 'Short range (< 10 meters / same room)' },
      { label: 'Security', val: 'High (No eavesdropping outside the room)' },
      { label: 'Interference', val: 'Sunlight and bright optical sources' }
    ]
  }
];

// Device Connections:
const straightThroughConnections = [
  { from: 'Switch', to: 'Router', fromIcon: Boxes, toIcon: Compass, note: 'Layer 2 to Layer 3 boundary' },
  { from: 'Switch', to: 'PC', fromIcon: Boxes, toIcon: Laptop, note: 'Network device to end-station' },
  { from: 'Switch', to: 'Server', fromIcon: Boxes, toIcon: Server, note: 'Network device to host server' },
  { from: 'Hub', to: 'PC', fromIcon: Radio, toIcon: Laptop, note: 'Layer 1 repeater to client PC' },
  { from: 'Hub', to: 'Server', fromIcon: Radio, toIcon: Server, note: 'Layer 1 repeater to host server' },
  { from: 'Router', to: 'PC', fromIcon: Compass, toIcon: Laptop, note: 'Gateway interface directly to PC' }
];

const crossoverConnections = [
  { from: 'Switch', to: 'Switch', fromIcon: Boxes, toIcon: Boxes, note: 'Like devices (Switch to Switch uplink)' },
  { from: 'Switch', to: 'Hub', fromIcon: Boxes, toIcon: Radio, note: 'Concentrator to Concentrator link' },
  { from: 'Hub', to: 'Hub', fromIcon: Radio, toIcon: Radio, note: 'Daisy-chaining like repeater hubs' },
  { from: 'Router', to: 'Router', fromIcon: Compass, toIcon: Compass, note: 'Back-to-back router interconnect' },
  { from: 'PC', to: 'PC', fromIcon: Laptop, toIcon: Laptop, note: 'Direct peer-to-peer computer link' }
];

// Color definitions matching Image 3:
const t568bStraightWires = [
  { pin: 1, label: 'Pin 1', name: 'White-Orange', stripe: true, solidColor: '#fb923c', stripeColor: '#ffffff' },
  { pin: 2, label: 'Pin 2', name: 'Orange', stripe: false, solidColor: '#f97316' },
  { pin: 3, label: 'Pin 3', name: 'White-Green', stripe: true, solidColor: '#4ade80', stripeColor: '#ffffff' },
  { pin: 4, label: 'Pin 4', name: 'Blue', stripe: false, solidColor: '#2563eb' },
  { pin: 5, label: 'Pin 5', name: 'White-Blue', stripe: true, solidColor: '#38bdf8', stripeColor: '#ffffff' },
  { pin: 6, label: 'Pin 6', name: 'Green', stripe: false, solidColor: '#16a34a' },
  { pin: 7, label: 'Pin 7', name: 'White-Brown', stripe: true, solidColor: '#a16207', stripeColor: '#ffffff' },
  { pin: 8, label: 'Pin 8', name: 'Brown', stripe: false, solidColor: '#78350f' }
];

export default function MediaTopic() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [flippedCards, setFlippedCards] = useState({});
  const [activeTab, setActiveTab] = useState('tree'); // 'tree', 'devices', 'colorcodes'
  const [activePinout, setActivePinout] = useState('both'); // 'both', 'straight', 'crossover'
  const [hoveredPin, setHoveredPin] = useState(null);

  const toggleCardFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const areAllFlipped = mediaList.every((m) => flippedCards[m.id]);

  const toggleFlipAll = () => {
    const next = !areAllFlipped;
    const updated = {};
    mediaList.forEach((m) => {
      updated[m.id] = next;
    });
    setFlippedCards(updated);
  };

  const filteredMedia = selectedBranch === 'all'
    ? mediaList
    : selectedBranch === 'guided'
      ? mediaList.filter((m) => m.mediumType === 'GUIDED MEDIA')
      : selectedBranch === 'unguided'
        ? mediaList.filter((m) => m.mediumType === 'UNGUIDED MEDIA')
        : mediaList.filter((m) => m.branch === selectedBranch);

  return (
    <div className="space-y-8">
      {/* SECTION 1: INTERACTIVE TRANSMISSION MEDIA HIERARCHY TREE (Strictly matching Image 1) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
              TAXONOMY CLASSIFICATION
            </span>
            <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Transmission Media Hierarchy (Image 1 Structure)
            </h3>
            <p className="text-xs text-slate-400">
              Click any node in the hierarchy tree to filter media cards below.
            </p>
          </div>

          <button
            onClick={() => setSelectedBranch('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer self-start sm:self-auto ${selectedBranch === 'all'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
          >
            Show All Branches
          </button>
        </div>

        {/* Tree Diagram Visualizer */}
        <div className="py-6 flex flex-col items-center select-none overflow-x-auto">
          {/* Level 1: Root Node */}
          <div
            onClick={() => setSelectedBranch('all')}
            className={`px-6 py-2.5 rounded-xl font-bold font-sans text-sm tracking-wide text-white transition-all cursor-pointer shadow-lg flex items-center gap-2 ${selectedBranch === 'all'
                ? 'bg-blue-600 border-2 border-blue-400 ring-4 ring-blue-500/20 scale-105'
                : 'bg-blue-700/80 hover:bg-blue-600 border border-blue-500'
              }`}
          >
            Transmission Media
          </div>

          {/* Stem Connector */}
          <div className="w-0.5 h-6 bg-slate-700" />

          {/* Level 2: Guided & Unguided Branches */}
          <div className="w-full max-w-2xl relative">
            {/* Horizontal Split Line */}
            <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-slate-700" />
            <div className="grid grid-cols-2 gap-8 md:gap-24 pt-4">
              {/* Guided Media Branch */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedBranch('guided')}
                  className={`w-full max-w-[200px] py-2 px-3 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-md ${selectedBranch === 'guided'
                      ? 'bg-blue-600 border-2 border-cyan-400 ring-2 ring-cyan-400/40'
                      : 'bg-blue-700 hover:bg-blue-600'
                    }`}
                >
                  Guided Media
                </button>
                <div className="w-0.5 h-6 bg-slate-700" />

                {/* Guided Sub-branches: Coaxial, Fibre Optics, Twisted */}
                <div className="w-full relative">
                  <div className="absolute top-0 left-[16%] right-[16%] h-0.5 bg-slate-700" />
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    <button
                      onClick={() => setSelectedBranch('coaxial')}
                      className={`p-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer text-center ${selectedBranch === 'coaxial'
                          ? 'bg-blue-600 border-2 border-cyan-400'
                          : 'bg-blue-700/90 hover:bg-blue-600'
                        }`}
                    >
                      Coaxial
                    </button>
                    <button
                      onClick={() => setSelectedBranch('fibre_optics')}
                      className={`p-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer text-center ${selectedBranch === 'fibre_optics'
                          ? 'bg-blue-600 border-2 border-cyan-400'
                          : 'bg-blue-700/90 hover:bg-blue-600'
                        }`}
                    >
                      Fibre Optics
                    </button>
                    <button
                      onClick={() => setSelectedBranch('twisted')}
                      className={`p-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer text-center ${selectedBranch === 'twisted'
                          ? 'bg-blue-600 border-2 border-cyan-400'
                          : 'bg-blue-700/90 hover:bg-blue-600'
                        }`}
                    >
                      Twisted
                    </button>
                  </div>
                </div>
              </div>

              {/* Unguided Media Branch */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedBranch('unguided')}
                  className={`w-full max-w-[200px] py-2 px-3 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-md ${selectedBranch === 'unguided'
                      ? 'bg-blue-600 border-2 border-rose-400 ring-2 ring-rose-400/40'
                      : 'bg-blue-700 hover:bg-blue-600'
                    }`}
                >
                  Unguided Media
                </button>
                <div className="w-0.5 h-6 bg-slate-700" />

                {/* Unguided Sub-branches: Radiowaves, Microwaves, Infrared */}
                <div className="w-full relative">
                  <div className="absolute top-0 left-[16%] right-[16%] h-0.5 bg-slate-700" />
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    <button
                      onClick={() => setSelectedBranch('radiowaves')}
                      className={`p-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer text-center ${selectedBranch === 'radiowaves'
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'bg-blue-700/90 hover:bg-blue-600'
                        }`}
                    >
                      Radiowaves
                    </button>
                    <button
                      onClick={() => setSelectedBranch('microwaves')}
                      className={`p-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer text-center ${selectedBranch === 'microwaves'
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'bg-blue-700/90 hover:bg-blue-600'
                        }`}
                    >
                      Microwaves
                    </button>
                    <button
                      onClick={() => setSelectedBranch('infrared')}
                      className={`p-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer text-center ${selectedBranch === 'infrared'
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'bg-blue-700/90 hover:bg-blue-600'
                        }`}
                    >
                      Infrared
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 3D FLIP CARDS (For Coaxial, Fibre Optics, Twisted, Radiowaves, Microwaves, Infrared) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cable className="w-4 h-4 text-cyan-400" /> Physical Media Cards
            </h3>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (Tap card to flip between theoretical concepts and hardware photographs)
            </span>
          </div>

          <button
            onClick={toggleFlipAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/60 transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{areAllFlipped ? 'Flip All to Concepts' : 'Flip All to Photos'}</span>
          </button>
        </div>

        {/* Flip Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedia.map((m) => {
            const isFlipped = !!flippedCards[m.id];

            return (
              <div
                key={m.id}
                className="perspective-1000 h-[380px] select-none"
              >
                <div
                  className={`relative w-full h-full rounded-2xl transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''
                    }`}
                  onClick={() => toggleCardFlip(m.id)}
                >
                  {/* FRONT FACE (Theory & Concept) */}
                  <div
                    className={`absolute inset-0 w-full h-full bg-slate-900 border ${m.borderColor} p-5 rounded-2xl flex flex-col justify-between backface-hidden shadow-xl transition-all`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${m.typeBadgeClass}`}>
                          {m.mediumType}
                        </span>
                        <Cable className={`w-4 h-4 ${m.accentColor}`} />
                      </div>

                      <h4 className="font-extrabold text-base text-white mt-3">
                        {m.title}
                      </h4>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {m.frontDesc}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px] font-mono">
                        <div className="text-cyan-300 font-semibold">{m.standard}</div>
                        <div className="text-slate-400 text-[10px]">{m.useCase}</div>
                      </div>

                      {/* Flip Hint */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" /> View Physical Media Photo
                        </span>
                        <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE (Hardware Photo & Physical Specs) */}
                  <div
                    className={`absolute inset-0 w-full h-full bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl overflow-hidden`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold text-white font-mono truncate max-w-[200px]">{m.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          PHOTO
                        </span>
                      </div>

                      {/* Photo Showcase */}
                      <div className="mt-2.5 relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-black/60 group">
                        <img
                          src={m.image}
                          alt={m.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 text-[10px] font-mono text-slate-300 truncate">
                          {m.category}
                        </div>
                      </div>

                      {/* Specifications List */}
                      <div className="mt-3 space-y-1 text-[11px] font-mono">
                        {m.specs.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-400 border-b border-slate-900 pb-0.5">
                            <span className="text-slate-500">{s.label}:</span>
                            <span className="text-slate-200 font-semibold text-right truncate max-w-[170px]">{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" /> Flip to Concept
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Tap Card</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: DEVICE INTERCONNECTION MATRIX (Strictly matching Image 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ArrowRightLeft className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-base md:text-lg text-white">
                Device Connection Matrix (Image 2 Specification)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Exact device rules: When to use Straight-Through cables vs. Crossover cables.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] font-mono text-slate-400 px-2">Rule:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/40">
              Unlike = Straight
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800/40">
              Like = Crossover
            </span>
          </div>
        </div>

        {/* Side-by-side Tables matching Image 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Column 1: Straight-Through Cable (6 Devices) */}
          <div className="bg-slate-950/80 border border-cyan-900/40 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3.5 bg-cyan-950/40 border-b border-cyan-800/50 flex items-center justify-between">
              <span className="font-bold text-sm text-cyan-300 font-mono">
                Straight-Through Cable (6 Pairs)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-900/60 px-2 py-0.5 rounded">
                T568B ↔ T568B
              </span>
            </div>

            <div className="divide-y divide-slate-800/60 p-2">
              {straightThroughConnections.map((item, idx) => {
                const FromIcon = item.fromIcon;
                const ToIcon = item.toIcon;

                return (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-900/60 transition rounded-lg">
                    {/* Device 1 */}
                    <div className="flex items-center gap-2.5 w-32">
                      <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-500/40 flex items-center justify-center text-cyan-300 shadow">
                        <FromIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white font-mono">{item.from}</span>
                    </div>

                    {/* Double-ended Arrow */}
                    <div className="flex flex-col items-center flex-1 px-2">
                      <div className="w-full flex items-center justify-center gap-1 text-cyan-400">
                        <span className="text-xs">&larr;</span>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />
                        <span className="text-xs">&rarr;</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-0.5">{item.note}</span>
                    </div>

                    {/* Device 2 */}
                    <div className="flex items-center justify-end gap-2.5 w-32">
                      <span className="text-xs font-bold text-white font-mono text-right">{item.to}</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-500/40 flex items-center justify-center text-cyan-300 shadow">
                        <ToIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Crossover Cable (5 Devices) */}
          <div className="bg-slate-950/80 border border-amber-900/40 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3.5 bg-amber-950/40 border-b border-amber-800/50 flex items-center justify-between">
              <span className="font-bold text-sm text-amber-300 font-mono">
                Crossover Cable (5 Pairs)
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-900/60 px-2 py-0.5 rounded">
                T568A ↔ T568B
              </span>
            </div>

            <div className="divide-y divide-slate-800/60 p-2">
              {crossoverConnections.map((item, idx) => {
                const FromIcon = item.fromIcon;
                const ToIcon = item.toIcon;

                return (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-900/60 transition rounded-lg">
                    {/* Device 1 */}
                    <div className="flex items-center gap-2.5 w-32">
                      <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow">
                        <FromIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white font-mono">{item.from}</span>
                    </div>

                    {/* Double-ended Arrow */}
                    <div className="flex flex-col items-center flex-1 px-2">
                      <div className="w-full flex items-center justify-center gap-1 text-amber-400">
                        <span className="text-xs">&larr;</span>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
                        <span className="text-xs">&rarr;</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-0.5">{item.note}</span>
                    </div>

                    {/* Device 2 */}
                    <div className="flex items-center justify-end gap-2.5 w-32">
                      <span className="text-xs font-bold text-white font-mono text-right">{item.to}</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow">
                        <ToIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: COLOR CODE PINOUT DISSECTOR (Strictly matching Image 3) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid-bg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-base md:text-lg text-white">
                T568B Straight Through vs. T568B Crossover (Image 3 Color Codes)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Exact 8-pin color sequences showing parallel vs. crossed wire trajectories.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActivePinout('both')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition cursor-pointer ${activePinout === 'both' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
            >
              Side-by-Side (Both)
            </button>
            <button
              onClick={() => setActivePinout('straight')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition cursor-pointer ${activePinout === 'straight' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
            >
              Straight Only
            </button>
            <button
              onClick={() => setActivePinout('crossover')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition cursor-pointer ${activePinout === 'crossover' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
            >
              Crossover Only
            </button>
          </div>
        </div>

        {/* Pinout Visual Diagrams (Side-by-side matching Image 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* T568B Straight Through */}
          {(activePinout === 'both' || activePinout === 'straight') && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              {/* Header Title Bar matching Image 3 Blue Header */}
              <div className="p-3 bg-blue-700 text-white font-bold text-center text-sm tracking-wide font-sans shadow-md">
                T568B Straight Through
              </div>

              {/* Wire Lines Area */}
              <div className="p-5 space-y-3 bg-[#0d1424]">
                {t568bStraightWires.map((wire) => (
                  <div key={wire.pin} className="flex items-center justify-between gap-3 text-xs font-mono">
                    {/* Left Pin */}
                    <span className="w-14 text-slate-400 font-bold shrink-0">{wire.label}</span>

                    {/* Striped / Solid Cable Line (Straight across) */}
                    <div className="flex-1 h-3 rounded-full relative overflow-hidden shadow-inner flex items-center"
                      style={{ backgroundColor: wire.solidColor }}>
                      {wire.stripe && (
                        <div
                          className="absolute inset-0 opacity-80"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 5px, transparent 5px, transparent 10px)'
                          }}
                        />
                      )}
                    </div>

                    {/* Right Pin */}
                    <span className="w-14 text-slate-400 font-bold text-right shrink-0">{wire.label}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-center text-slate-400">
                Pins 1 through 8 pass directly straight through to Pins 1 through 8 (1:1 Parallel).
              </div>
            </div>
          )}

          {/* T568B Crossover */}
          {(activePinout === 'both' || activePinout === 'crossover') && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              {/* Header Title Bar matching Image 3 Blue Header */}
              <div className="p-3 bg-blue-700 text-white font-bold text-center text-sm tracking-wide font-sans shadow-md">
                T568B Crossover
              </div>

              {/* SVG Curved Crossing Lines Area */}
              <div className="p-4 bg-[#0d1424]">
                <div className="relative w-full h-[280px]">
                  {/* Left Pin Labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs font-mono font-bold text-slate-400 py-1">
                    <span>Pin 1</span>
                    <span>Pin 2</span>
                    <span>Pin 3</span>
                    <span>Pin 4</span>
                    <span>Pin 5</span>
                    <span>Pin 6</span>
                    <span>Pin 7</span>
                    <span>Pin 8</span>
                  </div>

                  {/* Right Pin Labels */}
                  <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs font-mono font-bold text-slate-400 text-right py-1">
                    <span>Pin 1</span>
                    <span>Pin 2</span>
                    <span>Pin 3</span>
                    <span>Pin 4</span>
                    <span>Pin 5</span>
                    <span>Pin 6</span>
                    <span>Pin 7</span>
                    <span>Pin 8</span>
                  </div>

                  {/* SVG Canvas with Curved Crossing Paths (Matching Image 3 exactly!) */}
                  <svg className="w-full h-full px-14" viewBox="0 0 300 280" preserveAspectRatio="none">
                    <defs>
                      {/* Striped pattern for White-Orange (Pins 1 -> 3) */}
                      <pattern id="wo-stripe" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="8" stroke="#fb923c" strokeWidth="4" />
                        <line x1="4" y1="0" x2="4" y2="8" stroke="#ffffff" strokeWidth="4" />
                      </pattern>
                      {/* Striped pattern for White-Green (Pins 3 -> 1) */}
                      <pattern id="wg-stripe" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="8" stroke="#4ade80" strokeWidth="4" />
                        <line x1="4" y1="0" x2="4" y2="8" stroke="#ffffff" strokeWidth="4" />
                      </pattern>
                      {/* Striped pattern for White-Blue (Pins 5 -> 5) */}
                      <pattern id="wb-stripe" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="4" />
                        <line x1="4" y1="0" x2="4" y2="8" stroke="#ffffff" strokeWidth="4" />
                      </pattern>
                      {/* Striped pattern for White-Brown (Pins 7 -> 7) */}
                      <pattern id="wbr-stripe" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="8" stroke="#a16207" strokeWidth="4" />
                        <line x1="4" y1="0" x2="4" y2="8" stroke="#ffffff" strokeWidth="4" />
                      </pattern>
                    </defs>

                    {/* Pin Y-Coordinates: (280 - 16) / 7 = 37.7px each: 10, 48, 86, 124, 162, 200, 238, 276 */}

                    {/* Pin 4: Blue (Straight) */}
                    <path d="M 0 124 L 300 124" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" />

                    {/* Pin 5: White-Blue (Straight) */}
                    <path d="M 0 162 L 300 162" stroke="url(#wb-stripe)" strokeWidth="8" strokeLinecap="round" />

                    {/* Pin 7: White-Brown (Straight) */}
                    <path d="M 0 238 L 300 238" stroke="url(#wbr-stripe)" strokeWidth="8" strokeLinecap="round" />

                    {/* Pin 8: Brown (Straight) */}
                    <path d="M 0 274 L 300 274" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />

                    {/* Pin 1 (White-Orange) crosses down to Pin 3 (Y=86) */}
                    <path d="M 0 10 C 120 10, 180 86, 300 86" stroke="url(#wo-stripe)" strokeWidth="8" strokeLinecap="round" />

                    {/* Pin 2 (Orange) crosses down to Pin 6 (Y=200) */}
                    <path d="M 0 48 C 120 48, 180 200, 300 200" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />

                    {/* Pin 3 (White-Green) crosses up to Pin 1 (Y=10) */}
                    <path d="M 0 86 C 120 86, 180 10, 300 10" stroke="url(#wg-stripe)" strokeWidth="8" strokeLinecap="round" />

                    {/* Pin 6 (Green) crosses up to Pin 2 (Y=48) */}
                    <path d="M 0 200 C 120 200, 180 48, 300 48" stroke="#16a34a" strokeWidth="8" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-center text-amber-300">
                Pins 1 & 2 (TX) cross to Pins 3 & 6 (RX). Pins 4, 5, 7, 8 pass straight across!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
