@echo off
echo ========================================
echo AI Financial Assistant - Quick Launch
echo ========================================
echo.

REM Set Android SDK path
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%

echo Checking if emulator is running...
adb devices | findstr "device" >nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No emulator detected!
    echo Please start your Android emulator first.
    echo.
    pause
    exit /b 1
)

echo.
echo Emulator detected!
echo.
echo Launching AI Financial Assistant...
adb shell am start -n com.aifinancialassistant/.MainActivity

echo.
echo ========================================
echo App launched successfully!
echo ========================================
echo.
pause
