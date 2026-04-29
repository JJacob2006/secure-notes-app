#!/bin/bash
# Quick Setup Script for Secure Notes App
# This script helps you set up the application quickly

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Secure Notes App - Quick Setup                        ║"
echo "╚════════════════════════════════════════════════════════╝"

# Step 1: Install dependencies
echo ""
echo "Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error: npm install failed"
    exit 1
fi

echo "✓ Dependencies installed"

# Step 2: Create .env file
echo ""
echo "Step 2: Creating .env file..."

if [ -f .env ]; then
    echo "⚠ .env file already exists"
else
    cp .env.example .env
    echo "✓ .env file created from template"
    echo "✓ Please edit .env with your database credentials"
fi

# Step 3: Display next steps
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  NEXT STEPS:                                           ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║ 1. Edit .env file with your MySQL credentials         ║"
echo "║ 2. Create MySQL database with schema from db/schema.js║"
echo "║ 3. Set ENCRYPTION_KEY (32 characters)                 ║"
echo "║ 4. Set SESSION_SECRET (any random string)             ║"
echo "║ 5. Run: npm start (or npm run dev)                    ║"
echo "║ 6. Open: http://localhost:3000                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
