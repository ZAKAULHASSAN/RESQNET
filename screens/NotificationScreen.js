import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications-off-outline" size={60} color="#999" />
      <Text style={styles.message}>No Notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});
