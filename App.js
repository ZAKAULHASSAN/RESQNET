import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartScreen from './screens/StartScreen';
import TabNavigator from './navigation/TabNavigator';
import { UserProvider, UserContext } from './contexts/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigatorWrapper} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const TabNavigatorWrapper = () => {
  const { userRole } = React.useContext(UserContext);
  return <TabNavigator userRole={userRole} />;
};
