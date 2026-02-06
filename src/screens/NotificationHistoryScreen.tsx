import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { getNotifications, NotificationData, clearNotifications } from '../services/NotificationService';
import { useNavigation } from '@react-navigation/native';

const NotificationHistoryScreen = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

    const fetchNotifications = async () => {
        setRefreshing(true);
        const data = await getNotifications();
        setNotifications(data);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchNotifications();

        // Refresh when screen comes into focus
        const unsubscribe = navigation.addListener('focus', () => {
            fetchNotifications();
        });

        return unsubscribe;
    }, [navigation]);

    const handleClear = async () => {
        await clearNotifications();
        setNotifications([]);
    };

    const renderItem = ({ item }: { item: NotificationData }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MessageDetail', { messageId: item.messageId })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
            <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notification History</Text>
                <TouchableOpacity onPress={handleClear}>
                    <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.messageId + index}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No notifications yet.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    clearButton: {
        color: '#007AFF',
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    time: {
        fontSize: 12,
        color: '#888',
    },
    body: {
        fontSize: 14,
        color: '#444',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});

export default NotificationHistoryScreen;
