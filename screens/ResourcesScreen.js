import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const resources = [
  {
    id: '1',
    title: 'Disaster Preparedness',
    description: 'Comprehensive guides for all types of disasters',
    icon: 'book',
    color: '#4361EE',
    details: 'This guide provides planning tools and checklists to help you prepare for floods, earthquakes, fires, and other emergencies. Learn evacuation routes, emergency kit preparation, and family communication plans.',
  },
  {
    id: '2',
    title: 'Emergency Contacts',
    description: 'Critical numbers for immediate assistance',
    icon: 'phone',
    color: '#F72585',
    details: 'Immediate access to police, fire department, ambulance services, poison control, and local emergency response teams. Includes non-emergency numbers and community support contacts.',
  },
  {
    id: '3',
    title: 'First Aid Manual',
    description: 'Life-saving medical procedures',
    icon: 'medical-services',
    color: '#7209B7',
    details: 'Step-by-step instructions for CPR, wound care, burns treatment, fracture stabilization, choking relief, and recognizing stroke/heart attack symptoms. Includes pediatric variations.',
  },
  {
    id: '4',
    title: 'Shelter Network',
    description: 'Locate safe havens near you',
    icon: 'home',
    color: '#3A0CA3',
    details: 'Interactive map and list of designated emergency shelters with capacity information, accessibility features, pet policies, and available amenities. Updated in real-time during crises.',
  },
  {
    id: '5',
    title: 'Food Safety',
    description: 'Emergency nutrition guidelines',
    icon: 'restaurant',
    color: '#4CC9F0',
    details: 'Safe food handling during power outages, water purification methods, shelf-stable meal planning, and identifying contaminated supplies. Special sections for infants and dietary restrictions.',
  },
  {
    id: '6',
    title: 'Mental Health',
    description: 'Crisis support resources',
    icon: 'psychology',
    color: '#4895EF',
    details: 'Trauma coping strategies, stress reduction techniques, PTSD recognition, and nationwide counseling hotlines. Includes resources for children and first responders.',
  },
];

export default function ResourcesScreen() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));

  const handleCardPress = (resource) => {
    setSelectedResource(resource);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
    setModalVisible(true);
  };

  const closeModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Resources</Text>
          <Text style={styles.subtitle}>
            Essential information to keep you and your loved ones safe
          </Text>
        </View>

        <View style={styles.resourceGrid}>
          {resources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={[styles.resourceCard, { 
                backgroundColor: '#FFF',
                borderLeftWidth: 6,
                borderLeftColor: resource.color,
              }]}
              onPress={() => handleCardPress(resource)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { 
                backgroundColor: resource.color + '20' 
              }]}>
                <MaterialIcons 
                  name={resource.icon} 
                  size={24} 
                  color={resource.color} 
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.resourceTitle, { color: '#2B2D42' }]}>
                  {resource.title}
                </Text>
                <Text style={styles.resourceDescription} numberOfLines={2}>
                  {resource.description}
                </Text>
              </View>
              <MaterialIcons 
                name="chevron-right" 
                size={20} 
                color="#8D99AE" 
                style={styles.chevronIcon} 
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emergencySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.warningBadge}>
              <MaterialIcons name="warning" size={20} color="#FFF" />
            </View>
            <Text style={styles.sectionTitle}>Emergency Assistance</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            For life-threatening situations requiring immediate response
          </Text>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <View style={styles.emergencyButtonContent}>
              <View style={styles.emergencyIconCircle}>
                <FontAwesome5 name="phone-alt" size={18} color="#D90429" />
              </View>
              <Text style={styles.emergencyButtonText}>Call Emergency Services</Text>
              <View style={styles.emergencyPulse} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              { 
                transform: [{ scale: scaleValue }],
                opacity: scaleValue 
              }
            ]}
          >
            {selectedResource && (
              <>
                <View style={[styles.modalHeader, { backgroundColor: selectedResource.color }]}>
                  <View style={styles.modalIconCircle}>
                    <MaterialIcons 
                      name={selectedResource.icon} 
                      size={28} 
                      color="#FFF" 
                    />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>{selectedResource.title}</Text>
                    <Text style={styles.modalSubtitle}>{selectedResource.description}</Text>
                  </View>
                </View>
                <ScrollView style={styles.modalContent}>
                  <Text style={styles.modalDescription}>{selectedResource.details}</Text>
                </ScrollView>
                <View style={styles.modalFooter}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.closeButton,
                      { 
                        backgroundColor: selectedResource.color,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    onPress={closeModal}
                  >
                    <Text style={styles.closeButtonText}>Got It</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2B2D42',
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D99AE',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
    maxWidth: '90%',
  },
  resourceGrid: {
    marginBottom: 32,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  resourceTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'Inter-SemiBold',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#8D99AE',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  chevronIcon: {
    opacity: 0.8,
  },
  emergencySection: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningBadge: {
    backgroundColor: '#EF233C',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2D42',
    fontFamily: 'Inter-Bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8D99AE',
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 2,
    borderColor: '#EF233C',
    position: 'relative',
    overflow: 'hidden',
  },
  emergencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  emergencyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF233C20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyButtonText: {
    color: '#D90429',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  emergencyPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#EF233C10',
    borderRadius: 12,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(43,45,66,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: width - 48,
    maxHeight: height * 0.8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 20,
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Inter-Regular',
  },
  modalContent: {
    padding: 24,
    paddingTop: 16,
    maxHeight: height * 0.5,
  },
  modalDescription: {
    fontSize: 16,
    color: '#2B2D42',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  modalFooter: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  closeButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});