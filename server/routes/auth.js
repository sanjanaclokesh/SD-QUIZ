import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);
    const assignedRole = role || 'System Architect Candidate';
    const avatarColors = ['indigo', 'emerald', 'cyan', 'purple', 'rose', 'amber'];
    const avatar_color = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, avatar_color, xp, level, bio)
      VALUES (?, ?, ?, ?, ?, 100, 1, 'Excited to practice system design architectures!')
    `);

    const result = insert.run(name.trim(), email.toLowerCase().trim(), password_hash, assignedRole, avatar_color);
    const userId = result.lastInsertRowid;

    // Award welcome badge
    db.prepare(`
      INSERT OR IGNORE INTO user_badges (user_id, badge_key, badge_name, badge_desc, icon)
      VALUES (?, 'welcome', 'Initiated Architect', 'Created an account to master system design', 'compass')
    `).run(userId);

    const user = db.prepare(`
      SELECT id, name, email, role, avatar_color, xp, level, bio, created_at
      FROM users WHERE id = ?
    `).get(userId);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      user,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare(`
      SELECT id, name, email, password_hash, role, avatar_color, xp, level, bio, created_at
      FROM users WHERE email = ?
    `).get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Don't send back password hash
    delete user.password_hash;

    res.json({
      message: 'Logged in successfully!',
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// Get Current User Profile + Stats + Badges
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, name, email, role, avatar_color, xp, level, bio, created_at
      FROM users WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const badges = db.prepare(`
      SELECT badge_key, badge_name, badge_desc, icon, awarded_at
      FROM user_badges WHERE user_id = ?
      ORDER BY awarded_at DESC
    `).all(req.user.id);

    const attempts = db.prepare(`
      SELECT qa.id, qa.score, qa.total_questions, qa.time_spent_seconds, qa.created_at,
             q.title as quiz_title, q.category, q.slug, q.color
      FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.user_id = ?
      ORDER BY qa.created_at DESC
      LIMIT 10
    `).all(req.user.id);

    const stats = db.prepare(`
      SELECT 
        COUNT(id) as total_attempts,
        COALESCE(SUM(score), 0) as total_correct_answers,
        COALESCE(SUM(total_questions), 0) as total_questions_taken,
        COALESCE(MAX(score), 0) as high_score
      FROM quiz_attempts
      WHERE user_id = ?
    `).get(req.user.id);

    res.json({
      user,
      badges,
      recent_attempts: attempts,
      stats: {
        total_attempts: stats.total_attempts,
        total_correct_answers: stats.total_correct_answers,
        total_questions_taken: stats.total_questions_taken,
        accuracy_percent: stats.total_questions_taken > 0 
          ? Math.round((stats.total_correct_answers / stats.total_questions_taken) * 100) 
          : 0,
        high_score: stats.high_score
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching user profile.' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, role, bio, avatar_color } = req.body;

    db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          role = COALESCE(?, role),
          bio = COALESCE(?, bio),
          avatar_color = COALESCE(?, avatar_color)
      WHERE id = ?
    `).run(name, role, bio, avatar_color, req.user.id);

    const updatedUser = db.prepare(`
      SELECT id, name, email, role, avatar_color, xp, level, bio, created_at
      FROM users WHERE id = ?
    `).get(req.user.id);

    res.json({
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});

export default router;
