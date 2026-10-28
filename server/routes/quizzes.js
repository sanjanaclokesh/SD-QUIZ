import express from 'express';
import db from '../db.js';
import { optionalToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes
router.get('/', optionalToken, (req, res) => {
  try {
    const quizzes = db.prepare(`
      SELECT q.id, q.title, q.slug, q.category, q.difficulty, q.time_limit, q.icon, q.color, q.summary,
             COUNT(qu.id) as question_count
      FROM quizzes q
      LEFT JOIN questions qu ON qu.quiz_id = q.id
      GROUP BY q.id
      ORDER BY q.id ASC
    `).all();

    // If user is authenticated, attach user's best score for each quiz
    if (req.user) {
      const userAttempts = db.prepare(`
        SELECT quiz_id, MAX(score) as best_score, COUNT(id) as attempt_count
        FROM quiz_attempts
        WHERE user_id = ?
        GROUP BY quiz_id
      `).all(req.user.id);

      const attemptsMap = new Map();
      userAttempts.forEach(a => attemptsMap.set(a.quiz_id, a));

      quizzes.forEach(q => {
        const attempt = attemptsMap.get(q.id);
        q.user_best_score = attempt ? attempt.best_score : null;
        q.user_attempts_count = attempt ? attempt.attempt_count : 0;
      });
    }

    res.json(quizzes);
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    res.status(500).json({ error: 'Server error fetching quizzes.' });
  }
});

// Get single quiz with its questions
router.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let quiz = null;

    if (!isNaN(idOrSlug)) {
      quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(idOrSlug);
    } else {
      quiz = db.prepare('SELECT * FROM quizzes WHERE slug = ?').get(idOrSlug);
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    // Get questions for this quiz
    const questions = db.prepare(`
      SELECT id, quiz_id, question_text, code_snippet, diagram_type, explanation, difficulty, order_num
      FROM questions
      WHERE quiz_id = ?
      ORDER BY order_num ASC
    `).all(quiz.id);

    // Get options for each question
    const getOptions = db.prepare(`
      SELECT id, question_id, option_text, order_num
      FROM options
      WHERE question_id = ?
      ORDER BY order_num ASC
    `);

    const questionsWithOptions = questions.map(q => {
      const options = getOptions.all(q.id);
      return {
        ...q,
        options
      };
    });

    res.json({
      quiz,
      questions: questionsWithOptions
    });
  } catch (error) {
    console.error('Fetch quiz detail error:', error);
    res.status(500).json({ error: 'Server error fetching quiz.' });
  }
});

// Submit Quiz Attempt & Calculate Result
router.post('/:id/submit', optionalToken, (req, res) => {
  try {
    const quizId = parseInt(req.params.id, 10);
    const { answers, timeSpentSeconds } = req.body; // answers is { [questionId]: optionId }

    const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    const questions = db.prepare('SELECT id, question_text, explanation, diagram_type FROM questions WHERE quiz_id = ?').all(quizId);
    const options = db.prepare(`
      SELECT id, question_id, option_text, is_correct
      FROM options
      WHERE question_id IN (${questions.map(q => q.id).join(',') || 0})
    `).all();

    const optionsByQuestion = {};
    for (const opt of options) {
      if (!optionsByQuestion[opt.question_id]) {
        optionsByQuestion[opt.question_id] = [];
      }
      optionsByQuestion[opt.question_id].push(opt);
    }

    let score = 0;
    const reviewDetails = [];

    for (const q of questions) {
      const qOptions = optionsByQuestion[q.id] || [];
      const correctOption = qOptions.find(o => o.is_correct === 1);
      const selectedOptionId = answers ? parseInt(answers[q.id], 10) : null;
      const selectedOption = qOptions.find(o => o.id === selectedOptionId);
      const isCorrect = correctOption && selectedOptionId === correctOption.id;

      if (isCorrect) {
        score++;
      }

      reviewDetails.push({
        question_id: q.id,
        question_text: q.question_text,
        diagram_type: q.diagram_type,
        explanation: q.explanation,
        options: qOptions.map(o => ({
          id: o.id,
          text: o.option_text,
          is_correct: o.is_correct === 1
        })),
        selected_option_id: selectedOptionId,
        correct_option_id: correctOption ? correctOption.id : null,
        is_correct: !!isCorrect
      });
    }

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    let xpEarned = score * 50; // 50 XP per question

    // Bonus XP for high scores & speed
    if (percentage === 100) xpEarned += 100;
    else if (percentage >= 80) xpEarned += 50;

    const newBadges = [];

    // If user is logged in, record attempt and update XP
    if (req.user) {
      const insertAttempt = db.prepare(`
        INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, time_spent_seconds, answers_json)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      insertAttempt.run(
        req.user.id,
        quizId,
        score,
        totalQuestions,
        timeSpentSeconds || 0,
        JSON.stringify(answers || {})
      );

      // Check current user XP
      const currentUser = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(req.user.id);
      const newXp = (currentUser.xp || 0) + xpEarned;
      const newLevel = Math.floor(newXp / 300) + 1;

      db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, req.user.id);

      // Award Badges
      const insertBadge = db.prepare(`
        INSERT OR IGNORE INTO user_badges (user_id, badge_key, badge_name, badge_desc, icon)
        VALUES (?, ?, ?, ?, ?)
      `);

      // 1. First Quiz
      const totalAttempts = db.prepare('SELECT COUNT(*) as c FROM quiz_attempts WHERE user_id = ?').get(req.user.id).c;
      if (totalAttempts === 1) {
        const badgeRes = insertBadge.run(req.user.id, 'first_quiz', 'First Step', 'Completed your first system design quiz', 'award');
        if (badgeRes.changes > 0) {
          newBadges.push({ name: 'First Step', desc: 'Completed your first system design quiz' });
        }
      }

      // 2. Perfect Score
      if (score === totalQuestions && totalQuestions > 0) {
        const badgeRes = insertBadge.run(req.user.id, 'flawless_system', 'Flawless Architect', 'Scored 100% on a System Design Quiz', 'star');
        if (badgeRes.changes > 0) {
          newBadges.push({ name: 'Flawless Architect', desc: 'Scored 100% on a System Design Quiz' });
        }
      }

      // 3. Speed Demon
      if (timeSpentSeconds && timeSpentSeconds < 120 && percentage >= 80) {
        const badgeRes = insertBadge.run(req.user.id, 'speed_architect', 'Rapid Prototyper', 'Completed quiz under 2 minutes with ≥80% accuracy', 'zap');
        if (badgeRes.changes > 0) {
          newBadges.push({ name: 'Rapid Prototyper', desc: 'Completed quiz under 2 minutes with ≥80% accuracy' });
        }
      }

      // 4. Level up
      if (newLevel > currentUser.level) {
        newBadges.push({ name: `Level ${newLevel} Achieved!`, desc: 'You leveled up your System Architect status' });
      }
    }

    res.json({
      score,
      total_questions: totalQuestions,
      percentage,
      xp_earned: xpEarned,
      new_badges: newBadges,
      time_spent_seconds: timeSpentSeconds || 0,
      review: reviewDetails
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Server error processing quiz submission.' });
  }
});

export default router;
