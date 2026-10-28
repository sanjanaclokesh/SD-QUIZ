import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Award, 
  Flame, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  Edit3, 
  ShieldCheck, 
  Zap, 
  Star, 
  Compass,
  Calendar
} from 'lucide-react';

export default function ProfileView() {
  const { user, token, openAuth } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchFullProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchFullProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setName(data.user.name);
        setRole(data.user.role);
        setBio(data.user.bio);
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, role, bio })
      });
      if (res.ok) {
        setEditing(false);
        fetchFullProfile();
      }
    } catch (err) {
      console.error('Update profile failed:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'award': return Award;
      case 'zap': return Zap;
      case 'clock': return Clock;
      case 'star': return Star;
      case 'compass': return Compass;
      default: return Award;
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 p-8 rounded-3xl bg-[#0F172A] border border-slate-800">
        <User className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Sign In to View Profile</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6">
          Track your badges, stats, and quiz attempt history across all devices.
        </p>
        <button
          onClick={() => openAuth('login')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading || !profileData) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400">Loading your architect profile...</p>
      </div>
    );
  }

  const { stats, badges, recent_attempts } = profileData;
  const currentLevel = user.level || 1;
  const currentXp = user.xp || 0;
  const xpForNextLevel = currentLevel * 300;
  const xpCurrentProgress = currentXp % 300;
  const levelProgressPercent = Math.min(100, Math.round((xpCurrentProgress / 300) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center text-2xl font-black text-cyan-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Level {currentLevel}
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-mono mt-0.5">{user.role}</p>
              <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
                {user.bio || 'Architect building scalable distributed systems.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="self-start md:self-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">
              Progress to <span className="text-amber-400 font-bold">Level {currentLevel + 1}</span>
            </span>
            <span className="text-cyan-400 font-bold font-mono">
              {currentXp} XP ({xpCurrentProgress} / 300 to next level)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Edit Form Drawer */}
        {editing && (
          <form onSubmit={handleUpdateProfile} className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={saveLoading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
            {stats.total_attempts}
          </div>
          <div className="text-xs text-slate-400 mt-1">Quizzes Completed</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {stats.accuracy_percent}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Overall Accuracy</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 flex items-center gap-1">
            <Flame className="w-6 h-6 fill-amber-400" />
            {user.xp}
          </div>
          <div className="text-xs text-slate-400 mt-1">Total Architect XP</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
            {badges.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Badges Unlocked</div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          Earned Achievements & Badges ({badges.length})
        </h3>

        {badges.length === 0 ? (
          <p className="text-xs text-slate-500">No badges unlocked yet. Complete quizzes with high scores to earn them!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((b, idx) => {
              const Icon = getBadgeIcon(b.icon);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 hover:border-amber-500/40 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">{b.badge_name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{b.badge_desc}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Awarded {new Date(b.awarded_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Quiz Attempts */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          Recent Quiz Attempts
        </h3>

        {recent_attempts.length === 0 ? (
          <p className="text-xs text-slate-500">No quizzes taken yet. Jump into a scenario to start practicing!</p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recent_attempts.map((att) => {
              const percent = Math.round((att.score / att.total_questions) * 100);

              return (
                <div key={att.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {att.quiz_title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-indigo-400">{att.category}</span>
                      <span>•</span>
                      <span>{Math.round(att.time_spent_seconds)}s spent</span>
                      <span>•</span>
                      <span>{new Date(att.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg ${
                      percent >= 80 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {att.score}/{att.total_questions} ({percent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
