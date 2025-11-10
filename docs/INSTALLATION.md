# Installation Guide

## For End Users

### Download and Install APK

1. **Download APK**
   - Go to [Releases](../../releases)
   - Download `app-release.apk`

2. **Enable Unknown Sources**
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Install Unknown Apps"

3. **Install APK**
   - Open the downloaded APK file
   - Tap "Install"
   - Wait for installation to complete

4. **Grant Permissions**
   - Open the app
   - Grant microphone permission when prompted (for voice features)

5. **Start Using**
   - App is ready to use!
   - Sample data is included for testing

---

## For Developers

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio**
- **JDK 11**
- **Android SDK** (API 34)

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/ai-financial-assistant.git
cd ai-financial-assistant
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Setup Android SDK**
- Open Android Studio
- Install Android SDK Platform 34
- Install Android SDK Build-Tools
- Set ANDROID_HOME environment variable

4. **Start Metro Bundler**
```bash
npm start
# or
yarn start
```

5. **Run on Device/Emulator**
```bash
npm run android
# or
yarn android
```

### Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Troubleshooting

**Metro Bundler Issues:**
```bash
npm start -- --reset-cache
```

**Build Errors:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease --no-daemon
```

**Permission Errors:**
- Ensure Android SDK is properly installed
- Check ANDROID_HOME environment variable
- Verify JDK 11 is installed

---

## System Requirements

### For Users
- Android 5.0 (API 21) or higher
- 50 MB free storage
- Microphone (for voice features)

### For Developers
- Windows/Mac/Linux
- 4 GB RAM minimum (8 GB recommended)
- 10 GB free disk space
- Internet connection for dependencies
