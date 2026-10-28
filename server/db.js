import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial Quiz & Question Data
const INITIAL_QUIZZES = [
  {
    id: 1,
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
        id: 1,
        quiz_id: 1,
        question_text: 'When routing incoming traffic based on HTTP request path (e.g., /api/checkout vs /static), which type of Load Balancer is required?',
        code_snippet: null,
        diagram_type: 'layer7-lb',
        explanation: 'Layer 7 load balancers operate at the Application Layer of the OSI model. They can inspect HTTP headers, cookies, URLs, and payloads to make intelligent application-level routing decisions. Layer 4 operates purely at the transport layer (IP and TCP/UDP ports) without payload visibility.',
        difficulty: 'Beginner',
        order_num: 1,
        options: [
          { id: 1, question_id: 1, option_text: 'Layer 4 (Transport Layer) Load Balancer', is_correct: 0 },
          { id: 2, question_id: 1, option_text: 'Layer 7 (Application Layer) Load Balancer', is_correct: 1 },
          { id: 3, question_id: 1, option_text: 'DNS Round Robin without any LB', is_correct: 0 },
          { id: 4, question_id: 1, option_text: 'BGP Anycast routing only', is_correct: 0 }
        ]
      },
      {
        id: 2,
        quiz_id: 1,
        question_text: 'In a distributed caching or database ring using Consistent Hashing, what is the primary purpose of adding "Virtual Nodes" (vnodes)?',
        code_snippet: null,
        diagram_type: 'consistent-hashing',
        explanation: 'In consistent hashing, standard hashing of a few physical server nodes can lead to hot spots or uneven distribution of keys across the ring. By assigning multiple virtual nodes (e.g., 100-256 vnodes) per physical machine, keys are distributed uniformly across all servers.',
        difficulty: 'Intermediate',
        order_num: 2,
        options: [
          { id: 5, question_id: 2, option_text: 'To achieve uniform key distribution and prevent hot spots on physical nodes', is_correct: 1 },
          { id: 6, question_id: 2, option_text: 'To encrypt keys in transit between server nodes', is_correct: 0 },
          { id: 7, question_id: 2, option_text: 'To convert asynchronous TCP traffic into synchronous UDP packets', is_correct: 0 },
          { id: 8, question_id: 2, option_text: 'To eliminate the need for backup replicas', is_correct: 0 }
        ]
      },
      {
        id: 3,
        quiz_id: 1,
        question_text: 'Which scaling approach involves adding more compute instances (nodes) to an existing cluster rather than upgrading a single machine with more RAM and CPU cores?',
        code_snippet: null,
        diagram_type: 'horizontal-scaling',
        explanation: 'Horizontal scaling (scaling out) adds more compute instances to share the workload, offering superior fault tolerance, near-infinite scale, and cost flexibility compared to Vertical scaling (scaling up).',
        difficulty: 'Beginner',
        order_num: 3,
        options: [
          { id: 9, question_id: 3, option_text: 'Vertical Scaling (Scale Up)', is_correct: 0 },
          { id: 10, question_id: 3, option_text: 'Horizontal Scaling (Scale Out)', is_correct: 1 },
          { id: 11, question_id: 3, option_text: 'Diagonal Scaling', is_correct: 0 },
          { id: 12, question_id: 3, option_text: 'Monolithic Partitioning', is_correct: 0 }
        ]
      },
      {
        id: 4,
        quiz_id: 1,
        question_text: 'A critical service has two identical servers: Server A processes all live traffic while Server B stays idle until Server A fails health checks. What topology is this?',
        code_snippet: null,
        diagram_type: 'failover-active-passive',
        explanation: 'This describes an Active-Passive (Warm or Cold Standby) failover cluster. In Active-Active, both servers would actively serve live requests simultaneously with load distribution.',
        difficulty: 'Beginner',
        order_num: 4,
        options: [
          { id: 13, question_id: 4, option_text: 'Active-Active Clustering', is_correct: 0 },
          { id: 14, question_id: 4, option_text: 'Active-Passive Standby Failover', is_correct: 1 },
          { id: 15, question_id: 4, option_text: 'Asynchronous Broadcast Topology', is_correct: 0 },
          { id: 16, question_id: 4, option_text: 'Split-Brain Consensus Ring', is_correct: 0 }
        ]
      },
      {
        id: 5,
        quiz_id: 1,
        question_text: 'What is a "Sticky Session" (Session Affinity) in load balancing, and what is its main drawback?',
        code_snippet: null,
        diagram_type: 'sticky-sessions',
        explanation: 'Sticky sessions force all requests from a specific user to route to the exact same server instance. While easy for in-memory session state, it harms load distribution equality and causes session loss if that single node crashes.',
        difficulty: 'Intermediate',
        order_num: 5,
        options: [
          { id: 17, question_id: 5, option_text: 'It pins all requests from a user to a single server node, creating uneven load and vulnerability if that node crashes', is_correct: 1 },
          { id: 18, question_id: 5, option_text: 'It encrypts TLS handshakes at DNS level, slowing response times by 500ms', is_correct: 0 },
          { id: 19, question_id: 5, option_text: 'It prevents clients from disconnecting from WebSockets after 60 seconds', is_correct: 0 },
          { id: 20, question_id: 5, option_text: 'It caches static HTML files inside the router kernel', is_correct: 0 }
        ]
      }
    ]
  },
  {
    id: 2,
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
        id: 6,
        quiz_id: 2,
        question_text: 'In the "Cache-Aside" (Lazy Loading) pattern, what happens when an application attempts to read a user profile that is NOT present in the cache?',
        code_snippet: `// Pseudo-code\nasync function getUser(id) {\n  let user = await cache.get(id);\n  if (!user) {\n    user = await db.query('SELECT * FROM users WHERE id = ?', id);\n    await cache.set(id, user, TTL);\n  }\n  return user;\n}`,
        diagram_type: 'cache-aside',
        explanation: 'In Cache-Aside, the application code first inspects the cache. On a cache miss, the application directly queries the primary database, populates the cache with the fetched record (usually with a TTL), and returns the result to the client.',
        difficulty: 'Intermediate',
        order_num: 1,
        options: [
          { id: 21, question_id: 6, option_text: 'The cache directly queries the database automatically and syncs via database triggers', is_correct: 0 },
          { id: 22, question_id: 6, option_text: 'The application queries the database, writes the result to the cache, and returns it to the client', is_correct: 1 },
          { id: 23, question_id: 6, option_text: 'The database pushes the record to the CDN edge node asynchronously', is_correct: 0 },
          { id: 24, question_id: 6, option_text: 'The request fails with a 404 Cache Not Found error', is_correct: 0 }
        ]
      },
      {
        id: 7,
        quiz_id: 2,
        question_text: 'Which caching pattern writes data immediately to the cache and delays writing to the permanent database via an asynchronous background batch process?',
        code_snippet: null,
        diagram_type: 'write-back',
        explanation: 'Write-Back (Write-Behind) writes to cache first and confirms the write to the client immediately. Data is flushed to the database asynchronously. It offers ultra-low write latency and high throughput, but risks data loss if the cache node crashes before flushing.',
        difficulty: 'Intermediate',
        order_num: 2,
        options: [
          { id: 25, question_id: 7, option_text: 'Write-Through', is_correct: 0 },
          { id: 26, question_id: 7, option_text: 'Write-Back (Write-Behind)', is_correct: 1 },
          { id: 27, question_id: 7, option_text: 'Write-Around', is_correct: 0 },
          { id: 28, question_id: 7, option_text: 'Read-Through', is_correct: 0 }
        ]
      },
      {
        id: 8,
        quiz_id: 2,
        question_text: 'What phenomenon occurs when a hot cache key expires, causing hundreds of thousands of concurrent requests to suddenly overwhelm the underlying database simultaneously?',
        code_snippet: null,
        diagram_type: 'thundering-herd',
        explanation: 'A "Cache Stampede" (also known as the "Thundering Herd" problem) occurs when a heavily accessed key expires and multiple incoming requests experience a cache miss at the same millisecond, all hitting the database at once. Mutex locks or probabilistic early recomputation (XFetch) mitigate this.',
        difficulty: 'Advanced',
        order_num: 3,
        options: [
          { id: 29, question_id: 8, option_text: 'Cache Stampede (Thundering Herd)', is_correct: 1 },
          { id: 30, question_id: 8, option_text: 'Memory Leak Overflow', is_correct: 0 },
          { id: 31, question_id: 8, option_text: 'Cascading Deadlock Collapse', is_correct: 0 },
          { id: 32, question_id: 8, option_text: 'Split-Brain Inconsistency', is_correct: 0 }
        ]
      },
      {
        id: 9,
        quiz_id: 2,
        question_text: 'What data structure combination is traditionally used to implement an LRU (Least Recently Used) cache with O(1) get and O(1) put complexity?',
        code_snippet: null,
        diagram_type: 'lru-structure',
        explanation: 'A Hash Map (dictionary) combined with a Doubly Linked List enables O(1) lookup of items, while the doubly linked list allows moving nodes to the head and evicting from the tail in O(1) time.',
        difficulty: 'Intermediate',
        order_num: 4,
        options: [
          { id: 33, question_id: 9, option_text: 'Hash Map + Doubly Linked List', is_correct: 1 },
          { id: 34, question_id: 9, option_text: 'Binary Search Tree + Array', is_correct: 0 },
          { id: 35, question_id: 9, option_text: 'Min-Heap + Stack', is_correct: 0 },
          { id: 36, question_id: 9, option_text: 'Circular Ring Buffer + Bloom Filter', is_correct: 0 }
        ]
      },
      {
        id: 10,
        quiz_id: 2,
        question_text: 'What is a "Bloom Filter" frequently used for in front of a distributed database or cache?',
        code_snippet: null,
        diagram_type: 'bloom-filter',
        explanation: 'A Bloom filter is a space-efficient probabilistic data structure used to test set membership. It can definitively tell you if an element is NOT in the database, avoiding expensive disk reads for non-existent keys (no false negatives, though false positives are possible).',
        difficulty: 'Advanced',
        order_num: 5,
        options: [
          { id: 37, question_id: 10, option_text: 'To quickly determine with 100% certainty that a key does NOT exist, preventing costly disk lookups', is_correct: 1 },
          { id: 38, question_id: 10, option_text: 'To compress JSON payloads before sending over WebSockets', is_correct: 0 },
          { id: 39, question_id: 10, option_text: 'To balance TCP connections across multiple Docker containers', is_correct: 0 },
          { id: 40, question_id: 10, option_text: 'To guarantee ACID transactions across multi-datacenter clusters', is_correct: 0 }
        ]
      }
    ]
  },
  {
    id: 3,
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
        id: 11,
        quiz_id: 3,
        question_text: 'According to the CAP Theorem, in the presence of an unavoidable Network Partition (P), an architect must choose between which two properties?',
        code_snippet: null,
        diagram_type: 'cap-theorem',
        explanation: 'Network partitions are inevitable in real-world distributed networks due to fiber cuts, router failures, or packet loss. Therefore, when partition P occurs, a system must either return errors to ensure strict Consistency (CP) or serve potentially stale data to ensure high Availability (AP).',
        difficulty: 'Intermediate',
        order_num: 1,
        options: [
          { id: 41, question_id: 11, option_text: 'Consistency (C) or Availability (A)', is_correct: 1 },
          { id: 42, question_id: 11, option_text: 'Performance (P) or Durability (D)', is_correct: 0 },
          { id: 43, question_id: 11, option_text: 'Atomicity (A) or Concurrency (C)', is_correct: 0 },
          { id: 44, question_id: 11, option_text: 'Scalability (S) or Latency (L)', is_correct: 0 }
        ]
      },
      {
        id: 12,
        quiz_id: 3,
        question_text: 'When sharding a database table by User ID (hash-based sharding), what is the most significant disadvantage compared to a single primary database?',
        code_snippet: null,
        diagram_type: 'sharding-tradeoff',
        explanation: 'Cross-shard queries and joins (e.g., finding all orders placed across different users within a date range) require querying every shard and aggregating results in the application tier, which is slow and complex.',
        difficulty: 'Advanced',
        order_num: 2,
        options: [
          { id: 45, question_id: 12, option_text: 'Cross-shard JOINs and distributed transactions become complex, slow, and expensive', is_correct: 1 },
          { id: 46, question_id: 12, option_text: 'The maximum storage limit of each machine drops by 50%', is_correct: 0 },
          { id: 47, question_id: 12, option_text: 'Indexes can no longer be used on primary keys', is_correct: 0 },
          { id: 48, question_id: 12, option_text: 'All writes must be converted to binary strings', is_correct: 0 }
        ]
      },
      {
        id: 13,
        quiz_id: 3,
        question_text: 'A user updates their profile picture and immediately refreshes the page, but still sees their old photo due to asynchronous replication lag to Read Replicas. Which consistency model solves this specific issue?',
        code_snippet: null,
        diagram_type: 'read-your-writes',
        explanation: '"Read-Your-Own-Writes" (or Read-After-Write Consistency) guarantees that whenever a user makes an update, their subsequent reads are routed either to the primary database or to a replica guaranteed to have applied that write.',
        difficulty: 'Intermediate',
        order_num: 3,
        options: [
          { id: 49, question_id: 13, option_text: 'Read-Your-Own-Writes (Read-After-Write Consistency)', is_correct: 1 },
          { id: 50, question_id: 13, option_text: 'Eventual Consistency with 24h delay', is_correct: 0 },
          { id: 51, question_id: 13, option_text: 'Causal Ordering via Paxos consensus only', is_correct: 0 },
          { id: 52, question_id: 13, option_text: 'Monotonic Read Suppression', is_correct: 0 }
        ]
      },
      {
        id: 14,
        quiz_id: 3,
        question_text: 'What is the primary architectural difference between an LSM-Tree (Log-Structured Merge-Tree) database (like Cassandra/RocksDB) and a B-Tree database (like PostgreSQL/MySQL InnoDB)?',
        code_snippet: null,
        diagram_type: 'lsm-vs-btree',
        explanation: 'LSM-Trees optimize for high write throughput by appending writes sequentially to an in-memory MemTable and commit log (flushed to SSTables on disk), avoiding random disk writes. B-Trees modify pages in-place on disk, optimizing for read predictability.',
        difficulty: 'Advanced',
        order_num: 4,
        options: [
          { id: 53, question_id: 14, option_text: 'LSM-Trees append writes sequentially in memory/disk for ultra-high write throughput; B-Trees update disk pages in place', is_correct: 1 },
          { id: 54, question_id: 14, option_text: 'B-Trees cannot support indexes on secondary columns', is_correct: 0 },
          { id: 55, question_id: 14, option_text: 'LSM-Trees require quantum storage hardware', is_correct: 0 },
          { id: 56, question_id: 14, option_text: 'B-Trees do not support ACID transactions', is_correct: 0 }
        ]
      },
      {
        id: 15,
        quiz_id: 3,
        question_text: 'What does the "BASE" model in distributed NoSQL databases stand for?',
        code_snippet: null,
        diagram_type: 'base-model',
        explanation: 'BASE stands for Basically Available, Soft state, Eventual consistency. Unlike ACID which prioritizes immediate consistency, BASE prioritizes availability and accepts temporary inconsistencies that resolve eventually.',
        difficulty: 'Beginner',
        order_num: 5,
        options: [
          { id: 57, question_id: 15, option_text: 'Basically Available, Soft state, Eventual consistency', is_correct: 1 },
          { id: 58, question_id: 15, option_text: 'Binary Access, Synchronous Execution, Encryption', is_correct: 0 },
          { id: 59, question_id: 15, option_text: 'Buffered Allocation, Sharded Elasticity, Replication', is_correct: 0 },
          { id: 60, question_id: 15, option_text: 'Broad Availability, Strong Encryption, ACID Compliance', is_correct: 0 }
        ]
      }
    ]
  },
  {
    id: 4,
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
        id: 16,
        quiz_id: 4,
        question_text: 'What fundamental architectural difference sets Apache Kafka apart from traditional message brokers like RabbitMQ or AWS SQS?',
        code_snippet: null,
        diagram_type: 'kafka-vs-rabbitmq',
        explanation: 'Kafka is an append-only distributed commit log where messages are retained on disk for a configured duration. Consumers manage their own read offsets and multiple independent consumer groups can replay historical messages at their own pace. RabbitMQ deletes messages once acknowledged.',
        difficulty: 'Intermediate',
        order_num: 1,
        options: [
          { id: 61, question_id: 16, option_text: 'Kafka is a durable distributed commit log where consumers track their own offsets and can replay data', is_correct: 1 },
          { id: 62, question_id: 16, option_text: 'Kafka only supports synchronous peer-to-peer RPC without queues', is_correct: 0 },
          { id: 63, question_id: 16, option_text: 'RabbitMQ persists all data forever while Kafka clears data every 10 seconds', is_correct: 0 },
          { id: 64, question_id: 16, option_text: 'Kafka operates solely in client browser memory', is_correct: 0 }
        ]
      },
      {
        id: 17,
        quiz_id: 4,
        question_text: 'In an e-commerce microservices architecture, an order involves Payment Service, Inventory Service, and Shipping Service. If Payment succeeds but Inventory fails, how does the Saga Pattern handle consistency without 2PC (Two-Phase Commit)?',
        code_snippet: null,
        diagram_type: 'saga-pattern',
        explanation: 'The Saga Pattern executes a series of local transactions in each microservice. If a step fails, the Saga triggers a series of "Compensating Transactions" that undo the previously completed operations (e.g., refunding the payment).',
        difficulty: 'Advanced',
        order_num: 2,
        options: [
          { id: 65, question_id: 17, option_text: 'It executes compensating transactions in reverse order to undo previously committed changes', is_correct: 1 },
          { id: 66, question_id: 17, option_text: 'It rolls back all microservice databases automatically using a global OS lock', is_correct: 0 },
          { id: 67, question_id: 17, option_text: 'It cancels the customer internet connection immediately', is_correct: 0 },
          { id: 68, question_id: 17, option_text: 'It deletes the microservices container and launches fresh instances', is_correct: 0 }
        ]
      },
      {
        id: 18,
        quiz_id: 4,
        question_text: 'Why is it critical for distributed message consumers to be designed "Idempotently"?',
        code_snippet: null,
        diagram_type: 'idempotency',
        explanation: 'Because distributed networks frequently have at-least-once delivery (due to timeouts, retries, and network blips), the same message or payment request may arrive multiple times. Idempotent design ensures processing the message multiple times produces the exact same outcome as processing it once.',
        difficulty: 'Intermediate',
        order_num: 3,
        options: [
          { id: 69, question_id: 18, option_text: 'Because at-least-once message delivery means duplicates will arrive, and processing duplicate requests must not cause multiple charges or duplicate state', is_correct: 1 },
          { id: 70, question_id: 18, option_text: 'To ensure messages travel through optical fiber at the speed of light', is_correct: 0 },
          { id: 71, question_id: 18, option_text: 'To prevent messages from consuming CPU cycles during TLS compression', is_correct: 0 },
          { id: 72, question_id: 18, option_text: 'Because idempotent functions do not require a database connection', is_correct: 0 }
        ]
      },
      {
        id: 19,
        quiz_id: 4,
        question_text: 'What is the purpose of a "Dead Letter Queue" (DLQ) in an asynchronous messaging architecture?',
        code_snippet: null,
        diagram_type: 'dead-letter-queue',
        explanation: 'When a message cannot be successfully processed after a configured number of retries (e.g., due to malformed payloads or unrecoverable business logic errors), it is moved to a DLQ for offline inspection and debugging without blocking subsequent valid messages in the main queue.',
        difficulty: 'Beginner',
        order_num: 4,
        options: [
          { id: 73, question_id: 19, option_text: 'To isolate poisoned or repeatedly failing messages so they do not block normal queue processing', is_correct: 1 },
          { id: 74, question_id: 19, option_text: 'To store deleted user account records for GDPR compliance', is_correct: 0 },
          { id: 75, question_id: 19, option_text: 'To encrypt passwords before inserting into the cache', is_correct: 0 },
          { id: 76, question_id: 19, option_text: 'To serve static CSS and JavaScript files to browsers', is_correct: 0 }
        ]
      },
      {
        id: 20,
        quiz_id: 4,
        question_text: 'In Kafka, how is message ordering strictly guaranteed across a topic?',
        code_snippet: null,
        diagram_type: 'kafka-partitions',
        explanation: 'Kafka only guarantees strict message ordering within a single Partition, not across the entire multi-partition topic. Messages with the same Partition Key (e.g., order_id or customer_id) are always routed to the same partition and consumed sequentially.',
        difficulty: 'Advanced',
        order_num: 5,
        options: [
          { id: 77, question_id: 20, option_text: 'Ordering is strictly guaranteed within a specific partition, not across the entire multi-partition topic', is_correct: 1 },
          { id: 78, question_id: 20, option_text: 'Kafka automatically sorts all messages across all partitions alphabetically', is_correct: 0 },
          { id: 79, question_id: 20, option_text: 'Consumers sort messages using client-side quicksort', is_correct: 0 },
          { id: 80, question_id: 20, option_text: 'Kafka guarantees global ordering across all partitions regardless of key', is_correct: 0 }
        ]
      }
    ]
  },
  {
    id: 5,
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
        id: 21,
        quiz_id: 5,
        question_text: 'In designing a high-throughput API Rate Limiter, which algorithm allows bursts of traffic up to a maximum capacity while refilling tokens at a constant rate?',
        code_snippet: null,
        diagram_type: 'token-bucket',
        explanation: 'The Token Bucket algorithm maintains a bucket with a fixed capacity. Tokens are added periodically at a constant refill rate. Requests consume tokens; if tokens are available, the burst is accepted immediately; if empty, requests are throttled (HTTP 429).',
        difficulty: 'Intermediate',
        order_num: 1,
        options: [
          { id: 81, question_id: 21, option_text: 'Token Bucket Algorithm', is_correct: 1 },
          { id: 82, question_id: 21, option_text: 'Fixed Window Counter', is_correct: 0 },
          { id: 83, question_id: 21, option_text: 'Round Robin Arbiter', is_correct: 0 },
          { id: 84, question_id: 21, option_text: 'Exponential Backoff Protocol', is_correct: 0 }
        ]
      },
      {
        id: 22,
        quiz_id: 5,
        question_text: 'When designing a distributed URL shortener (like TinyURL or Bitly) that produces 7-character short codes using Base62 [0-9, a-z, A-Z], approximately how many unique short URLs can be generated?',
        code_snippet: `// Base62 Alphabet: 10 digits + 26 lowercase + 26 uppercase = 62 characters\nTotal URLs = 62^7`,
        diagram_type: 'base62-url',
        explanation: '62 raised to the 7th power equals 62^7 ≈ 3.52 trillion unique combinations (3,521,614,606,208 URLs), which easily accommodates hundreds of millions of new URLs generated every month for decades.',
        difficulty: 'Intermediate',
        order_num: 2,
        options: [
          { id: 85, question_id: 22, option_text: 'Approximately 3.5 Trillion (3.5 × 10^12) URLs', is_correct: 1 },
          { id: 86, question_id: 22, option_text: 'Approximately 62,000 URLs', is_correct: 0 },
          { id: 87, question_id: 22, option_text: 'Exactly 256 Million URLs', is_correct: 0 },
          { id: 88, question_id: 22, option_text: 'Only 4.3 Billion URLs (IPv4 range)', is_correct: 0 }
        ]
      },
      {
        id: 23,
        quiz_id: 5,
        question_text: 'Why is Twitter Snowflake preferred over traditional auto-incrementing database primary keys for generating 64-bit unique IDs in a distributed system?',
        code_snippet: null,
        diagram_type: 'snowflake-id',
        explanation: 'Twitter Snowflake generates 64-bit IDs containing a timestamp component, data center ID, worker machine ID, and sequence number. This allows decentralized, lock-free ID generation that is naturally time-sortable across thousands of independent nodes without a single point of contention.',
        difficulty: 'Advanced',
        order_num: 3,
        options: [
          { id: 89, question_id: 23, option_text: 'It generates roughly time-sortable, 64-bit unique IDs decentralized across thousands of nodes without coordination locks', is_correct: 1 },
          { id: 90, question_id: 23, option_text: 'It compresses image thumbnails directly into the primary key', is_correct: 0 },
          { id: 91, question_id: 23, option_text: 'It encrypts IDs with AES-256 automatically at zero CPU overhead', is_correct: 0 },
          { id: 92, question_id: 23, option_text: 'It completely replaces the need for an API Gateway', is_correct: 0 }
        ]
      },
      {
        id: 24,
        quiz_id: 5,
        question_text: 'When designing a newsfeed system (like Twitter or Instagram), what is the "Celebrity Problem" (Hot User Problem) associated with a Fanout-on-Write (Push) architecture?',
        code_snippet: null,
        diagram_type: 'fanout-architecture',
        explanation: 'In Fanout-on-Write, whenever a user posts, their post is pushed into every follower’s timeline inbox. When an account with 100 million followers posts, pushing 100M writes generates massive write amplification and system bottlenecks. Hybrid architectures use Fanout-on-Read (Pull) for celebrities.',
        difficulty: 'Advanced',
        order_num: 4,
        options: [
          { id: 93, question_id: 24, option_text: 'A user with millions of followers causes millions of concurrent writes to followers\' inboxes, leading to write amplification bottlenecks', is_correct: 1 },
          { id: 94, question_id: 24, option_text: 'Celebrities change their username frequently, breaking relational foreign keys', is_correct: 0 },
          { id: 95, question_id: 24, option_text: 'Video uploads from verified accounts exceed TCP maximum segment sizes', is_correct: 0 },
          { id: 96, question_id: 24, option_text: 'Celebrity accounts require dedicated physical database servers in every city', is_correct: 0 }
        ]
      },
      {
        id: 25,
        quiz_id: 5,
        question_text: 'In a real-time ride dispatch system (like Uber or Lyft), which spatial indexing approach divides 2D space into recursive hierarchical quadrants (NW, NE, SW, SE) to quickly find nearby drivers?',
        code_snippet: null,
        diagram_type: 'quadtree-geo',
        explanation: 'A QuadTree is a 2D spatial tree where every internal node has exactly four children corresponding to four quadrants. When a driver moves or a rider requests a pickup, spatial queries quickly traverse nodes containing nearby latitude/longitude coordinates.',
        difficulty: 'Advanced',
        order_num: 5,
        options: [
          { id: 97, question_id: 25, option_text: 'QuadTree Indexing', is_correct: 1 },
          { id: 98, question_id: 25, option_text: 'Red-Black Balancing Ring', is_correct: 0 },
          { id: 99, question_id: 25, option_text: 'B-Tree String Parsing', is_correct: 0 },
          { id: 100, question_id: 25, option_text: 'Trie Prefix Auto-complete', is_correct: 0 }
        ]
      }
    ]
  },
  {
    id: 6,
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
        id: 26,
        quiz_id: 6,
        question_text: 'What state transitions occur in a "Circuit Breaker" pattern (e.g., Netflix Hystrix / Resilience4j) to prevent cascading failures across microservices?',
        code_snippet: null,
        diagram_type: 'circuit-breaker',
        explanation: 'A circuit breaker starts in CLOSED (requests flow normally). If the failure rate exceeds a threshold, it trips to OPEN (fails fast immediately without calling the failing downstream service). After a timeout, it enters HALF-OPEN to test if the service has recovered.',
        difficulty: 'Intermediate',
        order_num: 1,
        options: [
          { id: 101, question_id: 26, option_text: 'CLOSED -> OPEN -> HALF-OPEN -> CLOSED', is_correct: 1 },
          { id: 102, question_id: 26, option_text: 'ACTIVE -> SLEEP -> KILLED -> ACTIVE', is_correct: 0 },
          { id: 103, question_id: 26, option_text: 'SYN -> SYN-ACK -> ACK -> FIN', is_correct: 0 },
          { id: 104, question_id: 26, option_text: 'PRIMARY -> REPLICA -> QUORUM -> PRIMARY', is_correct: 0 }
        ]
      },
      {
        id: 27,
        quiz_id: 6,
        question_text: 'What is the primary responsibility of a Service Mesh sidecar proxy (such as Envoy in Istio)?',
        code_snippet: null,
        diagram_type: 'service-mesh',
        explanation: 'A sidecar proxy intercepts all inbound and outbound network traffic to provide transparent mutual TLS (mTLS), distributed tracing, traffic routing, retry logic, and telemetry without changing application code.',
        difficulty: 'Intermediate',
        order_num: 2,
        options: [
          { id: 105, question_id: 27, option_text: 'To handle service-to-service communication, mTLS encryption, observability, and traffic routing transparently', is_correct: 1 },
          { id: 106, question_id: 27, option_text: 'To compile Java bytecode into machine binaries on the fly', is_correct: 0 },
          { id: 107, question_id: 27, option_text: 'To replace the primary relational database with in-memory SQLite', is_correct: 0 },
          { id: 108, question_id: 27, option_text: 'To render React frontend components inside the Linux kernel', is_correct: 0 }
        ]
      },
      {
        id: 28,
        quiz_id: 6,
        question_text: 'How does the "Bulkhead Pattern" (named after ship hull compartments) increase resiliency in distributed microservices?',
        code_snippet: null,
        diagram_type: 'bulkhead-pattern',
        explanation: 'Just like ship bulkheads prevent water in one punctured section from sinking the whole vessel, the software Bulkhead pattern partitions thread pools, connection pools, and memory so that an outage in one dependency doesn’t exhaust resources for the rest of the app.',
        difficulty: 'Intermediate',
        order_num: 3,
        options: [
          { id: 109, question_id: 28, option_text: 'It isolates thread pools and resource allocations so the failure of one downstream dependency cannot exhaust all resources', is_correct: 1 },
          { id: 110, question_id: 28, option_text: 'It compresses database snapshots into underwater storage vaults', is_correct: 0 },
          { id: 111, question_id: 28, option_text: 'It duplicates all HTTP requests across 5 cloud providers simultaneously', is_correct: 0 },
          { id: 112, question_id: 28, option_text: 'It shuts down the entire cluster when latency exceeds 100 milliseconds', is_correct: 0 }
        ]
      },
      {
        id: 29,
        quiz_id: 6,
        question_text: 'Which architectural component is best suited for cross-cutting concerns like Authentication, Rate Limiting, SSL Termination, and Request Routing for client apps?',
        code_snippet: null,
        diagram_type: 'api-gateway',
        explanation: 'An API Gateway sits between client devices (web, mobile) and backend microservices, serving as a unified entry point handling SSL termination, JWT authentication, rate limiting, and request transformation.',
        difficulty: 'Beginner',
        order_num: 4,
        options: [
          { id: 113, question_id: 29, option_text: 'API Gateway', is_correct: 1 },
          { id: 114, question_id: 29, option_text: 'Message Consumer Group', is_correct: 0 },
          { id: 115, question_id: 29, option_text: 'Write-Ahead Log (WAL)', is_correct: 0 },
          { id: 116, question_id: 29, option_text: 'MemTable Buffer', is_correct: 0 }
        ]
      },
      {
        id: 30,
        quiz_id: 6,
        question_text: 'In gRPC communication between microservices, what serialization format and underlying transport protocol are used for ultra-high performance?',
        code_snippet: null,
        diagram_type: 'grpc-proto',
        explanation: 'gRPC utilizes Protocol Buffers (Protobuf) for compact, strongly-typed binary serialization, and runs over HTTP/2, enabling multiplexing multiple requests over a single TCP connection with header compression.',
        difficulty: 'Intermediate',
        order_num: 5,
        options: [
          { id: 117, question_id: 30, option_text: 'Protocol Buffers (Protobuf) over HTTP/2', is_correct: 1 },
          { id: 118, question_id: 30, option_text: 'JSON text over HTTP/1.1', is_correct: 0 },
          { id: 119, question_id: 30, option_text: 'XML envelopes over SOAP UDP', is_correct: 0 },
          { id: 120, question_id: 30, option_text: 'YAML over raw Telnet sockets', is_correct: 0 }
        ]
      }
    ]
  }
];

