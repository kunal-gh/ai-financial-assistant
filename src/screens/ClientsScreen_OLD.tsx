import React, {useState} from 'react';
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

const ClientsScreen = () => {
  const [clients, setClients] = useState([
    {id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', company: 'Tech Corp', address: '123 Main St'},
    {id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', company: 'Design Studio', address: '456 Oak Ave'},
    {id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', company: 'Marketing Inc', address: '789 Pine Rd'},
    {id: '4', name: 'Alice Williams', email: 'alice@example.com', phone: '+1234567893', company: 'Finance Group', address: '321 Elm St'},
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleAddClient = () => {
    if (newClient.name && newClient.email) {
      const client = {
        id: String(clients.length + 1),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone || 'N/A',
        company: 'N/A',
        address: 'N/A',
      };
      setClients([...clients, client]);
      setNewClient({name: '', email: '', phone: ''});
      setShowAddModal(false);
    }
  };

  const openClientDetails = (client: any) => {
    setSelectedClient(client);
    setShowDetailModal(true);
  };

  const renderClient = ({item}: any) => (
    <TouchableOpacity 
      style={styles.clientCard}
      onPress={() => openClientDetails(item)}>
      <View style={styles.clientIcon}>
        <Icon name="account" size={32} color="#2c3e50" />
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientDetail}>
          <Icon name="email" size={14} /> {item.email}
        </Text>
        <Text style={styles.clientDetail}>
          <Icon name="phone" size={14} /> {item.phone}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#6b7c8d" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Client Details Modal */}
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
                <Icon name="close" size={24} color="#1a2332" />
              </TouchableOpacity>
            </View>
            {selectedClient && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>{selectedClient.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedClient.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedClient.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Company</Text>
                  <Text style={styles.detailValue}>{selectedClient.company || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>{selectedClient.address || 'N/A'}</Text>
                </View>
              </ScrollView>
            )}
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
                <Icon name="close" size={24} color="#1a2332" />
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
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8eef3',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f0f4f8',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#2c3e50',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#7c9cbf',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  list: {
    padding: 16,
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  clientIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#e8eef3',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  clientDetail: {
    fontSize: 14,
    color: '#5a6c7d',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 35, 50, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
    borderBottomWidth: 2,
    borderBottomColor: '#e8ecf1',
    backgroundColor: '#f8f9fb',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a2332',
    letterSpacing: 0.3,
  },
  modalBody: {
    padding: 22,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3d4f5f',
    marginBottom: 10,
    marginTop: 14,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#f8f9fb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a2332',
    borderWidth: 2,
    borderColor: '#d0d8e0',
  },
  addClientButton: {
    backgroundColor: '#2c3e50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addClientButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf1',
  },
  detailLabel: {
    fontSize: 15,
    color: '#6b7c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2332',
    maxWidth: '60%',
    textAlign: 'right',
  },
});

export default ClientsScreen;
