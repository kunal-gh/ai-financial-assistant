@echo off
echo ========================================
echo AI Financial Assistant - GitHub Setup
echo ========================================
echo.

echo Step 1: Initializing Git Repository...
git init
if errorlevel 1 (
    echo Error: Git initialization failed
    pause
    exit /b 1
)
echo ✓ Git initialized
echo.

echo Step 2: Adding files to Git...
git add .
if errorlevel 1 (
    echo Error: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added
echo.

echo Step 3: Creating initial commit...
git commit -m "Initial commit: AI Financial Assistant v1.0.0"
if errorlevel 1 (
    echo Error: Commit failed
    pause
    exit /b 1
)
echo ✓ Initial commit created
echo.

echo Step 4: Creating tag v1.0.0...
git tag -a v1.0.0 -m "Release v1.0.0 - Initial Release"
if errorlevel 1 (
    echo Error: Tag creation failed
    pause
    exit /b 1
)
echo ✓ Tag created
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create a new repository on GitHub
echo 2. Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/ai-financial-assistant.git
echo    git branch -M main
echo    git push -u origin main
echo    git push origin v1.0.0
echo.
echo 3. Create a release on GitHub and upload the APK
echo.
pause
