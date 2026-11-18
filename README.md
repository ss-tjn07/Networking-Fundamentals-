# Networking Fundamentals | Interactive Classroom Dashboard (React)

A modern, highly interactive React + Vite + Tailwind CSS application converted from the Networking Fundamentals Masterclass dashboard.

---

## 🚀 Quick Start

Run the development server:
```bash
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000).

To build for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📚 Curriculum & Interactive Simulators (10 Topics)

1. **Introduction to Networking**
   - Core concepts: Nodes, Transmission Links, Protocols, and Resource Sharing
   - Architectural models: Client-Server vs. Peer-to-Peer (P2P)
   - *Simulator*: Interactive real-time packet transmission demo with telemetry logs and serial bit stream inspection.

2. **Network Hardware (NIC, Hub, Switch, Router, Modem)**
   - L1 to L3 hardware devices breakdown & MAC address inspection with interactive 3D flip cards.
   - *Simulator*: Hub (L1 Blind Flooding) vs. Switch (L2 Smart Unicast MAC table) vs. Router (L3 IP subnet gateway) traffic flow simulation.

3. **Network Transmission Media: Guided vs. Unguided**
   - Guided (Bounded): Twisted Pair (Straight-Through vs. Crossover), Coaxial (RG-6), Fiber Optic (Single-Mode vs. Multi-Mode).
   - Unguided (Unbounded): Radio Frequency (Wi-Fi 2.4/5/6GHz), Microwaves & Satellite.
   - *Simulator*: Interactive T568A vs. T568B color pinout diagram, TX/RX crossing visualizer, and device interconnect helper (PC ↔ Switch vs. PC ↔ PC).

4. **Network Scope: LAN vs. MAN vs. WAN**
   - Coverage scale, ownership, latency, and throughput metrics comparison.
   - *Visualizer*: Nested Hierarchy diagram (WAN > MAN > LAN) + Exam cheat sheet differences (PAN, fault tolerance, error rates).

5. **Network Topologies**
   - Star, Bus, Ring, Full Mesh, Tree (Hierarchical), and Hybrid (Star-Ring) architectures.
   - *Simulator*: Live dynamic SVG topology canvas with interactive link failure injection ("Break Link / Cable Cut") and packet routing simulation.

6. **OSI 7-Layer vs. TCP/IP 4-Layer Model**
   - Side-by-side layer mapping and interactive layer inspection.
   - *Simulator*: Step-by-step PDU Encapsulation & Decapsulation pipeline (Application Data → TCP Segment → IP Packet → Ethernet Frame → Physical Bits).

7. **IPv4 vs. IPv6 Architecture**
   - 32-bit vs. 128-bit addressing, address exhaustion, and NAT elimination.
   - *Tool*: Interactive IPv4 Decimal-to-Binary Dissector with live 32-bit binary stream computation.

8. **Static IP vs. Dynamic IP (DHCP & DORA)**
   - Manual static IPs vs. automated leasing.
   - *Simulator*: Interactive 4-step DORA handshake (Discover → Offer → Request → Acknowledge) with dynamic client lease assignment.

9. **IPv4 Address Classes (A, B, C, D, E)**
   - Historical leading bits, default masks, usable host limits, and loopback rules.
   - *Tool*: Interactive IPv4 Address Class Calculator with class detection, subnet mask, network ID, and usable host capacity.

10. **Common Ports & Core Protocols**
   - Port matrix: HTTP (80), HTTPS (443), DNS (53), SSH (22), FTP (20/21), SMTP & SNMP (25/161).
   - *Simulators*: TCP 3-Way Handshake (SYN → SYN-ACK → ACK) with sequence numbers and recursive DNS query resolution (Root → TLD → Authoritative).

---

## 🛠️ Hands-on Practicals & TryHackMe Assignments

Official hands-on cyber lab assignments are integrated both as interactive cards within corresponding topics and via a dedicated **"Practicals (TryHackMe)"** dashboard:

1. **Introductory Networking**
   - **Room**: [https://tryhackme.com/room/introtonetworking](https://tryhackme.com/room/introtonetworking)
   - **Associated Topic**: Topic 01 (Introduction to Networking)
   - **Focus**: OSI 7-layer model, packet headers, encapsulation, ping, traceroute, and packet dissection.

2. **Intro to LAN**
   - **Room**: [https://tryhackme.com/room/introtolan](https://tryhackme.com/room/introtolan)
   - **Associated Topic**: Topic 03 (Network Scope: LAN vs MAN vs WAN) & Hardware
   - **Focus**: Local Area Network topologies, Ethernet switches, MAC tables, ARP resolution, and DHCP DORA address allocation.

Includes completion tracking saved to local storage so students can check off completed labs!


---

## 🎮 Interactive Features
- **Classroom Presentation Mode**: Toggle between classroom presentation and explorer sandbox mode.
- **Syllabus Drawer**: Slide-out curriculum index for rapid jumping between topics.
- **Teacher Explainer**: Real-world analogies and instructor talking points for every topic.
- **Knowledge Check Quiz**: Dynamic multiple-choice questions for each topic with instant feedback and reward confetti animations.
- **Keyboard Shortcuts**: Use `←` / `→` (or `PageUp` / `PageDown` / `Space`) to navigate slides, and `Esc` to close modals.

