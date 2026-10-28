import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ArchitectureDiagram from './ArchitectureDiagram';
import { Bookmark, BookmarkX, Layers, Trash2, ArrowRight, Zap, HelpCircle } from 'lucide-react';

export default function BookmarksView({ onBrowseQuizzes }) {
  const { user, openAuth } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('arch_token');
      const res = await fetch('/api/study/bookmarks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data);
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (questionId) => {
    try {
      const token = localStorage.getItem('arch_token');
      await fetch('/api/study/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questionId })
      });
      setBookmarks(prev => prev.filter(b => b.id !== questionId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 p-8 rounded-3xl bg-[#0F172A] border border-slate-800">
        <Bookmark className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Sign In to Save Bookmarks</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6">
          Bookmark complex system design questions to review them before your interview.
        </p>
        <button
          onClick={() => openAuth('login')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-400" />
            Saved Scenarios & Bookmarks
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Questions you saved for deep architectural review and interview practice.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {bookmarks.length} Saved
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading saved bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0F172A] border border-slate-800">
          <BookmarkX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No bookmarked questions yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            While taking a quiz, click the bookmark icon on any question to save it here.
          </p>
          <button
            onClick={onBrowseQuizzes}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition inline-flex items-center gap-1.5"
          >
            <span>Browse Quizzes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold border border-slate-700">
                    {b.category}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-medium">{b.quiz_title}</span>
                </div>

                <button
                  onClick={() => handleRemoveBookmark(b.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {b.question_text}
              </h3>

              {b.diagram_type && (
                <div className="pt-2">
                  <ArchitectureDiagram type={b.diagram_type} />
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  Architectural Explanation:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {b.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
