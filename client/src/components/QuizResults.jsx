import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import ArchitectureDiagram from './ArchitectureDiagram';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Share2, 
  ChevronDown, 
  ChevronUp,
  Flame
} from 'lucide-react';

export default function QuizResults({ result, quiz, onRetake, onCatalog }) {
  const { user, refreshUser, openAuth } = useAuth();
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    // Trigger confetti if score >= 60%
    if (result.percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    // Refresh user context to update XP and Level
    refreshUser();
  }, []);

  const toggleExpand = (qId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const getArchitectTitle = (percent) => {
    if (percent === 100) return { title: 'Principal System Architect', color: 'text-amber-400', badge: 'bg-amber-500/15 border-amber-500/30' };
    if (percent >= 80) return { title: 'Senior Distributed Engineer', color: 'text-cyan-400', badge: 'bg-cyan-500/15 border-cyan-500/30' };
    if (percent >= 60) return { title: 'Cloud Infrastructure Engineer', color: 'text-indigo-400', badge: 'bg-indigo-500/15 border-indigo-500/30' };
    return { title: 'Architect Apprentice', color: 'text-slate-400', badge: 'bg-slate-800 border-slate-700' };
  };

  const titleInfo = getArchitectTitle(result.percentage);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Hero Result Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl text-center overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Trophy Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-1 shadow-xl shadow-cyan-500/20 mb-4 animate-bounce">
            <div className="w-full h-full bg-[#0F172A] rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          {/* Assessment Title */}
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-3 ${titleInfo.badge}`}>
            <span className={titleInfo.color}>{titleInfo.title}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Quiz Completed!
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {quiz ? quiz.title : 'System Design Assessment'}
          </p>

          {/* Score Circle & Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
              <div className="text-3xl font-extrabold text-cyan-400">
                {result.score}/{result.total_questions}
              </div>
              <div className="text-xs text-slate-400 mt-1">Score ({result.percentage}%)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
              <div className="text-3xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-6 h-6 fill-amber-400" />
                +{result.xp_earned}
              </div>
              <div className="text-xs text-slate-400 mt-1">XP Gained</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
              <div className="text-3xl font-extrabold text-indigo-400">
                {Math.round(result.time_spent_seconds)}s
              </div>
              <div className="text-xs text-slate-400 mt-1">Duration</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
              <div className="text-3xl font-extrabold text-emerald-400">
                {result.percentage >= 70 ? 'Passed' : 'Needs Review'}
              </div>
              <div className="text-xs text-slate-400 mt-1">Status</div>
            </div>
          </div>

          {/* New Badges Alert */}
          {result.new_badges && result.new_badges.length > 0 && (
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-500/30 text-left flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Achievement Unlocked!
                </h4>
                <div className="mt-1 space-y-1">
                  {result.new_badges.map((b, idx) => (
                    <div key={idx} className="text-xs text-slate-200 font-medium">
                      🏅 <span className="font-semibold text-white">{b.name}</span> — {b.desc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Guest Sign-up prompt if not logged in */}
          {!user && (
            <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-left flex items-center justify-between gap-4">
              <div className="text-xs">
                <p className="font-bold text-white">Save your score & climb the global leaderboard!</p>
                <p className="text-slate-400">Create a free account or log in with 1-click to track badges & XP.</p>
              </div>
              <button
                onClick={() => openAuth('signup')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shrink-0"
              >
                Save Progress
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRetake}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={onCatalog}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
            >
              <span>Explore More Quizzes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* In-Depth Architectural Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Detailed Architectural Review & Explanations
          </h3>
          <span className="text-xs text-slate-400">
            {result.review ? result.review.length : 0} Scenarios Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {result.review && result.review.map((item, idx) => {
            const isCorrect = item.is_correct;
            const isExpanded = expandedQuestions[item.question_id] !== false; // default open

            return (
              <div
                key={item.question_id}
                className={`rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-[#0F172A] border-emerald-500/30'
                    : 'bg-[#0F172A] border-rose-500/30'
                }`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(item.question_id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Scenario #{idx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
                        {item.question_text}
                      </h4>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
                    {/* Visual Diagram if available */}
                    {item.diagram_type && (
                      <div className="mt-4">
                        <ArchitectureDiagram type={item.diagram_type} />
                      </div>
                    )}

                    {/* Options Breakdown */}
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Options Breakdown
                      </div>
                      {item.options.map((opt) => {
                        const isSelected = opt.id === item.selected_option_id;
                        const isThisCorrect = opt.is_correct;

                        let style = 'bg-slate-900/60 border-slate-800 text-slate-300';
                        if (isThisCorrect) {
                          style = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold';
                        } else if (isSelected && !isThisCorrect) {
                          style = 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-semibold';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${style}`}
                          >
                            <div className="flex items-center gap-2">
                              {isThisCorrect && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                                  Correct
                                </span>
                              )}
                              {isSelected && !isThisCorrect && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400">
                                  Your Choice
                                </span>
                              )}
                              <span>{opt.text}</span>
                            </div>

                            {isSelected && isThisCorrect && (
                              <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                                ✓ You got this right
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Deep Architectural Explanation */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Architectural Deep Dive & Production Trade-offs
                      </div>
                      <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
