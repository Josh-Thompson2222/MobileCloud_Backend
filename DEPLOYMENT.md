# Weather App — Full Setup & Deployment Guide

## ──────────────────────────────────────────
## STEP 1 — Fill in your secrets
## ──────────────────────────────────────────

### backend/.env
Open this file and replace the placeholders:

  MONGODB_URI=       ← paste your MongoDB Atlas connection string here
  JWT_SECRET=        ← any random string, e.g. "weatherapp_jwt_secret_2024"
  RAPIDAPI_KEY=      ← paste your new RapidAPI key here
  PORT=5000

### frontend/.env
This is already filled in with your EC2 IP:
  EXPO_PUBLIC_API_URL=http://54.227.100.59:5000/api

Nothing to change here unless your IP changes.

## ──────────────────────────────────────────
## STEP 2 — Open port 5000 on your EC2
## ──────────────────────────────────────────

Your EC2 needs to allow traffic on port 5000:

1. Go to AWS Console → EC2 → Instances → click your instance
2. Scroll down to "Security" tab → click the Security Group link
3. Click "Edit inbound rules"
4. Click "Add rule":
   - Type: Custom TCP
   - Port range: 5000
   - Source: Anywhere-IPv4 (0.0.0.0/0)
5. Click "Save rules"

## ──────────────────────────────────────────
## STEP 3 — SSH into your EC2 and set it up
## ──────────────────────────────────────────

Open your terminal where your .pem file is saved and run:

  ssh -i Cloud_Mobile_Project.pem ubuntu@54.227.100.59

If you get a permissions error on Windows, run this first:
  icacls Cloud_Mobile_Project.pem /inheritance:r /grant:r "%username%:R"

Once connected to EC2, install Node.js:

  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs

Verify:
  node --version
  npm --version

Install PM2 (keeps your server running after you close the terminal):
  sudo npm install -g pm2

## ──────────────────────────────────────────
## STEP 4 — Upload your backend to EC2
## ──────────────────────────────────────────

Open a NEW terminal (not the SSH one) on your Windows machine.
Navigate to your project folder, then run:

  scp -i Cloud_Mobile_Project.pem -r ./backend ubuntu@54.227.100.59:~/weather-app

This uploads your entire backend folder to the EC2.

## ──────────────────────────────────────────
## STEP 5 — Start the backend on EC2
## ──────────────────────────────────────────

Go back to your SSH terminal and run:

  cd ~/weather-app/backend
  npm install
  pm2 start src/server.js --name weather-api
  pm2 save
  pm2 startup

Copy and run the command that pm2 startup prints out.

To check your server is running:
  pm2 status
  pm2 logs weather-api

To test it works, open your browser and go to:
  http://54.227.100.59:5000/api/status

You should see: { "status": "OK", "message": "Weather App API is running" }

## ──────────────────────────────────────────
## STEP 6 — Run the frontend locally with Expo
## ──────────────────────────────────────────

In a terminal on your Windows machine:

  cd frontend
  npm install
  npx expo start

This opens the Expo developer tools in your browser.
Scan the QR code with the Expo Go app on your phone.

Make sure your phone is on the same WiFi as your laptop.

## ──────────────────────────────────────────
## USEFUL COMMANDS
## ──────────────────────────────────────────

# Re-upload backend after making changes:
  scp -i Cloud_Mobile_Project.pem -r ./backend ubuntu@54.227.100.59:~/weather-app

# Restart the server on EC2 after re-uploading:
  ssh -i Cloud_Mobile_Project.pem ubuntu@54.227.100.59
  cd ~/weather-app/backend && npm install && pm2 restart weather-api

# View server logs:
  pm2 logs weather-api

# Stop server:
  pm2 stop weather-api

## ──────────────────────────────────────────
## WHERE EACH DATABASE IS USED
## ──────────────────────────────────────────

SQLite (local, on device):
  - recent_searches   → stores last 10 cities the user searched
  - cached_weather    → stores last known weather per city (offline fallback)
  - user_preferences  → stores local settings

MongoDB Atlas (cloud):
  - users             → accounts, hashed passwords, push tokens
  - savedcities       → favourite cities per user, alert settings
