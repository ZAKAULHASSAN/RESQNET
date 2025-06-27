// navigation/TabNavigator.js
import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Easing,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import HelpScreen from '../screens/HelpScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomHeader from '../components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const tabWidth = width / 5;

function getIconName(name) {
  switch (name) {
    case 'Home':
      return 'home-outline';
    case 'Report':
      return 'alert-circle-outline';
    case 'Help':
      return 'help-circle-outline';
    case 'Resources':
      return 'book-outline';
    case 'Profile':
      return 'person-outline';
    default:
      return 'ellipse-outline';
  }
}

function CustomTabBar({ state, descriptors, navigation }) {
  const handlePress = (route, index) => {
    navigation.navigate(route.name);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => handlePress(route, index)}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              {isFocused ? (
                <>
                  <View style={styles.iconWrapper}>
                    <View style={styles.sliderCircle}>
                      <Ionicons
                        name={getIconName(route.name)}
                        size={22}
                        color="#000"
                      />
                    </View>
                  </View>
                  <Text style={styles.tabLabel}>{route.name}</Text>
                </>
              ) : (
                <Ionicons
                  name={getIconName(route.name)}
                  size={22}
                  color="white"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator({ userRole }) {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        header: () =>
          route.name === 'Home' ? undefined : <CustomHeader title={route.name} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {userRole === 'victim' && (
        <Tab.Screen name="Report" component={ReportScreen} />
      )}
      {userRole === 'volunteer' && (
        <Tab.Screen name="Help" component={HelpScreen} />
      )}
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    marginHorizontal: 10,
    height: 65,
    alignItems: 'center',
    position: 'relative',
    bottom: 35,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  iconWrapper: {
    position: 'absolute',
    top: -24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 30,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#FFD700',
  },
  sliderCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});
