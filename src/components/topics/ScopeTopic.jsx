import React from 'react';
import { Home, Building2, Globe2, ZoomIn, Laptop, Printer, Smartphone, Check } from 'lucide-react';

export default function ScopeTopic() {
  return (
    <div className="space-y-6">
      {/* Comparative Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LAN */}
        <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">LOCAL</span>
              <Home className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mt-2">LAN (Local Area Network)</h3>
            <p className="text-xs text-slate-300 mt-1">Single room, home, school computer lab, or corporate office building.</p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Coverage:</span>
                <span className="font-mono text-cyan-300">&lt; 1 Kilometer</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="font-mono text-cyan-300">1 Gbps - 100 Gbps</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Latency:</span>
                <span className="font-mono text-emerald-400">&lt; 1 - 2 ms (Extremely low)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ownership:</span>
                <span className="text-slate-200">Privately Owned</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-mono">
            Tech: Wi-Fi 6/7 (802.11ax/be), Cat6 Ethernet
          </div>
        </div>

        {/* MAN */}
        <div className="bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded">METROPOLITAN</span>
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mt-2">MAN (Metropolitan Area)</h3>
            <p className="text-xs text-slate-300 mt-1">Spans an entire city, municipality, university campus cluster, or cable TV network.</p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Coverage:</span>
                <span className="font-mono text-purple-300">5 - 50 Kilometers</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="font-mono text-purple-300">100 Mbps - 10 Gbps</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Latency:</span>
                <span className="font-mono text-purple-400">5 - 15 ms (Moderate)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ownership:</span>
                <span className="text-slate-200">Consortium / City / Telecom</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-purple-400 font-mono">
            Tech: Metro Ethernet, Dark Fiber Rings, DWDM
          </div>
        </div>

        {/* WAN */}
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">WIDE / GLOBAL</span>
              <Globe2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mt-2">WAN (Wide Area Network)</h3>
            <p className="text-xs text-slate-300 mt-1">Cross-country and trans-continental networks. The Global Internet is the supreme WAN.</p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Coverage:</span>
                <span className="font-mono text-emerald-300">Worldwide (100,000+ km)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="font-mono text-emerald-300">Variable (ISP Throttled)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Latency:</span>
                <span className="font-mono text-amber-400">30 - 250+ ms (Propagation delays)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ownership:</span>
                <span className="text-slate-200">Multiple Tier-1 Carriers</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
            Tech: Undersea Submarine Cables, Satellites, MPLS
          </div>
        </div>
      </div>

      {/* Interactive Scale Comparison Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <ZoomIn className="w-4 h-4 text-cyan-400" /> Nested Hierarchy Visualizer (LAN inside MAN inside WAN)
        </h4>

        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
          {/* WAN Bubble */}
          <div className="border-2 border-dashed border-emerald-500/60 bg-emerald-950/20 rounded-2xl p-6 w-full max-w-sm text-center">
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 border border-emerald-700 px-3 py-1 rounded-full">
              WAN: Global Internet Backbone
            </span>

            {/* Inside MAN Bubble */}
            <div className="mt-4 border-2 border-dashed border-purple-500/60 bg-purple-950/30 rounded-xl p-4 text-center">
              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950 border border-purple-700 px-2 py-0.5 rounded-full">
                MAN: City Metro Loop
              </span>

              {/* Inside LAN Bubble */}
              <div className="mt-4 border-2 border-cyan-500 bg-cyan-950/40 rounded-lg p-3 text-center">
                <span className="text-[11px] font-mono font-bold text-cyan-300">
                  LAN: Your Office / Campus
                </span>
                <div className="flex justify-center gap-2 mt-2">
                  <Laptop className="w-4 h-4 text-cyan-300" />
                  <Printer className="w-4 h-4 text-cyan-300" />
                  <Smartphone className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick comparison table for students */}
          <div className="w-full max-w-md text-xs space-y-3">
            <h5 className="font-bold text-slate-200">Exam Cheat Sheet Differences:</h5>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Fault Tolerance:</strong> LAN has the lowest complexity; WAN uses dynamic routing (BGP) to bypass broken undersea cables.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Error Rates:</strong> LAN has virtually zero noise errors; WAN experiences packet loss and jitter across cross-continental hops.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>PAN (Personal Area Network):</strong> Don't forget PAN! Bluetooth devices around 1 person within 10 meters (AirPods, Smartwatch).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

