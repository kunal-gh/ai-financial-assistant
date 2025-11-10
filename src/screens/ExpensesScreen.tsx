import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState([
    {id: '1', category: 'Office Supplies', amount: 450, date: '2024-01-15', icon: 'office-building', description: 'Printer paper and supplies'},
    {id: '2', category: 'Software', amount: 299, date: '2024-01-18', icon: 'laptop', description: 'Adobe Creative Cloud subscription'},
    {id: '3', category: 'Travel', amount: 1200, date: '2024-01-10', icon: 'airplane', description: 'Client meeting in NYC'},
    {id: '4', category: 'Marketing', amount: 850, date: '2024-01-20', icon: 'bullhorn', description: 'Facebook ads campaign'},
    {id: '5', category: 'Utilities', amount: 320, date: '2024-01-22', icon: 'flash', description: 'Office electricity bill'},
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
  });

  const categoryIcons: {[key: string]: string} = {
    'Office Supplies': 'office-building',
    'Software': 'laptop',
    'Travel': 'airplane',
    'Marketing': 'bullhorn',
    'Utilities': 'flash',
    'Other': 'cash',
  };

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount) {
      const expense = {
        id: String(expenses.length + 1),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0],
        icon: categoryIcons[newExpense.category] || 'cash',
        description: newExpense.description || 'No description',
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({category: '', amount: '', description: ''});
      setShowAddModal(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const openExpenseDetails = (expense: any) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  const renderExpense = ({item}: any) => (
    <TouchableOpacity 
      style={styles.expenseCard}
      onPress={() => openExpenseDetails(item)}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={28} color="#2c3e50" />
      </View>
      <View style={styles.expenseInfo}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.amount}>-₹{item.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Expenses</Text>
          <Text style={styles.totalLabel}>Total This Month</Text>
          <Text style={styles.totalAmount}>₹{totalExpenses.toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Expense Details Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Expense Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Icon name="close" size={24} color="#1a2332" />
              </TouchableOpacity>
            </View>
            {selectedExpense && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{selectedExpense.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>₹{selectedExpense.amount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{selectedExpense.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailValue}>{selectedExpense.description || 'N/A'}</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color="#1a2332" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryGrid}>
                {Object.keys(categoryIcons).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      newExpense.category === cat && styles.categoryButtonActive,
                    ]}
                    onPress={() => setNewExpense({...newExpense, category: cat})}>
                    <Icon name={categoryIcons[cat]} size={20} color={newExpense.category === cat ? '#fff' : '#3d4f5f'} />
                    <Text style={[
                      styles.categoryButtonText,
                      newExpense.category === cat && styles.categoryButtonTextActive,
                    ]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.inputLabel}>Amount *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
              />
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter description"
                multiline
                numberOfLines={3}
                value={newExpense.description}
                onChangeText={(text) => setNewExpense({...newExpense, description: text})}
              />
              <TouchableOpacity 
                style={styles.addExpenseButton}
                onPress={handleAddExpense}>
                <Text style={styles.addExpenseButtonText}>Add Expense</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#5a6c7d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalLabel: {
    fontSize: 14,
    color: '#e8eef3',
    marginTop: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  expenseCard: {
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
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#e8eef3',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  expenseInfo: {
    flex: 1,
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  date: {
    fontSize: 14,
    color: '#5a6c7d',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c89090',
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
    maxHeight: '80%',
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 4,
    borderWidth: 2,
    borderColor: '#d0d8e0',
  },
  categoryButtonActive: {
    backgroundColor: '#2c3e50',
    borderColor: '#2c3e50',
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#3d4f5f',
    marginLeft: 6,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addExpenseButton: {
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
  addExpenseButtonText: {
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

export default ExpensesScreen;

