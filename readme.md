# Real-Time Collaborative Playlist

A Spotify-inspired collaborative playlist application with real-time synchronization, voting, and drag-and-drop reordering. Built with React, Express, WebSockets, and Prisma.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Database Management](#database-management)
- [Testing](#testing)
- [Technical Decisions](#technical-decisions-and-trade-offs)
- [Future Improvements](#if-i-had-2-more-days)
- [API Documentation](#api-documentation)

---

## Features

### Core Functionality
- **Track Library**: Browse and search through 40 pre-seeded tracks
- **Collaborative Playlist**: Add, remove, and reorder tracks in real-time
- **Voting System**: Upvote/downvote tracks to influence playlist order
- **Drag & Drop**: Intuitive reordering with fractional positioning algorithm
- **Real-Time Sync**: WebSocket-powered instant updates across all connected clients
- **Playback Control**: Play, pause, next, previous with synchronized state
- **Recently Played**: Track playback history

### Real-Time Features
- Live playlist updates across all users
- Synchronized play/pause state
- Instant voting feedback
- Drag-and-drop position synchronization
- Connection status indicators

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Zustand** for state management
- **TailwindCSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **WebSocket** client for real-time updates

### Backend
- **Express** with TypeScript
- **Prisma ORM** with SQLite database
- **WebSocket (ws)** for real-time communication
- **CORS** enabled for cross-origin requests

### Testing
- **Jest** for test framework
- **Supertest** for API testing
- **24 comprehensive tests** with 100% pass rate

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **Git**

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/playlist.git
cd playlist
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set Up Environment Variables

```bash
# In the server directory
cd server
cp .env.example .env
```

Edit `.env` if needed (default values work out of the box):
```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

### 4. Initialize Database

```bash
# From the server directory
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

This will:
- Generate Prisma client
- Create the SQLite database with schema
- Seed 40 tracks (various genres: Rock, Pop, Jazz, Hip-Hop, etc.)

### 5. Start the Application

```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend client
cd client
npm run dev
```

### 6. Open the Application

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
playlist/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── NowPlayingBar.tsx
│   │   │   ├── Playlist.tsx
│   │   │   ├── PlaylistItem.tsx
│   │   │   └── TrackLibrary.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── usePlaybackControls.ts
│   │   │   └── useWebSocket.ts
│   │   ├── store/             # Zustand state management
│   │   │   └── playlistStore.ts
│   │   ├── lib/               # API client and utilities
│   │   │   └── api.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # Backend Express application
│   ├── src/
│   │   ├── index.ts           # Express server & REST API endpoints
│   │   ├── websocket.ts       # WebSocket server implementation
│   │   └── utils/
│   │       └── position.ts    # Fractional positioning algorithm
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Database seeding script
│   │   ├── dev.db             # SQLite database (development)
│   │   └── test.db            # SQLite database (testing)
│   ├── tests/                 # Test suites
│   │   ├── playlist.test.ts   # Playlist API tests
│   │   ├── position.test.ts   # Position algorithm tests
│   │   ├── websocket.test.ts  # WebSocket tests
│   │   └── setup.ts           # Test configuration
│   ├── jest.config.js         # Jest configuration
│   ├── package.json
│   └── tsconfig.json
│
├── README.md                  # This file
├── .env.example               # Environment variables template
└── .gitignore
```

---

## Running the Application

### Development Mode

```bash
# Backend (runs on http://localhost:4000)
cd server
npm run dev

# Frontend (runs on http://localhost:5173)
cd client
npm run dev
```

### Production Build

```bash
# Build backend
cd server
npm run build
npm start

# Build frontend
cd client
npm run build
npm run preview
```

---

## Database Management

### Prisma Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations (production)
npx prisma migrate deploy

# Seed the database with 40 tracks
npx prisma db seed

# Open Prisma Studio (visual database browser)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Database Schema

The application uses three main models:

**Track**: Stores music track information
- `id`, `title`, `artist`, `album`, `durationSeconds`, `genre`, `coverUrl`

**PlaylistTrack**: Represents tracks in the playlist
- `id`, `trackId`, `position`, `votes`, `addedBy`, `addedAt`, `isPlaying`, `playedAt`, `currentPositionMs`

**RecentlyPlayed**: Tracks playback history
- `id`, `trackId`, `playedBy`, `playedAt`

### Seeding Details

The seed script (`prisma/seed.ts`) populates the database with:
- **40 diverse tracks** across genres: Rock, Pop, Jazz, Electronic, Hip-Hop, Country, Latin
- **10 initial playlist items** with various vote counts and positions
- All tracks include metadata: title, artist, album, duration, genre

---

## Testing

### Run All Tests

```bash
cd server
npm test
```

### Test Coverage

The application includes **24 comprehensive tests**:

#### Test Suites
1. **playlist.test.ts** (15 tests)
   - GET/POST/PATCH/DELETE playlist endpoints
   - Vote functionality
   - Duplicate track prevention
   - Drag-and-drop position updates

2. **position.test.ts** (4 tests)
   - Fractional positioning algorithm
   - Playlist ordering
   - Track addition

3. **websocket.test.ts** (5 tests)
   - Connection management
   - Client reconnection
   - Event broadcasting
   - Heartbeat mechanism

### Run Specific Tests

```bash
# Run only playlist tests
npm test -- playlist.test.ts

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Configuration

Tests use:
- **Isolated test database** (`test.db`)
- **Serial execution** to prevent port conflicts
- **Automatic cleanup** between test suites

---

## Technical Decisions and Trade-Offs

### 1. Fractional Positioning for Drag-and-Drop

**Decision**: Use fractional positions instead of integer indices for playlist ordering.

**Rationale**:
- Allows O(1) insertion between any two items
- No need to update all subsequent items when reordering
- Simplifies real-time synchronization

**Trade-off**: Position values can become imprecise over time (mitigated by rounding to prevent floating-point errors)

### 2. WebSocket for Real-Time Sync

**Decision**: Implement custom WebSocket server instead of Socket.io

**Rationale**:
- Lighter weight (no additional dependencies)
- Full control over message format
- Simpler for small-scale application

**Trade-off**: Missing Socket.io features (automatic reconnection, rooms, etc.)

### 3. Client-Side Progress Tracking

**Decision**: Track playback progress entirely on the client using `Date.now()` and refs

**Rationale**:
- Reduces server load
- No need for interval-based server updates
- Smoother UI experience

**Trade-off**: Progress resets on page refresh (addressed by adding `currentPositionMs` to schema for future persistence)

### 4. SQLite Database

**Decision**: Use SQLite instead of PostgreSQL/MySQL

**Rationale**:
- Zero-configuration setup
- Single file database (easy to backup/share)
- Sufficient for demonstration purposes

**Trade-off**: Limited scalability and concurrent write performance

### 5. Zustand for State Management

**Decision**: Use Zustand instead of Redux or Context API

**Rationale**:
- Minimal boilerplate
- Simple API with hooks
- Good TypeScript support
- Sufficient for small-to-medium state complexity

**Trade-off**: Less ecosystem tooling compared to Redux

### 6. No Authentication/Authorization

**Decision**: Skip user authentication in this version

**Rationale**:
- Focuses on core playlist functionality
- Simplifies demonstration
- Can be added later without major refactoring

**Trade-off**: Anyone can modify the playlist (addressed with `addedBy` tracking)

---

## If I Had 2 More Days...

### High Priority

#### 1. Time Skip / Progress Seeking
- **What**: Click anywhere on the progress bar to jump to that position
- **Implementation**:
  - Add `currentPositionMs` to database (schema already updated)
  - New endpoint: `POST /api/playback/seek` with `{ itemId, positionMs }`
  - New WebSocket event: `playback.seek` to sync all clients
  - Update `NowPlayingBar.tsx` with clickable progress bar + hover preview
- **Benefit**: Better UX, matches Spotify behavior

#### 2. User Authentication
- **What**: JWT-based authentication with user profiles
- **Implementation**:
  - Add `User` model to Prisma schema
  - Implement login/signup endpoints
  - Associate playlist actions with authenticated users
  - Protect WebSocket connections with token validation
- **Benefit**: Personalized experience, track contributions, prevent abuse

#### 3. Queue System
- **What**: Separate "Up Next" queue from main playlist
- **Implementation**:
  - Add `Queue` model with ordering
  - New endpoints for queue management
  - UI section for queued tracks
  - Auto-play from queue after current track
- **Benefit**: Better playback control, temporary additions

### Medium Priority

#### 4. Search and Filtering
- Genre filter, artist search, duration range
- Debounced search input with highlighting
- Filter by "recently played"

#### 5. Persistent Playback State
- Save current track position to database
- Resume from last position on page refresh
- Sync playback state across devices for same user

#### 6. Enhanced Voting
- Limit one vote per user per track
- Visual indicator of user's vote
- Auto-reorder playlist by vote count

#### 7. Playlist History
- View previously played tracks
- Play count statistics
- Most popular tracks

### Nice-to-Have

#### 8. Social Features
- Display active users
- User avatars and names
- Chat/comments on tracks

#### 9. Multiple Playlists
- Create named playlists
- Switch between playlists
- Public/private playlist settings

#### 10. Audio Visualization
- Animated equalizer bars
- Waveform display
- Album art blur background

#### 11. Mobile Responsiveness
- Touch-friendly drag-and-drop
- Optimized layout for small screens
- PWA support

#### 12. Performance Optimizations
- Virtualized scrolling for large libraries
- Debounced WebSocket messages
- React Query for server state caching
- Image lazy loading

---

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### REST Endpoints

#### Tracks

**GET /api/tracks**
- Returns all tracks in the library
- Response: `Track[]`

#### Playlist

**GET /api/playlist**
- Returns all tracks in the current playlist
- Response: `PlaylistItem[]` (sorted by position)

**POST /api/playlist**
- Adds a track to the playlist
- Body: `{ trackId: string, addedBy: string }`
- Response: `PlaylistItem` (201 Created)

**PATCH /api/playlist/:id**
- Updates a playlist item (position or playing state)
- Body: `{ position?: number, isPlaying?: boolean }`
- Response: `PlaylistItem` (200 OK)

**DELETE /api/playlist/:id**
- Removes a track from the playlist
- Response: 204 No Content

#### Voting

**POST /api/playlist/:id/vote**
- Vote on a playlist track
- Body: `{ direction: 'up' | 'down' }`
- Response: `PlaylistItem` (200 OK)

#### Playback Control

**POST /api/playback/pause**
- Pauses playback for all clients
- Broadcasts: `playback.paused` event
- Response: `{ success: true }`

**POST /api/playback/resume**
- Resumes playback for all clients
- Broadcasts: `playback.resumed` event
- Response: `{ success: true }`

#### History

**GET /api/history**
- Returns recently played tracks
- Response: `RecentlyPlayedEntry[]`

### WebSocket Events

Connect to: `ws://localhost:4000/ws`

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `track.added` | `{ item: PlaylistItem }` | New track added to playlist |
| `track.removed` | `{ id: string }` | Track removed from playlist |
| `track.moved` | `{ item: PlaylistItem }` | Track position changed |
| `track.voted` | `{ item: PlaylistItem }` | Track votes updated |
| `track.playing` | `{ id: string, item: PlaylistItem }` | Track started playing |
| `playback.paused` | `{}` | Playback paused |
| `playback.resumed` | `{}` | Playback resumed |
| `history.added` | `{ entry: RecentlyPlayedEntry }` | Track added to history |
| `ping` | `{ type: 'ping', ts: string }` | Heartbeat (every 30s) |

---

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or feedback, please open an issue on GitHub.

---

Built for collaborative music listening
