import React, { useEffect } from 'react';
import { Alert, StyleSheet, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

// Services & Screens
import { requestNotificationPermission, saveNotification } from './src/services/NotificationService';
import NotificationHistoryScreen from './src/screens/NotificationHistoryScreen';
import MessageDetailScreen from './src/screens/MessageDetailScreen';

import { usePushNotifications } from './src/hooks/usePushNotifications';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['hwtask://'],
  config: {
    screens: {
      History: 'history',
      MessageDetail: 'message/:messageId',
    },
  },
};

function NavigationWrapper() {
  usePushNotifications();

  return (
    <Stack.Navigator initialRouteName="History">
      <Stack.Screen
        name="History"
        component={NotificationHistoryScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="MessageDetail"
        component={MessageDetailScreen}
        options={{ title: 'Message Detail' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <NavigationWrapper />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
