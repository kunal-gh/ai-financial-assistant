# 💰 Invoxen - AI Financial Assistant

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Android-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.72.17-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**A modern, AI-powered financial management app for Android with professional invoice sharing**

[Features](#-features) • [Installation](#-installation) • [Build Guide](#-building-from-source) • [Usage](#-usage) • [Development](#-development)

</div>

---

## 📱 About

**Invoxen** is a comprehensive financial management application built with React Native. It helps you manage clients, invoices, expenses, and provides an intelligent AI assistant with voice control for hands-free operation. Now with professional invoice sharing capabilities!

### ✨ Key Highlights

- 🤖 **AI-Powered Automation** - Natural language processing for task automation
- 🎤 **Voice Control** - Hands-free operation with voice commands
- 📊 **Visual Analytics** - Beautiful charts and graphs with Rupee (₹) currency
- 💾 **Local Database** - SQLite for fast, offline-first data storage
- 📄 **Professional Invoice Sharing** - Share formatted invoices via any app
- 🎨 **Modern UI** - Dark Material Design 3 theme with Invoxen branding
- 🚀 **Fast & Responsive** - Optimized performance

---

## 🎯 Features

### 📊 Dashboard
- Real-time financial statistics
- Revenue trend charts (6-month view)
- Expense distribution pie chart
- Recent activity feed
- Quick navigation to all sections

### 👥 Client Management
- Add and manage clients
- Store contact information (name, email, phone)
- View client-specific invoices
- Professional client cards

### 📄 Invoice Management
- Create detailed invoices with multiple line items
- Track invoice status (Paid, Pending, Overdue)
- Professional invoice layout with company branding
- **Share invoices** as beautifully formatted text via WhatsApp, Email, SMS, etc.
- Automatic calculations (subtotal, tax, total)
- Support for notes and payment terms
- Rupee (₹) currency formatting

### 💳 Expense Tracking
- Categorized expense management
- Categories: Office, Travel, Meals, Software, Utilities, Marketing
- Visual expense breakdown
- Date tracking

### 🤖 AI Assistant
- **Natural Language Processing** - Understand plain English commands
- **Voice Control** - Speak commands hands-free
- **Task Automation** - Automate repetitive tasks
- **Real-time Queries** - Get instant financial insights

#### AI Commands:
```
"Show my revenue"
"Show invoices"
"Show clients"
"Add client John Doe email john@example.com phone 555-1234"
"Create invoice for Acme Corp ₹5000 for consulting services"
"Add expense ₹200 for office supplies category office"
"Mark invoice #5 as paid"
"Show profit"
```

---

## 📸 Screenshots

<div align="center">

| Splash Screen | Dashboard | AI Assistant |
|:---:|:---:|:---:|
| ![Splash](docs/screenshots/splash.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![AI](docs/screenshots/ai.png) |

| Clients | Invoices | Expenses |
|:---:|:---:|:---:|
| ![Clients](docs/screenshots/clients.png) | ![Invoices](docs/screenshots/invoices.png) | ![Expenses](docs/screenshots/expenses.png) |

</div>

---

## 📥 Installation

### Option 1: Download APK (Recommended for Users)

1. Download the latest `app-release.apk` from the repository root or [Releases](../../releases)
2. Transfer to your Android device
3. Enable "Install from Unknown Sources" in Settings → Security
4. Tap the APK file to install
5. Grant microphone permission for voice features when prompted

---

## 🔨 Building from Source

### Prerequisites

Before building, ensure you have the following installed:

#### Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Java Development Kit (JDK 11)**
   - Download from: https://adoptium.net/
   - Verify: `java -version`
   - Set `JAVA_HOME` environment variable

3. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API Level 34)
   - Install Android SDK Build-Tools
   - Install Android Emulator (optional, for testing)

4. **Android SDK Setup**
   - Open Android Studio → SDK Manager
   - Install:
     - Android SDK Platform 34
     - Android SDK Build-Tools 34.0.0
     - Android SDK Platform-Tools
     - Android Emulator (optional)
   
5. **Environment Variables** (Windows)
   ```
   ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
   Add to PATH: %ANDROID_HOME%\platform-tools
   Add to PATH: %ANDROID_HOME%\tools
   ```

### Step-by-Step Build Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/kunal-gh/ai-financial-assistant.git
cd ai-financial-assistant
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all required Node.js packages including:
- React Native
- SQLite storage
- Voice recognition
- File system utilities
- Share functionality

#### 3. Configure Android SDK Path

The build process needs to know where your Android SDK is located.

**Windows:**
```bash
cd android
echo sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk > local.properties
```

**Mac/Linux:**
```bash
cd android
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
```

#### 4. Build Release APK

**Windows:**
```bash
cd android
.\gradlew.bat clean
.\gradlew.bat assembleRelease
```

**Mac/Linux:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

The build process will:
- Clean previous builds
- Compile TypeScript/JavaScript code
- Bundle assets
- Compile native Android code
- Create the APK

**Build time:** 2-5 minutes (first build may take longer)

#### 5. Locate the APK

After successful build, find your APK at:
```
android/app/build/outputs/apk/release/app-release.apk
```

You can also copy it to the project root:
```bash
# Windows
copy android\app\build\outputs\apk\release\app-release.apk .\app-release.apk

# Mac/Linux
cp android/app/build/outputs/apk/release/app-release.apk ./app-release.apk
```

### Running on Emulator

#### 1. Start Android Emulator

**From Android Studio:**
- Open AVD Manager (Tools → Device Manager)
- Click ▶️ on any emulator

**From Command Line (Windows):**
```bash
%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd YOUR_AVD_NAME -no-snapshot-load
```

#### 2. Verify Emulator is Running

```bash
adb devices
```

You should see:
```
List of devices attached
emulator-5554   device
```

#### 3. Install APK on Emulator

```bash
adb install -r app-release.apk
```

#### 4. Launch the App

```bash
adb shell am start -n com.aifinancialassistant/.MainActivity
```

### Development Mode (Hot Reload)

For development with hot reload:

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run on Android
npm run android
```

This will:
- Start the Metro bundler for hot reloading
- Build and install the debug APK
- Launch the app on connected device/emulator

### Troubleshooting Build Issues

#### Issue: "SDK location not found"
**Solution:** Create `android/local.properties` with your SDK path:
```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

#### Issue: "Gradle build failed"
**Solution:** Clean and rebuild:
```bash
cd android
.\gradlew.bat clean
.\gradlew.bat assembleRelease --no-daemon
```

#### Issue: "Command not found: gradlew"
**Solution:** Make sure you're in the `android` directory:
```bash
cd android
```

#### Issue: "Java version mismatch"
**Solution:** Ensure JDK 11 is installed and `JAVA_HOME` is set correctly:
```bash
java -version  # Should show version 11.x.x
```

#### Issue: "Out of memory"
**Solution:** Increase Gradle memory in `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

#### Issue: "Node modules not found"
**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

### Build Variants

**Debug APK** (for development):
```bash
cd android
.\gradlew.bat assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK** (for distribution):
```bash
cd android
.\gradlew.bat assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎮 Usage

### Getting Started

1. **Launch the app** - See the "Invoxen" splash screen
2. **Explore Dashboard** - View your Invoxen Dashboard with financial overview
3. **Add Clients** - Tap Clients tab → ➕ button
4. **Create Invoices** - Tap Invoices tab → ➕ button → Add line items
5. **Share Invoices** - Open any invoice → Tap "Share Invoice" → Choose app (WhatsApp, Email, etc.)
6. **Track Expenses** - Tap Expenses tab → ➕ button
7. **Use AI Assistant** - Tap AI Assistant tab → Speak or type commands

### Voice Commands

1. Tap the **microphone button** 🎤
2. Grant microphone permission (first time)
3. Speak your command clearly
4. Wait for AI to process and respond

**Note:** Voice recognition works best on real Android devices. Emulators may have limited microphone support.

---

## 🛠️ Development

### Project Structure

```
Invoxen/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BarChart.tsx
│   │   └── WorkingDonutChart.tsx
│   ├── screens/             # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── ClientsScreen.tsx
│   │   ├── InvoicesScreen.tsx
│   │   ├── ExpensesScreen.tsx
│   │   ├── AIAssistantScreen.tsx
│   │   └── SplashScreen.tsx
│   ├── services/            # Business logic
│   │   └── DatabaseService.ts
│   └── theme/               # Styling
│       └── theme.ts
├── android/                 # Android native code
├── App.tsx                  # Main app component
└── index.js                 # Entry point
```

### Tech Stack

- **Framework:** React Native 0.72.17
- **Language:** TypeScript
- **Database:** SQLite (react-native-sqlite-storage)
- **Voice:** @react-native-voice/voice
- **Icons:** react-native-vector-icons
- **Navigation:** @react-navigation/native

### Key Dependencies

```json
{
  "react-native": "0.72.17",
  "react-native-sqlite-storage": "^6.0.1",
  "@react-native-voice/voice": "^3.2.4",
  "react-native-vector-icons": "^10.0.0",
  "react-native-fs": "^2.20.0",
  "react-native-share": "^10.0.0"
}
```

### Database Schema

```sql
-- Clients
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT
);

