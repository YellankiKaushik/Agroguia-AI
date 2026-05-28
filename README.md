# 🌾 AGROGUIA.AI

> **AI-powered farm advisory platform for Indian farmers**

AGROGUIA.AI delivers hyper-personalized farm intelligence — weather alerts, pest risk detection, market prices, government scheme eligibility, insurance guidance, and loan advisory — all powered by OpenAI GPT and built on a standalone Next.js + MongoDB stack.

---

## ✨ Features

| Module | What It Does |
|--------|-------------|
| 🌤️ Weather Advisory | Daily actionable alerts based on crop stage |
| 🐛 Pest & Disease | Risk detection with immediate action plans |
| 💊 Protection Plan | Spray & fertilizer schedule within budget |
| 📈 Market Intelligence | Mandi price comparison & sell/wait guidance |
| 🏛️ Government Schemes | Eligibility check for PM-KISAN, PMFBY, etc. |
| 🛡️ Insurance | PMFBY claim eligibility & document checklist |
| 🏦 Loan Advisory | KCC vs local NBFC comparison |
| 🚨 Fraud Awareness | Digital safety tips & scam scenarios |
| ♻️ Waste Value | Crop residue monetization opportunities |
| 🔊 Voice Summary | Audio-ready advisory summaries |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (serverless)
- **AI Engine**: OpenAI GPT (via direct API — no vendor SDK)
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcrypt (standalone, no third-party auth)
- **Language**: TypeScript

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YellankiKaushik/Agroguia-AI.git
cd Agroguia-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Then open `.env.local` and fill in:
- `OPENAI_API_KEY` — get from https://platform.openai.com/api-keys
- `DATABASE_URL` — MongoDB connection string (free tier: https://mongodb.com/atlas)
- `JWT_SECRET` — any random 32-char string

### 4. Run the development server
```bash
npm run dev
```

Open → **http://localhost:3333**

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # App shell
│   └── api/
│       ├── agent/            # OpenAI advisory endpoint
│       ├── auth/             # Login / Register / Logout
│       ├── farmer-profiles/  # Farmer profile CRUD
│       └── advisory-history/ # Past advisory storage
├── app/sections/             # Dashboard UI sections
├── components/               # Shared UI components (shadcn/ui)
├── lib/
│   ├── openaiAdvisory.ts     # OpenAI integration
│   ├── auth.ts               # JWT helpers
│   └── db.ts                 # MongoDB connection
├── models/                   # Mongoose data models
└── .env.example              # Environment template
```

---

## 🔐 Environment Variables

See `.env.example` for all required variables. **Never commit `.env` or `.env.local`.**

---

## 🧪 Testing the App

1. Register an account at `/`
2. Fill in your farmer profile (crop, location, land size)
3. Toggle **Sample Data** to preview advisory immediately
4. Click **Generate Advisory** for a real AI-generated farm plan

---

## 📄 License

MIT — built for the OpenAI × Outskill Hackathon 2026.
