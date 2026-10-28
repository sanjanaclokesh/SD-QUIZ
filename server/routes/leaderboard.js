import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const leaderboard = db.prepare(`
      SELECT u.id, u.name, u.role, u.avatar_color, u.xp, u.level,
             COUNT(DISTINCT qa.id) as quizzes_taken,
             COALESCE(SUM(qa.score), 0) as total_correct,
             COUNT(DISTINCT ub.id) as badge_count
      FROM users u
      LEFT JOIN quiz_attempts qa ON qa.user_id = u.id
      LEFT JOIN user_badges ub ON ub.user_id = u.id
      GROUP BY u.id
      ORDER BY u.xp DESC, total_correct DESC
      LIMIT 25
    `).all();

    const ranked = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json(ranked);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard.' });
  }
});

export default router;
