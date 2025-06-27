import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.12.117:5000/api/auth';

const ProfileScreen = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('victim');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem('loggedInUser');
        if (user) setLoggedInUser(JSON.parse(user));
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      }
    };
    loadUser();
  }, []);

  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert('All fields are required');
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Registration failed', data.message || 'Unknown error');
      }

      Alert.alert('Registration successful! You can now login.');
      setIsRegistering(false);
      setEmail('');
      setPassword('');
      setRole('victim');
    } catch (error) {
      Alert.alert('Network error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Please enter email and password');
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Login failed', data.message || 'Invalid credentials');
      }

      const userInfo = {
        email: data.email,
        role: data.role,
        token: data.token,
        _id: data._id,
      };

      await AsyncStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      setLoggedInUser(userInfo);
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Network error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      setLoggedInUser(null);
      setEmail('');
      setPassword('');
      setRole('victim');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#6D28D9" />
          <Text style={styles.loadingText}>
            {isRegistering ? 'Creating your account...' : 'Logging you in...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loggedInUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.loggedInContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/ResQNetLogo.png')}
                style={[
                  styles.avatar,
                  loggedInUser.role === 'volunteer' ? styles.volunteerAvatar : styles.victimAvatar,
                ]}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.userEmail}>{loggedInUser.email}</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={22} color="#6D28D9" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>EMAIL</Text>
                    <Text style={styles.infoText}>{loggedInUser.email}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={22} color="#6D28D9" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>ROLE</Text>
                    <Text
                      style={[
                        styles.infoText,
                        loggedInUser.role === 'volunteer' ? styles.volunteerText : styles.victimText,
                      ]}
                    >
                      {loggedInUser.role.charAt(0).toUpperCase() + loggedInUser.role.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons name="key-outline" size={22} color="#6D28D9" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>USER ID</Text>
                    <Text style={styles.infoText}>{loggedInUser._id}</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={styles.logoutButtonText}>Sign Out</Text>
              <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.authScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.authContainer}>
          <View style={styles.authHeader}>
            <Text style={styles.authTitle}>{isRegistering ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.authSubtitle}>
              {isRegistering ? 'Join our community today' : 'Sign in to continue'}
            </Text>
          </View>

          <View style={styles.authForm}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {isRegistering && (
              <>
                <Text style={styles.roleTitle}>Select your role</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[styles.roleButton, role === 'victim' && styles.roleButtonSelected]}
                    onPress={() => setRole('victim')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={role === 'victim' ? '#FFFFFF' : '#6D28D9'}
                      style={styles.roleIcon}
                    />
                    <Text
                      style={[styles.roleButtonText, role === 'victim' && styles.roleButtonTextSelected]}
                    >
                      Victim
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.roleButton, role === 'volunteer' && styles.roleButtonSelected]}
                    onPress={() => setRole('volunteer')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="people-outline"
                      size={18}
                      color={role === 'volunteer' ? '#FFFFFF' : '#10B981'}
                      style={styles.roleIcon}
                    />
                    <Text
                      style={[styles.roleButtonText, role === 'volunteer' && styles.roleButtonTextSelected]}
                    >
                      Volunteer
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.authButton}
              onPress={isRegistering ? handleRegister : handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.authButtonText}>
                {isRegistering ? 'Create Account' : 'Sign In'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.authFooter}>
            <Text style={styles.toggleAuthText}>
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity
              onPress={() => setIsRegistering(!isRegistering)}
              style={styles.toggleAuthButton}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleAuthLink}>{isRegistering ? ' Sign In' : ' Sign Up'}</Text>
              <Ionicons
                name={isRegistering ? 'log-in-outline' : 'person-add-outline'}
                size={16}
                color="#6D28D9"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6D28D9',
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  loggedInContainer: {
    flexGrow: 1,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  profileCard: {
    paddingVertical: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EEE',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 7,
  },
  victimAvatar: {
    borderColor: '#6D28D9',
    borderWidth: 3,
  },
  volunteerAvatar: {
    borderColor: '#10B981',
    borderWidth: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 32,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  infoSection: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  infoIcon: {
    marginRight: 18,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  victimText: {
    color: '#6D28D9',
  },
  volunteerText: {
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E7FF',
    marginVertical: 14,
  },
  logoutButton: {
    backgroundColor: '#6D28D9',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginRight: 10,
  },
  authScrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  authHeader: {
    paddingBottom: 16,
  },
  authTitle: {
    fontSize: 30,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  authForm: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 17,
    color: '#1E293B',
    fontFamily: 'Inter-Medium',
    marginLeft: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  roleTitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 14,
    fontFamily: 'Inter-Medium',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#6D28D9',
    borderColor: '#6D28D9',
  },
  roleIcon: {
    marginRight: 10,
  },
  roleButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  roleButtonTextSelected: {
    color: '#FFFFFF',
  },
  authButton: {
    backgroundColor: '#6D28D9',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginRight: 10,
  },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
    flexWrap: 'wrap',
  },
  toggleAuthText: {
    color: '#64748B',
    fontFamily: 'Inter-Medium',
  },
  toggleAuthButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleAuthLink: {
    color: '#6D28D9',
    fontFamily: 'Inter-Bold',
    marginLeft: 6,
  },
});

export default ProfileScreen;
