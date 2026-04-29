@echo off
REM Quick Setup Script for Secure Notes App (Windows)
REM This script helps you set up the application quickly

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  Secure Notes App - Quick Setup (Windows)              ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Step 1: Install dependencies
echo Step 1: Installing dependencies...
call npm install

if errorlevel 1 (
    echo Error: npm install failed
    exit /b 1
)

echo ✓ Dependencies installed
echo.

REM Step 2: Create .env file
echo Step 2: Creating .env file...

if exist .env (
    echo ⚠ .env file already exists
) else (
    copy .env.example .env
    echo ✓ .env file created from template
    echo ✓ Please edit .env with your database credentials
)

REM Step 3: Display next steps
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  NEXT STEPS:                                           ║
echo ╠════════════════════════════════════════════════════════╣
echo ║ 1. Edit .env file with your MySQL credentials         ║
echo ║ 2. Create MySQL database with schema from db/schema.js║
echo ║ 3. Set ENCRYPTION_KEY (32 characters)                 ║
echo ║ 4. Set SESSION_SECRET (any random string)             ║
echo ║ 5. Run: npm start (or npm run dev)                    ║
echo ║ 6. Open: http://localhost:3000                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
pause
