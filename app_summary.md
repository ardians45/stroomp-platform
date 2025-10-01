🎯 STROOMP PLATFORM – AI DEVELOPMENT SPECIFICATION (SUPER DETAILED)
File: app_summary.md
Project: STROOMP – Decentralized Live Streaming Platform
Document Version: 1.4 (Super Detailed)
Target: AI Coding Agent (Gemini, QWen, etc.)
Purpose: Panduan resmi dan sangat rinci untuk AI Agent agar dapat membuat kode bersih, konsisten, aman, dan sesuai arsitektur STROOMP.

---

📋 1. PROJECT OVERVIEW
1.1 Vision & Mission
Visi: Menjadikan STROOMP platform live streaming blockchain pertama yang global dan interaktif.
Misi:
• Memberdayakan kreator dengan sistem donasi crypto dan monetisasi maksimal.
• Menyediakan ekosistem tanpa biaya (0% pajak).
• Memastikan aksesibilitas global untuk streamer dan penonton.
• Fleksibilitas aturan, fokus hiburan.
1.2 Core Values
• Interaktif: Maksimalkan interaksi streamer & penonton.
• Entertainment: Optimalisasi pengalaman hiburan.
• Global: Menjangkau pasar internasional.
• Speed: Semua akses, streaming, dan transaksi cepat.

---

🏗️ 2. ARCHITECTURE & TECH STACK
2.1 Monorepo Structure
stroomp-platform/
├── apps/
│ ├── web/ # Frontend: Dilan (UI, Wallet, Live Stream)
│ ├── api/ # Backend: Izal (API, Prisma, Notifications)
│ └── solana-programs/ # On-chain: Izal & Dilan (Smart Contracts, Donation, Token)
│
├── packages/
│ ├── eslint-config-custom/ # ESLint rules
│ ├── shared-types/ # TypeScript shared interfaces
│ ├── tsconfig/ # TS config
│ ├── ui/ # Reusable React components
│ └── utils/ # Helper functions
│
├── tools/ # Dev scripts, generators
└── README.md
2.2 Tech Stack
Layer Technology Notes for AI Agent
Frontend Next.js 14, TypeScript, Tailwind, shadcn/ui, Solana Wallet Adapter Dark mode, wallet login, FCP <1.5s
Backend Node.js, Express, Prisma, PostgreSQL, Redis REST + WebSocket, wallet signature verification, SQL injection/XSS prevention
Blockchain Solana, Anchor Framework, web3.js Donation & token transactions, microtransactions
Styling Tailwind CSS, shadcn/ui Konsistensi UI, dark theme

---

🔄 3. SYSTEM FLOW & CORE FEATURES
3.1 User Authentication & Onboarding

1. Wallet Connect: Phantom/Solflare
2. Auto Account Creation: JWT & wallet address sebagai ID
3. Error Handling: gagal connect → retry message, logging
   3.2 Crypto Donation
4. Donasi SOL/STROOMP Coin (opsi anonim)
5. On-chain transaction → backend monitors confirmation
6. Real-time alert & history logs
7. Edge cases: pending tx, failed tx → user notification
   3.3 Interactive Polling
   • Streamer buat polling, vote via donasi, pilihan terbanyak menang.
   3.4 Raid System
   • Penonton dialihkan otomatis ke target streamer saat raid
   3.5 Subscription & Reward
   • Tier subscription, reward STROOMP Coin
   • Edge case: expired subscription, failed payment

---

📦 4. PACKAGE STRUCTURE & TEAM ALLOCATION
Folder/Package Assigned To Role / Notes
apps/web FE Team (Dilan) Frontend UI, Wallet connect, Live Stream page
apps/api BE Team (Izal) API, Prisma DB, Blockchain listener, Notifications
apps/solana-programs BE/Blockchain Smart Contracts, Donation, STROOMP Coin
packages/ui FE Team Reusable React components
packages/shared-types FE & BE TypeScript shared types
packages/utils FE & BE Helper functions

---

🔧 5. DEVELOPMENT SETUP
Prerequisites
• Node.js 18+, pnpm
• Rust & Cargo
• Solana CLI, Anchor
• PostgreSQL & Redis
Initial Setup
git clone <repo-url>
cd stroomp-platform
pnpm install

# Frontend

cd apps/web
pnpm dev

# Backend

cd ../api
pnpm dev

# Blockchain

cd ../solana-programs
anchor build
anchor deploy
Environment Variables
• .env.local frontend:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_WS_URL=ws://localhost:3001
• .env backend:
DATABASE_URL="postgresql://user:pass@localhost:5432/stroomp"
SOLANA_RPC_URL=https://api.devnet.solana.com
REDIS_URL=redis://localhost:6379
JWT_SECRET="your_jwt_secret"

---

📝 6. CODING STANDARDS
• TypeScript strict mode
• No any, gunakan shared types
• ESLint custom rules wajib dipakai
• Tailwind + shadcn/ui untuk styling
• Komentar function/module wajib
• API endpoints harus type-safe
• Unit test wajib untuk fitur kritikal

---

🔌 7. INTEGRATION POINTS
• Frontend ↔ Backend: REST API & WebSocket
• Frontend ↔ Blockchain: Wallet Adapter + on-chain transactions
• Backend ↔ Blockchain: Anchor + Solana RPC listener

---

🏁 8. PRIORITY FEATURES

1. Wallet login & auto account creation
2. Live Stream page (video + chat)
3. Crypto donation system
4. Polling & Raid system
5. Streamer dashboard & analytics
6. Subscription & reward system

---

✅ 9. DATABASE SCHEMA (Prisma Example)
model User {
id String @id @default(cuid())
wallet String @unique
username String?
createdAt DateTime @default(now())
}

model Stream {
id String @id @default(cuid())
title String
streamerId String
isLive Boolean @default(false)
viewerCount Int @default(0)
createdAt DateTime @default(now())
}

model Donation {
id String @id @default(cuid())
from String
to String
amount Float
message String?
txSignature String
timestamp DateTime @default(now())
}

model Poll {
id String @id @default(cuid())
question String
options Json
isActive Boolean @default(true)
streamId String
stream Stream @relation(fields: [streamId], references: [id])
createdAt DateTime @default(now())
}

---

📈 10. TESTING & ERROR HANDLING
• Unit tests: Frontend (React components), Backend (API, Blockchain listener)
• Integration tests: Wallet connect, donation flow, live stream
• Edge cases: Failed tx, pending tx, no active stream, raid errors
• Logging & monitoring: Redis logs, WebSocket events, Solana transaction logs

---

📊 11. PERFORMANCE & METRICS
• FCP < 1.5s, TTI < 3s, Video start < 3s
• Chat latency < 100ms
• Max concurrent viewers: 50+
• Donation volume target: $10k/month

---

🚀 12. IMPLEMENTATION ROADMAP
Phase 1 – MVP: Wallet login, Streaming, Crypto Donation
Phase 2 – Community & Coin Launch: STROOMP Coin & marketing
Phase 3 – Feature Expansion: Polling, Raid, Subscription, Rewards
Phase 4 – Global Expansion: Internasionalisasi & optimasi performa

---

📌 Catatan untuk AI Agent
• Fokus fitur inti: Wallet login, Streaming, Donasi Crypto
• Gunakan shared types & strict TypeScript
• Ikuti monorepo & coding standards
• Pastikan semua transaksi & notifikasi realtime
• Sertakan unit & integration test, handle edge case
