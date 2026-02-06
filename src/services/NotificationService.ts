import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

const NOTIFICATIONS_KEY = '@notifications';

export interface NotificationData {
  title: string;
  body: string;
  timestamp: number;
  messageId: string;
}

/**
 * Request notification permissions for Android 13+
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
  
  // For iOS or older Android versions, use Firebase messaging permission
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

/**
 * Save a notification to AsyncStorage
 */
export async function saveNotification(
  title: string,
  body: string,
  messageId: string,
): Promise<void> {
  try {
    const notification: NotificationData = {
      title,
      body,
      timestamp: Date.now(),
      messageId,
    };

    // Get existing notifications
    const existingData = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications: NotificationData[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Add new notification
    notifications.unshift(notification);

    // Save back to storage
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    console.log('Notification saved:', notification);
  } catch (error) {
    console.error('Error saving notification:', error);
  }
}

/**
 * Get all saved notifications
 */
export async function getNotifications(): Promise<NotificationData[]> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

/**
 * Clear all notifications
 */
export async function clearNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    console.log('All notifications cleared');
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}
