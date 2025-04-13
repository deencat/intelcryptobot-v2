# Software Requirements Specification: Intelligent Crypto Trading Bot

## System Design

*   The system will be composed of several logical modules:
    *   **Frontend Dashboard:** User interface for monitoring, alerts, and configuration (React/Next.js).
    *   **Backend API:** Handles user authentication, serves data to the frontend, manages settings, and potentially orchestrates core bot actions (Next.js API Routes/Supabase Edge Functions).
    *   **Data Ingestion Service:** Collects market data, news, etc. (Could be a separate service or integrated).
    *   **AI Analysis Service:** Interfaces with DeepSeek API (Could be part of the core bot or a separate service).
    *   **RL Strategy & Execution Engine:** Core decision-making, risk management, and trade execution logic. **(Note:** This component is computationally intensive and likely best implemented as a separate service, potentially in Python, due to ML/RL library ecosystems).
    *   **Blockchain Interaction Service:** Handles connections and transactions specifically with the Solana network (and potentially others later).

## Architecture pattern

*   **Frontend:** Single Page Application (SPA) built with Next.js.
*   **Backend:**
    *   Initial: Backend-for-Frontend (BFF) using Next.js API routes for UI-related data and user management.
    *   Core Bot Logic: Event-driven or scheduled task architecture for the separate RL/Execution Engine service(s). Communication between the Next.js backend and the core bot service(s) could happen via a message queue (like Redis Streams or RabbitMQ) or direct API calls (less ideal for decoupled operation).
*   **Database:** PostgreSQL managed via Supabase.

## State management

*   **Frontend:** Client-side state management using React hooks (useState, useContext) or a dedicated library like Zustand or Jotai for managing UI state, user session, and cached data. Server state caching handled by React Query or SWR via Next.js.
*   **Backend:** Primarily stateless API endpoints. Core bot engine maintains state related to current positions, model status, risk levels, etc., potentially using Redis for fast access or relying on the database for persistence.

## Data flow

1.  **Data Ingestion:** Service collects real-time data (Solana on-chain data, CEX APIs if used, news feeds) -> Stores relevant info in Database/Cache.
2.  **AI Analysis:** Core Engine/Service periodically queries new data -> Formats prompts -> Sends requests to DeepSeek API -> Parses responses -> Stores insights in Database/Cache.
3.  **RL Decision:** Core Engine reads current market state (price data, indicators, DeepSeek insights, portfolio status from DB/Cache) -> RL model determines action (buy/sell/hold, size, SL/TP) -> Action proposed.
4.  **Risk Check:** Proposed action evaluated by Risk Management module against rules (1% risk, exposure limits, drawdown) -> Action approved, modified, or rejected.
5.  **Execution:** If approved, Blockchain Interaction Service/Execution module places the order on the Solana network (e.g., interacting with a DEX like Jupiter or Raydium).
6.  **Logging:** All significant events (decisions, orders, fills, errors, DeepSeek calls) are logged to the Database.
7.  **Monitoring/UI:** Backend API fetches performance data, logs, positions, status from Database/Cache -> Sends to Frontend Dashboard via REST or WebSocket for real-time updates.

## Technical Stack

*   **Frontend:** React, Next.js, Tailwind CSS, Shadcn/ui, Lucide Icons, Sonner (Toasts)
*   **Backend API/BFF:** Next.js (API Routes)
*   **Database:** Supabase (PostgreSQL)
*   **ORM:** Prisma
*   **Authentication:** Clerk Auth
*   **Deployment:** Vercel
*   **Blockchain Integration:** `@solana/web3.js`, potentially specific DEX SDKs (e.g., Jupiter Aggregator SDK, Raydium SDK).
*   **AI Integration:** DeepSeek API (via standard HTTP client like `fetch` or `axios`).
*   **Core Bot Engine (Recommendation):** Python (due to ML/RL ecosystem) using libraries like:
    *   ML/RL: TensorFlow/PyTorch, Stable-Baselines3, Pandas, NumPy
    *   Scheduling/Tasks: Celery, APScheduler, or cloud-native equivalents.
    *   (Communication with Next.js backend via Redis Pub/Sub, RabbitMQ, or REST API)
*   **Caching (Recommended):** Redis (for caching market data, DeepSeek responses, session info).

## Authentication Process

