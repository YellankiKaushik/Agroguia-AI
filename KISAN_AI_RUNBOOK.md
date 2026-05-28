# 🌾 KISAN.AI — Complete Run Guide

> **What is this?**  
> KISAN.AI is an AI-powered farm advisory platform for Indian farmers.  
> It gives weather alerts, pest warnings, crop advice, scheme eligibility, insurance guidance, and loan recommendations — all powered by OpenAI GPT.

---

## 📁 Folder Structure (What Each Folder Does)

```
extractted files/
│
├── START.ps1               ← ONE-CLICK startup script (run this!)
├── .env.local              ← YOUR SECRET KEYS go here (OpenAI API key)
├── .env                    ← Base environment (don't touch)
│
├── app/                    ← All pages and screen code
│   ├── page.tsx            ← Main dashboard page (the whole UI)
│   ├── layout.tsx          ← App shell (fonts, providers, theme)
│   ├── globals.css         ← Global styles
│   └── api/                ← Backend API routes (server-side logic)
│       ├── agent/          ← Calls OpenAI to generate farm advisory
│       ├── auth/           ← Login, Register, Logout, Session check
│       ├── farmer-profiles/← Save/load farmer profile from database
│       └── advisory-history/← Save/load past advisories
│
├── components/             ← Reusable UI building blocks
│   └── ui/                 ← shadcn/ui components (buttons, cards, etc.)
│
├── app/sections/           ← Each tab/section of the dashboard
│   ├── DashboardHero.tsx   ← Top summary card (weather, alerts, actions)
│   ├── DashboardTabs.tsx   ← All advisory tabs (weather, pest, market...)
│   ├── ProfileWizard.tsx   ← Farmer profile setup form
│   ├── CropTimeline.tsx    ← Crop growth stage tracker
│   ├── FinancialDashboard.tsx ← Income/expense summary
│   └── VoiceUpdate.tsx     ← Voice summary of the advisory
│
├── lib/                    ← Helper utilities and services
│   ├── openaiAdvisory.ts   ← Sends farmer data to OpenAI, gets advisory
│   ├── aiAgent.ts          ← Client-side wrapper to call /api/agent
│   ├── auth.ts             ← JWT login/session helpers
│   ├── db.ts               ← MongoDB database connection
│   └── advisoryDefaults.ts ← Fallback data if OpenAI fails
│
└── models/                 ← Database table definitions (MongoDB schemas)
    ├── User.ts             ← User accounts
    ├── FarmerProfile.ts    ← Farmer crop/land data
    └── AdvisoryHistory.ts  ← Saved past advisories
```

---

## 🔑 One-Time Setup (Do This First, Ever)

### Step 1 — Get Your OpenAI API Key
1. Go to → **https://platform.openai.com/api-keys**
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-...`)

### Step 2 — Add Your Key to the App
1. Open the file: **`.env.local`** (in the `extractted files` folder)
2. Find this line:
   ```
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
   ```
3. Replace it with your real key:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
   ```
4. **Save the file**

### Step 3 — Make Sure Node.js is Installed
- Open PowerShell and type: `node --version`
- You should see something like `v20.x.x`
- If not, download from → **https://nodejs.org** (choose LTS version)

---

## 🚀 How to Start the App (Every Time)

### Method 1 — One-Click Script (Easiest ✅)
1. Open the `extractted files` folder in File Explorer
2. Find `START.ps1`
3. **Right-click → "Run with PowerShell"**
4. Wait for the message: `App running at: http://localhost:3333`
5. Open your browser → go to **http://localhost:3333**

> **If Windows blocks the script**, open PowerShell as Administrator and run:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
> Then try again.

### Method 2 — Command Prompt / Terminal
1. Open a terminal in the `extractted files` folder  
   *(Right-click inside the folder → "Open in Terminal")*
2. Run:
   ```bash
   npm run dev
   ```
3. Open browser → **http://localhost:3333**

### To Stop the Server
Press **`Ctrl + C`** in the terminal window.

---

## 🧪 How to Test the App (Step-by-Step)

### 1. Open the App
Go to → **http://localhost:3333**

### 2. Create an Account
- Click **"Create an account"**
- Fill in: Name, Email, Password
- Click **Register**