// Universal In-Memory Store (Guarantees zero-crash execution on Vercel Serverless)
class UniversalDB {
  constructor() {
    this.users = [];
    this.quizzes = [];
    this.questions = [];
    this.options = [];
    this.quizAttempts = [];
    this.userBadges = [];
    this.bookmarks = [];
    this.nextUserId = 1;
    this.nextAttemptId = 1;
    this.nextBadgeId = 1;
    this.nextBookmarkId = 1;
  }

  seed() {
    if (this.quizzes.length > 0) return;

    // Seed Demo User
    const salt = bcrypt.genSaltSync(10);
    const demoHash = bcrypt.hashSync('demo123', salt);

    this.users.push({
      id: 1,
      name: 'Alex Rivera',
      email: 'demo@systemdesign.dev',
      password_hash: demoHash,
      role: 'Senior Distributed Systems Architect',
      avatar_color: 'indigo',
      xp: 1850,
      level: 7,
      bio: 'Designing planet-scale distributed services and zero-downtime databases.',
      created_at: new Date().toISOString()
    });

    const mockUsers = [
      { name: 'Sophia Chen', email: 'sophia@tech.io', role: 'Staff Infrastructure Engineer', color: 'emerald', xp: 2650, level: 9 },
      { name: 'Marcus Vance', email: 'marcus@cloud.io', role: 'Principal Architect', color: 'purple', xp: 2340, level: 8 },
      { name: 'Elena Rostova', email: 'elena@systems.dev', role: 'Site Reliability Fellow', color: 'amber', xp: 1980, level: 7 },
      { name: 'David Kim', email: 'david@scale.io', role: 'Backend Lead', color: 'cyan', xp: 1420, level: 5 },
      { name: 'Priya Sharma', email: 'priya@arch.org', role: 'Cloud Solutions Architect', color: 'rose', xp: 1150, level: 4 }
    ];

    let uId = 2;
    for (const u of mockUsers) {
      this.users.push({
        id: uId++,
        name: u.name,
        email: u.email,
        password_hash: demoHash,
        role: u.role,
        avatar_color: u.color,
        xp: u.xp,
        level: u.level,
        bio: 'Active contributor to system design mastery.',
        created_at: new Date().toISOString()
      });
    }
    this.nextUserId = uId;

    // Seed Badges for Demo User
    this.userBadges.push(
      { id: 1, user_id: 1, badge_key: 'first_quiz', badge_name: 'First Steps', badge_desc: 'Completed your first System Design Quiz', icon: 'award', awarded_at: new Date().toISOString() },
      { id: 2, user_id: 1, badge_key: 'cache_master', badge_name: 'Cache Master', badge_desc: 'Scored 100% on Caching Systems', icon: 'zap', awarded_at: new Date().toISOString() },
      { id: 3, user_id: 1, badge_key: 'speed_demon', badge_name: 'Fast Architect', badge_desc: 'Completed a quiz in under 2 minutes with >80% accuracy', icon: 'clock', awarded_at: new Date().toISOString() }
    );
    this.nextBadgeId = 4;

    // Seed Quizzes, Questions, Options
    for (const q of INITIAL_QUIZZES) {
      this.quizzes.push({
        id: q.id,
        title: q.title,
        slug: q.slug,
        category: q.category,
        difficulty: q.difficulty,
        time_limit: q.time_limit,
        icon: q.icon,
        color: q.color,
        summary: q.summary,
        created_at: new Date().toISOString()
      });

      for (const qu of q.questions) {
        this.questions.push({
          id: qu.id,
          quiz_id: q.id,
          question_text: qu.question_text,
          code_snippet: qu.code_snippet,
          diagram_type: qu.diagram_type,
          explanation: qu.explanation,
          difficulty: qu.difficulty,
          order_num: qu.order_num
        });

        for (const opt of qu.options) {
          this.options.push({
            id: opt.id,
            question_id: qu.id,
            option_text: opt.option_text,
            is_correct: opt.is_correct
          });
        }
      }
    }

    // Seed attempts for demo user
    this.quizAttempts.push(
      { id: 1, user_id: 1, quiz_id: 1, score: 5, total_questions: 5, time_spent_seconds: 142, answers_json: JSON.stringify({ 1: 2, 2: 5, 3: 10, 4: 14, 5: 17 }), created_at: new Date().toISOString() },
      { id: 2, user_id: 1, quiz_id: 2, score: 4, total_questions: 5, time_spent_seconds: 178, answers_json: JSON.stringify({ 6: 22, 7: 26, 8: 29, 9: 33, 10: 38 }), created_at: new Date().toISOString() }
    );
    this.nextAttemptId = 3;
  }

