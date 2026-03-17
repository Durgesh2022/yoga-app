@echo off
REM Celestials - Quick Deployment Script for Windows
REM This script helps deploy your app to Firebase Hosting

echo ================================
echo 🌟 Celestials Deployment Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 📦 Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Firebase CLI
        pause
        exit /b 1
    )
    
    echo ✅ Firebase CLI installed successfully
)

echo ✅ Firebase CLI found
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🔨 Building production bundle...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Check if user is logged in to Firebase
echo 🔐 Checking Firebase authentication...
firebase projects:list >nul 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo Please login to Firebase:
    call firebase login
    
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Firebase login failed
        pause
        exit /b 1
    )
)

echo ✅ Firebase authentication successful
echo.

REM Deploy to Firebase
echo 🚀 Deploying to Firebase Hosting...
echo.
call firebase deploy --only hosting

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo 🎉 Deployment Successful!
    echo ================================
    echo.
    echo Your Celestials app is now live!
    echo.
    echo Next steps:
    echo 1. Visit your hosting URL shown above
    echo 2. Test all pages (Home, Features, How It Works^)
    echo 3. Share the URL with your team
    echo 4. Set up custom domain in Firebase Console
    echo.
    echo For backend integration, see DEVELOPER_HANDOFF.md
) else (
    echo.
    echo ❌ Deployment failed!
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
pause
