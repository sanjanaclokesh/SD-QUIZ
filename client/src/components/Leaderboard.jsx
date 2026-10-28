import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaders(data);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const top3 = leaders.slice(0, 3);
  const remaining = leaders.slice(3);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Global System Architect Standings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Top Systems Engineers & Architects
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Earn XP, master distributed scenarios, and climb to the top of the distributed systems ranking.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading architect rankings...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
              {/* Rank 2 (Silver) */}
              {top3[1] && (
                <div className="order-2 md:order-1 rounded-3xl bg-[#0F172A] border border-slate-700/80 p-6 text-center relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-400 to-slate-200"></div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-300 font-bold text-sm mb-3 border border-slate-600">
                    #2
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-600 to-slate-400 mx-auto flex items-center justify-center text-xl font-extrabold text-white shadow-lg mb-3">
                    {top3[1].name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-white text-base truncate">{top3[1].name}</h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{top3[1].role}</p>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-around text-xs">
                    <div>
                      <span className="text-cyan-400 font-bold">{top3[1].xp}</span>
                      <p className="text-slate-500 text-[10px]">XP</p>
                    </div>
                    <div>
                      <span className="text-amber-400 font-bold">Lvl {top3[1].level}</span>
                      <p className="text-slate-500 text-[10px]">Level</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold - Center & Elevated) */}
              {top3[0] && (
                <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-amber-500/50 p-8 text-center relative overflow-hidden shadow-2xl shadow-amber-500/10 md:-translate-y-4">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"></div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 font-black text-lg mb-3 border border-amber-500/40 shadow-inner">
                    <Crown className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center text-2xl font-black text-slate-950 shadow-xl mb-3">
                    {top3[0].name.charAt(0)}
                  </div>
                  <h3 className="font-extrabold text-white text-lg truncate">{top3[0].name}</h3>
                  <p className="text-xs text-amber-300 font-medium truncate mt-0.5">{top3[0].role}</p>
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-around text-xs">
                    <div>
                      <span className="text-cyan-400 font-black text-sm">{top3[0].xp}</span>
                      <p className="text-slate-400 text-[10px]">Total XP</p>
                    </div>
                    <div>
                      <span className="text-amber-400 font-black text-sm">Lvl {top3[0].level}</span>
                      <p className="text-slate-400 text-[10px]">Level</p>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-black text-sm">{top3[0].quizzes_taken}</span>
                      <p className="text-slate-400 text-[10px]">Quizzes</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {top3[2] && (
                <div className="order-3 md:order-3 rounded-3xl bg-[#0F172A] border border-slate-700/80 p-6 text-center relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-700 to-orange-500"></div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-900/30 text-amber-500 font-bold text-sm mb-3 border border-amber-700/60">
                    #3
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 mx-auto flex items-center justify-center text-xl font-extrabold text-white shadow-lg mb-3">
                    {top3[2].name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-white text-base truncate">{top3[2].name}</h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{top3[2].role}</p>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-around text-xs">
                    <div>
                      <span className="text-cyan-400 font-bold">{top3[2].xp}</span>
                      <p className="text-slate-500 text-[10px]">XP</p>
                    </div>
                    <div>
                      <span className="text-amber-400 font-bold">Lvl {top3[2].level}</span>
                      <p className="text-slate-500 text-[10px]">Level</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Standings Table */}
          <div className="rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                All Ranked Engineers ({leaders.length})
              </span>
              <span className="text-xs text-slate-500">Ranked by Total XP</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {leaders.map((leader) => {
                const isCurrentUser = user && user.id === leader.id;

                return (
                  <div
                    key={leader.id}
                    className={`px-6 py-4 flex items-center justify-between gap-4 transition ${
                      isCurrentUser
                        ? 'bg-indigo-600/15 border-l-4 border-l-indigo-500'
                        : 'hover:bg-slate-850'
                    }`}
                  >
                    {/* Rank & User Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-8 text-center font-bold text-xs text-slate-400">
                        {leader.rank === 1 ? '🥇' : leader.rank === 2 ? '🥈' : leader.rank === 3 ? '🥉' : `#${leader.rank}`}
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-300 shrink-0">
                        {leader.name.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm truncate">
                            {leader.name}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{leader.role}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 sm:gap-8 text-xs shrink-0">
                      <div className="hidden sm:block text-right">
                        <div className="font-semibold text-slate-300">{leader.quizzes_taken}</div>
                        <div className="text-[10px] text-slate-500">Quizzes</div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-amber-400">Lvl {leader.level}</div>
                        <div className="text-[10px] text-slate-500">Level</div>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <div className="font-black text-cyan-400 text-sm flex items-center justify-end gap-1">
                          <Flame className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                          {leader.xp}
                        </div>
                        <div className="text-[10px] text-slate-500">XP</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
