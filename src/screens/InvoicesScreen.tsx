import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DatabaseService, LineItem} from '../services/DatabaseService';

const InvoicesScreen = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [db] = useState(() => DatabaseService.getInstance());

  // Form state
  const [selectedClient, setSelectedClient] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {description: '', quantity: 1, rate: 0, amount: 0}
  ]);
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    loadData();
    // Set default due date to 30 days from now
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setDueDate(date.toISOString().split('T')[0]);
  }, []);

  const loadData = async () => {
    try {
      await db.initDatabase();
      const invoicesData = await db.getInvoices();
      const clientsData = await db.getClients();
      
      // Parse line items from description
      const parsedInvoices = invoicesData.map(inv => {
        try {
          const parsed = JSON.parse(inv.description);
          if (parsed.line_items) {
            return {...inv, line_items: parsed.line_items, notes: parsed.notes, tax_rate: parsed.tax_rate};
          }
        } catch (e) {
          // Old format, keep as is
        }
        return inv;
      });
      
      setInvoices(parsedInvoices);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {description: '', quantity: 1, rate: 0, amount: 0}]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = {...updated[index], [field]: value};
    
    // Calculate amount
    if (field === 'quantity' || field === 'rate') {
      updated[index].amount = updated[index].quantity * updated[index].rate;
    }
    
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (parseFloat(taxRate) / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCreateInvoice = async () => {
    if (!selectedClient || lineItems.length === 0 || lineItems[0].description === '') {
      Alert.alert('Error', 'Please fill in client and at least one line item');
      return;
    }

    try {
      const invoiceData = {
        line_items: lineItems,
        notes: notes,
        tax_rate: parseFloat(taxRate),
      };

      await db.createInvoice({
        client_name: selectedClient,
        amount: calculateTotal(),
        description: JSON.stringify(invoiceData),
        date_created: new Date().toISOString().split('T')[0],
        due_date: dueDate,
        status: 'pending',
      });

      // Reset form
      setSelectedClient('');
      setLineItems([{description: '', quantity: 1, rate: 0, amount: 0}]);
      setTaxRate('0');
      setNotes('');
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Error creating invoice:', error);
      Alert.alert('Error', 'Failed to create invoice');
    }
  };

  const handleShareInvoice = async () => {
    if (!selectedInvoice) return;

    const subtotal = selectedInvoice.line_items 
      ? selectedInvoice.line_items.reduce((sum: number, item: LineItem) => sum + item.amount, 0)
      : selectedInvoice.amount;
    
    const tax = selectedInvoice.tax_rate ? subtotal * (selectedInvoice.tax_rate / 100) : 0;
    const total = subtotal + tax;

    // Generate line items HTML
    let lineItemsHTML = '';
    if (selectedInvoice.line_items) {
      selectedInvoice.line_items.forEach((item: LineItem, index: number) => {
        lineItemsHTML += `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.description}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.rate.toFixed(2)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold;">₹${item.amount.toFixed(2)}</td>
          </tr>
        `;
      });
    } else {
      lineItemsHTML = `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${selectedInvoice.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">1</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${selectedInvoice.amount.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold;">₹${selectedInvoice.amount.toFixed(2)}</td>
        </tr>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 40px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #6200ee;
          }
          .company-info {
            flex: 1;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
          }
          .company-details {
            font-size: 12px;
            color: #666;
            line-height: 1.6;
          }
          .invoice-title-section {
            text-align: right;
          }
          .invoice-title {
            font-size: 36px;
            font-weight: bold;
            color: #6200ee;
            margin: 0;
          }
          .invoice-number {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          .bill-to {
            margin-bottom: 30px;
          }
          .bill-to-label {
            font-size: 12px;
            font-weight: bold;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .bill-to-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
          .invoice-info {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .info-label {
            font-size: 14px;
            color: #666;
          }
          .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            color: white;
            background: #3d5a80;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          thead {
            background: #6200ee;
            color: white;
          }
          th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          th:nth-child(2), th:nth-child(3), th:nth-child(4) {
            text-align: right;
          }
          td {
            font-size: 13px;
          }
          .totals {
            text-align: right;
            margin-bottom: 30px;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
          }
          .total-label {
            width: 150px;
            font-size: 14px;
            color: #666;
            text-align: right;
            margin-right: 20px;
          }
          .total-value {
            width: 120px;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            text-align: right;
          }
          .grand-total {
            border-top: 2px solid #333;
            padding-top: 12px;
            margin-top: 12px;
          }
          .grand-total .total-label {
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }
          .grand-total .total-value {
            font-size: 18px;
            font-weight: bold;
            color: #6200ee;
          }
          .notes {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .notes-label {
            font-size: 12px;
            font-weight: bold;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .notes-text {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
          }
          .footer {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-info">
              <div class="company-name">Your Company</div>
              <div class="company-details">
                123 Business Street<br>
                City, State 12345<br>
                Phone: (123) 456-7890<br>
                Email: info@yourcompany.com
              </div>
            </div>
            <div class="invoice-title-section">
              <h1 class="invoice-title">INVOICE</h1>
              <div class="invoice-number">#${selectedInvoice.id}</div>
            </div>
          </div>

          <div class="bill-to">
            <div class="bill-to-label">Bill To:</div>
            <div class="bill-to-name">${selectedInvoice.client_name}</div>
          </div>

          <div class="invoice-info">
            <div class="info-row">
              <span class="info-label">Invoice Date:</span>
              <span class="info-value">${selectedInvoice.date_created}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Due Date:</span>
              <span class="info-value">${selectedInvoice.due_date}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-badge">${selectedInvoice.status.toUpperCase()}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHTML}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <div class="total-label">Subtotal:</div>
              <div class="total-value">₹${subtotal.toFixed(2)}</div>
            </div>
            ${tax > 0 ? `
            <div class="total-row">
              <div class="total-label">Tax (${selectedInvoice.tax_rate}%):</div>
              <div class="total-value">₹${tax.toFixed(2)}</div>
            </div>
            ` : ''}
            <div class="total-row grand-total">
              <div class="total-label">TOTAL:</div>
              <div class="total-value">₹${total.toFixed(2)}</div>
            </div>
          </div>

          ${selectedInvoice.notes ? `
          <div class="notes">
            <div class="notes-label">Notes:</div>
            <div class="notes-text">${selectedInvoice.notes}</div>
          </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
              This is a computer-generated invoice. No signature required.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // Create a nicely formatted text invoice
      let textInvoice = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      textInvoice += `           INVOICE #${selectedInvoice.id}\n`;
      textInvoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      textInvoice += `FROM:\n`;
      textInvoice += `Your Company\n`;
      textInvoice += `123 Business Street\n`;
      textInvoice += `City, State 12345\n\n`;
      
      textInvoice += `BILL TO:\n`;
      textInvoice += `${selectedInvoice.client_name}\n\n`;
      
      textInvoice += `Invoice Date: ${selectedInvoice.date_created}\n`;
      textInvoice += `Due Date: ${selectedInvoice.due_date}\n`;
      textInvoice += `Status: ${selectedInvoice.status.toUpperCase()}\n\n`;
      
      textInvoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      textInvoice += `ITEMS:\n`;
      textInvoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      if (selectedInvoice.line_items) {
        selectedInvoice.line_items.forEach((item: LineItem, index: number) => {
          textInvoice += `${index + 1}. ${item.description}\n`;
          textInvoice += `   Qty: ${item.quantity} × ₹${item.rate.toFixed(2)} = ₹${item.amount.toFixed(2)}\n\n`;
        });
      } else {
        textInvoice += `1. ${selectedInvoice.description}\n`;
        textInvoice += `   Amount: ₹${selectedInvoice.amount.toFixed(2)}\n\n`;
      }
      
      textInvoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      textInvoice += `Subtotal:        ₹${subtotal.toFixed(2)}\n`;
      
      if (tax > 0) {
        textInvoice += `Tax (${selectedInvoice.tax_rate}%):       ₹${tax.toFixed(2)}\n`;
      }
      
      textInvoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      textInvoice += `TOTAL:           ₹${total.toFixed(2)}\n`;
      textInvoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      if (selectedInvoice.notes) {
        textInvoice += `Notes:\n${selectedInvoice.notes}\n\n`;
      }
      
      textInvoice += `Thank you for your business!\n`;
      textInvoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      // Use React Native's built-in Share API
      await Share.share({
        message: textInvoice,
        title: `Invoice #${selectedInvoice.id} - ${selectedInvoice.client_name}`,
      });
    } catch (error: any) {
      console.error('Error sharing invoice:', error);
      if (error.message !== 'User did not share') {
        Alert.alert(
          'Error', 
          `Failed to share invoice. ${error.message || 'Please try again.'}`
        );
      }
    }
  };

  const updateInvoiceStatus = async (newStatus: 'paid' | 'pending' | 'overdue') => {
    if (!selectedInvoice) return;

    try {
      await db.updateInvoiceStatus(selectedInvoice.id, newStatus);
      setSelectedInvoice({...selectedInvoice, status: newStatus});
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#3d5a80'; // Steel blue - professional paid status
      case 'pending': return '#5a7a9e'; // Slate blue - neutral pending
      case 'overdue': return '#2c3e50'; // Dark slate - serious overdue
      default: return '#6b8caf'; // Light slate - default
    }
  };

  const renderInvoice = ({item}: any) => (
    <TouchableOpacity 
      style={styles.invoiceCard}
      onPress={() => {
        setSelectedInvoice(item);
        setShowDetailModal(true);
      }}>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceNumber}>Invoice #{item.id}</Text>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.clientName}>{item.client_name}</Text>
      <View style={styles.invoiceFooter}>
        <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
        <Text style={styles.date}>Due: {item.due_date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invoices</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderInvoice}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No invoices yet</Text>
          </View>
        }
      />

      {/* Create Invoice Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.createModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Invoice</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Client Selection */}
              <Text style={styles.inputLabel}>Client *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientChips}>
                {clients.map((client) => (
                  <TouchableOpacity
                    key={client.id}
                    style={[
                      styles.clientChip,
                      selectedClient === client.name && styles.clientChipSelected
                    ]}
                    onPress={() => setSelectedClient(client.name)}>
                    <Text style={[
                      styles.clientChipText,
                      selectedClient === client.name && styles.clientChipTextSelected
                    ]}>
                      {client.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Line Items */}
              <Text style={styles.sectionTitle}>Line Items</Text>
              {lineItems.map((item, index) => (
                <View key={index} style={styles.lineItemCard}>
                  <View style={styles.lineItemHeader}>
                    <Text style={styles.lineItemNumber}>Item {index + 1}</Text>
                    {lineItems.length > 1 && (
                      <TouchableOpacity onPress={() => removeLineItem(index)}>
                        <Icon name="delete" size={20} color="#f44336" />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={item.description}
                    onChangeText={(text) => updateLineItem(index, 'description', text)}
                  />
                  
                  <View style={styles.lineItemRow}>
                    <View style={styles.lineItemCol}>
                      <Text style={styles.inputLabel}>Qty</Text>
                      <TextInput
                        style={styles.inputSmall}
                        placeholder="1"
                        keyboardType="numeric"
                        value={item.quantity.toString()}
                        onChangeText={(text) => updateLineItem(index, 'quantity', parseFloat(text) || 0)}
                      />
                    </View>
                    <View style={styles.lineItemCol}>
                      <Text style={styles.inputLabel}>Rate</Text>
                      <TextInput
                        style={styles.inputSmall}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={item.rate.toString()}
                        onChangeText={(text) => updateLineItem(index, 'rate', parseFloat(text) || 0)}
                      />
                    </View>
                    <View style={styles.lineItemCol}>
                      <Text style={styles.inputLabel}>Amount</Text>
                      <Text style={styles.amountText}>₹{item.amount.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addLineButton} onPress={addLineItem}>
                <Icon name="plus-circle" size={20} color="#6200ee" />
                <Text style={styles.addLineText}>Add Line Item</Text>
              </TouchableOpacity>

              {/* Calculations */}
              <View style={styles.calculationsCard}>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Subtotal:</Text>
                  <Text style={styles.calcValue}>₹{calculateSubtotal().toFixed(2)}</Text>
                </View>
                
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Tax Rate (%):</Text>
                  <TextInput
                    style={styles.taxInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={taxRate}
                    onChangeText={setTaxRate}
                  />
                </View>
                
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Tax:</Text>
                  <Text style={styles.calcValue}>₹{calculateTax().toFixed(2)}</Text>
                </View>
                
                <View style={[styles.calcRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>TOTAL:</Text>
                  <Text style={styles.totalValue}>₹{calculateTotal().toFixed(2)}</Text>
                </View>
              </View>

              {/* Due Date */}
              <Text style={styles.inputLabel}>Due Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
              />

              {/* Notes */}
              <Text style={styles.inputLabel}>Notes / Terms</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Payment terms, notes, etc."
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity style={styles.createButton} onPress={handleCreateInvoice}>
                <Text style={styles.createButtonText}>Create Invoice</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            <ScrollView>
              {selectedInvoice && (
                <View style={styles.invoiceDocument}>
                  {/* Header */}
                  <View style={styles.docHeader}>
                    <View>
                      <Text style={styles.companyName}>Your Company</Text>
                      <Text style={styles.companyDetails}>123 Business St</Text>
                      <Text style={styles.companyDetails}>City, State 12345</Text>
                    </View>
                    <View style={styles.invoiceTitleSection}>
                      <Text style={styles.invoiceTitle}>INVOICE</Text>
                      <Text style={styles.invoiceNum}>#{selectedInvoice.id}</Text>
                    </View>
                  </View>

                  {/* Bill To */}
                  <View style={styles.billToSection}>
                    <Text style={styles.billToLabel}>BILL TO:</Text>
                    <Text style={styles.billToName}>{selectedInvoice.client_name}</Text>
                  </View>

                  {/* Invoice Info */}
                  <View style={styles.invoiceInfoSection}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Date:</Text>
                      <Text style={styles.infoValue}>{selectedInvoice.date_created}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Due Date:</Text>
                      <Text style={styles.infoValue}>{selectedInvoice.due_date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Status:</Text>
                      <View style={[styles.statusBadge, {backgroundColor: getStatusColor(selectedInvoice.status)}]}>
                        <Text style={styles.statusText}>{selectedInvoice.status.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Line Items */}
                  <View style={styles.lineItemsTable}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {flex: 2}]}>Description</Text>
                      <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'center'}]}>Qty</Text>
                      <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'right'}]}>Rate</Text>
                      <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'right'}]}>Amount</Text>
                    </View>
                    {selectedInvoice.line_items ? (
                      selectedInvoice.line_items.map((item: LineItem, index: number) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, {flex: 2}]}>{item.description}</Text>
                          <Text style={[styles.tableCell, {flex: 1, textAlign: 'center'}]}>{item.quantity}</Text>
                          <Text style={[styles.tableCell, {flex: 1, textAlign: 'right'}]}>₹{item.rate.toFixed(2)}</Text>
                          <Text style={[styles.tableCell, {flex: 1, textAlign: 'right'}]}>₹{item.amount.toFixed(2)}</Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, {flex: 2}]}>{selectedInvoice.description}</Text>
                        <Text style={[styles.tableCell, {flex: 1, textAlign: 'center'}]}>1</Text>
                        <Text style={[styles.tableCell, {flex: 1, textAlign: 'right'}]}>₹{selectedInvoice.amount.toFixed(2)}</Text>
                        <Text style={[styles.tableCell, {flex: 1, textAlign: 'right'}]}>₹{selectedInvoice.amount.toFixed(2)}</Text>
                      </View>
                    )}
                  </View>

                  {/* Totals */}
                  <View style={styles.totalsSection}>
                    <View style={styles.totalRow2}>
                      <Text style={styles.totalLabel2}>Subtotal:</Text>
                      <Text style={styles.totalValue2}>
                        ₹{(selectedInvoice.line_items 
                          ? selectedInvoice.line_items.reduce((sum: number, item: LineItem) => sum + item.amount, 0)
                          : selectedInvoice.amount
                        ).toFixed(2)}
                      </Text>
                    </View>
                    {selectedInvoice.tax_rate > 0 && (
                      <View style={styles.totalRow2}>
                        <Text style={styles.totalLabel2}>Tax ({selectedInvoice.tax_rate}%):</Text>
                        <Text style={styles.totalValue2}>
                          ₹{((selectedInvoice.line_items 
                            ? selectedInvoice.line_items.reduce((sum: number, item: LineItem) => sum + item.amount, 0)
                            : selectedInvoice.amount
                          ) * (selectedInvoice.tax_rate / 100)).toFixed(2)}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.totalRow2, styles.grandTotal]}>
                      <Text style={styles.grandTotalLabel}>TOTAL:</Text>
                      <Text style={styles.grandTotalValue}>₹{selectedInvoice.amount.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* Notes */}
                  {selectedInvoice.notes && (
                    <View style={styles.notesSection}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{selectedInvoice.notes}</Text>
                    </View>
                  )}

                  {/* Footer */}
                  <View style={styles.docFooter}>
                    <Text style={styles.footerText}>Thank you for your business!</Text>
                  </View>

                  {/* Status Change Buttons */}
                  <View style={styles.statusButtons}>
                    <TouchableOpacity 
                      style={[styles.statusButton, {backgroundColor: '#3d5a80'}]}
                      onPress={() => updateInvoiceStatus('paid')}>
                      <Text style={styles.statusButtonText}>Mark Paid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.statusButton, {backgroundColor: '#5a7a9e'}]}
                      onPress={() => updateInvoiceStatus('pending')}>
                      <Text style={styles.statusButtonText}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.statusButton, {backgroundColor: '#2c3e50'}]}
                      onPress={() => updateInvoiceStatus('overdue')}>
                      <Text style={styles.statusButtonText}>Overdue</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareInvoice}>
                <Icon name="share-variant" size={20} color="#fff" />
                <Text style={styles.shareButtonText}>Share Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDetailModal(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0'},
  headerTitle: {fontSize: 24, fontWeight: 'bold', color: '#333'},
  addButton: {backgroundColor: '#6200ee', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center'},
  list: {padding: 16},
  invoiceCard: {backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3},
  invoiceHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  invoiceNumber: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  statusBadge: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12},
  statusText: {color: '#fff', fontSize: 11, fontWeight: 'bold'},
  clientName: {fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8},
  invoiceFooter: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  amount: {fontSize: 20, fontWeight: 'bold', color: '#6200ee'},
  date: {fontSize: 14, color: '#666'},
  emptyContainer: {alignItems: 'center', justifyContent: 'center', paddingVertical: 60},
  emptyText: {fontSize: 16, color: '#999', marginTop: 16},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'},
  createModalContent: {backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%'},
  detailModalContent: {backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '95%'},
  modalHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'},
  modalTitle: {fontSize: 20, fontWeight: 'bold', color: '#333'},
  modalBody: {padding: 20},
  inputLabel: {fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12},
  input: {backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 12},
  textArea: {height: 80, textAlignVertical: 'top'},
  clientChips: {marginBottom: 16},
  clientChip: {backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8, borderWidth: 2, borderColor: 'transparent'},
  clientChipSelected: {backgroundColor: '#e8d5ff', borderColor: '#6200ee'},
  clientChipText: {fontSize: 14, color: '#666'},
  clientChipTextSelected: {color: '#6200ee', fontWeight: 'bold'},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 12},
  lineItemCard: {backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e0e0e0'},
  lineItemHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  lineItemNumber: {fontSize: 14, fontWeight: 'bold', color: '#666'},
  lineItemRow: {flexDirection: 'row', justifyContent: 'space-between', gap: 8},
  lineItemCol: {flex: 1},
  inputSmall: {backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 14, borderWidth: 1, borderColor: '#e0e0e0'},
  amountText: {fontSize: 16, fontWeight: 'bold', color: '#6200ee', paddingVertical: 10},
  addLineButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#f0e6ff', borderRadius: 8, marginTop: 8},
  addLineText: {fontSize: 14, fontWeight: '600', color: '#6200ee', marginLeft: 8},
  calculationsCard: {backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16, marginTop: 20, borderWidth: 1, borderColor: '#e0e0e0'},
  calcRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  calcLabel: {fontSize: 14, color: '#666'},
  calcValue: {fontSize: 14, fontWeight: '600', color: '#333'},
  taxInput: {width: 80, backgroundColor: '#fff', borderRadius: 8, padding: 8, fontSize: 14, borderWidth: 1, borderColor: '#e0e0e0', textAlign: 'right'},
  totalRow: {borderTopWidth: 2, borderTopColor: '#333', paddingTop: 12, marginTop: 8},
  totalLabel: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  totalValue: {fontSize: 18, fontWeight: 'bold', color: '#6200ee'},
  createButton: {backgroundColor: '#6200ee', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 20, marginBottom: 20},
  createButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  invoiceDocument: {padding: 24},
  docHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: '#6200ee'},
  companyName: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  companyDetails: {fontSize: 12, color: '#666', marginTop: 2},
  invoiceTitleSection: {alignItems: 'flex-end'},
  invoiceTitle: {fontSize: 28, fontWeight: 'bold', color: '#6200ee'},
  invoiceNum: {fontSize: 14, color: '#666', marginTop: 4},
  billToSection: {marginBottom: 20},
  billToLabel: {fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 4},
  billToName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  invoiceInfoSection: {backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 20},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6},
  infoLabel: {fontSize: 14, color: '#666'},
  infoValue: {fontSize: 14, fontWeight: '600', color: '#333'},
  lineItemsTable: {marginBottom: 20},
  tableHeader: {flexDirection: 'row', backgroundColor: '#6200ee', padding: 10, borderTopLeftRadius: 8, borderTopRightRadius: 8},
  tableHeaderText: {color: '#fff', fontWeight: 'bold', fontSize: 12},
  tableRow: {flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'},
  tableCell: {fontSize: 13, color: '#333'},
  totalsSection: {alignItems: 'flex-end', marginBottom: 20},
  totalRow2: {flexDirection: 'row', justifyContent: 'space-between', minWidth: 200, marginBottom: 6},
  totalLabel2: {fontSize: 14, color: '#666'},
  totalValue2: {fontSize: 14, fontWeight: '600', color: '#333'},
  grandTotal: {borderTopWidth: 2, borderTopColor: '#333', paddingTop: 8, marginTop: 8},
  grandTotalLabel: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  grandTotalValue: {fontSize: 16, fontWeight: 'bold', color: '#6200ee'},
  notesSection: {backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 20},
  notesLabel: {fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 4},
  notesText: {fontSize: 14, color: '#666'},
  docFooter: {alignItems: 'center', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0', marginBottom: 20},
  footerText: {fontSize: 14, fontWeight: '600', color: '#333'},
  statusButtons: {flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 16},
  statusButton: {flex: 1, padding: 12, borderRadius: 8, alignItems: 'center'},
  statusButtonText: {color: '#fff', fontSize: 13, fontWeight: 'bold'},
  actionButtons: {flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0'},
  shareButton: {flex: 1, flexDirection: 'row', backgroundColor: '#6200ee', padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8},
  shareButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  closeButton: {flex: 1, backgroundColor: '#f0f0f0', padding: 16, borderRadius: 8, alignItems: 'center'},
  closeButtonText: {color: '#333', fontSize: 16, fontWeight: 'bold'},
});

export default InvoicesScreen;