  prepare(sql) {
    const s = sql.trim();
    const self = this;

    return {
      get(...params) {
        // Users count
        if (s.includes('COUNT(*) as count FROM users')) {
          return { count: self.users.length };
        }
        // User by email
        if (s.includes('FROM users WHERE email = ?')) {
          const email = (params[0] || '').toLowerCase().trim();
          return self.users.find(u => u.email.toLowerCase() === email) || null;
        }
        // User by ID
        if (s.includes('FROM users WHERE id = ?')) {
          const id = parseInt(params[0], 10);
          return self.users.find(u => u.id === id) || null;
        }
        // Quiz by ID or slug
        if (s.includes('FROM quizzes WHERE id = ?')) {
          const id = parseInt(params[0], 10);
          return self.quizzes.find(q => q.id === id) || null;
        }
        if (s.includes('FROM quizzes WHERE slug = ?')) {
          const slug = params[0];
          return self.quizzes.find(q => q.slug === slug) || null;
        }
        // User stats
        if (s.includes('COUNT(id) as total_attempts')) {
          const userId = parseInt(params[0], 10);
          const atts = self.quizAttempts.filter(a => a.user_id === userId);
          const total_attempts = atts.length;
          const total_correct_answers = atts.reduce((sum, a) => sum + (a.score || 0), 0);
          const total_questions_taken = atts.reduce((sum, a) => sum + (a.total_questions || 0), 0);
          const high_score = atts.length > 0 ? Math.max(...atts.map(a => a.score)) : 0;
          return { total_attempts, total_correct_answers, total_questions_taken, high_score };
        }
        // Attempts count
        if (s.includes('SELECT COUNT(*) as c FROM quiz_attempts WHERE user_id = ?')) {
          const userId = parseInt(params[0], 10);
          return { c: self.quizAttempts.filter(a => a.user_id === userId).length };
        }
        // Bookmark exists
        if (s.includes('FROM bookmarks WHERE user_id = ? AND question_id = ?')) {
          const userId = parseInt(params[0], 10);
          const qId = parseInt(params[1], 10);
          return self.bookmarks.find(b => b.user_id === userId && b.question_id === qId) || null;
        }
        return null;
      },

      all(...params) {
        // Quizzes with question count
        if (s.includes('FROM quizzes q')) {
          return self.quizzes.map(q => {
            const count = self.questions.filter(qu => qu.quiz_id === q.id).length;
            return { ...q, question_count: count };
          });
        }
        // User quiz attempts grouped
        if (s.includes('SELECT quiz_id, MAX(score) as best_score')) {
          const userId = parseInt(params[0], 10);
          const atts = self.quizAttempts.filter(a => a.user_id === userId);
          const map = {};
          for (const a of atts) {
            if (!map[a.quiz_id] || a.score > map[a.quiz_id].best_score) {
              map[a.quiz_id] = { quiz_id: a.quiz_id, best_score: a.score, attempt_count: (map[a.quiz_id]?.attempt_count || 0) + 1 };
            } else {
              map[a.quiz_id].attempt_count++;
            }
          }
          return Object.values(map);
        }
        // Questions for quiz
        if (s.includes('FROM questions') && s.includes('quiz_id = ?')) {
          const quizId = parseInt(params[0], 10);
          return self.questions.filter(q => q.quiz_id === quizId).sort((a, b) => a.order_num - b.order_num);
        }
        // Options for question
        if (s.includes('FROM options') && s.includes('question_id = ?')) {
          const qId = parseInt(params[0], 10);
          return self.options.filter(o => o.question_id === qId);
        }
        // Options for multiple questions (IN)
        if (s.includes('FROM options') && s.includes('IN')) {
          return self.options;
        }
        // Badges for user
        if (s.includes('FROM user_badges WHERE user_id = ?')) {
          const userId = parseInt(params[0], 10);
          return self.userBadges.filter(b => b.user_id === userId);
        }
        // Recent attempts for user
        if (s.includes('FROM quiz_attempts qa') && s.includes('WHERE qa.user_id = ?')) {
          const userId = parseInt(params[0], 10);
          return self.quizAttempts
            .filter(a => a.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10)
            .map(a => {
              const q = self.quizzes.find(qz => qz.id === a.quiz_id);
              return {
                id: a.id,
                score: a.score,
                total_questions: a.total_questions,
                time_spent_seconds: a.time_spent_seconds,
                created_at: a.created_at,
                quiz_title: q ? q.title : 'Assessment',
                category: q ? q.category : 'General',
                slug: q ? q.slug : '',
                color: q ? q.color : ''
              };
            });
        }
        // Leaderboard
        if (s.includes('FROM users u') && s.includes('ORDER BY u.xp DESC')) {
          return self.users
            .map(u => {
              const userAtts = self.quizAttempts.filter(a => a.user_id === u.id);
              const userBads = self.userBadges.filter(b => b.user_id === u.id);
              return {
                id: u.id,
                name: u.name,
                role: u.role,
                avatar_color: u.avatar_color,
                xp: u.xp || 0,
                level: u.level || 1,
                quizzes_taken: userAtts.length,
                total_correct: userAtts.reduce((sum, a) => sum + (a.score || 0), 0),
                badge_count: userBads.length
              };
            })
            .sort((a, b) => b.xp - a.xp || b.total_correct - a.total_correct);
        }
        // User bookmarks
        if (s.includes('FROM bookmarks b')) {
          const userId = parseInt(params[0], 10);
          return self.bookmarks
            .filter(b => b.user_id === userId)
            .map(b => {
              const q = self.questions.find(qu => qu.id === b.question_id);
              const qz = q ? self.quizzes.find(qz => qz.id === q.quiz_id) : null;
              return {
                bookmark_id: b.id,
                bookmarked_at: b.created_at,
                id: q ? q.id : 0,
                question_text: q ? q.question_text : '',
                explanation: q ? q.explanation : '',
                diagram_type: q ? q.diagram_type : null,
                difficulty: q ? q.difficulty : 'Medium',
                quiz_title: qz ? qz.title : '',
                category: qz ? qz.category : ''
              };
            });
        }
        return [];
      },

      run(...params) {
        // Insert User
        if (s.includes('INSERT INTO users')) {
          const [name, email, password_hash, role, avatar_color] = params;
          const newId = self.nextUserId++;
          const newUser = {
            id: newId,
            name,
            email: email.toLowerCase().trim(),
            password_hash,
            role,
            avatar_color,
            xp: 100,
            level: 1,
            bio: 'Excited to practice system design architectures!',
            created_at: new Date().toISOString()
          };
          self.users.push(newUser);
          return { lastInsertRowid: newId, changes: 1 };
        }
        // Update User
        if (s.includes('UPDATE users SET name = COALESCE')) {
          const [name, role, bio, avatar_color, id] = params;
          const user = self.users.find(u => u.id === parseInt(id, 10));
          if (user) {
            if (name) user.name = name;
            if (role) user.role = role;
            if (bio) user.bio = bio;
            if (avatar_color) user.avatar_color = avatar_color;
          }
          return { changes: user ? 1 : 0 };
        }
        // Update XP & Level
        if (s.includes('UPDATE users SET xp = ?, level = ? WHERE id = ?')) {
          const [xp, level, id] = params;
          const user = self.users.find(u => u.id === parseInt(id, 10));
          if (user) {
            user.xp = xp;
            user.level = level;
          }
          return { changes: user ? 1 : 0 };
        }
        // Insert Badge
        if (s.includes('INSERT OR IGNORE INTO user_badges') || s.includes('INSERT INTO user_badges')) {
          const [user_id, badge_key, badge_name, badge_desc, icon] = params;
          const exists = self.userBadges.some(b => b.user_id === user_id && b.badge_key === badge_key);
          if (!exists) {
            self.userBadges.push({
              id: self.nextBadgeId++,
              user_id,
              badge_key,
              badge_name,
              badge_desc,
              icon,
              awarded_at: new Date().toISOString()
            });
            return { changes: 1 };
          }
          return { changes: 0 };
        }
        // Insert Attempt
        if (s.includes('INSERT INTO quiz_attempts')) {
          const [user_id, quiz_id, score, total_questions, time_spent_seconds, answers_json] = params;
          const newId = self.nextAttemptId++;
          self.quizAttempts.push({
            id: newId,
            user_id,
            quiz_id,
            score,
            total_questions,
            time_spent_seconds,
            answers_json,
            created_at: new Date().toISOString()
          });
          return { lastInsertRowid: newId, changes: 1 };
        }
        // Insert Bookmark
        if (s.includes('INSERT INTO bookmarks')) {
          const [user_id, question_id] = params;
          self.bookmarks.push({
            id: self.nextBookmarkId++,
            user_id,
            question_id,
            created_at: new Date().toISOString()
          });
          return { changes: 1 };
        }
        // Delete Bookmark
        if (s.includes('DELETE FROM bookmarks WHERE id = ?')) {
          const id = parseInt(params[0], 10);
          const initialLen = self.bookmarks.length;
          self.bookmarks = self.bookmarks.filter(b => b.id !== id);
          return { changes: initialLen - self.bookmarks.length };
        }
        return { changes: 0 };
      }
    };
  }

  exec(sql) {}
  pragma(sql) {}
}

const db = new UniversalDB();

export function initDatabase() {
  db.seed();
  console.log('✅ Universal Database initialized and seeded with 6 System Design quiz sets!');
}

export default db;
