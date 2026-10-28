# ArchIQ — System Design & Distributed Architecture Quiz Platform

A modern, full-stack web application designed for software engineers, backend developers, and systems architects to practice scenario-based System Design interviews and test their knowledge of distributed systems with interactive visual architecture diagrams, real-time grading, and gamified XP progression.

---

## 🌟 Key Features

1. **Authentication System (Sign Up & Log In)**:
   - Full user registration with Name, Email, Password, and Engineering Role (Backend Engineer, Solutions Architect, SRE, etc.).
   - Secure password hashing using **bcryptjs**.
   - Stateless session management using **JWT (JSON Web Tokens)**.
   - **1-Click Instant Demo Login**: Test immediately as Alex Rivera (*Senior Distributed Systems Architect*) with pre-loaded badges and 1,850 XP without typing.

2. **Visual Architecture Diagrams**:
   - Custom SVG vector diagrams for distributed systems topologies:
     - **Layer 7 Application Load Balancing** (Path & Header routing to microservice clusters)
     - **Consistent Hashing Ring** with Virtual Nodes (vNodes) and clockwise routing
     - **Cache-Aside Pattern** (Lazy loading flow with Redis and Primary DB)
     - **CAP Theorem Trade-Off Triangle** (CP vs AP distributed database matrix)
     - **Token Bucket Rate Limiter** (Capacity, refill rates, burst handling, HTTP 429)
     - **Circuit Breaker Finite State Machine** (CLOSED, OPEN, HALF-OPEN transitions)

3. **Curated System Design Quiz Modules**:
   - **Scalability & Load Balancing Essentials**: Horizontal vs vertical scaling, Layer 4 vs Layer 7, consistent hashing, active-passive failover, sticky sessions.
   - **Caching Systems & Invalidation Strategies**: LRU/LFU cache eviction, Cache-Aside, Write-Back vs Write-Through, Thundering Herd mitigation, Bloom filters.
   - **Distributed Databases, CAP & Sharding**: CAP theorem trade-offs, hash sharding cross-partition joins, read-after-write consistency, LSM-trees vs B-Trees, BASE vs ACID.
   - **Message Queues, Event Streaming & Sagas**: Apache Kafka commit log vs RabbitMQ, Saga compensating transactions, consumer idempotency, Dead Letter Queues (DLQ), partition ordering.
   - **Real-World Architecture Challenges**: Token Bucket API rate limiters, 64-bit Snowflake ID generation, URL shorteners (Base62 math), Twitter fanout-on-write celebrity bottlenecks, QuadTree geospatial dispatch.
   - **Microservices, Resiliency & API Gateways**: Circuit breakers, Bulkhead resource isolation, Service Mesh Envoy sidecars, API Gateway cross-cutting concerns, gRPC Protobuf over HTTP/2.

4. **Interactive Quiz Experience**:
   - Real-time countdown timer with visual progress bar and alert color transitions.
   - Scenario problem descriptions with code snippets and architecture diagrams.
   - Interactive question palette to jump between answered and unanswered questions.
   - One-click bookmarking of challenging scenarios for later revision.

5. **Deep Architectural Review & Grading**:
   - Instant calculation of score, percentage, XP gain, and Level progression.
   - Confetti celebration animation upon completing quizzes with high marks.
   - Detailed question-by-question review showing:
     - Your selected choice vs the correct choice.
     - Production explanations explaining the trade-offs and real-world failure modes.
     - Visual diagram illustration for the concept.

6. **Global Leaderboard & Architect Badges**:
   - Ranked podium with crowns and medals for top engineers.
   - Badges collection: *First Step*, *Cache Master*, *Fast Architect*, *Flawless Architect*, *Initiated Architect*.
   - Architectural level titles (*Principal System Architect*, *Senior Distributed Engineer*, *Cloud Solutions Architect*).

7. **Visual Architecture Study Guide / Cheatsheet**:
   - Dedicated reference cards for interview preparation.
   - Covers key trade-offs (Latency vs Throughput, Consistency vs Availability).

8. **Free Embedded Database (SQLite)**:
   - 100% free, zero external credentials or cloud subscriptions required.
   - Embedded high-speed SQLite database with WAL mode and foreign key constraints enabled.
   - Automatically migrates schema and seeds quizzes, questions, options, badges, and demo users on first startup.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express.js, CORS, JSON Web Tokens (jsonwebtoken), bcryptjs |
