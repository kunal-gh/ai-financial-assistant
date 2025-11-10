# API Documentation

## DatabaseService

The `DatabaseService` class handles all database operations using SQLite.

### Initialization

```typescript
const db = DatabaseService.getInstance();
await db.initDatabase();
```

### Client Methods

#### createClient
```typescript
await db.createClient({
  name: string,
  email: string,
  phone?: string
});
```

#### getClients
```typescript
const clients = await db.getClients();
// Returns: Array<{id, name, email, phone, address}>
```

### Invoice Methods

#### createInvoice
```typescript
await db.createInvoice({
  client_name: string,
  amount: number,
  description: string,
  date_created: string,  // YYYY-MM-DD
  due_date: string,      // YYYY-MM-DD
  status: 'pending' | 'paid' | 'overdue'
});
```

#### getInvoices
```typescript
const invoices = await db.getInvoices();
// Returns: Array<{id, client_name, amount, description, date_created, due_date, status}>
```

#### updateInvoiceStatus
```typescript
await db.updateInvoiceStatus(invoiceId: number, status: string);
```

### Expense Methods

#### createExpense
```typescript
await db.createExpense({
  description: string,
  amount: number,
  category: string,
  date_created: string  // YYYY-MM-DD
});
```

#### getExpenses
```typescript
const expenses = await db.getExpenses();
// Returns: Array<{id, description, amount, category, date_created}>
```

#### getExpensesByCategory
```typescript
const categoryData = await db.getExpensesByCategory();
// Returns: Array<{category, total}>
```

### Dashboard Methods

#### getDashboardStats
```typescript
const stats = await db.getDashboardStats();
// Returns: {
//   totalRevenue: number,
//   totalExpenses: number,
//   profit: number,
//   invoiceCount: number
// }
```

#### getMonthlyRevenue
```typescript
const revenue = await db.getMonthlyRevenue();
// Returns: Array<{month, revenue}>
```

---

## AI Assistant Commands

### View Commands

```typescript
"Show my revenue"      // Display total revenue
"Show invoices"        // List all invoices
"Show clients"         // List all clients
"Show expenses"        // List all expenses
"Show profit"          // Display profit calculation
```

### Create Commands

```typescript
// Add Client
"Add client [name] email [email] phone [phone]"
"Create client [name] email [email]"

// Create Invoice
"Create invoice for [client] ₹[amount] for [description]"
"Add invoice for [client] ₹[amount]"

// Add Expense
"Add expense ₹[amount] for [description] category [category]"
"Create expense ₹[amount] for [description]"
```

### Update Commands

```typescript
// Update Invoice Status
"Mark invoice #[id] as paid"
"Update invoice #[id] to overdue"
"Set invoice #[id] to pending"
```

### Help Command

```typescript
"help"                 // Show all available commands
"what can you do"      // Show capabilities
```

---

## Voice Recognition

### Setup

```typescript
import Voice from '@react-native-voice/voice';

// Initialize
Voice.onSpeechResults = (e) => {
  const text = e.value[0];
  // Process voice input
};

// Start listening
await Voice.start('en-US');

// Stop listening
await Voice.stop();
```

### Permissions

```typescript
import {PermissionsAndroid} from 'react-native';

const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
);
```

---

## Navigation

### Navigate Between Screens

```typescript
// From Dashboard
onNavigate('Clients');
onNavigate('Invoices');
onNavigate('Expenses');
onNavigate('AI Assistant');

// Using Tab Navigation
setActiveTab('Dashboard');
setActiveTab('Clients');
// etc.
```

---

## Theme

### Colors

```typescript
const theme = {
  primary: '#6200ee',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336'
};
```

### Usage

```typescript
import {theme} from './src/theme/theme';

<View style={{backgroundColor: theme.background}}>
  <Text style={{color: theme.text}}>Hello</Text>
</View>
```
