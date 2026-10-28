import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const SYSTEM_DESIGN_TOPICS = [
  {
    id: 'cap-theorem',
    title: 'The CAP Theorem Deep Dive',
    category: 'Distributed Databases',
    read_time: '5 min read',
    summary: 'Why no distributed system can simultaneously guarantee Consistency, Availability, and Partition Tolerance.',
    diagram_type: 'cap-theorem',
    key_points: [
      'Consistency (C): Every read receives the most recent write or an error.',
      'Availability (A): Every non-failing node returns a non-error response for every request (without guarantee it contains the most recent write).',
      'Partition Tolerance (P): The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network.',
      'In real networks, Network Partitions (P) are inevitable; thus, you must choose CP (e.g., HBase, MongoDB, Spanner) or AP (e.g., Cassandra, DynamoDB, CouchDB).'
    ],
    tradeoffs: 'CP systems favor data correctness at the cost of transient downtime during network splits. AP systems favor 100% uptime by returning potentially stale replica data.'
  },
  {
    id: 'caching-strategies',
    title: 'Caching Strategies & Invalidation Matrix',
    category: 'Performance & Latency',
    read_time: '6 min read',
    summary: 'Compare Cache-Aside, Write-Through, Write-Back, and Write-Around patterns with eviction algorithms.',
    diagram_type: 'cache-aside',
    key_points: [
      'Cache-Aside (Lazy Loading): App queries cache first. On miss, app queries DB, then writes to cache. Resilient to cache crashes, but cache miss penalty exists.',
      'Write-Through: App writes data to cache, and cache immediately synchronizes with DB before acknowledging the client. High consistency, slightly higher write latency.',
      'Write-Back (Write-Behind): App writes to cache and receives immediate OK. Cache flushes asynchronously to DB. Ultra-fast writes, but risk of data loss on cache crash.',
      'Write-Around: Data is written directly to DB without touching cache. Good for write-heavy data that is rarely read again.'
    ],
    tradeoffs: 'Write-Back maximizes write throughput; Cache-Aside gives maximum flexibility and resilience against total cache failure.'
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing & Virtual Nodes',
    category: 'Scalability & Load Balancing',
    read_time: '4 min read',
    summary: 'How distributed hash rings minimize key reshuffling when servers scale up or down.',
    diagram_type: 'consistent-hashing',
    key_points: [
      'Traditional modulo hashing (hash(key) % N) causes almost 100% of keys to reshuffle when N changes (server added or removed).',
      'Consistent hashing maps both keys and servers to a circular 360-degree hash ring.',
      'A key is assigned to the first server encountered moving clockwise on the ring.',
      'Adding or removing a server only reshuffles K/N keys on average, leaving the rest untouched.',
      'Virtual Nodes (vnodes): Assigning 100+ points on the ring per physical server prevents uneven hot-spots and balances load smoothly.'
    ],
    tradeoffs: 'Introduces slight ring-lookup overhead in memory (O(log S)), but saves catastrophic database and cache stampedes during scaling.'
  },
  {
    id: 'rate-limiting',
    title: 'API Rate Limiting Algorithms',
    category: 'API & Reliability',
    read_time: '5 min read',
    summary: 'Explore Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window Log/Counter algorithms.',
    diagram_type: 'token-bucket',
    key_points: [
      'Token Bucket: Tokens are added at a constant rate. Requests consume tokens. Accommodates bursts up to capacity while capping average throughput.',
      'Leaky Bucket: Requests enter a queue and are processed at a strictly constant rate. Smooths out bursty traffic into a smooth trickle.',
      'Fixed Window Counter: Simple counter per minute/hour. Vulnerable to 2x burst traffic around window boundaries.',
      'Sliding Window Counter: Computes weighted sum of previous window and current window to prevent window boundary spikes with low memory.'
    ],
    tradeoffs: 'Token Bucket is the most widely adopted in industry (Stripe, AWS, Cloudflare) due to memory efficiency and natural burst handling.'
  },
  {
    id: 'microservices-sagas',
    title: 'The Saga Pattern for Distributed Transactions',
    category: 'Microservices & Consistency',
    read_time: '6 min read',
    summary: 'Eliminate 2-Phase-Commit bottlenecks using Choreography or Orchestration with compensating actions.',
    diagram_type: 'saga-pattern',
    key_points: [
      'Two-Phase Commit (2PC) creates blocking locks across microservices, killing availability and scalability.',
      'A Saga breaks a distributed transaction into a sequence of local transactions.',
      'Each service commits locally and publishes an event or message.',
      'If a step fails, compensating transactions run backwards to undo changes (e.g., refund money, cancel reservation).',
      'Choreography: Services listen to events and coordinate implicitly. Great for simple flows.',
      'Orchestration: A central orchestrator service tells each participant what step to execute. Best for complex multi-step workflows.'
    ],
    tradeoffs: 'Eventual consistency means data is temporarily inconsistent during execution; compensations must be carefully designed to never fail.'
  }
];

// Get study topics
router.get('/', (req, res) => {
  res.json(SYSTEM_DESIGN_TOPICS);
});

// Bookmarking
router.post('/bookmark', authenticateToken, (req, res) => {
  try {
    const { questionId } = req.body;
    if (!questionId) {
      return res.status(400).json({ error: 'Question ID required.' });
    }

    const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND question_id = ?').get(req.user.id, questionId);
    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE id = ?').run(existing.id);
      return res.json({ bookmarked: false, message: 'Bookmark removed.' });
    } else {
      db.prepare('INSERT INTO bookmarks (user_id, question_id) VALUES (?, ?)').run(req.user.id, questionId);
      return res.json({ bookmarked: true, message: 'Question saved to your review bookmarks!' });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ error: 'Server error updating bookmark.' });
  }
});

router.get('/bookmarks', authenticateToken, (req, res) => {
  try {
    const bookmarks = db.prepare(`
      SELECT b.id as bookmark_id, b.created_at as bookmarked_at,
             q.id, q.question_text, q.explanation, q.diagram_type, q.difficulty,
             qz.title as quiz_title, qz.category
      FROM bookmarks b
      JOIN questions q ON q.id = b.question_id
      JOIN quizzes qz ON qz.id = q.quiz_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(req.user.id);

    res.json(bookmarks);
  } catch (error) {
    console.error('Fetch bookmarks error:', error);
    res.status(500).json({ error: 'Server error fetching bookmarks.' });
  }
});

export default router;
