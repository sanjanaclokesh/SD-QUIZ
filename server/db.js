import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'Architect Candidate',
      avatar_color TEXT DEFAULT 'indigo',
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      bio TEXT DEFAULT 'Passionate software engineer building resilient distributed systems.',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      time_limit INTEGER NOT NULL, -- in seconds
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      code_snippet TEXT,
      diagram_type TEXT,
      explanation TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      order_num INTEGER DEFAULT 0,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      option_text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0,
      order_num INTEGER DEFAULT 0,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_spent_seconds INTEGER NOT NULL,
      answers_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      badge_key TEXT NOT NULL,
      badge_name TEXT NOT NULL,
      badge_desc TEXT NOT NULL,
      icon TEXT NOT NULL,
      awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, badge_key)
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE(user_id, question_id)
    );
  `);

  seedData();
}

function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    return; // Already seeded
  }

  console.log('Seeding initial database with sample data, quizzes, and questions...');

  // Create demo user and mock leaderboard users
  const salt = bcrypt.genSaltSync(10);
  const demoHash = bcrypt.hashSync('demo123', salt);
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, avatar_color, xp, level, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const demoUser = insertUser.run(
    'Alex Rivera',
    'demo@systemdesign.dev',
    demoHash,
    'Senior Distributed Systems Architect',
    'indigo',
    1850,
    7,
    'Designing planet-scale distributed services and zero-downtime databases.'
  );

  const mockUsers = [
    { name: 'Sophia Chen', email: 'sophia@tech.io', role: 'Staff Infrastructure Engineer', color: 'emerald', xp: 2650, level: 9 },
    { name: 'Marcus Vance', email: 'marcus@cloud.io', role: 'Principal Architect', color: 'purple', xp: 2340, level: 8 },
    { name: 'Elena Rostova', email: 'elena@systems.dev', role: 'Site Reliability Fellow', color: 'amber', xp: 1980, level: 7 },
    { name: 'David Kim', email: 'david@scale.io', role: 'Backend Lead', color: 'cyan', xp: 1420, level: 5 },
    { name: 'Priya Sharma', email: 'priya@arch.org', role: 'Cloud Solutions Architect', color: 'rose', xp: 1150, level: 4 }
  ];

  for (const u of mockUsers) {
    insertUser.run(u.name, u.email, demoHash, u.role, u.color, u.xp, u.level, 'Active contributor to system design mastery.');
  }

  // Seed Badges for demo user
  const insertBadge = db.prepare(`
    INSERT INTO user_badges (user_id, badge_key, badge_name, badge_desc, icon)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertBadge.run(demoUser.lastInsertRowid, 'first_quiz', 'First Steps', 'Completed your first System Design Quiz', 'award');
  insertBadge.run(demoUser.lastInsertRowid, 'cache_master', 'Cache Master', 'Scored 100% on Caching Systems', 'zap');
  insertBadge.run(demoUser.lastInsertRowid, 'speed_demon', 'Fast Architect', 'Completed a quiz in under 2 minutes with >80% accuracy', 'clock');

  // Insert Quizzes
  const insertQuiz = db.prepare(`
    INSERT INTO quizzes (title, slug, category, difficulty, time_limit, icon, color, summary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertQuestion = db.prepare(`
    INSERT INTO questions (quiz_id, question_text, code_snippet, diagram_type, explanation, difficulty, order_num)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOption = db.prepare(`
    INSERT INTO options (question_id, option_text, is_correct, order_num)
    VALUES (?, ?, ?, ?)
  `);

  const quizzesData = [
    {
      title: 'Scalability & Load Balancing Essentials',
      slug: 'scalability-load-balancing',
      category: 'High Availability',
      difficulty: 'Beginner - Intermediate',
      time_limit: 300,
      icon: 'Network',
      color: 'from-blue-600 to-cyan-500',
      summary: 'Master horizontal vs vertical scaling, Layer 4 vs Layer 7 load balancers, and consistent hashing algorithms.',
      questions: [
        {
          question_text: 'When routing incoming traffic based on HTTP request path (e.g., /api/checkout vs /static), which type of Load Balancer is required?',
          code_snippet: null,
          diagram_type: 'layer7-lb',
          explanation: 'Layer 7 load balancers operate at the Application Layer of the OSI model. They can inspect HTTP headers, cookies, URLs, and payloads to make intelligent application-level routing decisions. Layer 4 operates purely at the transport layer (IP and TCP/UDP ports) without payload visibility.',
          difficulty: 'Beginner',
          options: [
            { text: 'Layer 4 (Transport Layer) Load Balancer', is_correct: 0 },
            { text: 'Layer 7 (Application Layer) Load Balancer', is_correct: 1 },
            { text: 'DNS Round Robin without any LB', is_correct: 0 },
            { text: 'BGP Anycast routing only', is_correct: 0 }
          ]
        },
        {
          question_text: 'In a distributed caching or database ring using Consistent Hashing, what is the primary purpose of adding "Virtual Nodes" (vnodes)?',
          code_snippet: null,
          diagram_type: 'consistent-hashing',
          explanation: 'In consistent hashing, standard hashing of a few physical server nodes can lead to hot spots or uneven distribution of keys across the ring. By assigning multiple virtual nodes (e.g., 100-256 vnodes) per physical machine, keys are distributed uniformly across all servers.',
          difficulty: 'Intermediate',
          options: [
            { text: 'To achieve uniform key distribution and prevent hot spots on physical nodes', is_correct: 1 },
            { text: 'To encrypt keys in transit between server nodes', is_correct: 0 },
            { text: 'To convert asynchronous TCP traffic into synchronous UDP packets', is_correct: 0 },
            { text: 'To eliminate the need for backup replicas', is_correct: 0 }
          ]
        },
        {
          question_text: 'Which scaling approach involves adding more compute instances (nodes) to an existing cluster rather than upgrading a single machine with more RAM and CPU cores?',
          code_snippet: null,
          diagram_type: 'horizontal-scaling',
          explanation: 'Horizontal scaling (scaling out) adds more compute instances to share the workload, offering superior fault tolerance, near-infinite scale, and cost flexibility compared to Vertical scaling (scaling up).',
          difficulty: 'Beginner',
          options: [
            { text: 'Vertical Scaling (Scale Up)', is_correct: 0 },
            { text: 'Horizontal Scaling (Scale Out)', is_correct: 1 },
            { text: 'Diagonal Scaling', is_correct: 0 },
            { text: 'Monolithic Partitioning', is_correct: 0 }
          ]
        },
        {
          question_text: 'A critical service has two identical servers: Server A processes all live traffic while Server B stays idle until Server A fails health checks. What topology is this?',
          code_snippet: null,
          diagram_type: 'failover-active-passive',
          explanation: 'This describes an Active-Passive (Warm or Cold Standby) failover cluster. In Active-Active, both servers would actively serve live requests simultaneously with load distribution.',
          difficulty: 'Beginner',
          options: [
            { text: 'Active-Active Clustering', is_correct: 0 },
            { text: 'Active-Passive Standby Failover', is_correct: 1 },
            { text: 'Asynchronous Broadcast Topology', is_correct: 0 },
            { text: 'Split-Brain Consensus Ring', is_correct: 0 }
          ]
        },
        {
          question_text: 'What is a "Sticky Session" (Session Affinity) in load balancing, and what is its main drawback?',
          code_snippet: null,
          diagram_type: 'sticky-sessions',
          explanation: 'Sticky sessions force all requests from a specific user to route to the exact same server instance. While easy for in-memory session state, it harms load distribution equality and causes session loss if that single node crashes.',
          difficulty: 'Intermediate',
          options: [
            { text: 'It pins all requests from a user to a single server node, creating uneven load and vulnerability if that node crashes', is_correct: 1 },
            { text: 'It encrypts TLS handshakes at DNS level, slowing response times by 500ms', is_correct: 0 },
            { text: 'It prevents clients from disconnecting from WebSockets after 60 seconds', is_correct: 0 },
            { text: 'It caches static HTML files inside the router kernel', is_correct: 0 }
          ]
        }
      ]
    },
    {
      title: 'Caching Systems & Invalidation Strategies',
      slug: 'caching-invalidation',
      category: 'Caching & Performance',
      difficulty: 'Intermediate',
      time_limit: 300,
      icon: 'Zap',
      color: 'from-amber-500 to-orange-500',
      summary: 'Learn cache eviction algorithms (LRU, LFU), invalidation patterns (Cache-Aside, Write-Through, Write-Back), and CDN edge caching.',
      questions: [
        {
          question_text: 'In the "Cache-Aside" (Lazy Loading) pattern, what happens when an application attempts to read a user profile that is NOT present in the cache?',
          code_snippet: `// Pseudo-code
async function getUser(id) {
  let user = await cache.get(id);
  if (!user) {
    user = await db.query('SELECT * FROM users WHERE id = ?', id);
    await cache.set(id, user, TTL);
  }
  return user;
}`,
          diagram_type: 'cache-aside',
          explanation: 'In Cache-Aside, the application code first inspects the cache. On a cache miss, the application directly queries the primary database, populates the cache with the fetched record (usually with a TTL), and returns the result to the client.',
          difficulty: 'Intermediate',
          options: [
            { text: 'The cache directly queries the database automatically and syncs via database triggers', is_correct: 0 },
            { text: 'The application queries the database, writes the result to the cache, and returns it to the client', is_correct: 1 },
            { text: 'The database pushes the record to the CDN edge node asynchronously', is_correct: 0 },
            { text: 'The request fails with a 404 Cache Not Found error', is_correct: 0 }
          ]
        },
        {
          question_text: 'Which caching pattern writes data immediately to the cache and delays writing to the permanent database via an asynchronous background batch process?',
          code_snippet: null,
          diagram_type: 'write-back',
          explanation: 'Write-Back (Write-Behind) writes to cache first and confirms the write to the client immediately. Data is flushed to the database asynchronously. It offers ultra-low write latency and high throughput, but risks data loss if the cache node crashes before flushing.',
          difficulty: 'Intermediate',
          options: [
            { text: 'Write-Through', is_correct: 0 },
            { text: 'Write-Back (Write-Behind)', is_correct: 1 },
            { text: 'Write-Around', is_correct: 0 },
            { text: 'Read-Through', is_correct: 0 }
          ]
        },
        {
          question_text: 'What phenomenon occurs when a hot cache key expires, causing hundreds of thousands of concurrent requests to suddenly overwhelm the underlying database simultaneously?',
          code_snippet: null,
          diagram_type: 'thundering-herd',
          explanation: 'A "Cache Stampede" (also known as the "Thundering Herd" problem) occurs when a heavily accessed key expires and multiple incoming requests experience a cache miss at the same millisecond, all hitting the database at once. Mutex locks or probabilistic early recomputation (XFetch) mitigate this.',
          difficulty: 'Advanced',
          options: [
            { text: 'Cache Stampede (Thundering Herd)', is_correct: 1 },
            { text: 'Memory Leak Overflow', is_correct: 0 },
            { text: 'Cascading Deadlock Collapse', is_correct: 0 },
            { text: 'Split-Brain Inconsistency', is_correct: 0 }
          ]
        },
        {
          question_text: 'What data structure combination is traditionally used to implement an LRU (Least Recently Used) cache with O(1) get and O(1) put complexity?',
          code_snippet: null,
          diagram_type: 'lru-structure',
          explanation: 'A Hash Map (dictionary) combined with a Doubly Linked List enables O(1) lookup of items, while the doubly linked list allows moving nodes to the head and evicting from the tail in O(1) time.',
          difficulty: 'Intermediate',
          options: [
            { text: 'Hash Map + Doubly Linked List', is_correct: 1 },
            { text: 'Binary Search Tree + Array', is_correct: 0 },
            { text: 'Min-Heap + Stack', is_correct: 0 },
            { text: 'Circular Ring Buffer + Bloom Filter', is_correct: 0 }
          ]
        },
        {
          question_text: 'What is a "Bloom Filter" frequently used for in front of a distributed database or cache?',
          code_snippet: null,
          diagram_type: 'bloom-filter',
          explanation: 'A Bloom filter is a space-efficient probabilistic data structure used to test set membership. It can definitively tell you if an element is NOT in the database, avoiding expensive disk reads for non-existent keys (no false negatives, though false positives are possible).',
          difficulty: 'Advanced',
          options: [
            { text: 'To quickly determine with 100% certainty that a key does NOT exist, preventing costly disk lookups', is_correct: 1 },
            { text: 'To compress JSON payloads before sending over WebSockets', is_correct: 0 },
            { text: 'To balance TCP connections across multiple Docker containers', is_correct: 0 },
            { text: 'To guarantee ACID transactions across multi-datacenter clusters', is_correct: 0 }
          ]
        }
      ]
    },
    {
      title: 'Distributed Databases, CAP & Sharding',
      slug: 'databases-cap-sharding',
      category: 'Databases & Storage',
      difficulty: 'Advanced',
      time_limit: 360,
      icon: 'Database',
      color: 'from-emerald-500 to-teal-600',
      summary: 'Explore CAP theorem tradeoffs, horizontal database sharding, replication lag, and ACID vs BASE paradigms.',
      questions: [
        {
          question_text: 'According to the CAP Theorem, in the presence of an unavoidable Network Partition (P), an architect must choose between which two properties?',
          code_snippet: null,
          diagram_type: 'cap-theorem',
          explanation: 'Network partitions are inevitable in real-world distributed networks due to fiber cuts, router failures, or packet loss. Therefore, when partition P occurs, a system must either return errors to ensure strict Consistency (CP) or serve potentially stale data to ensure high Availability (AP).',
          difficulty: 'Intermediate',
          options: [
            { text: 'Consistency (C) or Availability (A)', is_correct: 1 },
            { text: 'Performance (P) or Durability (D)', is_correct: 0 },
            { text: 'Atomicity (A) or Concurrency (C)', is_correct: 0 },
            { text: 'Scalability (S) or Latency (L)', is_correct: 0 }
          ]
        },
        {
          question_text: 'When sharding a database table by User ID (hash-based sharding), what is the most significant disadvantage compared to a single primary database?',
          code_snippet: null,
          diagram_type: 'sharding-tradeoff',
          explanation: 'Cross-shard queries and joins (e.g., finding all orders placed across different users within a date range) require querying every shard and aggregating results in the application tier, which is slow and complex.',
          difficulty: 'Advanced',
          options: [
            { text: 'Cross-shard JOINs and distributed transactions become complex, slow, and expensive', is_correct: 1 },
            { text: 'The maximum storage limit of each machine drops by 50%', is_correct: 0 },
            { text: 'Indexes can no longer be used on primary keys', is_correct: 0 },
            { text: 'All writes must be converted to binary strings', is_correct: 0 }
          ]
        },
        {
          question_text: 'A user updates their profile picture and immediately refreshes the page, but still sees their old photo due to asynchronous replication lag to Read Replicas. Which consistency model solves this specific issue?',
          code_snippet: null,
          diagram_type: 'read-your-writes',
          explanation: '"Read-Your-Own-Writes" (or Read-After-Write Consistency) guarantees that whenever a user makes an update, their subsequent reads are routed either to the primary database or to a replica guaranteed to have applied that write.',
          difficulty: 'Intermediate',
          options: [
            { text: 'Read-Your-Own-Writes (Read-After-Write Consistency)', is_correct: 1 },
            { text: 'Eventual Consistency with 24h delay', is_correct: 0 },
            { text: 'Causal Ordering via Paxos consensus only', is_correct: 0 },
            { text: 'Monotonic Read Suppression', is_correct: 0 }
          ]
        },
        {
          question_text: 'What is the primary architectural difference between an LSM-Tree (Log-Structured Merge-Tree) database (like Cassandra/RocksDB) and a B-Tree database (like PostgreSQL/MySQL InnoDB)?',
          code_snippet: null,
          diagram_type: 'lsm-vs-btree',
          explanation: 'LSM-Trees optimize for high write throughput by appending writes sequentially to an in-memory MemTable and commit log (flushed to SSTables on disk), avoiding random disk writes. B-Trees modify pages in-place on disk, optimizing for read predictability.',
          difficulty: 'Advanced',
          options: [
            { text: 'LSM-Trees append writes sequentially in memory/disk for ultra-high write throughput; B-Trees update disk pages in place', is_correct: 1 },
            { text: 'B-Trees cannot support indexes on secondary columns', is_correct: 0 },
            { text: 'LSM-Trees require quantum storage hardware', is_correct: 0 },
            { text: 'B-Trees do not support ACID transactions', is_correct: 0 }
          ]
        },
        {
          question_text: 'What does the "BASE" model in distributed NoSQL databases stand for?',
          code_snippet: null,
          diagram_type: 'base-model',
          explanation: 'BASE stands for Basically Available, Soft state, Eventual consistency. Unlike ACID which prioritizes immediate consistency, BASE prioritizes availability and accepts temporary inconsistencies that resolve eventually.',
          difficulty: 'Beginner',
          options: [
            { text: 'Basically Available, Soft state, Eventual consistency', is_correct: 1 },
            { text: 'Binary Access, Synchronous Execution, Encryption', is_correct: 0 },
            { text: 'Buffered Allocation, Sharded Elasticity, Replication', is_correct: 0 },
            { text: 'Broad Availability, Strong Encryption, ACID Compliance', is_correct: 0 }
          ]
        }
      ]
    },
    {
      title: 'Message Queues, Event Streaming & Sagas',
      slug: 'messaging-events-sagas',
      category: 'Distributed Systems',
      difficulty: 'Intermediate - Advanced',
      time_limit: 300,
      icon: 'Cpu',
      color: 'from-purple-600 to-indigo-600',
      summary: 'Differentiate RabbitMQ vs Apache Kafka, explore Saga choreography vs orchestration, and ensure idempotent processing.',
      questions: [
        {
          question_text: 'What fundamental architectural difference sets Apache Kafka apart from traditional message brokers like RabbitMQ or AWS SQS?',
          code_snippet: null,
          diagram_type: 'kafka-vs-rabbitmq',
          explanation: 'Kafka is an append-only distributed commit log where messages are retained on disk for a configured duration. Consumers manage their own read offsets and multiple independent consumer groups can replay historical messages at their own pace. RabbitMQ deletes messages once acknowledged.',
          difficulty: 'Intermediate',
          options: [
            { text: 'Kafka is a durable distributed commit log where consumers track their own offsets and can replay data', is_correct: 1 },
            { text: 'Kafka only supports synchronous peer-to-peer RPC without queues', is_correct: 0 },
            { text: 'RabbitMQ persists all data forever while Kafka clears data every 10 seconds', is_correct: 0 },
            { text: 'Kafka operates solely in client browser memory', is_correct: 0 }
          ]
        },
        {
          question_text: 'In an e-commerce microservices architecture, an order involves Payment Service, Inventory Service, and Shipping Service. If Payment succeeds but Inventory fails, how does the Saga Pattern handle consistency without 2PC (Two-Phase Commit)?',
          code_snippet: null,
          diagram_type: 'saga-pattern',
          explanation: 'The Saga Pattern executes a series of local transactions in each microservice. If a step fails, the Saga triggers a series of "Compensating Transactions" that undo the previously completed operations (e.g., refunding the payment).',
          difficulty: 'Advanced',
          options: [
            { text: 'It executes compensating transactions in reverse order to undo previously committed changes', is_correct: 1 },
            { text: 'It rolls back all microservice databases automatically using a global OS lock', is_correct: 0 },
            { text: 'It cancels the customer internet connection immediately', is_correct: 0 },
            { text: 'It deletes the microservices container and launches fresh instances', is_correct: 0 }
          ]
        },
        {
          question_text: 'Why is it critical for distributed message consumers to be designed "Idempotently"?',
          code_snippet: null,
          diagram_type: 'idempotency',
          explanation: 'Because distributed networks frequently have at-least-once delivery (due to timeouts, retries, and network blips), the same message or payment request may arrive multiple times. Idempotent design ensures processing the message multiple times produces the exact same outcome as processing it once.',
          difficulty: 'Intermediate',
          options: [
            { text: 'Because at-least-once message delivery means duplicates will arrive, and processing duplicate requests must not cause multiple charges or duplicate state', is_correct: 1 },
            { text: 'To ensure messages travel through optical fiber at the speed of light', is_correct: 0 },
            { text: 'To prevent messages from consuming CPU cycles during TLS compression', is_correct: 0 },
            { text: 'Because idempotent functions do not require a database connection', is_correct: 0 }
          ]
        },
        {
          question_text: 'What is the purpose of a "Dead Letter Queue" (DLQ) in an asynchronous messaging architecture?',
          code_snippet: null,
          diagram_type: 'dead-letter-queue',
          explanation: 'When a message cannot be successfully processed after a configured number of retries (e.g., due to malformed payloads or unrecoverable business logic errors), it is moved to a DLQ for offline inspection and debugging without blocking subsequent valid messages in the main queue.',
          difficulty: 'Beginner',
          options: [
            { text: 'To isolate poisoned or repeatedly failing messages so they do not block normal queue processing', is_correct: 1 },
            { text: 'To store deleted user account records for GDPR compliance', is_correct: 0 },
            { text: 'To encrypt passwords before inserting into the cache', is_correct: 0 },
            { text: 'To serve static CSS and JavaScript files to browsers', is_correct: 0 }
          ]
        },
        {
          question_text: 'In Kafka, how is message ordering strictly guaranteed across a topic?',
          code_snippet: null,
          diagram_type: 'kafka-partitions',
          explanation: 'Kafka only guarantees strict message ordering within a single Partition, not across the entire multi-partition topic. Messages with the same Partition Key (e.g., order_id or customer_id) are always routed to the same partition and consumed sequentially.',
          difficulty: 'Advanced',
          options: [
            { text: 'Ordering is strictly guaranteed within a specific partition, not across the entire multi-partition topic', is_correct: 1 },
            { text: 'Kafka automatically sorts all messages across all partitions alphabetically', is_correct: 0 },
            { text: 'Consumers sort messages using client-side quicksort', is_correct: 0 },
            { text: 'Kafka guarantees global ordering across all partitions regardless of key', is_correct: 0 }
          ]
        }
      ]
    },
    {
      title: 'Real-World Architecture: Rate Limiters & URL Shorteners',
      slug: 'rate-limiters-url-shortener',
      category: 'Real-World Design',
      difficulty: 'Advanced',
      time_limit: 360,
      icon: 'Shield',
      color: 'from-rose-500 to-pink-600',
      summary: 'Design realistic high-scale services: Token Bucket rate limiters, 64-bit ID generation, Base62 encoding, and cache sizing.',
      questions: [
        {
          question_text: 'In designing a high-throughput API Rate Limiter, which algorithm allows bursts of traffic up to a maximum capacity while refilling tokens at a constant rate?',
          code_snippet: null,
          diagram_type: 'token-bucket',
          explanation: 'The Token Bucket algorithm maintains a bucket with a fixed capacity. Tokens are added periodically at a constant refill rate. Requests consume tokens; if tokens are available, the burst is accepted immediately; if empty, requests are throttled (HTTP 429).',
          difficulty: 'Intermediate',
          options: [
            { text: 'Token Bucket Algorithm', is_correct: 1 },
            { text: 'Fixed Window Counter', is_correct: 0 },
            { text: 'Round Robin Arbiter', is_correct: 0 },
            { text: 'Exponential Backoff Protocol', is_correct: 0 }
          ]
        },
        {
          question_text: 'When designing a distributed URL shortener (like TinyURL or Bitly) that produces 7-character short codes using Base62 [0-9, a-z, A-Z], approximately how many unique short URLs can be generated?',
          code_snippet: `// Base62 Alphabet: 10 digits + 26 lowercase + 26 uppercase = 62 characters
Total URLs = 62^7`,
          diagram_type: 'base62-url',
          explanation: '62 raised to the 7th power equals 62^7 ≈ 3.52 trillion unique combinations (3,521,614,606,208 URLs), which easily accommodates hundreds of millions of new URLs generated every month for decades.',
          difficulty: 'Intermediate',
          options: [
            { text: 'Approximately 3.5 Trillion (3.5 × 10^12) URLs', is_correct: 1 },
            { text: 'Approximately 62,000 URLs', is_correct: 0 },
            { text: 'Exactly 256 Million URLs', is_correct: 0 },
            { text: 'Only 4.3 Billion URLs (IPv4 range)', is_correct: 0 }
          ]
        },
        {
          question_text: 'Why is Twitter Snowflake preferred over traditional auto-incrementing database primary keys for generating 64-bit unique IDs in a distributed system?',
          code_snippet: null,
          diagram_type: 'snowflake-id',
          explanation: 'Twitter Snowflake generates 64-bit IDs containing a timestamp component, data center ID, worker machine ID, and sequence number. This allows decentralized, lock-free ID generation that is naturally time-sortable across thousands of independent nodes without a single point of contention.',
          difficulty: 'Advanced',
          options: [
            { text: 'It generates roughly time-sortable, 64-bit unique IDs decentralized across thousands of nodes without coordination locks', is_correct: 1 },
            { text: 'It compresses image thumbnails directly into the primary key', is_correct: 0 },
            { text: 'It encrypts IDs with AES-256 automatically at zero CPU overhead', is_correct: 0 },
            { text: 'It completely replaces the need for an API Gateway', is_correct: 0 }
          ]
        },
        {
          question_text: 'When designing a newsfeed system (like Twitter or Instagram), what is the "Celebrity Problem" (Hot User Problem) associated with a Fanout-on-Write (Push) architecture?',
          code_snippet: null,
          diagram_type: 'fanout-architecture',
          explanation: 'In Fanout-on-Write, whenever a user posts, their post is pushed into every follower’s timeline inbox. When an account with 100 million followers posts, pushing 100M writes generates massive write amplification and system bottlenecks. Hybrid architectures use Fanout-on-Read (Pull) for celebrities.',
          difficulty: 'Advanced',
          options: [
            { text: 'A user with millions of followers causes millions of concurrent writes to followers\' inboxes, leading to write amplification bottlenecks', is_correct: 1 },
            { text: 'Celebrities change their username frequently, breaking relational foreign keys', is_correct: 0 },
            { text: 'Video uploads from verified accounts exceed TCP maximum segment sizes', is_correct: 0 },
            { text: 'Celebrity accounts require dedicated physical database servers in every city', is_correct: 0 }
          ]
        },
        {
          question_text: 'In a real-time ride dispatch system (like Uber or Lyft), which spatial indexing approach divides 2D space into recursive hierarchical quadrants (NW, NE, SW, SE) to quickly find nearby drivers?',
          code_snippet: null,
          diagram_type: 'quadtree-geo',
          explanation: 'A QuadTree is a 2D spatial tree where every internal node has exactly four children corresponding to four quadrants. When a driver moves or a rider requests a pickup, spatial queries quickly traverse nodes containing nearby latitude/longitude coordinates.',
          difficulty: 'Advanced',
          options: [
            { text: 'QuadTree Indexing', is_correct: 1 },
            { text: 'Red-Black Balancing Ring', is_correct: 0 },
            { text: 'B-Tree String Parsing', is_correct: 0 },
            { text: 'Trie Prefix Auto-complete', is_correct: 0 }
          ]
        }
      ]
    },
    {
      title: 'Microservices, Resiliency & API Gateways',
      slug: 'microservices-resiliency',
      category: 'System Architecture',
      difficulty: 'Intermediate',
      time_limit: 300,
      icon: 'Layers',
      color: 'from-cyan-600 to-blue-700',
      summary: 'Explore Circuit Breaker patterns, Bulkhead isolation, API Gateway responsibilities, and Service Mesh architecture.',
      questions: [
        {
          question_text: 'What state transitions occur in a "Circuit Breaker" pattern (e.g., Netflix Hystrix / Resilience4j) to prevent cascading failures across microservices?',
          code_snippet: null,
          diagram_type: 'circuit-breaker',
          explanation: 'A circuit breaker starts in CLOSED (requests flow normally). If the failure rate exceeds a threshold, it trips to OPEN (fails fast immediately without calling the failing downstream service). After a timeout, it enters HALF-OPEN to test if the service has recovered.',
          difficulty: 'Intermediate',
          options: [
            { text: 'CLOSED -> OPEN -> HALF-OPEN -> CLOSED', is_correct: 1 },
            { text: 'ACTIVE -> SLEEP -> KILLED -> ACTIVE', is_correct: 0 },
            { text: 'SYN -> SYN-ACK -> ACK -> FIN', is_correct: 0 },
            { text: 'PRIMARY -> REPLICA -> QUORUM -> PRIMARY', is_correct: 0 }
          ]
        },
        {
          question_text: 'What is the primary responsibility of a Service Mesh sidecar proxy (such as Envoy in Istio)?',
          code_snippet: null,
          diagram_type: 'service-mesh',
          explanation: 'A sidecar proxy intercepts all inbound and outbound network traffic to provide transparent mutual TLS (mTLS), distributed tracing, traffic routing, retry logic, and telemetry without changing application code.',
          difficulty: 'Intermediate',
          options: [
            { text: 'To handle service-to-service communication, mTLS encryption, observability, and traffic routing transparently', is_correct: 1 },
            { text: 'To compile Java bytecode into machine binaries on the fly', is_correct: 0 },
            { text: 'To replace the primary relational database with in-memory SQLite', is_correct: 0 },
            { text: 'To render React frontend components inside the Linux kernel', is_correct: 0 }
          ]
        },
        {
          question_text: 'How does the "Bulkhead Pattern" (named after ship hull compartments) increase resiliency in distributed microservices?',
          code_snippet: null,
          diagram_type: 'bulkhead-pattern',
          explanation: 'Just like ship bulkheads prevent water in one punctured section from sinking the whole vessel, the software Bulkhead pattern partitions thread pools, connection pools, and memory so that an outage in one dependency doesn’t exhaust resources for the rest of the app.',
          difficulty: 'Intermediate',
          options: [
            { text: 'It isolates thread pools and resource allocations so the failure of one downstream dependency cannot exhaust all resources', is_correct: 1 },
            { text: 'It compresses database snapshots into underwater storage vaults', is_correct: 0 },
            { text: 'It duplicates all HTTP requests across 5 cloud providers simultaneously', is_correct: 0 },
            { text: 'It shuts down the entire cluster when latency exceeds 100 milliseconds', is_correct: 0 }
          ]
        },
        {
          question_text: 'Which architectural component is best suited for cross-cutting concerns like Authentication, Rate Limiting, SSL Termination, and Request Routing for client apps?',
          code_snippet: null,
          diagram_type: 'api-gateway',
          explanation: 'An API Gateway sits between client devices (web, mobile) and backend microservices, serving as a unified entry point handling SSL termination, JWT authentication, rate limiting, and request transformation.',
          difficulty: 'Beginner',
          options: [
            { text: 'API Gateway', is_correct: 1 },
            { text: 'Message Consumer Group', is_correct: 0 },
            { text: 'Write-Ahead Log (WAL)', is_correct: 0 },
            { text: 'MemTable Buffer', is_correct: 0 }
          ]
        },
        {
          question_text: 'In gRPC communication between microservices, what serialization format and underlying transport protocol are used for ultra-high performance?',
          code_snippet: null,
          diagram_type: 'grpc-proto',
          explanation: 'gRPC utilizes Protocol Buffers (Protobuf) for compact, strongly-typed binary serialization, and runs over HTTP/2, enabling multiplexing multiple requests over a single TCP connection with header compression.',
          difficulty: 'Intermediate',
          options: [
            { text: 'Protocol Buffers (Protobuf) over HTTP/2', is_correct: 1 },
            { text: 'JSON text over HTTP/1.1', is_correct: 0 },
            { text: 'XML envelopes over SOAP UDP', is_correct: 0 },
            { text: 'YAML over raw Telnet sockets', is_correct: 0 }
          ]
        }
      ]
    }
  ];

  for (const qData of quizzesData) {
    const quizRes = insertQuiz.run(
      qData.title,
      qData.slug,
      qData.category,
      qData.difficulty,
      qData.time_limit,
      qData.icon,
      qData.color,
      qData.summary
    );
    const quizId = quizRes.lastInsertRowid;

    let qOrder = 1;
    for (const q of qData.questions) {
      const qRes = insertQuestion.run(
        quizId,
        q.question_text,
        q.code_snippet,
        q.diagram_type,
        q.explanation,
        q.difficulty,
        qOrder++
      );
      const questionId = qRes.lastInsertRowid;

      let oOrder = 1;
      for (const opt of q.options) {
        insertOption.run(questionId, opt.text, opt.is_correct, oOrder++);
      }
    }
  }

  // Seed sample quiz attempts for demo user
  const insertAttempt = db.prepare(`
    INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, time_spent_seconds, answers_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAttempt.run(demoUser.lastInsertRowid, 1, 5, 5, 142, JSON.stringify({ 1: 1, 2: 0, 3: 1, 4: 1, 5: 0 }));
  insertAttempt.run(demoUser.lastInsertRowid, 2, 4, 5, 178, JSON.stringify({ 6: 1, 7: 1, 8: 0, 9: 0, 10: 0 }));

  console.log('Database initialized and seeded successfully with 6 full quizzes and questions!');
}

export default db;
