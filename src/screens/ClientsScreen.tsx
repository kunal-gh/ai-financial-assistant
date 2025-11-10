import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DatabaseService} from '../services/DatabaseService';

const ClientsScreen = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [db] = useState(() => DatabaseService.getInstance());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await db.initDatabase();
      const clientsData = await db.getClients();
      const invoicesData = await db.getInvoices();
      setClients(clientsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddClient = async () => {
    if (newClient.name && newClient.email) {
      try {
        await db.createClient({
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone || '',
        });
        setNewClient({name: '', email: '', phone: ''});
        setShowAddModal(false);
        loadData();
      } catch (error) {
        console.error('Error adding client:', error);
      }
    }
  };

  const openClientDetails = (client: any) => {
    setSelectedClient(client);
    // Filter invoices for this client
    const clientInvs = invoices.filter(inv => 
      inv.client_name.toLowerCase() === client.name.toLowerCase()
    );
    setClientInvoices(clientInvs);
    setShowDetailModal(true);
  };

  const openInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'overdue': return '#f44336';
      default: return '#999';
    }
  };

  const renderClient = ({item}: any) => {
    const clientInvCount = invoices.filter(inv => 
      inv.client_name.toLowerCase() === item.name.toLowerCase()
    ).length;

    return (
      <TouchableOpacity 
        style={styles.clientCard}
        onPress={() => openClientDetails(item)}>
        <View style={styles.clientIcon}>
          <Icon name="account-circle" size={48} color="#6200ee" />
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientDetail}>
            <Icon name="email" size={14} color="#666" /> {item.email}
          </Text>
          <Text style={styles.clientDetail}>
            <Icon name="phone" size={14} color="#666" /> {item.phone || 'N/A'}
          </Text>
          <Text style={styles.clientInvoices}>
            {clientInvCount} invoice{clientInvCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clients</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No clients yet</Text>
          </View>
        }
      />

      {/* Client Details Modal with Invoices */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Client Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {selectedClient && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.clientDetailSection}>
                  <Icon name="account-circle" size={64} color="#6200ee" />
                  <Text style={styles.clientDetailName}>{selectedClient.name}</Text>
                  <Text style={styles.clientDetailEmail}>{selectedClient.email}</Text>
                  <Text style={styles.clientDetailPhone}>{selectedClient.phone || 'No phone'}</Text>
                </View>

                <View style={styles.invoicesSection}>
                  <Text style={styles.sectionTitle}>
                    <Icon name="file-document" size={20} /> Invoices ({clientInvoices.length})
                  </Text>
                  {clientInvoices.length === 0 ? (
                    <Text style={styles.noInvoicesText}>No invoices for this client</Text>
                  ) : (
                    clientInvoices.map((invoice) => (
                      <TouchableOpacity
                        key={invoice.id}
                        style={styles.invoiceItem}
                        onPress={() => openInvoiceDetails(invoice)}>
                        <View style={styles.invoiceInfo}>
                          <Text style={styles.invoiceAmount}>{invoice.amount.toFixed(2)}</Text>
                          <Text style={styles.invoiceDesc}>{invoice.description}</Text>
                          <Text style={styles.invoiceDate}>Due: {invoice.due_date}</Text>
                        </View>
                        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(invoice.status)}]}>
                          <Text style={styles.statusText}>{invoice.status.toUpperCase()}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Professional Invoice Details Modal */}
      <Modal
        visible={showInvoiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInvoiceModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.invoiceModalContent}>
            <ScrollView>
              {selectedInvoice && (
                <View style={styles.invoiceDocument}>
                  {/* Invoice Header */}
                  <View style={styles.invoiceHeader}>
                    <View>
                      <Text style={styles.companyName}>Your Company</Text>
                      <Text style={styles.companyDetails}>123 Business St</Text>
                      <Text style={styles.companyDetails}>City, State 12345</Text>
                      <Text style={styles.companyDetails}>contact@company.com</Text>
                    </View>
                    <View style={styles.invoiceTitleSection}>
                      <Text style={styles.invoiceTitle}>INVOICE</Text>
                      <Text style={styles.invoiceNumber}>#{selectedInvoice.id}</Text>
                    </View>
                  </View>

                  {/* Bill To Section */}
                  <View style={styles.billToSection}>
                    <Text style={styles.billToLabel}>BILL TO:</Text>
                    <Text style={styles.billToName}>{selectedInvoice.client_name}</Text>
                    <Text style={styles.billToDetails}>Client Email</Text>
                  </View>

                  {/* Invoice Info */}
                  <View style={styles.invoiceInfoSection}>
                    <View style={styles.invoiceInfoRow}>
                      <Text style={styles.invoiceInfoLabel}>Invoice Date:</Text>
                      <Text style={styles.invoiceInfoValue}>{selectedInvoice.date_created}</Text>
                    </View>
                    <View style={styles.invoiceInfoRow}>
                      <Text style={styles.invoiceInfoLabel}>Due Date:</Text>
                      <Text style={styles.invoiceInfoValue}>{selectedInvoice.due_date}</Text>
                    </View>
                    <View style={styles.invoiceInfoRow}>
                      <Text style={styles.invoiceInfoLabel}>Status:</Text>
                      <View style={[styles.statusBadge, {backgroundColor: getStatusColor(selectedInvoice.status)}]}>
                        <Text style={styles.statusText}>{selectedInvoice.status.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Line Items */}
                  <View style={styles.lineItemsSection}>
                    <View style={styles.lineItemsHeader}>
                      <Text style={[styles.lineItemHeaderText, {flex: 2}]}>Description</Text>
                      <Text style={[styles.lineItemHeaderText, {flex: 1, textAlign: 'right'}]}>Amount</Text>
                    </View>
                    <View style={styles.lineItem}>
                      <Text style={[styles.lineItemText, {flex: 2}]}>{selectedInvoice.description}</Text>
                      <Text style={[styles.lineItemText, {flex: 1, textAlign: 'right'}]}>{selectedInvoice.amount.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* Totals */}
                  <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Subtotal:</Text>
                      <Text style={styles.totalValue}>{selectedInvoice.amount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Tax (0%):</Text>
                      <Text style={styles.totalValue}>0.00</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotalRow]}>
                      <Text style={styles.grandTotalLabel}>TOTAL:</Text>
                      <Text style={styles.grandTotalValue}>{selectedInvoice.amount.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.invoiceFooter}>
                    <Text style={styles.footerText}>Thank you for your business!</Text>
                    <Text style={styles.footerNote}>Payment is due by {selectedInvoice.due_date}</Text>
                  </View>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeInvoiceButton}
              onPress={() => setShowInvoiceModal(false)}>
              <Text style={styles.closeInvoiceButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Client Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Client</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Client Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter client name"
                value={newClient.name}
                onChangeText={(text) => setNewClient({...newClient, name: text})}
              />
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                keyboardType="email-address"
                value={newClient.email}
                onChangeText={(text) => setNewClient({...newClient, email: text})}
              />
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={newClient.phone}
                onChangeText={(text) => setNewClient({...newClient, phone: text})}
              />
              <TouchableOpacity 
                style={styles.addClientButton}
                onPress={handleAddClient}>
                <Text style={styles.addClientButtonText}>Add Client</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200ee',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientIcon: {
    marginRight: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clientDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  clientInvoices: {
    fontSize: 12,
    color: '#6200ee',
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  clientDetailSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  clientDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  clientDetailEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  clientDetailPhone: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  invoicesSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  noInvoicesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  invoiceItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  invoiceDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  invoiceDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addClientButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addClientButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Professional Invoice Styles
  invoiceModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  invoiceDocument: {
    backgroundColor: '#fff',
    padding: 24,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  invoiceTitleSection: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  invoiceNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  billToSection: {
    marginBottom: 24,
  },
  billToLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  billToName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  billToDetails: {
    fontSize: 14,
    color: '#666',
  },
  invoiceInfoSection: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  invoiceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  invoiceInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  lineItemsSection: {
    marginBottom: 24,
  },
  lineItemsHeader: {
    flexDirection: 'row',
    backgroundColor: '#6200ee',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lineItemHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  lineItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  lineItemText: {
    fontSize: 14,
    color: '#333',
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 200,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  grandTotalRow: {
    borderTopWidth: 2,
    borderTopColor: '#333',
    paddingTop: 12,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  invoiceFooter: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  footerNote: {
    fontSize: 12,
    color: '#666',
  },
  closeInvoiceButton: {
    backgroundColor: '#6200ee',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeInvoiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClientsScreen;

