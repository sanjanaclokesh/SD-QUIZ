import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ArchitectureDiagram from './ArchitectureDiagram';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  AlertCircle, 
  Eye, 
  Layers,
  Flag
} from 'lucide-react';

export default function QuizPlayer({ quizId, onBack, onComplete }) {
  const { user, openAuth } = useAuth();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionId }
  const [timeLeft, setTimeLeft] = useState(300);
  const [submitting, setSubmitting] = useState(false);
  const [showDiagram, setShowDiagram] = useState(true);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchQuiz();
    return () => clearInterval(timerRef.current);
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      if (res.ok) {
        const data = await res.json();
        setQuizData(data);
        setTimeLeft(data.quiz.time_limit || 300);
        startTimer(data.quiz.time_limit || 300);
      }
    } catch (err) {
      console.error('Failed to load quiz details:', err);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (initialSeconds) => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleToggleBookmark = async (questionId) => {
    if (!user) {
      openAuth('login');
      return;
    }

    try {
      const token = localStorage.getItem('arch_token');
      const res = await fetch('/api/study/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questionId })
      });
      const data = await res.json();
      setBookmarkedQuestions((prev) => {
        const next = new Set(prev);
        if (data.bookmarked) next.add(questionId);
        else next.delete(questionId);
        return next;
      });
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);

    const totalSecondsSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    try {
      const token = localStorage.getItem('arch_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          answers: selectedAnswers,
          timeSpentSeconds: totalSecondsSpent
        })
      });

      if (res.ok) {
        const result = await res.json();
        onComplete(result, quizData.quiz);
      } else {
        alert('Error submitting quiz. Please try again.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Network error submitting quiz.');
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-400">Loading system design scenarios...</p>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Quiz not found or empty.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg">
          Back to Catalog
        </button>
      </div>
    );
  }

  const currentQ = quizData.questions[currentIndex];
  const totalQuestions = quizData.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Timer format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeLow = timeLeft < 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Navigation & Status Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (answeredCount > 0) {
                if (window.confirm('You have unsaved progress. Are you sure you want to leave this quiz?')) {
                  onBack();
                }
              } else {
                onBack();
              }
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {quizData.quiz.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{quizData.quiz.category}</span>
              <span>•</span>
              <span className="text-indigo-400 font-medium">Question {currentIndex + 1} of {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Timer & Answer Tracker */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold transition-colors ${
            isTimeLow 
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse'
              : 'bg-slate-900 border-slate-700/80 text-cyan-300'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Answers'}</span>
          </button>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Question Header & Bookmark */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-semibold text-xs">
            Scenario #{currentIndex + 1} • {currentQ.difficulty || 'Intermediate'}
          </span>

          <div className="flex items-center gap-2">
            {currentQ.diagram_type && (
              <button
                onClick={() => setShowDiagram(!showDiagram)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition ${
                  showDiagram 
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Toggle Architecture Diagram"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{showDiagram ? 'Hide Diagram' : 'Show Diagram'}</span>
              </button>
            )}

            <button
              onClick={() => handleToggleBookmark(currentQ.id)}
              className={`p-2 rounded-lg border transition ${
                bookmarkedQuestions.has(currentQ.id)
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Bookmark Question"
            >
              {bookmarkedQuestions.has(currentQ.id) ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-xl font-bold text-white leading-relaxed mb-6">
          {currentQ.question_text}
        </h3>

        {/* Code Snippet (if available) */}
        {currentQ.code_snippet && (
          <div className="mb-6 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
            <pre>{currentQ.code_snippet}</pre>
          </div>
        )}

        {/* Embedded Architecture Diagram */}
        {showDiagram && currentQ.diagram_type && (
          <div className="mb-6">
            <ArchitectureDiagram type={currentQ.diagram_type} />
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 mt-4">
          {currentQ.options.map((option, optIdx) => {
            const letters = ['A', 'B', 'C', 'D'];
            const letter = letters[optIdx] || optIdx + 1;
            const isSelected = selectedAnswers[currentQ.id] === option.id;

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(currentQ.id, option.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-indigo-500/15'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {/* Option Letter Badge */}
                <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs transition ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {letter}
                </div>

                {/* Option Text */}
                <span className={`text-sm sm:text-base leading-relaxed ${
                  isSelected ? 'text-white font-medium' : 'text-slate-300'
                }`}>
                  {option.option_text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Selector Palette + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
        {/* Question Bubbles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {quizData.questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-400/50'
                    : isAnswered
                    ? 'bg-indigo-600/40 text-cyan-300 border border-indigo-500/40'
                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25"
            >
              <span>Finish & Grade</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
