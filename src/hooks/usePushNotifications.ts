import { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { requestNotificationPermission, saveNotification } from '../services/NotificationService';

// Define the navigation param list for better typing
export type RootStackParamList = {
    History: undefined;
    MessageDetail: { messageId: string };
};

/**
 * Extract a consistent messageId from various notification states
 */
const getMessageId = (remoteMessage: FirebaseMessagingTypes.RemoteMessage): string => {
    // Priority 1: Custom data payload (often used for deep linking)
    if (remoteMessage.data?.messageId) {
        return String(remoteMessage.data.messageId);
    }
    // Priority 2: Standard FCM message ID
    if (remoteMessage.messageId) {
        return remoteMessage.messageId;
    }
    // Priority 3: Fallback timestamp
    return String(Date.now());
};

export const usePushNotifications = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        const setupNotifications = async () => {
            try {
                // 1. Request Permissions
                const granted = await requestNotificationPermission();
                if (!granted) {
                    console.log('Push notification permission denied');
                    return;
                }

                // 2. Get FCM Token
                const token = await messaging().getToken();
                if (token) {
                    console.log('FCM Token:', token);
                }

                // 3. Handle Foreground Messages
                const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
                    console.log('Foreground message received:', remoteMessage);

                    const title = remoteMessage.notification?.title || 'New Notification';
                    const body = remoteMessage.notification?.body || '';
                    const messageId = getMessageId(remoteMessage);

                    // Save to local storage
                    await saveNotification(title, body, messageId);

                    // Show in-app alert
                    Alert.alert(
                        title,
                        body,
                        [
                            {
                                text: 'View',
                                onPress: () => navigation.navigate('MessageDetail', { messageId }),
                            },
                            { text: 'OK', style: 'cancel' },
                        ]
                    );
                });

                // 4. Handle Notification Tapped (Background state)
                const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
                    console.log('App opened from background by notification:', remoteMessage);
                    const messageId = getMessageId(remoteMessage);
                    navigation.navigate('MessageDetail', { messageId });
                });

                // 5. Check if app was opened from a killed state
                messaging()
                    .getInitialNotification()
                    .then((remoteMessage) => {
                        if (remoteMessage) {
                            console.log('App opened from killed state by notification:', remoteMessage);
                            const messageId = getMessageId(remoteMessage);
                            // Initial notification is often handled by Deep Linking config,
                            // but we check here as a backup for non-standard flows.
                            navigation.navigate('MessageDetail', { messageId });
                        }
                    });

                return () => {
                    unsubscribeForeground();
                    unsubscribeOpened();
                };
            } catch (error) {
                console.error('Error setting up notifications:', error);
            }
        };

        setupNotifications();
    }, [navigation]);
};