### 3. Set Up Your Farmer Profile
A form will appear asking for:
- Your name, district, state
- Crop type (e.g. Soybean, Cotton, Rice)
- Land size, soil type, irrigation method
- Bank, insurance, loan status

Fill it in and click **Save Profile**.

### 4. View the Dashboard
You'll see the main dashboard with:
| Section | What It Shows |
|---------|--------------|
| 🌤️ Weather Card | Today's weather alerts & actions |
| 🐛 Alerts | Pest/disease risk level |
| 📈 Financial | Expected income vs costs |
| 📋 Schemes | Govt schemes you're missing |
| 🔊 Voice | Audio summary of advice |

### 5. Try Sample Data (No OpenAI Key Needed)
- Toggle **"Sample Data"** switch in the top bar → ON
- This loads realistic pre-built demo advisory data instantly

### 6. Generate Real AI Advisory
- Click the **"Generate Advisory"** button
- Wait 10–20 seconds (it calls OpenAI)
- Full tabs appear: Weather, Pest, Protection, Market, Schemes, Insurance, Loans, Fraud, Waste

---

## ❌ Common Errors & Fixes

| Error | What It Means | Fix |
|-------|--------------|-----|
| `OPENAI_API_KEY missing` | Key not added to `.env.local` | Add your real key to `.env.local`, restart server |
| Login fails with "Authentication failed" | MongoDB database may be offline | See below ↓ |
| Port 3333 already in use | Server is already running | Run `START.ps1` — it clears the port automatically |
| Page shows blank/white screen | Usually a build error | Check terminal for red error messages |

### If Login/Register Always Fails (MongoDB Issue)
The database in `.env.local` is a remote cloud MongoDB that was part of the original Lyzr hackathon platform. It may be decommissioned. To fix this permanently:

**Option A — MongoDB Atlas (Free, recommended)**
1. Go to → **https://www.mongodb.com/atlas**
2. Create a free account → Create a free cluster (M0)
3. Get your connection string
4. Open `.env.local` and replace the `DATABASE_URL=` line with your Atlas URL

**Option B — Local MongoDB**
1. Install MongoDB Community → **https://www.mongodb.com/try/download/community**
2. Replace `DATABASE_URL=` in `.env.local` with:
   ```
   DATABASE_URL=mongodb://localhost:27017/kisanai
   ```

---

## ⚙️ Environment Variables Explained (`.env.local`)

| Variable | What It Does |
|----------|-------------|
| `OPENAI_API_KEY` | **Your key** — required for AI advisory |
| `OPENAI_ADVISORY_MODEL` | Which GPT model to use (default: `gpt-4o-mini`) |
| `JWT_SECRET` | Secret used to sign login sessions |
| `DATABASE_URL` | MongoDB connection string |
| `APP_JWT_SECRET` | Backup JWT secret (same value) |

---

## 🛠️ What Was Fixed (Technical Summary)

These bugs were found and fixed to make the app run locally:

1. **Missing `IframeLoggerInit` component** — Lyzr telemetry hook that didn't ship with the code → created a no-op stub
2. **Missing `AgentInterceptorProvider` component** — Lyzr API proxy that didn't ship → created a transparent pass-through stub
3. **`JWT_SECRET` env variable mismatch** — code looked for `JWT_SECRET`, env had `APP_JWT_SECRET` → fixed to check both
4. **MongoDB TLS cert path** — connection string had `tlsCAFile=/tmp/docdb-ca-bundle.pem` (Linux path, doesn't exist on Windows) → stripped at runtime
5. **Missing `OPENAI_API_KEY`** — was never added to any env file → added as a placeholder with instructions
6. **`mongoose` not in `package.json`** — was only an indirect dependency → installed it directly

---

## 📞 Quick Reference Card

```
EVERY TIME YOU WANT TO RUN:
  1. Double-click START.ps1  (or: npm run dev in terminal)
  2. Open browser → http://localhost:3333
  3. Press Ctrl+C to stop

ONE-TIME SETUP:
  1. Add OpenAI key to .env.local
  2. Make sure Node.js is installed (node --version)

IF SOMETHING BREAKS:
  1. Stop server (Ctrl+C)
  2. Delete the .next folder
  3. Run: npm run dev
```
