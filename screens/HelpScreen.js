import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.12.117:5000/api/help';

export default function HelpScreen() {
  const [requests, setRequests] = useState([]);
  const [myClaimedRequests, setMyClaimedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [responseText, setResponseText] = useState('');

  const decodeUserIdFromToken = (jwt) => {
    try {
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return payload.id || payload._id || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const getTokenAndFetch = async () => {
      try {
        const userData = await AsyncStorage.getItem('loggedInUser');
        if (userData) {
          const user = JSON.parse(userData);
          setToken(user.token);
          const uid = decodeUserIdFromToken(user.token);
          setUserId(uid);
          fetchRequests(user.token, uid);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load user data');
      }
    };
    getTokenAndFetch();
  }, []);

  const fetchRequests = async (authToken, uid) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/unresolved`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch requests');

      const claimed = data.filter(
        (r) => r.claimedBy?._id === uid && r.status !== 'completed'
      );
      const unresolved = data.filter(
        (r) => (!r.claimedBy || r.claimedBy._id !== uid) && r.status !== 'completed'
      );
      const completed = data.filter(
        (r) => r.claimedBy?._id === uid && r.status === 'completed'
      );

      setMyClaimedRequests(claimed);
      setRequests(unresolved);
      setCompletedRequests(completed);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!token) return;
    setRefreshing(true);
    fetchRequests(token, userId);
  };

  const claimRequest = async (requestId) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/claim/${requestId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to claim request');

      Alert.alert('Success', 'Request claimed!');
      fetchRequests(token, userId);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const markInProgress = async (requestId) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/inprogress/${requestId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to mark as in progress');

      Alert.alert('Success', 'Request marked as In Progress!');
      fetchRequests(token, userId);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const completeRequest = async (requestId) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/complete/${requestId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to complete request');

      Alert.alert('Success', 'Request marked as Completed!');
      fetchRequests(token, userId);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openResponseModal = (requestId) => {
    setSelectedRequestId(requestId);
    setResponseText('');
    setModalVisible(true);
  };

  const submitResponse = async () => {
    if (!token || !responseText.trim()) {
      Alert.alert('Error', 'Response text is required');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/respond/${selectedRequestId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseText }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit response');

      Alert.alert('Success', 'Response submitted!');
      setModalVisible(false);
      fetchRequests(token, userId);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderActionButtons = (item) => {
    const isMine = item.claimedBy?._id === userId;

    if (item.status === 'unclaimed') {
      return (
        <TouchableOpacity 
          style={[styles.button, styles.claimButton]} 
          onPress={() => claimRequest(item._id)}
        >
          <Text style={styles.buttonText}>Claim Request</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      );
    }

    if (item.status === 'claimed' && isMine) {
      return (
        <TouchableOpacity 
          style={[styles.button, styles.startButton]} 
          onPress={() => markInProgress(item._id)}
        >
          <Text style={styles.buttonText}>Start Working</Text>
          <Ionicons name="play" size={18} color="#fff" />
        </TouchableOpacity>
      );
    }

    if (item.status === 'in progress' && isMine) {
      return (
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.button, styles.respondButton]} 
            onPress={() => openResponseModal(item._id)}
          >
            <Text style={styles.buttonText}>Respond</Text>
            <Ionicons name="chatbubble" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.completeButton]} 
            onPress={() => completeRequest(item._id)}
          >
            <Text style={styles.buttonText}>Complete</Text>
            <Ionicons name="checkmark" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    if (item.status === 'completed' && isMine) {
      return (
        <View style={[styles.statusBadge, styles.completedBadge]}>
          <Text style={styles.statusBadgeText}>Completed</Text>
          <Ionicons name="checkmark-done" size={18} color="#fff" />
        </View>
      );
    }

    if (item.claimedBy?.email) {
      return (
        <View style={styles.claimedByContainer}>
          <Ionicons name="person" size={14} color="#64748b" />
          <Text style={styles.claimedByText}>Claimed by: {item.claimedBy.email}</Text>
        </View>
      );
    }

    return null;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'unclaimed' ? styles.unclaimedBadge :
          item.status === 'claimed' ? styles.claimedBadge :
          item.status === 'in progress' ? styles.inProgressBadge :
          styles.completedBadge
        ]}>
          <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.cardDescription}>{item.description}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={14} color="#64748b" />
          <Text style={styles.userText}>Requested by: {item.createdBy?.email || 'Unknown'}</Text>
        </View>
        {renderActionButtons(item)}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4f46e5']}
            tintColor="#4f46e5"
          />
        }
      >
        {myClaimedRequests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Your Active Requests</Text>
            {myClaimedRequests.map((req) => renderItem({ item: req }))}
          </>
        )}

        <Text style={styles.sectionTitle}>Available Requests</Text>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="help-circle-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>No unresolved help requests</Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}

        {completedRequests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed Requests</Text>
            {completedRequests.map((req) => renderItem({ item: req }))}
          </>
        )}
      </ScrollView>

      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Your Response</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              multiline
              placeholder="Type your response here..."
              placeholderTextColor="#94a3b8"
              value={responseText}
              onChangeText={setResponseText}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]} 
                onPress={submitResponse}
                disabled={!responseText.trim()}
              >
                <Text style={styles.modalButtonText}>Submit Response</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    marginTop: 24,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'column',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  unclaimedBadge: {
    backgroundColor: '#fee2e2',
  },
  claimedBadge: {
    backgroundColor: '#fef3c7',
  },
  inProgressBadge: {
    backgroundColor: '#dbeafe',
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  claimButton: {
    backgroundColor: '#4f46e5',
  },
  startButton: {
    backgroundColor: '#f59e0b',
  },
  respondButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  claimedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  claimedByText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: '#1e293b',
    textAlignVertical: 'top',
    marginBottom: 24,
    backgroundColor: '#f8fafc',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});