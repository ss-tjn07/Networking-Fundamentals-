import React, { useState } from 'react';
import { Lock, RefreshCw, Radio, Play, Laptop, Server } from 'lucide-react';

export default function DhcpDoraTopic() {
  const [doraStage, setDoraStage] = useState(0);

  const resetDora = () => {
    setDoraStage(0);
  };

  const stepDora = () => {
    if (doraStage >= 4) {
      resetDora();
    } else {
      setDoraStage((prev) => prev + 1);
    }
  };

  const getStepButtonLabel = () => {
    switch (doraStage) {
      case 0:
        return 'Start: 1. Discover';
      case 1:
        return 'Step 2: Offer';
      case 2:
        return 'Step 3: Request';
      case 3:
        return 'Step 4: Acknowledge';
      default:
        return 'Completed (Reset)';
    }
  };

  const getLogContent = () => {
    switch (doraStage) {
      case 1:
        return (
          <>
            <span className="text-cyan-400">&gt; [1. DISCOVER]:</span> Client broadcasts UDP datagram from 0.0.0.0:68 to 255.255.255.255:67 asking: "Is there any DHCP Server active on this local LAN?"
          </>
        );
      case 2:
        return (
          <>
            <span className="text-purple-400">&gt; [2. OFFER]:</span> DHCP Server reserves IP 192.168.1.55 from its pool and sends an Offer packet containing Subnet Mask (255.255.255.0), Gateway (192.168.1.1), and DNS (8.8.8.8).
          </>
        );
      case 3:
        return (
          <>
            <span className="text-blue-400">&gt; [3. REQUEST]:</span> Client formally replies to the server: "Thank you, I would like to accept the lease for 192.168.1.55." (Broadcasted so other potential DHCP servers know their offers were declined).
          </>
        );
      case 4:
        return (
          <>
            <span className="text-emerald-400">&gt; [4. ACKNOWLEDGE]:</span> DHCP Server sends DHCPACK finalizing lease agreement! Host network interface configured.
          </>
        );
      default:
        return 'Click "Start: 1. Discover" to initiate the DORA broadcast.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Static vs Dynamic Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Lock className="w-4 h-4" /> Static IP Addressing
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Manually configured on the device adapter. Never changes unless altered by a network admin. Essential for web servers, DNS servers, and network printers so clients always know where to find them.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <RefreshCw className="w-4 h-4" /> Dynamic IP (DHCP)
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Automated assignment via <strong>Dynamic Host Configuration Protocol</strong>. Devices lease an IP address from an available pool for a set duration. Reduces human configuration errors and IP collisions.
          </p>
        </div>
      </div>

      {/* Interactive DORA Process Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" /> The DORA Protocol Handshake Simulator
            </h3>
            <p className="text-xs text-slate-400">Step through the 4-stage DHCP handshake between a new laptop and router.</p>
          </div>

          {/* DORA Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetDora}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={stepDora}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{getStepButtonLabel()}</span>
            </button>
          </div>
        </div>

        {/* Visualization Stage */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Client PC */}
          <div className="md:col-span-3 flex flex-col items-center text-center">
            <div
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center p-2 shadow-lg transition-all duration-300 ${
                doraStage === 4
                  ? 'bg-slate-800 border-2 border-emerald-500 shadow-emerald-500/20'
                  : 'bg-slate-800 border-2 border-slate-600'
              }`}
            >
              <Laptop className={`w-8 h-8 ${doraStage === 4 ? 'text-emerald-400' : 'text-slate-300'}`} />
              <span className={`text-[9px] font-mono font-bold mt-1 ${doraStage === 4 ? 'text-emerald-300' : 'text-slate-300'}`}>
                CLIENT PC
              </span>
            </div>
            <span
              className={`text-xs font-mono font-bold mt-2 ${
                doraStage === 4 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {doraStage === 4 ? 'IP: 192.168.1.55 (Active Lease)' : 'IP: 0.0.0.0 (Unassigned)'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">MAC: 4A:2B:CC:90</span>
          </div>

          {/* Interactive Exchange Highway */}
          <div className="md:col-span-6 flex flex-col space-y-2.5">
            {/* Discover */}
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                doraStage >= 1
                  ? 'border-cyan-500 bg-cyan-950/40 shadow-md'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-400">D</span>
                <span className={`font-bold ${doraStage >= 1 ? 'text-cyan-200' : 'text-slate-400'}`}>
                  DHCP DISCOVER
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Client &rarr; Broadcast (255.255.255.255)</span>
            </div>

            {/* Offer */}
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                doraStage >= 2
                  ? 'border-purple-500 bg-purple-950/40 shadow-md'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-purple-400">O</span>
                <span className={`font-bold ${doraStage >= 2 ? 'text-purple-200' : 'text-slate-400'}`}>
                  DHCP OFFER
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Server &rarr; Client (Offers 192.168.1.55)</span>
            </div>

            {/* Request */}
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                doraStage >= 3
                  ? 'border-blue-500 bg-blue-950/40 shadow-md'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-400">R</span>
                <span className={`font-bold ${doraStage >= 3 ? 'text-blue-200' : 'text-slate-400'}`}>
                  DHCP REQUEST
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Client &rarr; Server ("I accept 192.168.1.55")</span>
            </div>

            {/* Acknowledge */}
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                doraStage >= 4
                  ? 'border-emerald-500 bg-emerald-950/40 shadow-md'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-400">A</span>
                <span className={`font-bold ${doraStage >= 4 ? 'text-emerald-200' : 'text-slate-400'}`}>
                  DHCP ACKNOWLEDGE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Server &rarr; Client (Lease Locked 24 hrs)</span>
            </div>
          </div>

          {/* DHCP Server */}
          <div className="md:col-span-3 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-cyan-950 border-2 border-cyan-500 flex flex-col items-center justify-center p-2 shadow-lg shadow-cyan-500/20">
              <Server className="w-8 h-8 text-cyan-400" />
              <span className="text-[9px] font-mono font-bold text-cyan-300 mt-1">DHCP SERVER</span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 mt-2">192.168.1.1</span>
            <span className="text-[10px] text-slate-500 font-mono">Pool: 192.168.1.50-200</span>
          </div>
        </div>

        {/* Handshake Log */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          {getLogContent()}
        </div>
      </div>
    </div>
  );
}

