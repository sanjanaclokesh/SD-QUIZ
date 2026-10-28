import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';
import leaderboardRoutes from './routes/leaderboard.js';
import studyRoutes from './routes/study.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize Database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/study', studyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'System Design Mastery API',
    database: 'Embedded Database (Serverless & Local Ready)',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files if client/dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback for non-API routes (SPA routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>ArchIQ API Active</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0F1D; color: #E2E8F0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { text-align: center; padding: 2.5rem; background: #111827; border-radius: 1.25rem; border: 1px solid #1E293B; box-shadow: 0 20px 40px rgba(0,0,0,0.5); max-width: 500px; }
            h1 { color: #6366F1; margin-top: 0; font-size: 1.5rem; }
            p { color: #94A3B8; font-size: 0.95rem; line-height: 1.6; }
            a.btn { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; background: #6366F1; color: #FFF; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
            a.btn:hover { background: #4F46E5; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🚀 ArchIQ API Server is Running</h1>
            <p>API endpoints are active at <a href="/api/health" style="color:#38bdf8;">/api/health</a></p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

export default app;