1.  User navigates to the application hosted on Vercel.
2.  Clerk's Next.js SDK intercepts unauthenticated users and redirects to Clerk's hosted login page or renders embedded Clerk components.
3.  User authenticates using available methods (email/password, social logins configured in Clerk).
4.  Upon successful authentication, Clerk redirects back to the application, establishing a user session managed by Clerk's SDK.
5.  Frontend requests to Next.js API routes include authentication tokens (handled by Clerk's SDK).
6.  Next.js API routes use Clerk middleware (`@clerk/nextjs/server`) to verify the token and authenticate the request before processing.

## Route Design

*   `/` : Landing page or redirects to dashboard if authenticated.
*   `/dashboard` : Main application UI (protected route).
*   `/settings` : User and bot configuration page (protected route).
*   `/sign-in`, `/sign-up` : Handled by Clerk's Next.js integration.
*   `/api/auth/*` : Clerk authentication webhooks/callbacks.
*   `/api/performance` : GET endpoint to fetch historical/real-time performance data.
*   `/api/positions` : GET endpoint to fetch current open positions.
*   `/api/logs` : GET endpoint to fetch trade/system logs (with filtering).
*   `/api/alerts` : GET endpoint to fetch critical alerts.
*   `/api/settings` : GET/POST/PUT endpoints to manage user/bot settings.
*   `/api/status` : GET endpoint for overall bot/system health.
*   *(Potential WebSocket endpoint for real-time updates)*

## API Design

*   **Style:** RESTful principles for HTTP endpoints. WebSocket for real-time data pushes to the dashboard.
*   **Authentication:** All data-fetching/mutation API endpoints (except auth routes) require authentication via Clerk JWT verification.
*   **Data Format:** JSON.
*   **Key Endpoints:** (Based on Route Design)
    *   `GET /api/status`: Returns `{ botStatus: 'Running' | 'Paused' | 'Error', connections: { deepseek: 'OK' | 'Error', broker: 'OK' | 'Error', dataFeed: 'OK' | 'Error' } }`
    *   `GET /api/performance?timeframe=daily|weekly|monthly|all`: Returns performance data object (P&L, equity, drawdown points).
    *   `GET /api/positions`: Returns array of open position objects.
    *   `GET /api/logs?type=trade|system|error&limit=100`: Returns array of log entries.
    *   `GET /api/settings`: Returns user and bot configuration object.
    *   `POST /api/settings`: Updates settings object.

## Database Design ERD

(Using Prisma-like syntax for description)

```prisma
model User {
  id         String   @id @default(cuid()) // Clerk User ID can be used here
  clerkId    String   @unique
  email      String   @unique
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  apiSettings APISettings[]
  botConfig  BotConfiguration?
  alerts     Alert[]
}

// Stores API keys securely (consider encryption at rest/application level)
model APISettings {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  broker      String   // e.g., 'Jupiter', 'Raydium', 'Binance'
  apiKey      String   // Encrypted
  apiSecret   String   // Encrypted
  deepseekKey String?  // Encrypted
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BotConfiguration {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  isEnabled       Boolean  @default(false)
  riskPerTrade    Float    @default(0.01) // e.g., 1% = 0.01
  maxExposure     Float    @default(0.50) // e.g., 50% = 0.50
  maxDrawdown     Float    @default(0.15) // e.g., 15% = 0.15
  targetNetwork   String   @default("Solana") // e.g., "Solana", "Ethereum"
  // Other strategy/RL specific parameters
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model TradeLog {
  id            String    @id @default(cuid())
  timestamp     DateTime  @default(now())
  symbol        String    // e.g., 'SOL/USDC'
  action        String    // 'BUY', 'SELL', 'HOLD_Decision'
  orderType     String?   // 'MARKET', 'LIMIT'
  size          Float?
  entryPrice    Float?
  exitPrice     Float?
  stopLoss      Float?
  takeProfit    Float?
  pnl           Float?
  fee           Float?
  brokerOrderId String?
  status        String    // 'Filled', 'Partial', 'Cancelled', 'Rejected', 'Decision'
  strategyInfo  Json?     // State/Context at decision time
  createdAt     DateTime  @default(now())
}

// Could store periodic snapshots for charting
model PerformanceSnapshot {
  id        String   @id @default(cuid())
  timestamp DateTime @default(now()) @unique
  equity    Float
  balance   Float
  openPnl   Float
  drawdown  Float    // Current drawdown %
  createdAt DateTime @default(now())

  @@index([timestamp])
}

model Alert {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  timestamp DateTime @default(now())
  type      String   // 'RiskLimit', 'APIError', 'SystemError', 'TradeError'
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId, timestamp])
}

// Optional: To store info about deployed/active RL models
// model RLModel {
//   id          String @id @default(cuid())
//   version     String @unique
//   description String?
//   isActive    Boolean @default(false)
//   deployedAt  DateTime @default(now())
//   // Path or reference to model file/weights
// }
```