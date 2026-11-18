import React, { useState } from 'react';
import { Globe, Lock, BookOpen, Terminal, FileText, Mail, Activity, Play, Laptop, Server, Database, ExternalLink, Compass, Sparkles } from 'lucide-react';

export default function PortsProtocolsTopic({ setStatusMessage }) {
  const [activeProtocol, setActiveProtocol] = useState('http');
  const [tcpStepStates, setTcpStepStates] = useState([false, false, false]);
  const [dnsStepStates, setDnsStepStates] = useState([false, false, false]);
  const [consoleLogs, setConsoleLogs] = useState([
    '// Ready to inspect packet handshakes and query resolutions.'
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectProtocol = (proto) => {
    setActiveProtocol(proto);
    setTcpStepStates([false, false, false]);
    setDnsStepStates([false, false, false]);
    if (proto === 'http' || proto === 'https') {
      setConsoleLogs(['// TCP State: LISTEN. Ready to initiate 3-Way Handshake.']);
    } else if (proto === 'dns') {
      setConsoleLogs(['// Cache checked (Miss). Ready to execute recursive DNS resolution.']);
    } else {
      setConsoleLogs([`// Protocol ${proto.toUpperCase()} selected. Ready to inspect connection mechanism.`]);
    }
  };

  const runProtocolAction = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    if (activeProtocol === 'http' || activeProtocol === 'https') {
      setTcpStepStates([true, false, false]);
      setConsoleLogs([
        '> [STEP 1: SYN]: Client sends Synchronize packet with random Initial Sequence Number (ISN=100).'
      ]);

      setTimeout(() => {
        setTcpStepStates([true, true, false]);
        setConsoleLogs((prev) => [
          ...prev,
          '> [STEP 2: SYN-ACK]: Server responds with its own ISN (300) and Acknowledgement (101).'
        ]);
      }, 600);

      setTimeout(() => {
        setTcpStepStates([true, true, true]);
        setConsoleLogs((prev) => [
          ...prev,
          '> [STEP 3: ACK]: Client acknowledges server ISN (301). Connection ESTABLISHED! HTTP GET dispatched.'
        ]);
        setStatusMessage("TCP Handshake complete! Data pipe ready.");
        setIsSimulating(false);
      }, 1200);
    } else if (activeProtocol === 'dns') {
      setDnsStepStates([true, false, false]);
      setConsoleLogs([
        '> 1. Root Name Server (.) queries TLD server for .com extension...'
      ]);

      setTimeout(() => {
        setDnsStepStates([true, true, false]);
        setConsoleLogs((prev) => [
          ...prev,
          '> 2. .com TLD server refers resolver to Google Authoritative DNS (ns1.google.com)...'
        ]);
      }, 600);

      setTimeout(() => {
        setDnsStepStates([true, true, true]);
        setConsoleLogs((prev) => [
          ...prev,
          '> 3. Authoritative DNS returns A Record: google.com → 142.250.190.46 (TTL: 300s). Cached!'
        ]);
        setStatusMessage("DNS resolution complete: 142.250.190.46");
        setIsSimulating(false);
      }, 1200);
    } else {
      setConsoleLogs([
        `> [${activeProtocol.toUpperCase()}] Handshake verified. Session encryption key negotiated.`
      ]);
      setStatusMessage(`${activeProtocol.toUpperCase()} security and parameter check completed.`);
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Interactive External Tool: A2A Protocol Explorer */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/40 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                A2A Protocol Explorer
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
                Interactive Online Tool
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Explore interactive protocol trees, packet specifications, port allocations, and communication workflows with the online Protocol Explorer tool.
            </p>
          </div>
        </div>

        <a
          href="https://a2aprotocol.ai/tools/protocol-explorer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer shrink-0"
        >
          <span>Launch Protocol Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Protocol Cards / Port Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* HTTP */}
        <div
          onClick={() => selectProtocol('http')}
          className={`p-3 bg-slate-900 border rounded-xl cursor-pointer transition ${
            activeProtocol === 'http' ? 'border-cyan-500 bg-slate-800' : 'border-slate-800 hover:border-cyan-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400">PORT 80</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <h5 className="text-xs font-bold text-white mt-1">HTTP</h5>
          <p className="text-[10px] text-slate-400">Unencrypted HyperText Transfer</p>
        </div>

        {/* HTTPS */}
        <div
          onClick={() => selectProtocol('https')}
          className={`p-3 bg-slate-900 border rounded-xl cursor-pointer transition ${
            activeProtocol === 'https' ? 'border-emerald-500 bg-slate-800' : 'border-slate-800 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">PORT 443</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <h5 className="text-xs font-bold text-white mt-1">HTTPS</h5>
          <p className="text-[10px] text-slate-400">Encrypted TLS/SSL Web</p>
        </div>

        {/* DNS */}
        <div
          onClick={() => selectProtocol('dns')}
          className={`p-3 bg-slate-900 border rounded-xl cursor-pointer transition ${
            activeProtocol === 'dns' ? 'border-purple-500 bg-slate-800' : 'border-slate-800 hover:border-purple-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400">PORT 53</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <h5 className="text-xs font-bold text-white mt-1">DNS</h5>
          <p className="text-[10px] text-slate-400">Domain Name System (UDP/TCP)</p>
        </div>

        {/* SSH */}
        <div
          onClick={() => selectProtocol('ssh')}
          className={`p-3 bg-slate-900 border rounded-xl cursor-pointer transition ${
            activeProtocol === 'ssh' ? 'border-amber-500 bg-slate-800' : 'border-slate-800 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400">PORT 22</span>
            <Terminal className="w-4 h-4 text-amber-400" />
          </div>
          <h5 className="text-xs font-bold text-white mt-1">SSH</h5>
          <p className="text-[10px] text-slate-400">Secure Shell Remote Terminal</p>
        </div>

        {/* FTP */}
        <div
          onClick={() => selectProtocol('ftp')}
          className={`p-3 bg-slate-900 border rounded-xl cursor-pointer transition ${
            activeProtocol === 'ftp' ? 'border-blue-500 bg-slate-800' : 'border-slate-800 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-400">PORT 20/21</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <h5 className="text-xs font-bold text-white mt-1">FTP</h5>
          <p className="text-[10px] text-slate-400">File Transfer Protocol</p>
        </div>

        {/* SMTP & SNMP */}
        <div
          onClick={() => selectProtocol('smtp')}
          className={`p-3 bg-slate-900 border rounded-xl cursor-pointer transition ${
            activeProtocol === 'smtp' ? 'border-rose-500 bg-slate-800' : 'border-slate-800 hover:border-rose-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400">PORT 25 / 161</span>
            <Mail className="w-4 h-4 text-rose-400" />
          </div>
          <h5 className="text-xs font-bold text-white mt-1">SMTP & SNMP</h5>
          <p className="text-[10px] text-slate-400">Mail & Network Management</p>
        </div>
      </div>

      {/* Interactive Protocol Simulation Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              {activeProtocol === 'http' || activeProtocol === 'https'
                ? `Interactive TCP 3-Way Handshake (${activeProtocol.toUpperCase()}: Port ${activeProtocol === 'http' ? '80' : '443'})`
                : activeProtocol === 'dns'
                ? 'DNS Recursive Resolution (UDP Port 53)'
                : `Secure Shell & Management (Port ${activeProtocol === 'ssh' ? '22' : activeProtocol === 'ftp' ? '20/21' : '25/161'})`}
            </h3>
            <p className="text-xs text-slate-400">
              {activeProtocol === 'http' || activeProtocol === 'https'
                ? 'Reliable stream establishment: Client SYN → Server SYN-ACK → Client ACK.'
                : activeProtocol === 'dns'
                ? "Translating human-friendly domain 'google.com' into computer IP 142.250.190.46."
                : 'Encrypted asymmetric key exchange and secure telemetry polling.'}
            </p>
          </div>

          <button
            onClick={runProtocolAction}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>
              {activeProtocol === 'http' || activeProtocol === 'https'
                ? 'Dispatch TCP Handshake'
                : activeProtocol === 'dns'
                ? "Resolve 'google.com'"
                : 'Perform Protocol Check'}
            </span>
          </button>
        </div>

        {/* Simulation Canvas */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {activeProtocol === 'http' || activeProtocol === 'https' ? (
            <>
              <div className="md:col-span-3 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-cyan-400 flex items-center justify-center">
                  <Laptop className="w-8 h-8 text-cyan-300" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2">Browser Client</span>
                <span className="text-[10px] text-slate-400">Port 52140</span>
              </div>

              <div className="md:col-span-6 space-y-3">
                <div
                  className={`p-2 rounded border text-xs flex justify-between font-mono transition-all ${
                    tcpStepStates[0]
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="text-cyan-400">1. [SYN]</span>
                  <span>Seq = 100</span>
                  <span className="text-cyan-400">&rarr;&rarr;&rarr;</span>
                </div>
                <div
                  className={`p-2 rounded border text-xs flex justify-between font-mono transition-all ${
                    tcpStepStates[1]
                      ? 'border-purple-400 bg-purple-950/40 text-purple-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="text-purple-400">&larr;&larr;&larr;</span>
                  <span>Seq = 300, Ack = 101</span>
                  <span className="text-purple-400">2. [SYN-ACK]</span>
                </div>
                <div
                  className={`p-2 rounded border text-xs flex justify-between font-mono transition-all ${
                    tcpStepStates[2]
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="text-emerald-400">3. [ACK]</span>
                  <span>Ack = 301</span>
                  <span className="text-emerald-400">&rarr;&rarr;&rarr;</span>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center">
                  <Server className="w-8 h-8 text-cyan-400" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2">Web Server</span>
                <span className="text-[10px] font-mono text-cyan-400">
                  Port {activeProtocol === 'http' ? '80' : '443'}
                </span>
              </div>
            </>
          ) : activeProtocol === 'dns' ? (
            <>
              <div className="md:col-span-3 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-purple-400 flex items-center justify-center">
                  <Laptop className="w-8 h-8 text-purple-300" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2">Client Resolver</span>
              </div>

              <div className="md:col-span-6 space-y-2 text-xs font-mono">
                <div
                  className={`p-2 rounded border flex justify-between transition-all ${
                    dnsStepStates[0]
                      ? 'border-purple-400 bg-purple-950/40 text-purple-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span>Query: "google.com" &rarr;</span>
                  <span className="text-purple-400">Root Server (.)</span>
                </div>
                <div
                  className={`p-2 rounded border flex justify-between transition-all ${
                    dnsStepStates[1]
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span>Refers to &rarr;</span>
                  <span className="text-cyan-400">TLD Server (.com)</span>
                </div>
                <div
                  className={`p-2 rounded border flex justify-between transition-all ${
                    dnsStepStates[2]
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span>Resolved by &rarr;</span>
                  <span className="text-emerald-400">Authoritative Server</span>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-purple-950 border-2 border-purple-500 flex items-center justify-center">
                  <Database className="w-8 h-8 text-purple-400" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2">DNS Hierarchy</span>
                <span className="text-[10px] font-mono text-purple-300">A-Record Response</span>
              </div>
            </>
          ) : (
            <div className="md:col-span-12 p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                {activeProtocol} Protocol Active
              </span>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                {activeProtocol === 'ssh'
                  ? 'SSH operates over Port 22 using Diffie-Hellman key exchange for encrypted command execution.'
                  : activeProtocol === 'ftp'
                  ? 'FTP uses Port 21 for commands and Port 20 for data streaming.'
                  : 'SNMP polls device health via UDP 161 while traps arrive on 162.'}
              </p>
            </div>
          )}
        </div>

        {/* Telemetry Logs */}
        <div className="p-3 bg-black/70 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          {consoleLogs.map((log, idx) => {
            let color = 'text-slate-300';
            if (log.startsWith('//')) color = 'text-slate-500';
            else if (log.includes('SYN]:')) color = 'text-cyan-400';
            else if (log.includes('SYN-ACK]:')) color = 'text-purple-400';
            else if (log.includes('ACK]:') || log.includes('Authoritative')) color = 'text-emerald-400';
            else if (log.includes('Root')) color = 'text-purple-300';
            else if (log.includes('TLD')) color = 'text-cyan-300';
            return <div key={idx} className={color}>{log}</div>;
          })}
        </div>
      </div>

      {/* Recommended Interactive Link Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase">Deep-Dive Protocol Exploration</span>
          </div>
          <p className="text-xs text-slate-400">
            For advanced packet dissection and cross-protocol comparisons, visit <strong className="text-slate-200">A2A Protocol Explorer</strong> at{' '}
            <a
              href="https://a2aprotocol.ai/tools/protocol-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              https://a2aprotocol.ai/tools/protocol-explorer
            </a>
          </p>
        </div>

        <a
          href="https://a2aprotocol.ai/tools/protocol-explorer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs font-mono transition cursor-pointer shrink-0"
        >
          <span>Open Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

