import React, { useState } from 'react';
import { Hash, Sparkles, Binary } from 'lucide-react';

export default function Ipv4Ipv6Topic() {
  const [octets, setOctets] = useState({
    o1: 192,
    o2: 168,
    o3: 1,
    o4: 50
  });

  const handleOctetChange = (key, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 0;
    num = Math.max(0, Math.min(255, num));
    setOctets((prev) => ({ ...prev, [key]: num }));
  };

  const b1 = octets.o1.toString(2).padStart(8, '0');
  const b2 = octets.o2.toString(2).padStart(8, '0');
  const b3 = octets.o3.toString(2).padStart(8, '0');
  const b4 = octets.o4.toString(2).padStart(8, '0');

  const fullBinaryStream = `${b1}.${b2}.${b3}.${b4}`;

  return (
    <div className="space-y-6">
      {/* Comparison Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IPv4 Card */}
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded">
                32-BIT ADDRESSING
              </span>
              <Hash className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mt-2">IPv4 (Internet Protocol v4)</h3>
            <p className="text-xs text-slate-300 mt-1">Deployed in 1983 for ARPANET. Dotted-decimal notation divided into 4 octets.</p>

            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center">
              <span className="text-sm font-bold text-cyan-400">192 . 168 . 1 . 100</span>
              <span className="text-[10px] text-slate-500 block mt-1">4 Octets × 8 Bits = 32 Total Bits</span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Total Pool:</span>
                <span className="font-mono text-cyan-300">2^32 ≈ 4.29 Billion Addresses</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Status:</span>
                <span className="font-mono text-rose-400">Depleted (Requires NAT workaround)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Header Size:</span>
                <span className="font-mono text-slate-300">20 - 60 Bytes (Variable options)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Configuration:</span>
                <span className="text-slate-300">Manual or DHCP</span>
              </div>
            </div>
          </div>
        </div>

        {/* IPv6 Card */}
        <div className="bg-slate-900 border-2 border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2.5 py-1 rounded">
                128-BIT ADDRESSING
              </span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mt-2">IPv6 (Next-Gen Protocol)</h3>
            <p className="text-xs text-slate-300 mt-1">Hexadecimal notation divided into 8 hextets separated by colons.</p>

            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center">
              <span className="text-xs font-bold text-purple-400">2001:0db8:85a3::8a2e:0370:7334</span>
              <span className="text-[10px] text-slate-500 block mt-1">8 Hextets × 16 Bits = 128 Total Bits</span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Total Pool:</span>
                <span className="font-mono text-purple-300">2^128 ≈ 3.4 × 10^38 Addresses</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">NAT Required:</span>
                <span className="font-mono text-emerald-400">No (True End-to-End reachability)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Header Size:</span>
                <span className="font-mono text-emerald-400">Fixed 40 Bytes (Faster router lookups)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security:</span>
                <span className="text-slate-300">IPSec natively integrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive IPv4 Octet-to-Binary Classroom Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="font-bold text-white text-base flex items-center gap-2 mb-2">
          <Binary className="w-5 h-5 text-cyan-400" /> Interactive IPv4 Decimal-to-Binary Dissector
        </h4>
        <p className="text-xs text-slate-400 mb-6">Type or adjust any octet below to see how routers view IPv4 addresses in raw binary bits.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Octet 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <label className="text-[10px] font-mono text-slate-400 font-bold mb-1">OCTET 1</label>
            <input
              type="number"
              min="0"
              max="255"
              value={octets.o1}
              onChange={(e) => handleOctetChange('o1', e.target.value)}
              className="w-20 text-center bg-slate-900 border border-cyan-500 rounded-lg p-2 font-mono font-bold text-cyan-300 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-xs font-mono text-emerald-400 mt-2 font-bold tracking-wider">{b1}</span>
            <span className="text-[9px] text-slate-500 mt-1">128+64 = {octets.o1}</span>
          </div>

          {/* Octet 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <label className="text-[10px] font-mono text-slate-400 font-bold mb-1">OCTET 2</label>
            <input
              type="number"
              min="0"
              max="255"
              value={octets.o2}
              onChange={(e) => handleOctetChange('o2', e.target.value)}
              className="w-20 text-center bg-slate-900 border border-cyan-500 rounded-lg p-2 font-mono font-bold text-cyan-300 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-xs font-mono text-emerald-400 mt-2 font-bold tracking-wider">{b2}</span>
            <span className="text-[9px] text-slate-500 mt-1">Bit Val = {octets.o2}</span>
          </div>

          {/* Octet 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <label className="text-[10px] font-mono text-slate-400 font-bold mb-1">OCTET 3</label>
            <input
              type="number"
              min="0"
              max="255"
              value={octets.o3}
              onChange={(e) => handleOctetChange('o3', e.target.value)}
              className="w-20 text-center bg-slate-900 border border-cyan-500 rounded-lg p-2 font-mono font-bold text-cyan-300 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-xs font-mono text-emerald-400 mt-2 font-bold tracking-wider">{b3}</span>
            <span className="text-[9px] text-slate-500 mt-1">Bit Val = {octets.o3}</span>
          </div>

          {/* Octet 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <label className="text-[10px] font-mono text-slate-400 font-bold mb-1">OCTET 4</label>
            <input
              type="number"
              min="0"
              max="255"
              value={octets.o4}
              onChange={(e) => handleOctetChange('o4', e.target.value)}
              className="w-20 text-center bg-slate-900 border border-cyan-500 rounded-lg p-2 font-mono font-bold text-cyan-300 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-xs font-mono text-emerald-400 mt-2 font-bold tracking-wider">{b4}</span>
            <span className="text-[9px] text-slate-500 mt-1">Bit Val = {octets.o4}</span>
          </div>
        </div>

        {/* Complete Binary Stream */}
        <div className="mt-6 p-4 rounded-xl bg-black/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">Full 32-Bit Unbroken Stream:</span>
          <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 tracking-widest break-all">
            {fullBinaryStream}
          </span>
        </div>
      </div>
    </div>
  );
}

