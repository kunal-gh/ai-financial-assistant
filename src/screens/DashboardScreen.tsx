import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BarChart from '../components/BarChart';
import WorkingDonutChart from '../components/WorkingDonutChart';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({onNavigate}) => {
  // Sophisticated dark color palette: blacks, blues, greys
  const revenueData = [
    {label: 'Jan', value: 12500, color: '#2c3e50'}, // Dark slate
    {label: 'Feb', value: 15800, color: '#34495e'}, // Charcoal
    {label: 'Mar', value: 18200, color: '#3d5a80'}, // Steel blue
    {label: 'Apr', value: 21000, color: '#4a6fa5'}, // Denim blue
    {label: 'May', value: 19500, color: '#5a7a9e'}, // Slate blue
    {label: 'Jun', value: 23400, color: '#6b8caf'}, // Powder blue
  ];

  const expenseData = [
    {label: 'Office Supplies', value: 3200, color: '#1a2332'}, // Midnight black
    {label: 'Software & Tools', value: 2800, color: '#2d3e50'}, // Dark navy
    {label: 'Travel & Transport', value: 4100, color: '#3d5a80'}, // Steel blue
    {label: 'Marketing', value: 2900, color: '#4a6fa5'}, // Denim
    {label: 'Utilities', value: 1800, color: '#5a7a9e'}, // Slate
    {label: 'Other', value: 1200, color: '#6b8caf'}, // Light slate
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[styles.statCard, {backgroundColor: '#2c3e50'}]}
          onPress={() => onNavigate('Invoices')}>
          <Icon name="cash-multiple" size={32} color="#fff" />
          <Text style={styles.statValue}>₹110,200</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, {backgroundColor: '#34495e'}]}
          onPress={() => onNavigate('Clients')}>
          <Icon name="account-group" size={32} color="#fff" />
          <Text style={styles.statValue}>47</Text>
          <Text style={styles.statLabel}>Active Clients</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, {backgroundColor: '#3d5a80'}]}
          onPress={() => onNavigate('Invoices')}>
          <Icon name="file-document" size={32} color="#fff" />
          <Text style={styles.statValue}>18</Text>
          <Text style={styles.statLabel}>Pending Invoices</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, {backgroundColor: '#4a6fa5'}]}
          onPress={() => onNavigate('Expenses')}>
          <Icon name="trending-down" size={32} color="#fff" />
          <Text style={styles.statValue}>₹16,000</Text>
          <Text style={styles.statLabel}>Monthly Expenses</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Trend (6 Months)</Text>
        <Text style={styles.sectionSubtitle}>Monthly revenue performance</Text>
        <BarChart data={revenueData} height={220} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Distribution</Text>
        <Text style={styles.sectionSubtitle}>Breakdown by category</Text>
        <WorkingDonutChart data={expenseData} size={200} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity 
          style={styles.activityItem}
          onPress={() => onNavigate('Invoices')}>
          <Icon name="check-circle" size={24} color="#4a6fa5" />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>Invoice #1234 Paid</Text>
            <Text style={styles.activitySubtitle}>2 hours ago</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#6b7c8d" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.activityItem}
          onPress={() => onNavigate('Clients')}>
          <Icon name="account-plus" size={24} color="#3d5a80" />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>New Client Added</Text>
            <Text style={styles.activitySubtitle}>5 hours ago</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#6b7c8d" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.activityItem}
          onPress={() => onNavigate('Expenses')}>
          <Icon name="file-document-outline" size={24} color="#5a7a9e" />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>Expense Added: Travel</Text>
            <Text style={styles.activitySubtitle}>1 day ago</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#6b7c8d" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf1',
  },
  header: {
    padding: 24,
    backgroundColor: '#1a2332',
    borderBottomWidth: 3,
    borderBottomColor: '#2c3e50',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#b8c5d6',
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '47%',
    marginBottom: 12,
    padding: 22,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 13,
    color: '#fff',
    marginTop: 6,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e6ed',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1a2332',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7c8d',
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf1',
  },
  activityText: {
    marginLeft: 14,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2332',
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#6b7c8d',
    marginTop: 3,
  },
});

export default DashboardScreen;

