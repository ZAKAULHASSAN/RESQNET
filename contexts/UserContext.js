import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  const loadUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('loggedInUser');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserRole(parsed.role);
      }
    } catch (error) {
      console.log('Error loading user role:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = setInterval(loadUserRole, 1000); // auto-refresh every 1 second
    return () => clearInterval(unsubscribe);
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, reloadUserRole: loadUserRole }}>
      {children}
    </UserContext.Provider>
  );
};