-- Invoices
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  date_created TEXT NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Expenses
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  date_created TEXT NOT NULL,
  receipt_path TEXT
);
```

### Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Build release APK
cd android && ./gradlew assembleRelease

# Clean build
cd android && ./gradlew clean
```

---

## 🐛 Troubleshooting

### Voice Recognition Not Working
- **Emulator:** Voice may not work on emulators. Test on a real device.
- **Permissions:** Ensure microphone permission is granted in Settings.
- **Language:** Voice recognition uses English (US). Speak clearly.

### Build Errors
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease --no-daemon
```

### Database Issues
- App automatically creates and initializes the database on first launch
- Sample data is included for testing
- Database file: `FinancialAssistant.db`

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Invoxen** - Professional Financial Management

Created by: [@kunal-gh](https://github.com/kunal-gh)

---

## 🙏 Acknowledgments

- React Native community
- Material Design guidelines
- Open source contributors

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](../../issues)
- Submit a [Pull Request](../../pulls)

---

## 🚀 Roadmap

- [x] Professional invoice sharing
- [x] Rupee (₹) currency support
- [x] Invoxen branding
- [ ] PDF invoice generation
- [ ] Cloud sync
- [ ] Multi-currency support
- [ ] Recurring invoices
- [ ] Payment reminders
- [ ] Data export/import
- [ ] iOS version

---

<div align="center">

**Made with ❤️ using React Native**

⭐ Star this repo if you find it helpful!

</div>
