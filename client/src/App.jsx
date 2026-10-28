import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import QuizList from './components/QuizList';
import QuizPlayer from './components/QuizPlayer';
import QuizResults from './components/QuizResults';
import Leaderboard from './components/Leaderboard';
import ArchitectureGuide from './components/ArchitectureGuide';
import BookmarksView from './components/BookmarksView';
import ProfileView from './components/ProfileView';
import { Cpu, Heart, Database, Shield, Zap, Sparkles } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const handleStartQuiz = (quizId) => {
    setActiveQuizId(quizId);
    setQuizResult(null);
  };

  const handleQuizComplete = (result, quiz) => {
    setQuizResult(result);
    setCurrentQuiz(quiz);
    setActiveQuizId(null);
  };

  const handleRetakeQuiz = () => {
    if (currentQuiz) {
      setActiveQuizId(currentQuiz.id);
      setQuizResult(null);
    }
  };

  const handleBackToCatalog = () => {
    setActiveQuizId(null);
    setQuizResult(null);
    setActiveTab('quizzes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F1D] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar 
        activeTab={activeQuizId ? 'quizzes' : activeTab} 
        setActiveTab={(tab) => {
          setActiveQuizId(null);
          setQuizResult(null);
          setActiveTab(tab);
        }} 
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeQuizId ? (
          <QuizPlayer
            quizId={activeQuizId}
            onBack={handleBackToCatalog}
            onComplete={handleQuizComplete}
          />
        ) : quizResult ? (
          <QuizResults
            result={quizResult}
            quiz={currentQuiz}
            onRetake={handleRetakeQuiz}
            onCatalog={handleBackToCatalog}
          />
        ) : (
          <>
            {activeTab === 'quizzes' && (
              <QuizList onSelectQuiz={handleStartQuiz} />
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard />
            )}

            {activeTab === 'cheatsheet' && (
              <ArchitectureGuide />
            )}

            {activeTab === 'bookmarks' && (
              <BookmarksView onBrowseQuizzes={() => setActiveTab('quizzes')} />
            )}

            {activeTab === 'profile' && (
              <ProfileView />
            )}
          </>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0A0F1D]/80 backdrop-blur-md py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">
                Arch<span className="text-cyan-400">IQ</span>
              </span>
              <span className="text-xs text-slate-500">
                — Distributed System Design Platform
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
                Free SQLite Embedded DB
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400 font-mono">
                Node.js + Express
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono">
                React 19 + Tailwind
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Built for high-scale software engineering interviews & mastery.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
