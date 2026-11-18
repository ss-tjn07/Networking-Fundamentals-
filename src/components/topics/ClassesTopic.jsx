import React, { useState } from 'react';
import { Table, Calculator, Search } from 'lucide-react';

export default function ClassesTopic() {
  const [ipInput, setIpInput] = useState('192.168.10.45');

  const calculateResult = () => {
    const parts = ipInput.trim().split('.');
    const firstOctet = parseInt(parts[0], 10);

    if (isNaN(firstOctet) || parts.length < 1) {
      return {
        className: 'Invalid IP',
        color: 'text-rose-400',
        mask: 'N/A',
        netId: 'N/A',
        hosts: 'N/A'
      };
    }

    if (firstOctet === 127) {
      return {
        className: 'Loopback (127)',
        color: 'text-amber-400',
        mask: '255.0.0.0',
        netId: '127.0.0.0',
        hosts: 'Host Diagnostic Only'
      };
    }

    if (firstOctet >= 1 && firstOctet <= 126) {
      return {
        className: 'Class A',
        color: 'text-cyan-400',
        mask: '255.0.0.0 (/8)',
        netId: `${parts[0]}.0.0.0`,
        hosts: '16,777,214 Hosts'
      };
    }

    if (firstOctet >= 128 && firstOctet <= 191) {
      return {
        className: 'Class B',
        color: 'text-purple-400',
        mask: '255.255.0.0 (/16)',
        netId: `${parts[0]}.${parts[1] || '0'}.0.0`,
        hosts: '65,534 Hosts'
      };
    }

    if (firstOctet >= 192 && firstOctet <= 223) {
      return {
        className: 'Class C',
        color: 'text-emerald-400',
        mask: '255.255.255.0 (/24)',
        netId: `${parts[0]}.${parts[1] || '0'}.${parts[2] || '0'}.0`,
        hosts: '254 Hosts'
      };
    }

    if (firstOctet >= 224 && firstOctet <= 239) {
      return {
        className: 'Class D (Multicast)',
        color: 'text-amber-400',
        mask: 'None (No Subnetting)',
        netId: 'Multicast Stream',
        hosts: 'Group Members'
      };
    }

    if (firstOctet >= 240 && firstOctet <= 255) {
      return {
        className: 'Class E (Experimental)',
        color: 'text-rose-400',
        mask: 'Reserved',
        netId: 'R&D Range',
        hosts: 'Reserved'
      };
    }

    return {
      className: 'Out of Range',
      color: 'text-rose-400',
      mask: 'N/A',
      netId: 'N/A',
      hosts: 'N/A'
    };
  };

  const res = calculateResult();

  return (
    <div className="space-y-6">
      {/* Class Summary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" /> IPv4 Classful Architecture Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">Classful boundaries based on highest-order leading bits.</p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
            HISTORICAL STANDARD
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Class</th>
                <th className="p-3">Leading Bits</th>
                <th className="p-3">Octet Range</th>
                <th className="p-3">Default Subnet Mask</th>
                <th className="p-3">Net / Host Division</th>
                <th className="p-3">Max Usable Hosts</th>
                <th className="p-3">Primary Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-cyan-400">Class A</td>
                <td className="p-3">0...</td>
                <td className="p-3">1 - 126</td>
                <td className="p-3 text-emerald-400">255.0.0.0 (/8)</td>
                <td className="p-3"><span className="text-cyan-400 font-bold">N</span>.H.H.H</td>
                <td className="p-3 font-bold text-white">16,777,214</td>
                <td className="p-3 text-slate-400">Giant Telecoms, Governments</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-purple-400">Class B</td>
                <td className="p-3">10...</td>
                <td className="p-3">128 - 191</td>
                <td className="p-3 text-emerald-400">255.255.0.0 (/16)</td>
                <td className="p-3"><span className="text-purple-400 font-bold">N.N</span>.H.H</td>
                <td className="p-3 font-bold text-white">65,534</td>
                <td className="p-3 text-slate-400">Large Universities & Enterprises</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-emerald-400">Class C</td>
                <td className="p-3">110...</td>
                <td className="p-3">192 - 223</td>
                <td className="p-3 text-emerald-400">255.255.255.0 (/24)</td>
                <td className="p-3"><span className="text-emerald-400 font-bold">N.N.N</span>.H</td>
                <td className="p-3 font-bold text-white">254</td>
                <td className="p-3 text-slate-400">Small Business / Home LANs</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-amber-400">Class D</td>
                <td className="p-3">1110...</td>
                <td className="p-3">224 - 239</td>
                <td className="p-3 text-slate-500">N/A (No host bits)</td>
                <td className="p-3">Multicast Group</td>
                <td className="p-3 text-slate-500">N/A</td>
                <td className="p-3 text-amber-300">Multicast (Video streaming, OSPF)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-rose-400">Class E</td>
                <td className="p-3">1111...</td>
                <td className="p-3">240 - 255</td>
                <td className="p-3 text-slate-500">N/A</td>
                <td className="p-3">Reserved</td>
                <td className="p-3 text-slate-500">N/A</td>
                <td className="p-3 text-rose-300">Experimental / R&D Research</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>* 127.0.0.0/8 is reserved for internal loopback diagnostic tests (127.0.0.1 = localhost).</span>
          <span>Usable Hosts = 2^(Host Bits) - 2 (Network ID & Broadcast ID)</span>
        </div>
      </div>

      {/* Interactive IP Class & Subnet Analyzer Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="font-bold text-white text-base flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-cyan-400" /> Interactive IPv4 Address Class Calculator
        </h4>
        <p className="text-xs text-slate-400 mb-6">Type any IPv4 address to determine its Class, Network ID, Broadcast ID, and usable host range.</p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 10.0.5.1"
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-cyan-400 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIpInput('10.50.1.20')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
            >
              Class A
            </button>
            <button
              onClick={() => setIpInput('172.16.4.15')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
            >
              Class B
            </button>
            <button
              onClick={() => setIpInput('192.168.1.1')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
            >
              Class C
            </button>
          </div>
        </div>

        {/* Output Diagnostic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block font-bold">DETECTED CLASS</span>
            <span className={`text-lg font-mono font-extrabold mt-1 block ${res.color}`}>{res.className}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block font-bold">DEFAULT SUBNET MASK</span>
            <span className="text-sm font-mono font-bold text-purple-400 mt-1.5 block">{res.mask}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block font-bold">NETWORK ID (Subnet)</span>
            <span className="text-sm font-mono font-bold text-emerald-400 mt-1.5 block">{res.netId}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block font-bold">USABLE HOST CAPACITY</span>
            <span className="text-sm font-mono font-bold text-white mt-1.5 block">{res.hosts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

