import React, { useState, useEffect } from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';
import { 
  BookOpen, 
  Layers, 
  Zap, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function ArchitectureGuide() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopicId, setActiveTopicId] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/study');
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
        if (data.length > 0) setActiveTopicId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load study guide topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Visual Architecture Reference & Cheatsheet</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          System Design Study Guides
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Deepen your architectural intuition with high-fidelity visual diagrams and production trade-offs.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading architectural reference cards...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Topic Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
              Select Architecture Topic
            </span>
            <div className="space-y-2">
              {topics.map((t) => {
                const isActive = t.id === activeTopicId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTopicId(t.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-indigo-500/10'
                        : 'bg-[#0F172A] border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-300 border border-slate-700">
                        {t.category}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.read_time}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold leading-snug ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}>
                      {t.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {t.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Topic Detail & Diagram (8 cols) */}
          {activeTopic && (
            <div className="lg:col-span-8 rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              {/* Header */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-2">
                  <span>{activeTopic.category}</span>
                  <span>•</span>
                  <span>{activeTopic.read_time}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeTopic.title}
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {activeTopic.summary}
                </p>
              </div>

              {/* Visual Diagram */}
              {activeTopic.diagram_type && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Interactive Architectural Diagram
                  </h3>
                  <ArchitectureDiagram type={activeTopic.diagram_type} />
                </div>
              )}

              {/* Key Architectural Points */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Key Principles & How It Works
                </h3>
                <div className="space-y-2.5">
                  {activeTopic.key_points && activeTopic.key_points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade-offs & Production Takeaway */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-4 h-4" />
                  Interview & Production Trade-Offs
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {activeTopic.tradeoffs}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
