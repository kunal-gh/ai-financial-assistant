import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from './src/screens/DashboardScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import InvoicesScreen from './src/screens/InvoicesScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import SplashScreen from './src/screens/SplashScreen';

function App(): JSX.Element {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const navigateToTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardScreen onNavigate={navigateToTab} />;
      case 'Clients':
        return <ClientsScreen />;
      case 'Invoices':
        return <InvoicesScreen />;
      case 'Expenses':
        return <ExpensesScreen />;
      case 'AI Assistant':
        return <AIAssistantScreen />;
      default:
        return <DashboardScreen onNavigate={navigateToTab} />;
    }
  };

  const TabButton = ({name, icon}: {name: string; icon: string}) => {
    const isActive = activeTab === name;
    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setActiveTab(name)}>
        <Icon
          name={icon}
          size={24}
          color={isActive ? '#2c3e50' : '#6b7c8d'}
        />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        <TabButton name="Dashboard" icon="view-dashboard" />
        <TabButton name="Clients" icon="account-group" />
        <TabButton name="AI Assistant" icon="robot" />
        <TabButton name="Expenses" icon="cash-multiple" />
        <TabButton name="Invoices" icon="file-document" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#d0d8e0',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    color: '#6b7c8d',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
});

export default App;
