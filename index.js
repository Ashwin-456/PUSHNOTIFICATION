/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { saveNotification } from './src/services/NotificationService';

// Register background handler for notifications when app is killed
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    const title = remoteMessage.notification?.title || 'New Notification';
    const body = remoteMessage.notification?.body || '';

    // Unified messageId logic
    const messageId = remoteMessage.data?.messageId || remoteMessage.messageId || String(Date.now());

    await saveNotification(title, body, String(messageId));
});

AppRegistry.registerComponent(appName, () => App);
