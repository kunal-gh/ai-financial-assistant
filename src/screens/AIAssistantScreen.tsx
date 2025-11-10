import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DatabaseService} from '../services/DatabaseService';
import Voice from '@react-native-voice/voice';

const AIAssistantScreen = () => {
  const [messages, setMessages] = useState([
    {id: '1', text: '👋 Hello! I\'m your AI Financial Assistant.\n\n✨ I can automate tasks for you!\n\n🎤 Tap the microphone to use voice commands!\n\n📝 Or type/tap buttons:\n• "Show my revenue"\n• "Show invoices"\n• "Add client John Doe email john@example.com"\n• "Create invoice for Acme Corp ₹5000"\n\nTap any button below to see me in action! 👇', isBot: true},
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [db] = useState(() => DatabaseService.getInstance());
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    db.initDatabase().catch(console.error);
    
    // Setup voice recognition
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e: any) => {
      if (e.value && e.value[0]) {
        const voiceText = e.value[0];
        setInputText(voiceText);
        handleSuggestion(voiceText);
      }
    };
    Voice.onSpeechError = (e: any) => {
      console.error('Voice error:', e);
      setIsListening(false);
      Alert.alert('Voice Error', 'Could not recognize speech. Please try again.');
    };
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  }, [messages]);

  const getAIResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase();
    
    try {
      if (input.includes('add client') || input.includes('create client') || input.includes('new client')) {
        const nameMatch = input.match(/(?:add|create|new)\s+client\s+([a-z\s]+?)(?:\s+email|\s+with)/i);
        const emailMatch = input.match(/email\s+([^\s]+)/i);
        const phoneMatch = input.match(/phone\s+([^\s]+)/i);
        
        if (nameMatch && emailMatch) {
          const name = nameMatch[1].trim();
          const email = emailMatch[1].trim();
          const phone = phoneMatch ? phoneMatch[1].trim() : '';
          
          await db.createClient({name, email, phone});
          return `✅ Client added successfully!\n\n👤 ${name}\n📧 ${email}${phone ? `\n📱 ${phone}` : ''}\n\nYou can view them in the Clients tab.`;
        }
        return '❌ Please provide client details in this format:\n"Add client John Doe email john@example.com phone 555-1234"';
      }
      
      if (input.includes('create invoice') || input.includes('add invoice') || input.includes('new invoice')) {
        const clientMatch = input.match(/(?:for|client)\s+([a-z\s]+?)(?:\s+₹|\s+amount)/i);
        const amountMatch = input.match(/₹?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        const descMatch = input.match(/(?:for|description)\s+(.+?)$/i);
        
        if (clientMatch && amountMatch) {
          const clientName = clientMatch[1].trim();
          const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
          const description = descMatch ? descMatch[1].trim() : 'Services rendered';
          
          const today = new Date();
          const dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + 30);
          
          await db.createInvoice({
            client_name: clientName,
            amount,
            description,
            date_created: today.toISOString().split('T')[0],
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pending'
          });
          
          return `✅ Invoice created successfully!\n\n📄 Client: ${clientName}\n💰 Amount: ₹${amount.toFixed(2)}\n📝 Description: ${description}\n📅 Due: ${dueDate.toLocaleDateString()}\n\nStatus: Pending\n\nView it in the Invoices tab.`;
        }
        return '❌ Please provide invoice details:\n"Create invoice for Acme Corp ₹5000 for consulting services"';
      }
      
      if (input.includes('add expense') || input.includes('create expense') || input.includes('new expense')) {
        const amountMatch = input.match(/₹?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        const descMatch = input.match(/(?:for|description)\s+([a-z\s]+?)(?:\s+category|$)/i);
        const categoryMatch = input.match(/category\s+([a-z\s]+)/i);
        
        if (amountMatch) {
          const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
          const description = descMatch ? descMatch[1].trim() : 'General expense';
          let category = categoryMatch ? categoryMatch[1].trim() : 'Other';
          
          const categoryMap: {[key: string]: string} = {
            'office': 'Office',
            'office supplies': 'Office',
            'travel': 'Travel',
            'meal': 'Meals',
            'meals': 'Meals',
            'food': 'Meals',
            'software': 'Software',
            'subscription': 'Software',
            'marketing': 'Marketing',
            'advertising': 'Marketing',
            'utilities': 'Utilities',
            'utility': 'Utilities',
          };
          
          category = categoryMap[category.toLowerCase()] || 'Other';
          
          await db.createExpense({
            description,
            amount,
            category,
            date_created: new Date().toISOString().split('T')[0]
          });
          
          return `✅ Expense added successfully!\n\n💳 Amount: ₹${amount.toFixed(2)}\n📝 Description: ${description}\n🏷️ Category: ${category}\n📅 Date: ${new Date().toLocaleDateString()}\n\nView it in the Expenses tab.`;
        }
        return '❌ Please provide expense details:\n"Add expense ₹200 for office supplies category office"';
      }
      
      if (input.includes('mark invoice') || input.includes('update invoice')) {
        const idMatch = input.match(/invoice\s+#?(\d+)/i);
        let status: 'paid' | 'pending' | 'overdue' | null = null;
        
        if (input.includes('paid')) status = 'paid';
        else if (input.includes('pending')) status = 'pending';
        else if (input.includes('overdue')) status = 'overdue';
        
        if (idMatch && status) {
          const id = parseInt(idMatch[1]);
          await db.updateInvoiceStatus(id, status);
          return `✅ Invoice #${id} marked as ${status}!\n\nView updated status in the Invoices tab.`;
        }
        return '❌ Please specify invoice ID and status:\n"Mark invoice #5 as paid"';
      }
      
      if (input.includes('revenue') || input.includes('income') || input.includes('earnings')) {
        const stats = await db.getDashboardStats();
        const invoices = await db.getInvoices();
        const paidInvoices = invoices.filter(inv => inv.status === 'paid');
        const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
        const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        
        return `💰 Revenue Report:\n\n✅ Paid: ₹${stats.revenue.toFixed(2)} (${paidInvoices.length} invoices)\n⏳ Pending: ₹${pendingAmount.toFixed(2)} (${pendingInvoices.length} invoices)\n📊 Total: ₹${(stats.revenue + pendingAmount).toFixed(2)}\n\nKeep up the great work!`;
      }
      
      if (input.includes('invoice') || input.includes('bill')) {
        const invoices = await db.getInvoices();
        const paid = invoices.filter(inv => inv.status === 'paid');
        const pending = invoices.filter(inv => inv.status === 'pending');
        const overdue = invoices.filter(inv => inv.status === 'overdue');
        
        const paidTotal = paid.reduce((sum, inv) => sum + inv.amount, 0);
        const pendingTotal = pending.reduce((sum, inv) => sum + inv.amount, 0);
        const overdueTotal = overdue.reduce((sum, inv) => sum + inv.amount, 0);
        
        return `📄 Invoice Summary:\n\n✅ Paid: ${paid.length} (₹${paidTotal.toFixed(2)})\n⏳ Pending: ${pending.length} (₹${pendingTotal.toFixed(2)})\n⚠️ Overdue: ${overdue.length} (₹${overdueTotal.toFixed(2)})\n\n📊 Total: ${invoices.length} invoices\n💰 Total Value: ₹${(paidTotal + pendingTotal + overdueTotal).toFixed(2)}`;
      }
      
      if (input.includes('client') || input.includes('customer')) {
        const clients = await db.getClients();
        const invoices = await db.getInvoices();
        
        if (input.includes('list') || input.includes('show all')) {
          const clientList = clients.slice(0, 5).map(c => `• ${c.name} (${c.email})`).join('\n');
          return `👥 Clients (${clients.length} total):\n\n${clientList}\n\n${clients.length > 5 ? `...and ${clients.length - 5} more` : ''}\n\nView all in the Clients tab.`;
        }
        
        return `👥 Client Overview:\n\n📊 Total Clients: ${clients.length}\n📄 Total Invoices: ${invoices.length}\n📈 Avg Invoices/Client: ${(invoices.length / clients.length).toFixed(1)}\n\nYour client base is growing!`;
      }
      
      if (input.includes('expense') || input.includes('spending') || input.includes('cost')) {
        const expenses = await db.getExpenses();
        const categories = await db.getExpensesByCategory();
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        const breakdown = categories.slice(0, 5).map(cat => 
          `• ${cat.category}: ₹${cat.total.toFixed(2)} (${((cat.total / total) * 100).toFixed(1)}%)`
        ).join('\n');
        
        return `💸 Expense Report:\n\n💰 Total: ₹${total.toFixed(2)}\n📊 Transactions: ${expenses.length}\n\nTop Categories:\n${breakdown}\n\nView details in the Expenses tab.`;
      }
      
      if (input.includes('profit') || input.includes('margin')) {
        const stats = await db.getDashboardStats();
        const margin = stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : '0';
        
        return `📊 Profit Analysis:\n\n💰 Revenue: ₹${stats.revenue.toFixed(2)}\n💸 Expenses: ₹${stats.expenses.toFixed(2)}\n✨ Net Profit: ₹${stats.profit.toFixed(2)}\n📈 Profit Margin: ${margin}%\n\n${parseFloat(margin) > 70 ? 'Excellent! Your profit margin is very healthy!' : 'Keep optimizing your expenses!'}`;
      }
      
      if (input.includes('help') || input.includes('command') || input.includes('what can you do')) {
        return `🤖 I can automate these tasks:\n\n📝 CREATE:\n• "Add client John Doe email john@example.com phone 555-1234"\n• "Create invoice for Acme Corp ₹5000 for consulting"\n• "Add expense ₹200 for office supplies"\n\n📊 VIEW:\n• "Show my revenue"\n• "Show invoices"\n• "Show clients"\n• "Show expenses"\n• "Show profit"\n\n✏️ UPDATE:\n• "Mark invoice #5 as paid"\n\nJust type naturally and I'll handle it!`;
      }
      
      if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return '👋 Hello! I\'m your AI Financial Assistant. I can automate tasks for you!\n\nTry:\n• "Add client Sarah Smith email sarah@example.com"\n• "Create invoice for Tech Corp ₹3000"\n• "Show my revenue"\n\nType "help" to see all commands!';
      }
      
      if (input.includes('thank') || input.includes('thanks')) {
        return '😊 You\'re welcome! I\'m here anytime you need help managing your finances. Just ask!';
      }
      
      return '🤔 I\'m not sure what you mean. Try:\n\n• "Add client [name] email [email]"\n• "Create invoice for [client] ₹[amount]"\n• "Add expense ₹[amount] for [description]"\n• "Show my revenue"\n\nType "help" for all commands!';
      
    } catch (error) {
      console.error('AI Response Error:', error);
      return '❌ Sorry, something went wrong. Please try again or check the format of your command.';
    }
  };

  const handleSuggestion = async (suggestion: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    const timestamp = Date.now();
    const userMsg = {
      id: `user-${timestamp}`,
      text: suggestion,
      isBot: false,
    };
    
    const loadingMsg = {
      id: `loading-${timestamp}`,
      text: '⏳ Processing...',
      isBot: true,
    };
    
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    
    try {
      const responseText = await getAIResponse(suggestion);
      
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== loadingMsg.id);
        return [...withoutLoading, {
          id: `bot-${Date.now()}`,
          text: responseText,
          isBot: true,
        }];
      });
    } catch (error) {
      console.error('Error in handleSuggestion:', error);
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== loadingMsg.id);
        return [...withoutLoading, {
          id: `error-${Date.now()}`,
          text: '❌ Sorry, something went wrong. Please try again.',
          isBot: true,
        }];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sendMessage = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput || isProcessing) return;
    
    setIsProcessing(true);
    
    const timestamp = Date.now();
    const userMsg = {
      id: `user-${timestamp}`,
      text: trimmedInput,
      isBot: false,
    };
    
    const loadingMsg = {
      id: `loading-${timestamp}`,
      text: '⏳ Processing...',
      isBot: true,
    };
    
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInputText('');
    
    try {
      const responseText = await getAIResponse(trimmedInput);
      
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== loadingMsg.id);
        return [...withoutLoading, {
          id: `bot-${Date.now()}`,
          text: responseText,
          isBot: true,
        }];
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== loadingMsg.id);
        return [...withoutLoading, {
          id: `error-${Date.now()}`,
          text: '❌ Sorry, something went wrong. Please try again.',
          isBot: true,
        }];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'AI Assistant needs access to your microphone for voice commands',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const startVoiceRecognition = async () => {
    if (isListening || isProcessing) return;
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required for voice commands');
      return;
    }
    
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error('Voice start error:', error);
      
      // Fallback for emulator testing
      Alert.alert(
        'Voice Input',
        'Voice recognition may not work on emulator. Try on a real device, or use the text input instead.',
        [
          {text: 'OK', style: 'cancel'},
          {
            text: 'Test with Sample',
            onPress: () => {
              const sampleCommand = 'Show my revenue';
              setInputText(sampleCommand);
              handleSuggestion(sampleCommand);
            }
          }
        ]
      );
    }
  };

  const stopVoiceRecognition = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Voice stop error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}>
        {messages.map(message => (
          <View key={message.id} style={[
            styles.messageBubble,
            message.isBot ? styles.botMessage : styles.userMessage
          ]}>
            {message.isBot && (
              <Icon name="robot" size={20} color="#666" style={styles.messageIcon} />
            )}
            <Text style={[
              styles.messageText,
              {color: message.isBot ? '#333' : '#fff'}
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Tap to try:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsScroll}>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Show my revenue')}>
            <Text style={styles.suggestionText}>💰 Show Revenue</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Show invoices')}>
            <Text style={styles.suggestionText}>📊 Show Invoices</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Show clients')}>
            <Text style={styles.suggestionText}>👥 Show Clients</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Add client Sarah Smith email sarah@example.com phone 555-9999')}>
            <Text style={styles.suggestionText}>➕ Add Client</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Create invoice for Tech Corp ₹3000 for web development')}>
            <Text style={styles.suggestionText}>📄 Create Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Add expense ₹150 for office supplies category office')}>
            <Text style={styles.suggestionText}>💳 Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Show expenses')}>
            <Text style={styles.suggestionText}>💸 Show Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('Show profit')}>
            <Text style={styles.suggestionText}>📈 Show Profit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionChip}
            onPress={() => handleSuggestion('help')}>
            <Text style={styles.suggestionText}>❓ Help</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={[styles.micButton, isListening && styles.micButtonActive]} 
          onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}>
          <Icon 
            name={isListening ? "microphone" : "microphone-outline"} 
            size={24} 
            color={isListening ? "#fff" : "#6200ee"} 
          />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder={isListening ? "Listening..." : "Type or speak..."}
          value={inputText}
          onChangeText={setInputText}
          multiline
          editable={!isListening}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6200ee',
  },
  messageIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    flexShrink: 1,
  },
  suggestionsContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
    color: '#666',
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    paddingRight: 80,
  },
  suggestionChip: {
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 120,
  },
  suggestionText: {
    color: '#6200ee',
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#6200ee',
    backgroundColor: '#fff',
  },
  micButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIAssistantScreen;
