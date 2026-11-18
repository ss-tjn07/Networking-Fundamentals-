import React, { useState, useRef, useEffect } from 'react';
import { Radio, Server, Share2, PlayCircle, Send, Laptop } from 'lucide-react';

export default function IntroTopic({ setStatusMessage }) {

  const [packetStyle, setPacketStyle] = useState({
    opacity: 0,
    left: '5%',
    transition: 'none'
  });
  const [senderActive, setSenderActive] = useState(false);
  const [receiverActive, setReceiverActive] = useState(false);
  const [logs, setLogs] = useState([
    '// Terminal packet logger initialized. Ready for transmission.',
    '> Transmission medium: Unshielded Twisted Pair (Cat6 Copper). Bandwidth: 1 Gbps.'
  ]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStartTransmission = () => {
    if (isTransmitting) return;
    setIsTransmitting(true);
    setSenderActive(true);
    setReceiverActive(false);

    setLogs((prev) => [
      ...prev,
      '> [Node A] Encapsulating payload: "Hello World" into IP Datagram...'
    ]);

    // Position at start
    setPacketStyle({
      opacity: 1,
      left: '5%',
      transition: 'none'
    });

    // Move packet
    setTimeout(() => {
      setPacketStyle({
        opacity: 1,
        left: '85%',
        transition: 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
      });
      setLogs((prev) => [
        ...prev,
        '> [Medium] Signal serialized into electromagnetic pulses. In flight...'
      ]);
    }, 50);

    // Arrive at Node B
    setTimeout(() => {
      setSenderActive(false);
      setReceiverActive(true);
      setPacketStyle((prev) => ({ ...prev, opacity: 0 }));
      setLogs((prev) => [
        ...prev,
        '> [Node B] Frame received! CRC Checksum: OK. Decapsulating payload: "Hello World"'
      ]);
      setStatusMessage("Data successfully transferred and acknowledged.");
    }, 1300);

    setTimeout(() => {
      setReceiverActive(false);
      setIsTransmitting(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left side: Core concepts */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" /> What is a Computer Network?
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            A computer network is an interconnected group of autonomous computing devices (<strong>nodes</strong>) capable of exchanging information and sharing computational resources using standardized communication channels (<strong>links</strong>) and formal rule sets (<strong>protocols</strong>).
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-cyan-400 font-semibold block">Nodes</span>
              <span className="text-slate-400 text-[11px]">Computers, Servers, IoT devices, Mobile phones, Routers.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-purple-400 font-semibold block">Transmission Links</span>
              <span className="text-slate-400 text-[11px]">Copper (Cat6), Optical Fiber, Wireless (Wi-Fi, 5G, Sat).</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-emerald-400 font-semibold block">Protocols</span>
              <span className="text-slate-400 text-[11px]">Rules of syntax & semantics: TCP/IP, Ethernet, HTTP, ARP.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-amber-400 font-semibold block">Resource Sharing</span>
              <span className="text-slate-400 text-[11px]">Files, Web services, Printers, APIs, Compute clusters.</span>
            </div>
          </div>
        </div>

        {/* Architecture Comparison Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Architectural Models</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-cyan-800/40 bg-cyan-950/20">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5" /> Client-Server
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Centralized server controls resources; clients request data (Web, Email, Databases). Easy to secure, single point of bottleneck.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-purple-800/40 bg-purple-950/20">
              <div className="font-bold text-purple-300 flex items-center gap-1.5 mb-1">
                <Share2 className="w-3.5 h-3.5" /> Peer-to-Peer (P2P)
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Every node acts as both client and server (BitTorrent, Blockchain). Highly fault-tolerant, decentralized, hard to govern.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Interactive Transmission Sandbox */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between grid-bg relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-cyan-400" /> Interactive Data Packet Transmission Demo
              </h4>
              <p className="text-[11px] text-slate-400">Transmit a chunk of data across physical media to see packetization.</p>
            </div>
            <button
              onClick={handleStartTransmission}
              disabled={isTransmitting}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Send "Hello World"
            </button>
          </div>

          {/* Visual Canvas/Animation Area */}
          <div className="py-8 relative flex items-center justify-between px-4 sm:px-12 my-6">
            {/* Node A (Sender) */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-16 h-16 rounded-2xl bg-cyan-950 border-2 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/30 transition-all duration-300 ${
                  senderActive ? 'scale-105 border-white ring-2 ring-cyan-400' : 'border-cyan-500'
                }`}
              >
                <Laptop className="w-8 h-8 text-cyan-400" />
                <span className="text-[9px] font-mono font-bold text-cyan-300 mt-0.5">NODE A</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">192.168.1.10</span>
            </div>

            {/* Connecting Medium Pipeline */}
            <div className="flex-1 relative mx-4 h-3 bg-slate-800 rounded-full overflow-hidden flex items-center border border-slate-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent w-full" />
              {/* Animated Packet in Transmission */}
              <div
                style={packetStyle}
                className="absolute w-8 h-4 rounded bg-gradient-to-r from-cyan-400 to-purple-500 text-[8px] font-mono text-black font-extrabold flex items-center justify-center shadow-md shadow-cyan-400/80 -translate-x-1/2"
              >
                PKT
              </div>
            </div>

            {/* Node B (Receiver) */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-16 h-16 rounded-2xl bg-slate-900 border-2 flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                  receiverActive
                    ? 'border-purple-400 shadow-purple-500/50 scale-105 ring-2 ring-purple-400'
                    : 'border-slate-700'
                }`}
              >
                <Server className="w-8 h-8 text-purple-400" />
                <span className="text-[9px] font-mono font-bold text-purple-300 mt-0.5">NODE B</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">192.168.1.20</span>
            </div>
          </div>

          {/* Terminal Telemetry Log */}
          <div
            ref={logContainerRef}
            className="bg-black/80 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 h-36 overflow-y-auto"
          >
            {logs.map((line, idx) => {
              let color = 'text-slate-300';
              if (line.startsWith('//')) color = 'text-slate-500';
              else if (line.includes('[Node A]')) color = 'text-amber-400';
              else if (line.includes('[Medium]')) color = 'text-cyan-400';
              else if (line.includes('[Node B]')) color = 'text-emerald-400';
              return <div key={idx} className={color}>{line}</div>;
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
          <span>Bit Stream: <code className="text-cyan-400 font-mono">01001000 01100101 01101100 01101100 01101111</code></span>
          <span className="text-slate-500">Latency: ~2ms</span>
        </div>
      </div>
    </div>
  );
}

