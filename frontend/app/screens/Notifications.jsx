import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import responsiveUtils from '../utils/responsive';

const { iconSize } = responsiveUtils;
import styles from '../styles/Notifications.styles';

const GREEN = '#00C896';
const GRAY = '#aaa';

export default function Notifications() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications, markAllRead, markAllUnread, markAsRead } = useNotifications();
    const unreadCount = notifications.filter(n => n.unread).length;
    const allRead = notifications.length > 0 && notifications.every(n => !n.unread);
    const unreadNotifications = notifications.filter(n => n.unread);
    const readNotifications = notifications.filter(n => !n.unread);
    const bellAnim = useRef(new Animated.Value(0)).current;

    // Pulse bell if there are unread notifications
    React.useEffect(() => {
        if (unreadCount > 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bellAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(bellAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
                ])
            ).start();
        } else {
            bellAnim.stopAnimation();
            bellAnim.setValue(0);
        }
    }, [unreadCount]);

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={iconSize.md} color="#fff" />
                </TouchableOpacity>
                {allRead ? (
                    <TouchableOpacity style={styles.markAllRead} onPress={markAllUnread}>
                        <Text style={styles.markAllReadText}>Mark as unread</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.markAllRead} onPress={markAllRead}>
                        <Text style={styles.markAllReadText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.contentWrapper}>
                {/* Notifications Info Card (moved to top) */}
                <View style={styles.infoCard}>
                    <Animated.View style={[styles.infoIconCircle, unreadCount > 0 && { transform: [{ scale: bellAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                        <MaterialIcons name="notifications" size={iconSize.xl} color={GREEN} />
                    </Animated.View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.infoTitle} numberOfLines={1} ellipsizeMode="tail">Notifications</Text>
                        <Text style={styles.infoDesc} numberOfLines={2} ellipsizeMode="tail">Stay updated with your account activity and alerts</Text>
                    </View>
                </View>
                {/* Caught Up Box if all notifications are read */}
                {allRead && notifications.length > 0 && (
                    <View style={styles.caughtUpBox}>
                        <View style={styles.caughtUpIconContainer}>
                            <Ionicons name="notifications-off" size={iconSize.xl} color={GRAY} />
                        </View>
                        <Text style={styles.caughtUpTitle}>All Caught Up!</Text>
                        <Text style={styles.caughtUpText}>You&apos;ve read all your notifications</Text>
                    </View>
                )}
                {/* Notification Card Section - Unread */}
                {unreadNotifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>New <Text style={styles.unreadCount}>{unreadCount} unread</Text></Text>
                        {unreadNotifications.map((n) => (
                            <TouchableOpacity
                                key={n.id}
                                style={[styles.notificationCard, styles.notificationCardUnread]}
                                activeOpacity={0.85}
                                onPress={() => { if (n.unread) markAsRead(n.id); }}
                            >
                                <View style={styles.unreadBar} />
                                <View style={styles.notificationIconCircle}>
                                    <Ionicons name={n.icon || 'information-circle'} size={iconSize.md} color={GREEN} />
                                </View>
                                <View style={{ flex: 1, minWidth: 0 }}>
                                    <Text style={styles.notificationTitle} numberOfLines={1} ellipsizeMode="tail">{n.title}</Text>
                                    <Text style={styles.notificationDesc} numberOfLines={2} ellipsizeMode="tail">{n.desc}</Text>
                                    <Text style={styles.notificationTime}>{n.time}</Text>
                                </View>
                                <View style={styles.greenDot} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {/* Notification Card Section - Read */}
                {readNotifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Earlier</Text>
                        {readNotifications.map((n) => (
                            <View key={n.id} style={styles.notificationCard}>
                                <View style={styles.notificationIconCircle}>
                                    <Ionicons name={n.icon || 'information-circle'} size={iconSize.md} color={GREEN} />
                                </View>
                                <View style={{ flex: 1, minWidth: 0 }}>
                                    <Text style={styles.notificationTitle} numberOfLines={1} ellipsizeMode="tail">{n.title}</Text>
                                    <Text style={styles.notificationDesc} numberOfLines={2} ellipsizeMode="tail">{n.desc}</Text>
                                    <Text style={styles.notificationTime}>{n.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
} 