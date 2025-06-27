import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, ImageBackground, ScrollView,
  Dimensions, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const mockReports = [
  {
    id: '1',
    title: 'Flood in District Mianwali',
    description: 'Heavy monsoon rain has caused urban flooding in low-lying areas of Mianwali. Residents are advised to stay indoors.',
    date: '2025-06-21',
    type: 'flood',
    severity: 'high',
  },
  {
    id: '2',
    title: 'Fire in Kundian Forest Zone',
    description: 'A wildfire has erupted in the outskirts of Kundian Mianwali. Firefighters are working to contain the blaze.',
    date: '2025-06-20',
    type: 'fire',
    severity: 'critical',
  },
  {
    id: '3',
    title: 'Heatwave Warning in Kundian',
    description: 'Temperatures expected to rise above 45°C. Stay hydrated and avoid outdoor activities.',
    date: '2025-06-19',
    type: 'heatwave',
    severity: 'medium',
  },
];

const severityColors = {
  high: '#FF4757',
  critical: '#FF0033',
  medium: '#FFA502',
  low: '#2ED573',
};

const disasterIcons = {
  flood: 'water',
  fire: 'local-fire-department',
  earthquake: 'terrain',
  heatwave: 'wb-sunny',
  default: 'warning',
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('loggedInUser');
      if (userData) {
        const parsed = JSON.parse(userData);
        setRole(parsed.role);
      }
    };

    loadUser();
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => navigation.navigate('ReportDetails', { report: item })}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFB']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.reportHeader}>
            <View style={[styles.disasterIconContainer, { backgroundColor: severityColors[item.severity] + '20' }]}>
              <MaterialIcons
                name={disasterIcons[item.type] || disasterIcons.default}
                size={24}
                color={severityColors[item.severity]}
              />
            </View>
            <View style={styles.reportTextContainer}>
              <Text style={styles.reportTitle}>{item.title}</Text>
              <Text style={styles.reportDescription} numberOfLines={2}>{item.description}</Text>
            </View>
          </View>
          <View style={styles.reportFooter}>
            <View style={styles.dateContainer}>
              <MaterialIcons name="date-range" size={14} color="#7F8C8D" />
              <Text style={styles.reportDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={[styles.severityBadge, { backgroundColor: severityColors[item.severity] + '20' }]}>
              <Text style={[styles.severityText, { color: severityColors[item.severity] }]}>
                {item.severity}
              </Text>
            </View>
          </View>
          <View style={[styles.severityIndicator, { backgroundColor: severityColors[item.severity] }]} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back to</Text>
            <View style={styles.appNameContainer}>
              <Text style={styles.userName}>ResQNet</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.8}
          >
            <Feather name="bell" size={24} color="#2F3542" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity 
          style={styles.emergencyBanner} 
          onPress={() => navigation.navigate('Emergency')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FF4757', '#FF6B81']}
            style={styles.emergencyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.emergencyContent}>
              <View style={styles.emergencyIconContainer}>
                <FontAwesome5 name="exclamation-triangle" size={20} color="#FFF" />
              </View>
              <View style={styles.emergencyTextContainer}>
                <Text style={styles.emergencyText}>Emergency Alert System</Text>
                <Text style={styles.emergencySubtext}>Tap to send immediate distress signal</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="#FFF" />
            </View>
            <View style={styles.emergencyPulse} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Reports Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={[styles.sectionIcon, { backgroundColor: '#FF475710' }]}>
              <MaterialIcons name="warning" size={18} color="#FF4757" />
            </View>
            <Text style={styles.sectionTitle}>Recent Disaster Reports</Text>
          </View>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('AllReports')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAll}>See All</Text>
            <MaterialIcons name="chevron-right" size={16} color="#1E90FF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            data={reports}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reportsContainer}
            snapToInterval={width * 0.8 + 16}
            decelerationRate="fast"
          />
        )}

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={[styles.sectionIcon, { backgroundColor: '#FFA50210' }]}>
              <MaterialIcons name="flash-on" size={18} color="#FFA502" />
            </View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {(role !== 'volunteer') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reportButton]}
              onPress={() => navigation.navigate('Report')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF475710', '#FF475705']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIconContainer}>
                  <MaterialIcons name="report-problem" size={28} color="#FF4757" />
                </View>
                <Text style={styles.actionText}>Report Disaster</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {(role !== 'victim') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.helpButton]}
              onPress={() => navigation.navigate('Help')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#2ED57310', '#2ED57305']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIconContainer}>
                  <FontAwesome5 name="hands-helping" size={24} color="#2ED573" />
                </View>
                <Text style={styles.actionText}>Request Help</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.resourcesButton]}
            onPress={() => navigation.navigate('Resources')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FFA50210', '#FFA50205']}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="ios-restaurant-outline" size={24} color="#FFA502" />
              </View>
              <Text style={styles.actionText}>Resources</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.profileButton]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#1E90FF10', '#1E90FF05']}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="person" size={24} color="#1E90FF" />
              </View>
              <Text style={styles.actionText}>My Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Safety Tips */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={[styles.sectionIcon, { backgroundColor: '#2ED57310' }]}>
              <MaterialIcons name="health-and-safety" size={18} color="#2ED573" />
            </View>
            <Text style={styles.sectionTitle}>Safety Tips</Text>
          </View>
        </View>

        <ImageBackground
          source={require('../assets/ResQNet logo.jpg')}
          style={styles.safetyTipsCard}
          imageStyle={{ borderRadius: 16 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
            style={styles.safetyTipsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.safetyTipsTitle}>During an Earthquake</Text>
            <Text style={styles.safetyTipsText}>
              Drop, Cover, and Hold On. Stay indoors until shaking stops. Stay away from windows.
            </Text>
            <TouchableOpacity 
              style={styles.learnMoreButton}
              activeOpacity={0.7}
            >
              <Text style={styles.learnMoreText}>Learn More</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    paddingTop: 35,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#FFFFFF',
    zIndex: -1,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#7F8C8D',
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.5,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2F3542',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  waveEmoji: {
    fontSize: 28,
    marginLeft: 8,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
  },
  emergencyBanner: {
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  emergencyGradient: {
    padding: 18,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  emergencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyPulse: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 1,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.3,
  },
  emergencySubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F3542',
    fontFamily: 'Inter-Bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  reportsContainer: {
    paddingBottom: 10,
  },
  reportCard: {
    width: width * 0.8,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
  },
  cardContent: {
    padding: 20,
    height: 180,
    justifyContent: 'space-between',
  },
  severityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
  },
  reportHeader: {
    flexDirection: 'row',
  },
  disasterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportTextContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F3542',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#57606F',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    fontFamily: 'Inter-Bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  reportButton: {
    borderTopWidth: 3,
    borderTopColor: '#FF4757',
  },
  helpButton: {
    borderTopWidth: 3,
    borderTopColor: '#2ED573',
  },
  resourcesButton: {
    borderTopWidth: 3,
    borderTopColor: '#FFA502',
  },
  profileButton: {
    borderTopWidth: 3,
    borderTopColor: '#1E90FF',
  },
  actionText: {
    color: '#2F3542',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  safetyTipsCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  safetyTipsGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  safetyTipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  safetyTipsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  learnMoreText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginRight: 6,
  },
});