| **Database** | SQLite via `better-sqlite3` (Zero-config, embedded, free) |
| **Styling** | Cyber-slate aesthetic (`#0A0F1D`), electric indigo, cyan, emerald accents, glassmorphism |

---

## 🚀 How to Run the Website

### Option 1: One-Click Launch (Windows)
Double-click the included `start.bat` file in the project folder. It will start both backend and frontend servers and open `http://localhost:5173` automatically in your default browser.

### Option 2: Running via Terminal

#### 1. Start the Backend API (Port 5000)
```powershell
cd server
node index.js
```
The server will start on `http://localhost:5000` and automatically initialize and seed the SQLite database `database.sqlite`.

#### 2. Start the Frontend Dev Server (Port 5173)
In a second terminal window:
```powershell
cd client
npm.cmd run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔑 Demo Credentials

To test the application immediately with pre-configured XP, Level 7 ranking, and badges:
- **Email**: `demo@systemdesign.dev`
- **Password**: `demo123`
*(Or simply click **"Try 1-Click Instant Demo Access"** inside the Sign In modal!)*

---

## 📁 Project Structure

```
Sanjana C/
├── start.bat               # Windows 1-click launcher for backend & frontend
├── package.json            # Root project metadata & run scripts
├── README.md               # Complete project documentation
├── server/
│   ├── database.sqlite     # Embedded SQLite database (Free, local)
│   ├── db.js               # Database initialization, schema migration & rich seed data
│   ├── index.js            # Express app entry point & route registration
│   ├── middleware/
│   │   └── auth.js         # JWT verification & optional auth middleware
│   └── routes/
│       ├── auth.js         # Sign up, Login, Profile & Stats endpoints
│       ├── quizzes.js      # Quiz catalog, questions fetching & submission grading
│       ├── leaderboard.js  # Global rankings & XP calculation
│       └── study.js        # Architectural reference cards & bookmarking
└── client/
    ├── package.json        # Frontend dependencies (React, Tailwind, Lucide, Confetti)
    ├── vite.config.js      # Vite config with API proxy to port 5000
    ├── tailwind.config.js  # Custom theme, brand palette & animations
    ├── index.html          # HTML entry with custom typography & SVG favicon
    └── src/
        ├── App.jsx         # Main application shell & tab routing
        ├── index.css       # Tailwind directives & glassmorphic styling
        ├── context/
        │   └── AuthContext.jsx # Auth state, JWT storage & user management
        └── components/
            ├── Navbar.jsx              # Navigation bar, user level badge & auth triggers
            ├── AuthModal.jsx           # Sign Up & Log In dialog with demo quick-login
            ├── QuizList.jsx            # Quiz catalog grid, filters & hero section
            ├── QuizPlayer.jsx          # Interactive quiz scenario runner & timer
            ├── QuizResults.jsx         # Confetti celebration, grading & deep explanations
            ├── ArchitectureDiagram.jsx # Custom SVG diagrams (L7 LB, CAP, Cache, etc.)
            ├── Leaderboard.jsx         # Top 3 podium & rankings table
            ├── ArchitectureGuide.jsx   # Visual architecture cheatsheets & principles
            ├── BookmarksView.jsx       # Saved review questions collection
            └── ProfileView.jsx         # User stats, level progression & badges showcase
```

---

## 📋 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Log in and receive JWT token |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile, badges & stats |
| `PUT`  | `/api/auth/profile` | Update user name, role, or bio |
| `GET`  | `/api/quizzes` | Fetch list of all quizzes with metadata |
| `GET`  | `/api/quizzes/:id` | Fetch quiz scenarios and multiple-choice options |
| `POST` | `/api/quizzes/:id/submit` | Grade answers, compute XP & award badges |
| `GET`  | `/api/leaderboard` | Get global architect standings ranked by XP |
| `GET`  | `/api/study` | Get architecture cheatsheet topics & diagrams |
| `POST` | `/api/study/bookmark` | Bookmark or unbookmark a scenario |
| `GET`  | `/api/study/bookmarks`| Get all bookmarked scenarios for current user |
| `GET`  | `/api/health` | Service health status check |
