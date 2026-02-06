import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getNotifications, NotificationData } from '../services/NotificationService';

const MessageDetailScreen = ({ route }: any) => {
    const { messageId } = route.params || {};
    const [notification, setNotification] = useState<NotificationData | null>(null);

    useEffect(() => {
        const findNotification = async () => {
            const all = await getNotifications();
            const found = all.find(n => n.messageId === messageId);
            if (found) {
                setNotification(found);
            }
        };

        findNotification();
    }, [messageId]);

    if (!notification) {
        return (
            <View style={styles.center}>
                <Text>Message not found or ID: {messageId}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>Title</Text>
                <Text style={styles.value}>{notification.title}</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Body</Text>
                <Text style={styles.value}>{notification.body}</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Received At</Text>
                <Text style={styles.value}>{new Date(notification.timestamp).toLocaleString()}</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Message ID</Text>
                <Text style={styles.value}>{notification.messageId}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        color: '#333',
        marginBottom: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 16,
    },
});

export default MessageDetailScreen;
