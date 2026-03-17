#!/bin/bash

# Celestials - Quick Deployment Script
# This script helps deploy your app to Firebase Hosting

echo "🌟 Celestials Deployment Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo ""
    echo "📦 Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Firebase CLI"
        exit 1
    fi
    
    echo "✅ Firebase CLI installed successfully"
fi

echo "✅ Firebase CLI found"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔨 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check if user is logged in to Firebase
echo "🔐 Checking Firebase authentication..."
firebase projects:list &> /dev/null

if [ $? -ne 0 ]; then
    echo "Please login to Firebase:"
    firebase login
    
    if [ $? -ne 0 ]; then
        echo "❌ Firebase login failed"
        exit 1
    fi
fi

echo "✅ Firebase authentication successful"
echo ""

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
echo ""
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ================================"
    echo "🎉 Deployment Successful!"
    echo "🎉 ================================"
    echo ""
    echo "Your Celestials app is now live!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your hosting URL shown above"
    echo "2. Test all pages (Home, Features, How It Works)"
    echo "3. Share the URL with your team"
    echo "4. Set up custom domain in Firebase Console"
    echo ""
    echo "For backend integration, see DEVELOPER_HANDOFF.md"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error messages above"
    exit 1
fi
