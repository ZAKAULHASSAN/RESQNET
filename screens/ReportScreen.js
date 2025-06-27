import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const disasterTypes = [
  { id: 'fire', name: 'Fire', icon: 'local-fire-department' },
  { id: 'flood', name: 'Flood', icon: 'water' },
  { id: 'earthquake', name: 'Earthquake', icon: 'terrain' },
  { id: 'hurricane', name: 'Hurricane', icon: 'cyclone' },
  { id: 'medical', name: 'Medical', icon: 'medical-services' },
  { id: 'other', name: 'Other', icon: 'warning' },
];

const disasterColors = {
  fire: '#FF4757',
  flood: '#1E90FF',
  earthquake: '#FFA502',
  hurricane: '#2ED573',
  medical: '#FF0033',
  other: '#9C64A6',
};

const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

export default function ReportScreen({ navigation }) {
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [token, setToken] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonScale = new Animated.Value(1);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('loggedInUser');
        if (!userDataString) {
          Alert.alert(
            'Not logged in',
            'You must login to submit an emergency report',
            [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
          );
          return;
        }
        const userData = JSON.parse(userDataString);
        if (!userData.token) {
          Alert.alert(
            'Not logged in',
            'You must login to submit an emergency report',
            [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
          );
          return;
        }
        setToken(userData.token);
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ]).start();
  };

  const handleSubmit = async () => {
    animateButton();
    
    if (!selectedDisaster) {
      Alert.alert('Please select a disaster type');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Please enter a description');
      return;
    }
    if (!token) {
      Alert.alert(
        'Not authorized',
        'You must login to submit an emergency report',
        [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
      );
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bodyPayload = {
        type: selectedDisaster.id,
        description,
        location: {
          address: location.trim() || 'Unknown',
          coordinates: { lat: 0, lng: 0 },
        },
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would use actual API call:
      /*
      const response = await fetch('http://192.168.12.117:5000/api/reports/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }
      */

      Alert.alert('Success', 'Emergency report submitted successfully.');

      // Store in local state for display
      setSubmittedReport({
        id: Date.now().toString(),
        type: selectedDisaster.id,
        typeName: selectedDisaster.name,
        icon: selectedDisaster.icon,
        description,
        location: location.trim() || 'Unknown',
        timestamp: new Date().toLocaleString(),
      });

      setSelectedDisaster(null);
      setDescription('');
      setLocation('');
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#1E90FF', '#70A1FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Report an Emergency</Text>
          <Text style={styles.subtitle}>
            Provide details about the emergency situation
          </Text>
        </View>
      </LinearGradient>

      {/* Disaster Type Selection */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Select Disaster Type</Text>
        <View style={styles.disasterGrid}>
          {disasterTypes.map((disaster) => (
            <TouchableOpacity
              key={disaster.id}
              style={[
                styles.disasterButton,
                selectedDisaster?.id === disaster.id && {
                  borderColor: disasterColors[disaster.id],
                  backgroundColor: `${disasterColors[disaster.id]}20`,
                  shadowColor: disasterColors[disaster.id],
                },
              ]}
              onPress={() => setSelectedDisaster(disaster)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[disasterColors[disaster.id], lightenColor(disasterColors[disaster.id], 20)]}
                style={styles.disasterIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name={disaster.icon} size={20} color="#FFF" />
              </LinearGradient>
              <Text style={styles.disasterText}>{disaster.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Describe the emergency in detail..."
            placeholderTextColor="#7F8C8D"
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Location Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Location (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location or address"
            placeholderTextColor="#7F8C8D"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Submit Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit} 
            activeOpacity={0.9}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['#FF4757', '#FF6B81']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit Emergency Report</Text>
                  <MaterialIcons name="send" size={20} color="#FFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Submitted Report Preview */}
        {submittedReport && (
          <View style={styles.reportPreview}>
            <Text style={styles.previewTitle}>Your Submitted Report</Text>
            <View style={styles.previewItem}>
              <LinearGradient
                colors={[disasterColors[submittedReport.type], lightenColor(disasterColors[submittedReport.type], 20)]}
                style={styles.previewIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons 
                  name={submittedReport.icon} 
                  size={24} 
                  color="#FFF" 
                />
              </LinearGradient>
              <Text style={styles.previewText}>{submittedReport.typeName}</Text>
            </View>
            <View style={styles.previewDetail}>
              <Text style={styles.previewLabel}>Description:</Text>
              <Text style={styles.previewValue}>{submittedReport.description}</Text>
            </View>
            <View style={styles.previewDetail}>
              <Text style={styles.previewLabel}>Location:</Text>
              <Text style={styles.previewValue}>{submittedReport.location}</Text>
            </View>
            <View style={styles.previewDetail}>
              <Text style={styles.previewLabel}>Submitted At:</Text>
              <Text style={styles.previewValue}>{submittedReport.timestamp}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8FAFB',
  },
  headerGradient: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F3542',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  disasterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  disasterButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  disasterIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disasterText: {
    fontSize: 16,
    color: '#2F3542',
    fontFamily: 'Inter-SemiBold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3542',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#FFF',
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  charCount: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitGradient: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
    fontFamily: 'Inter-Bold',
  },
  reportPreview: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 30,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
    color: '#2F3542',
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewDetail: {
    marginBottom: 10,
  },
  previewLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2F3542',
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  previewValue: {
    fontSize: 15,
    color: '#57606F',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  previewText: {
    fontSize: 16,
    color: '#2F3542',
    fontFamily: 'Inter-SemiBold',
  },
});