import React from 'react';

export default function ArchitectureDiagram({ type, className = "" }) {
  if (!type) return null;

  switch (type) {
    case 'layer7-lb':
      return (
        <div className={`rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 ${className}`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Layer 7 Application Load Balancing
            </span>
            <span>Path & Header Routing</span>
          </div>
          <svg viewBox="0 0 540 200" className="w-full h-auto">
            <defs>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>

            {/* Client Nodes */}
            <rect x="20" y="35" width="85" height="40" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="62" y="55" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Web Client</text>
            <text x="62" y="68" fill="#94A3B8" fontSize="9" textAnchor="middle">GET /checkout</text>

            <rect x="20" y="125" width="85" height="40" rx="8" fill="#1E293B" stroke="#818CF8" strokeWidth="1.5" />
            <text x="62" y="145" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Mobile App</text>
            <text x="62" y="158" fill="#94A3B8" fontSize="9" textAnchor="middle">GET /products</text>

            {/* Arrows to LB */}
            <path d="M 105 55 L 180 90" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M 105 145 L 180 110" stroke="#818CF8" strokeWidth="2" strokeDasharray="4 2" />

            {/* Layer 7 Load Balancer */}
            <rect x="180" y="65" width="120" height="70" rx="10" fill="url(#cyanGrad)" filter="drop-shadow(0 4px 10px rgba(6,182,212,0.3))" />
            <text x="240" y="93" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">Layer 7 Reverse Proxy</text>
            <text x="240" y="108" fill="#E0F2FE" fontSize="9" textAnchor="middle">NGINX / HAProxy / ALB</text>
            <text x="240" y="122" fill="#FEF08A" fontSize="9" fontWeight="600" textAnchor="middle">Inspects HTTP URI & Cookies</text>

            {/* Arrows from LB to Microservices */}
            <path d="M 300 85 L 375 45" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
            <path d="M 300 100 L 375 100" stroke="#6366F1" strokeWidth="2" />
            <path d="M 300 115 L 375 155" stroke="#F59E0B" strokeWidth="2" />

            {/* Microservices */}
            <rect x="375" y="25" width="135" height="40" rx="8" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
            <text x="442" y="44" fill="#6EE7B7" fontSize="11" fontWeight="bold" textAnchor="middle">/checkout Service</text>
            <text x="442" y="57" fill="#A7F3D0" fontSize="8" textAnchor="middle">Payment Cluster (3 pods)</text>

            <rect x="375" y="80" width="135" height="40" rx="8" fill="#312E81" stroke="#818CF8" strokeWidth="1.5" />
            <text x="442" y="99" fill="#C7D2FE" fontSize="11" fontWeight="bold" textAnchor="middle">/products Service</text>
            <text x="442" y="112" fill="#E0E7FF" fontSize="8" textAnchor="middle">Catalog Cluster (8 pods)</text>

            <rect x="375" y="135" width="135" height="40" rx="8" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="442" y="154" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle">/static & Assets</text>
            <text x="442" y="167" fill="#FEF3C7" fontSize="8" textAnchor="middle">CDN Edge Bucket S3</text>
          </svg>
        </div>
      );

    case 'consistent-hashing':
      return (
        <div className={`rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 ${className}`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Consistent Hashing Ring & Virtual Nodes
            </span>
            <span>Clockwise Key Assignment</span>
          </div>
          <svg viewBox="0 0 500 220" className="w-full h-auto">
            {/* Hash Ring Circle */}
            <circle cx="250" cy="115" r="85" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="6 4" />
            <circle cx="250" cy="115" r="85" fill="none" stroke="#6366F1" strokeWidth="2" strokeOpacity="0.6" />

            {/* Server Nodes on Ring */}
            {/* Node A (Top) */}
            <circle cx="250" cy="30" r="14" fill="#6366F1" stroke="#A5B4FC" strokeWidth="2" />
            <text x="250" y="34" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Node A</text>

            {/* Node B (Bottom Right) */}
            <circle cx="325" cy="165" r="14" fill="#10B981" stroke="#6EE7B7" strokeWidth="2" />
            <text x="325" y="169" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Node B</text>

            {/* Node C (Bottom Left) */}
            <circle cx="175" cy="165" r="14" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />
            <text x="175" y="169" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Node C</text>

            {/* Virtual Nodes */}
            <circle cx="330" cy="80" r="9" fill="#6366F1" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="2 2" />
            <text x="348" y="83" fill="#A5B4FC" fontSize="9">vNode A2</text>

            <circle cx="170" cy="80" r="9" fill="#10B981" stroke="#A7F3D0" strokeWidth="1" strokeDasharray="2 2" />
            <text x="110" y="83" fill="#6EE7B7" fontSize="9">vNode B2</text>

            <circle cx="250" cy="200" r="9" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" strokeDasharray="2 2" />
            <text x="250" y="215" fill="#FDE68A" fontSize="9" textAnchor="middle">vNode C2</text>

            {/* Incoming Keys */}
            <circle cx="310" cy="50" r="6" fill="#EC4899" />
            <path d="M 310 50 A 85 85 0 0 1 330 80" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="320" y="44" fill="#F472B6" fontSize="9" fontWeight="bold">Key_749 ➔ vNode A2</text>

            {/* Clockwise Arrow */}
            <path d="M 270 115 A 20 20 0 1 1 250 95" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="250" y="119" fill="#94A3B8" fontSize="9" textAnchor="middle">Clockwise</text>
          </svg>
        </div>
      );

    case 'cache-aside':
      return (
        <div className={`rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 ${className}`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Cache-Aside Pattern (Lazy Loading)
            </span>
            <span>App-Managed Cache Workflow</span>
          </div>
          <svg viewBox="0 0 540 180" className="w-full h-auto">
            {/* App Server */}
            <rect x="30" y="60" width="110" height="60" rx="8" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />
            <text x="85" y="88" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">Application</text>
            <text x="85" y="104" fill="#93C5FD" fontSize="9" textAnchor="middle">Server / Worker</text>

            {/* Redis Cache */}
            <rect x="230" y="15" width="130" height="55" rx="8" fill="#881337" stroke="#F43F5E" strokeWidth="2" />
            <text x="295" y="40" fill="#FECDD3" fontSize="12" fontWeight="bold" textAnchor="middle">Redis / Memcached</text>
            <text x="295" y="55" fill="#FDA4AF" fontSize="9" textAnchor="middle">In-Memory Cache</text>

            {/* Database */}
            <rect x="390" y="95" width="120" height="65" rx="8" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
            <text x="450" y="125" fill="#A7F3D0" fontSize="12" fontWeight="bold" textAnchor="middle">Primary DB</text>
            <text x="450" y="140" fill="#6EE7B7" fontSize="9" textAnchor="middle">PostgreSQL / MySQL</text>

            {/* Arrow 1: Check Cache */}
            <path d="M 140 75 L 230 45" stroke="#F43F5E" strokeWidth="2" />
            <text x="180" y="55" fill="#FDA4AF" fontSize="9" fontWeight="bold">1. Check Key</text>

            {/* Arrow 2: Cache Miss ➔ Query DB */}
            <path d="M 140 100 L 390 125" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2" />
            <text x="250" y="125" fill="#FDE68A" fontSize="9" fontWeight="bold">2. Cache Miss: Query DB</text>

            {/* Arrow 3: Populate Cache */}
            <path d="M 430 95 L 340 70" stroke="#10B981" strokeWidth="2" />
            <text x="400" y="70" fill="#6EE7B7" fontSize="9" fontWeight="bold">3. Set(Key, Data)</text>
          </svg>
        </div>
      );

    case 'cap-theorem':
      return (
        <div className={`rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 ${className}`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              CAP Theorem Distributed Trade-offs
            </span>
            <span>Network Partition (P) Inevitability</span>
          </div>
          <svg viewBox="0 0 520 200" className="w-full h-auto">
            {/* Triangle Background */}
            <polygon points="260,25 90,175 430,175" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {/* Node C: Consistency */}
            <circle cx="260" cy="25" r="22" fill="#312E81" stroke="#818CF8" strokeWidth="2" />
            <text x="260" y="29" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
            <text x="260" y="60" fill="#C7D2FE" fontSize="10" fontWeight="bold" textAnchor="middle">Consistency</text>

            {/* Node A: Availability */}
            <circle cx="90" cy="175" r="22" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
            <text x="90" y="179" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
            <text x="90" y="150" fill="#6EE7B7" fontSize="10" fontWeight="bold" textAnchor="middle">Availability</text>

            {/* Node P: Partition Tolerance */}
            <circle cx="430" cy="175" r="22" fill="#78350F" stroke="#FBBF24" strokeWidth="2" />
            <text x="430" y="179" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">P</text>
            <text x="430" y="150" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle">Partition Tolerance</text>

            {/* CP Badge */}
            <rect x="330" y="80" width="115" height="42" rx="6" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
            <text x="387" y="98" fill="#A5B4FC" fontSize="10" fontWeight="bold" textAnchor="middle">CP Systems</text>
            <text x="387" y="112" fill="#94A3B8" fontSize="8" textAnchor="middle">MongoDB, HBase, Spanner</text>

            {/* AP Badge */}
            <rect x="200" y="155" width="120" height="40" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
            <text x="260" y="172" fill="#6EE7B7" fontSize="10" fontWeight="bold" textAnchor="middle">AP Systems</text>
            <text x="260" y="185" fill="#94A3B8" fontSize="8" textAnchor="middle">Cassandra, DynamoDB, CouchDB</text>

            {/* CA Badge */}
            <rect x="80" y="80" width="115" height="42" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
            <text x="137" y="98" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">CA (Non-distributed)</text>
            <text x="137" y="112" fill="#64748B" fontSize="8" textAnchor="middle">Traditional RDBMS (Single node)</text>
          </svg>
        </div>
      );

    case 'token-bucket':
      return (
        <div className={`rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 ${className}`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              Token Bucket Rate Limiter
            </span>
            <span>Refill Rate R tokens/sec</span>
          </div>
          <svg viewBox="0 0 540 180" className="w-full h-auto">
            {/* Token Generator */}
            <rect x="40" y="20" width="110" height="40" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="95" y="38" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">Token Generator</text>
            <text x="95" y="50" fill="#94A3B8" fontSize="8" textAnchor="middle">+100 tokens / sec</text>

            <path d="M 150 40 L 220 55" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 2" />

            {/* The Bucket */}
            <path d="M 210 50 L 230 140 L 290 140 L 310 50 Z" fill="#0F172A" stroke="#818CF8" strokeWidth="2" />
            {/* Tokens in Bucket */}
            <ellipse cx="260" cy="125" rx="20" ry="6" fill="#F59E0B" />
            <ellipse cx="260" cy="110" rx="24" ry="7" fill="#F59E0B" />
            <ellipse cx="260" cy="95" rx="28" ry="8" fill="#F59E0B" />
            <text x="260" y="75" fill="#FEF08A" fontSize="9" fontWeight="bold" textAnchor="middle">Tokens (Capacity B)</text>

            {/* Incoming Requests */}
            <rect x="360" y="25" width="120" height="40" rx="6" fill="#1E293B" stroke="#F43F5E" strokeWidth="1.5" />
            <text x="420" y="43" fill="#F43F5E" fontSize="10" fontWeight="bold" textAnchor="middle">Incoming Requests</text>
            <text x="420" y="55" fill="#94A3B8" fontSize="8" textAnchor="middle">API Calls (1 token each)</text>

            {/* Outcomes */}
            <path d="M 420 65 L 420 100" stroke="#94A3B8" strokeWidth="1.5" />
            
            {/* Pass */}
            <rect x="340" y="110" width="90" height="35" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
            <text x="385" y="126" fill="#6EE7B7" fontSize="10" fontWeight="bold" textAnchor="middle">HTTP 200 OK</text>
            <text x="385" y="137" fill="#A7F3D0" fontSize="8" textAnchor="middle">Token consumed</text>

            {/* Throttle */}
            <rect x="445" y="110" width="85" height="35" rx="6" fill="#881337" stroke="#F43F5E" strokeWidth="1.5" />
            <text x="487" y="126" fill="#FDA4AF" fontSize="10" fontWeight="bold" textAnchor="middle">HTTP 429</text>
            <text x="487" y="137" fill="#FECDD3" fontSize="8" textAnchor="middle">Rate Exceeded</text>
          </svg>
        </div>
      );

    case 'circuit-breaker':
      return (
        <div className={`rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 ${className}`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Circuit Breaker Finite State Machine
            </span>
            <span>Preventing Cascading System Failures</span>
          </div>
          <svg viewBox="0 0 540 160" className="w-full h-auto">
            {/* State CLOSED */}
            <rect x="30" y="50" width="115" height="60" rx="8" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
            <text x="87" y="77" fill="#6EE7B7" fontSize="12" fontWeight="bold" textAnchor="middle">CLOSED</text>
            <text x="87" y="93" fill="#A7F3D0" fontSize="9" textAnchor="middle">Normal Operation</text>

            {/* State OPEN */}
            <rect x="210" y="50" width="115" height="60" rx="8" fill="#881337" stroke="#F43F5E" strokeWidth="2" />
            <text x="267" y="77" fill="#FDA4AF" fontSize="12" fontWeight="bold" textAnchor="middle">OPEN</text>
            <text x="267" y="93" fill="#FECDD3" fontSize="9" textAnchor="middle">Fast Fail (No Calls)</text>

            {/* State HALF-OPEN */}
            <rect x="390" y="50" width="125" height="60" rx="8" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
            <text x="452" y="77" fill="#FDE68A" fontSize="12" fontWeight="bold" textAnchor="middle">HALF-OPEN</text>
            <text x="452" y="93" fill="#FEF3C7" fontSize="9" textAnchor="middle">Probe Trial Calls</text>

            {/* Transitions */}
            <path d="M 145 70 L 210 70" stroke="#F43F5E" strokeWidth="2" />
            <text x="177" y="62" fill="#F87171" fontSize="8" textAnchor="middle">Failures &gt; limit</text>

            <path d="M 325 70 L 390 70" stroke="#F59E0B" strokeWidth="2" />
            <text x="357" y="62" fill="#FBBF24" fontSize="8" textAnchor="middle">Timeout elapsed</text>

            <path d="M 452 110 C 452 145 87 145 87 110" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
            <text x="260" y="148" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">Trial calls succeed ➔ Reset to CLOSED</text>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`rounded-xl bg-slate-900/90 border border-slate-700/60 p-4 ${className}`}>
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Distributed Architecture Diagram
            </span>
            <span className="text-slate-500">Tier Topology</span>
          </div>
          <svg viewBox="0 0 520 140" className="w-full h-auto">
            {/* Generic Microservices Flow */}
            <rect x="30" y="45" width="85" height="50" rx="8" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="72" y="70" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">Client App</text>
            <text x="72" y="83" fill="#93C5FD" fontSize="8" textAnchor="middle">Browser/Mobile</text>

            <path d="M 115 70 L 175 70" stroke="#60A5FA" strokeWidth="2" strokeDasharray="3 3" />

            <rect x="175" y="40" width="105" height="60" rx="8" fill="#312E81" stroke="#818CF8" strokeWidth="1.5" />
            <text x="227" y="68" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">API Gateway</text>
            <text x="227" y="82" fill="#C7D2FE" fontSize="8" textAnchor="middle">Auth & Rate Limit</text>

            <path d="M 280 70 L 340 70" stroke="#818CF8" strokeWidth="2" />

            <rect x="340" y="25" width="135" height="40" rx="8" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
            <text x="407" y="45" fill="#6EE7B7" fontSize="10" fontWeight="bold" textAnchor="middle">Distributed Services</text>
            <text x="407" y="56" fill="#A7F3D0" fontSize="8" textAnchor="middle">Stateless Workers</text>

            <rect x="340" y="80" width="135" height="45" rx="8" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="407" y="101" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle">Data Tier & Cache</text>
            <text x="407" y="114" fill="#FEF3C7" fontSize="8" textAnchor="middle">Redis + Sharded RDBMS</text>
          </svg>
        </div>
      );
  }
}
