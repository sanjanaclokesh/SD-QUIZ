import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Network, 
  Zap, 
  Database, 
  Cpu, 
  Shield, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Search, 
  Award,
  BarChart3,
  Flame,
  HelpCircle
} from 'lucide-react';

export default function QuizList({ onSelectQuiz }) {
  const { user, openAuth } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('arch_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/quizzes', { headers });
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Network': return Network;
      case 'Zap': return Zap;
      case 'Database': return Database;
      case 'Cpu': return Cpu;
      case 'Shield': return Shield;
      case 'Layers': return Layers;
      default: return Cpu;
    }
  };

  const categories = ['All', 'High Availability', 'Caching & Performance', 'Databases & Storage', 'Distributed Systems', 'Real-World Design', 'System Architecture'];

  const filteredQuizzes = quizzes.filter(q => {
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Interactive Distributed Architecture Practice</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight">
            Crack FAANG & Staff-Level <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
              System Design Interviews
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Test your knowledge on CAP theorem, database sharding, high-availability load balancers, 
            caching hierarchies, and real-world microservices with visual architecture diagrams and deep explanations.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-cyan-400">30+</div>
              <div className="text-xs text-slate-400 mt-0.5">Scenario Questions</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-indigo-400">6 Sets</div>
              <div className="text-xs text-slate-400 mt-0.5">Core Topics</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Free Embedded DB</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-bold text-amber-400">Instant</div>
              <div className="text-xs text-slate-400 mt-0.5">Visual Diagrams</div>
            </div>
          </div>

          {/* Action Row */}
          {!user && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openAuth('signup')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
              >
                <span>Create Free Profile & Save Progress</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold border border-slate-700 transition"
              >
                Sign In with 1-Click Demo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Quiz Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No quizzes match your search</h3>
          <p className="text-xs text-slate-400 mt-1">Try selecting "All" categories or changing keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const Icon = getCategoryIcon(quiz.icon);
            const isCompleted = quiz.user_best_score !== null && quiz.user_best_score !== undefined;
            const perfectScore = isCompleted && quiz.user_best_score === quiz.question_count;

            return (
              <div
                key={quiz.id}
                className="group relative rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-bl-full transition pointer-events-none"></div>

                <div>
                  {/* Category & Status badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/80 text-cyan-300 border border-slate-700/60">
                      {quiz.category}
                    </span>

                    {isCompleted ? (
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        perfectScore 
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Best: {quiz.user_best_score}/{quiz.question_count}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.round(quiz.time_limit / 60)} mins
                      </span>
                    )}
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      <Icon className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-cyan-300 transition leading-snug">
                        {quiz.title}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400">
                        {quiz.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {quiz.summary}
                  </p>
                </div>

                {/* Footer specs + Start button */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      {quiz.question_count} Questions
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      +{quiz.question_count * 50} XP
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectQuiz(quiz.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent text-xs font-semibold transition flex items-center gap-1.5 shadow-sm group-hover:bg-indigo-600 group-hover:text-white"
                  >
                    <span>{isCompleted ? 'Retake' : 'Start Quiz'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
