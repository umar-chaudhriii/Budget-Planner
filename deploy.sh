#!/bin/bash

# Git Bash Deployment Script
# Run this in Git Bash terminal

echo "🚀 Budget Tracker - Git Deployment Script"
echo "=========================================="
echo ""

# Step 1: Initialize Git
echo "📦 Step 1: Initializing Git repository..."
git init

# Step 2: Add all files
echo "📁 Step 2: Adding all files..."
git add .

# Step 3: Create initial commit
echo "💾 Step 3: Creating initial commit..."
git commit -m "Initial commit - Budget Tracker"

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a GitHub repository at: https://github.com/new"
echo "2. Copy the repository URL"
echo "3. Run these commands (replace YOUR_GITHUB_URL):"
echo ""
echo "   git remote add origin YOUR_GITHUB_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Then go to https://vercel.com to deploy!"
