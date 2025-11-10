@echo off
echo ========================================
echo AI Financial Assistant - Rebuild and Run
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
echo Step 1: Building release APK...
echo.
cd android
call gradlew assembleRelease --no-daemon
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Step 2: Uninstalling old app...
echo.
adb uninstall com.aifinancialassistant

echo.
echo Step 3: Installing new APK...
echo.
adb install android\app\build\outputs\apk\release\app-release.apk
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Installation failed!
    echo.
    pause
    exit /b 1
)

echo.
echo Step 4: Restarting emulator for clean launch...
echo.
echo Killing emulator...
adb -s emulator-5554 emu kill
timeout /t 5 /nobreak >nul

echo Starting emulator...
start "" "%ANDROID_HOME%\emulator\emulator.exe" -avd Medium_Phone_API_36.1
echo Waiting for emulator to boot (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo Step 5: Launching app...
echo.
adb wait-for-device
adb shell am start -n com.aifinancialassistant/.MainActivity

echo.
echo ========================================
echo App rebuilt and launched successfully!
echo ========================================
echo.
pause
