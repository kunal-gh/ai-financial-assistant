# 💰 AI Financial Assistant (Invoxen)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Android-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.72.17-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**A modern, AI-powered financial management app for Android**

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Usage](#-usage) • [Development](#-development)

</div>

---

## 📱 About

AI Financial Assistant (Invoxen) is a comprehensive financial management application built with React Native. It helps you manage clients, invoices, expenses, and provides an intelligent AI assistant with voice control for hands-free operation.

### ✨ Key Highlights

- 🤖 **AI-Powered Automation** - Natural language processing for task automation
- 🎤 **Voice Control** - Hands-free operation with voice commands
- 📊 **Visual Analytics** - Beautiful charts and graphs for financial insights
- 💾 **Local Database** - SQLite for fast, offline-first data storage
- 🎨 **Modern UI** - Dark Material Design 3 theme
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
- Professional invoice layout
- Share invoices via email/messaging
- Automatic calculations (subtotal, tax, total)

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

1. Download the latest APK from [Releases](../../releases)
2. Transfer to your Android device
3. Enable "Install from Unknown Sources" in Settings
4. Install the APK
5. Grant microphone permission for voice features

### Option 2: Build from Source (For Developers)

#### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Android Studio
- JDK 11
- Android SDK (API 34)

#### Steps

```bash
# Clone the repository
git clone https://github.com/kunal-gh/ai-financial-assistant.git
cd ai-financial-assistant

# Install dependencies
npm install

# Start Metro bundler
npm start

# Build and run on Android
npm run android
```

#### Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎮 Usage

### Getting Started

1. **Launch the app** - See the "Created by SW" splash screen
2. **Explore Dashboard** - View your financial overview
3. **Add Clients** - Tap Clients tab → ➕ button
4. **Create Invoices** - Tap Invoices tab → ➕ button
5. **Track Expenses** - Tap Expenses tab → ➕ button
6. **Use AI Assistant** - Tap AI Assistant tab → Speak or type commands

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
  "react-native-vector-icons": "^10.0.3",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11"
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

**Created by SW**

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

- [ ] Cloud sync
- [ ] PDF invoice generation
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
