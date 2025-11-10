import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id?: number;
  client_name: string;
  amount: number;
  description: string; // Will store JSON for line items
  date_created: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  tax_rate?: number;
  notes?: string;
  line_items?: LineItem[]; // Parsed from description
}

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  category: string;
  date_created: string;
  receipt_path?: string;
}

export interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface DashboardStats {
  revenue: number;
  expenses: number;
  profit: number;
  invoices: number;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private database: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initDatabase(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: 'FinancialAssistant.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const createInvoicesTable = `
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        date_created TEXT NOT NULL,
        due_date TEXT NOT NULL,
        status TEXT DEFAULT 'pending'
      );
    `;

    const createExpensesTable = `
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date_created TEXT NOT NULL,
        receipt_path TEXT
      );
    `;

    const createClientsTable = `
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT
      );
    `;

    await this.database.executeSql(createInvoicesTable);
    await this.database.executeSql(createExpensesTable);
    await this.database.executeSql(createClientsTable);

    // Insert sample data if tables are empty
    await this.insertSampleData();
  }

  private async insertSampleData(): Promise<void> {
    if (!this.database) return;

    try {
      // Check if data already exists
      const [invoiceResult] = await this.database.executeSql('SELECT COUNT(*) as count FROM invoices');
      const invoiceCount = invoiceResult.rows.item(0).count;

      if (invoiceCount === 0) {
        // Insert sample invoices
        const sampleInvoices = [
          {
            client_name: 'Acme Corporation',
            amount: 2500.00,
            description: 'Website development and design services',
            date_created: '2024-01-15',
            due_date: '2024-02-15',
            status: 'paid'
          },
          {
            client_name: 'Tech Solutions Inc',
            amount: 1800.00,
            description: 'Mobile app consultation',
            date_created: '2024-01-20',
            due_date: '2024-02-20',
            status: 'pending'
          },
          {
            client_name: 'Digital Marketing Pro',
            amount: 3200.00,
            description: 'E-commerce platform development',
            date_created: '2024-01-25',
            due_date: '2024-02-25',
            status: 'paid'
          },
          {
            client_name: 'Global Enterprises',
            amount: 4500.00,
            description: 'Custom CRM system development',
            date_created: '2024-02-01',
            due_date: '2024-03-01',
            status: 'paid'
          },
          {
            client_name: 'StartUp Innovations',
            amount: 2200.00,
            description: 'MVP development and testing',
            date_created: '2024-02-05',
            due_date: '2024-03-05',
            status: 'pending'
          },
          {
            client_name: 'Retail Solutions LLC',
            amount: 3800.00,
            description: 'Inventory management system',
            date_created: '2024-02-10',
            due_date: '2024-03-10',
            status: 'overdue'
          },
          {
            client_name: 'Healthcare Plus',
            amount: 5200.00,
            description: 'Patient portal development',
            date_created: '2024-02-15',
            due_date: '2024-03-15',
            status: 'paid'
          },
          {
            client_name: 'Finance Corp',
            amount: 6800.00,
            description: 'Trading platform integration',
            date_created: '2024-02-20',
            due_date: '2024-03-20',
            status: 'pending'
          },
          {
            client_name: 'Education Hub',
            amount: 2900.00,
            description: 'Learning management system',
            date_created: '2024-02-25',
            due_date: '2024-03-25',
            status: 'paid'
          },
          {
            client_name: 'Travel Agency Pro',
            amount: 3400.00,
            description: 'Booking system development',
            date_created: '2024-03-01',
            due_date: '2024-04-01',
            status: 'pending'
          }
        ];

        for (const invoice of sampleInvoices) {
          await this.database.executeSql(
            'INSERT INTO invoices (client_name, amount, description, date_created, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [invoice.client_name, invoice.amount, invoice.description, invoice.date_created, invoice.due_date, invoice.status]
          );
        }

        // Insert sample expenses
        const sampleExpenses = [
          {
            description: 'Office supplies - Notebooks and pens',
            amount: 150.00,
            category: 'Office',
            date_created: '2024-01-10'
          },
          {
            description: 'Business lunch with client',
            amount: 85.50,
            category: 'Meals',
            date_created: '2024-01-12'
          },
          {
            description: 'Software subscription - Adobe Creative Suite',
            amount: 52.99,
            category: 'Software',
            date_created: '2024-01-15'
          },
          {
            description: 'Travel expenses - Client meeting',
            amount: 320.00,
            category: 'Travel',
            date_created: '2024-01-18'
          },
          {
            description: 'Office rent - January',
            amount: 1200.00,
            category: 'Utilities',
            date_created: '2024-01-20'
          },
          {
            description: 'Marketing campaign - Social media ads',
            amount: 450.00,
            category: 'Marketing',
            date_created: '2024-01-22'
          },
          {
            description: 'Conference tickets - Tech Summit 2024',
            amount: 599.00,
            category: 'Travel',
            date_created: '2024-01-25'
          },
          {
            description: 'Cloud hosting - AWS services',
            amount: 280.00,
            category: 'Software',
            date_created: '2024-02-01'
          },
          {
            description: 'Team lunch - Monthly meeting',
            amount: 125.00,
            category: 'Meals',
            date_created: '2024-02-05'
          },
          {
            description: 'Office furniture - Ergonomic chairs',
            amount: 890.00,
            category: 'Office',
            date_created: '2024-02-08'
          },
          {
            description: 'Internet and phone bills',
            amount: 180.00,
            category: 'Utilities',
            date_created: '2024-02-10'
          },
          {
            description: 'Google Ads campaign',
            amount: 650.00,
            category: 'Marketing',
            date_created: '2024-02-12'
          },
          {
            description: 'Flight to client site',
            amount: 420.00,
            category: 'Travel',
            date_created: '2024-02-15'
          },
          {
            description: 'GitHub Enterprise subscription',
            amount: 210.00,
            category: 'Software',
            date_created: '2024-02-18'
          },
          {
            description: 'Printer and supplies',
            amount: 340.00,
            category: 'Office',
            date_created: '2024-02-20'
          }
        ];

        for (const expense of sampleExpenses) {
          await this.database.executeSql(
            'INSERT INTO expenses (description, amount, category, date_created) VALUES (?, ?, ?, ?)',
            [expense.description, expense.amount, expense.category, expense.date_created]
          );
        }

        // Insert sample clients
        const sampleClients = [
          {
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1 (555) 123-4567'
          },
          {
            name: 'Tech Solutions Inc',
            email: 'info@techsolutions.com',
            phone: '+1 (555) 987-6543'
          },
          {
            name: 'Digital Marketing Pro',
            email: 'hello@digitalmarketing.com',
            phone: '+1 (555) 456-7890'
          },
          {
            name: 'Global Enterprises',
            email: 'contact@globalent.com',
            phone: '+1 (555) 234-5678'
          },
          {
            name: 'StartUp Innovations',
            email: 'team@startupinno.com',
            phone: '+1 (555) 345-6789'
          },
          {
            name: 'Retail Solutions LLC',
            email: 'sales@retailsol.com',
            phone: '+1 (555) 456-7891'
          },
          {
            name: 'Healthcare Plus',
            email: 'info@healthcareplus.com',
            phone: '+1 (555) 567-8912'
          },
          {
            name: 'Finance Corp',
            email: 'contact@financecorp.com',
            phone: '+1 (555) 678-9123'
          },
          {
            name: 'Education Hub',
            email: 'admin@eduhub.com',
            phone: '+1 (555) 789-1234'
          },
          {
            name: 'Travel Agency Pro',
            email: 'bookings@travelagency.com',
            phone: '+1 (555) 891-2345'
          }
        ];

        for (const client of sampleClients) {
          await this.database.executeSql(
            'INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)',
            [client.name, client.email, client.phone]
          );
        }

        console.log('Sample data inserted successfully');
      }
    } catch (error) {
      console.error('Error inserting sample data:', error);
    }
  }

  // Invoice methods
  public async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<number> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql(
      'INSERT INTO invoices (client_name, amount, description, date_created, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [invoice.client_name, invoice.amount, invoice.description, invoice.date_created, invoice.due_date, invoice.status]
    );

    return result.insertId;
  }

  public async getInvoices(): Promise<Invoice[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql('SELECT * FROM invoices ORDER BY date_created DESC');
    const invoices: Invoice[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      invoices.push(result.rows.item(i));
    }

    return invoices;
  }

  public async updateInvoiceStatus(id: number, status: 'pending' | 'paid' | 'overdue'): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    await this.database.executeSql('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
  }

  // Expense methods
  public async createExpense(expense: Omit<Expense, 'id'>): Promise<number> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql(
      'INSERT INTO expenses (description, amount, category, date_created, receipt_path) VALUES (?, ?, ?, ?, ?)',
      [expense.description, expense.amount, expense.category, expense.date_created, expense.receipt_path || null]
    );

    return result.insertId;
  }

  public async getExpenses(): Promise<Expense[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql('SELECT * FROM expenses ORDER BY date_created DESC');
    const expenses: Expense[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      expenses.push(result.rows.item(i));
    }

    return expenses;
  }

  public async getExpensesByCategory(): Promise<{category: string; total: number}[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql(
      'SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC'
    );

    const categories: {category: string; total: number}[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      categories.push(result.rows.item(i));
    }

    return categories;
  }

  // Client methods
  public async createClient(client: Omit<Client, 'id'>): Promise<number> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql(
      'INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [client.name, client.email, client.phone, client.address || null]
    );

    return result.insertId;
  }

  public async getClients(): Promise<Client[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql('SELECT * FROM clients ORDER BY name');
    const clients: Client[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      clients.push(result.rows.item(i));
    }

    return clients;
  }

  // Dashboard methods
  public async getDashboardStats(): Promise<DashboardStats> {
    if (!this.database) throw new Error('Database not initialized');

    // Get total revenue (paid invoices)
    const [revenueResult] = await this.database.executeSql(
      "SELECT SUM(amount) as total FROM invoices WHERE status = 'paid'"
    );
    const revenue = revenueResult.rows.item(0).total || 0;

    // Get total expenses
    const [expensesResult] = await this.database.executeSql('SELECT SUM(amount) as total FROM expenses');
    const expenses = expensesResult.rows.item(0).total || 0;

    // Get invoice count
    const [invoiceCountResult] = await this.database.executeSql('SELECT COUNT(*) as count FROM invoices');
    const invoices = invoiceCountResult.rows.item(0).count || 0;

    return {
      revenue,
      expenses,
      profit: revenue - expenses,
      invoices,
    };
  }

  public async getMonthlyRevenue(): Promise<{month: string; revenue: number}[]> {
    if (!this.database) throw new Error('Database not initialized');

    const [result] = await this.database.executeSql(`
      SELECT 
        strftime('%Y-%m', date_created) as month,
        SUM(amount) as revenue
      FROM invoices 
      WHERE status = 'paid'
      GROUP BY strftime('%Y-%m', date_created)
      ORDER BY month DESC
      LIMIT 6
    `);

    const monthlyData: {month: string; revenue: number}[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      monthlyData.push(result.rows.item(i));
    }

    return monthlyData.reverse(); // Show oldest to newest
  }

  public async closeDatabase(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
    }
  }
}