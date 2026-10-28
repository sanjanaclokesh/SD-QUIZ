import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 System Design Quiz Server running on http://127.0.0.1:${PORT}`);
});
