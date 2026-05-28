# ============================================================
#  AGROGUIA.AI — One-Click Startup Script
#  Run this every time you want to start the app locally.
#  How to run:  Right-click → "Run with PowerShell"
#               OR open PowerShell here and type:  .\START.ps1
# ============================================================

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   AGROGUIA.AI — Starting Dev Server" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check if Node is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed." -ForegroundColor Red
    Write-Host "Download it from: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$nodeVersion = node --version
Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Cyan

# Step 2: Check if required environment values are set
$envContent = Get-Content ".env.local" -ErrorAction SilentlyContinue
$hasOpenRouterKey = $envContent | Where-Object { $_ -match "^OPENROUTER_API_KEY=.+" -and $_ -notmatch "your-openrouter-api-key-here" }
$hasDatabaseUrl = $envContent | Where-Object { $_ -match "^DATABASE_URL=mongodb(\+srv)?://" }
if (-not $hasOpenRouterKey) {
    Write-Host ""
    Write-Host "[WARNING] OPENROUTER_API_KEY is not set or still a placeholder!" -ForegroundColor Yellow
    Write-Host "  Open .env.local and replace:" -ForegroundColor Yellow
    Write-Host "    OPENROUTER_API_KEY=your-openrouter-api-key-here" -ForegroundColor Gray
    Write-Host "  with your real key from: https://openrouter.ai/keys" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  The app will still start, but AI advisory generation will fail." -ForegroundColor Yellow
    Write-Host ""
}
if (-not $hasDatabaseUrl) {
    Write-Host ""
    Write-Host "[WARNING] DATABASE_URL is missing or is not a MongoDB connection string." -ForegroundColor Yellow
    Write-Host "  Add your MongoDB Atlas connection string to .env.local:" -ForegroundColor Yellow
    Write-Host "    DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Auth, CRUD, and advisory history persistence need this value." -ForegroundColor Yellow
    Write-Host ""
}

# Step 3: Install dependencies if node_modules is missing
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] node_modules not found. Installing dependencies..." -ForegroundColor Cyan
    npm install
    Write-Host "[OK] Dependencies installed." -ForegroundColor Green
} else {
    Write-Host "[OK] node_modules found — skipping install." -ForegroundColor Cyan
}

# Step 4: Kill anything already running on port 3333
$conn = Get-NetTCPConnection -LocalPort 3333 -ErrorAction SilentlyContinue
if ($conn) {
    $procId = $conn.OwningProcess | Select-Object -First 1
    Write-Host "[INFO] Port 3333 in use by process $procId. Clearing it..." -ForegroundColor Yellow
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "[OK] Port 3333 cleared." -ForegroundColor Green
} else {
    Write-Host "[OK] Port 3333 is free." -ForegroundColor Cyan
}

# Step 5: Start the dev server
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  App running at: http://localhost:3333" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

npm run dev

