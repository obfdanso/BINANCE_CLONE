import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../contexts/NotificationsContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/HotLaunches.styles';

const GREEN = '#00C896';
const RED = '#FF4D4F';

const launches = [
    {
        icon: <FontAwesome5 name="atom" size={28} color={GREEN} />, // Quantum Token
        title: 'Quantum Token',
        symbol: 'QTK',
        desc: 'Next-generation quantum computing token',
        date: 'July 31, 2025',
        daysLeft: 1,
        tag: 'AI/ML',
    },
    {
        icon: <MaterialCommunityIcons name="leaf" size={28} color={GREEN} />, // EcoChain
        title: 'EcoChain',
        symbol: 'ECO',
        desc: 'Blockchain for environmental sustainability',
        date: 'August 1, 2025',
        daysLeft: 2,
        tag: 'Green Tech',
    },
    {
        icon: <FontAwesome5 name="coins" size={28} color={GREEN} />, // DeFi Protocol
        title: 'DeFi Protocol',
        symbol: 'DFP',
        desc: 'Decentralized finance protocol',
        date: 'August 5, 2025',
        daysLeft: 6,
        tag: 'DeFi',
    },
];

export default function HotLaunches() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { addNotification } = useNotifications();
    const [reminderVisible, setReminderVisible] = useState(false);
    const [reminderMessage, setReminderMessage] = useState('');
    const [activeReminders, setActiveReminders] = useState(new Set());

    // Load saved reminders on component mount
    useEffect(() => {
        loadSavedReminders();
    }, []);

    const loadSavedReminders = async () => {
        try {
            const savedReminders = await AsyncStorage.getItem('hotLaunchesReminders');
            if (savedReminders) {
                const remindersArray = JSON.parse(savedReminders);
                setActiveReminders(new Set(remindersArray));
            }
        } catch (error) {
            console.log('Error loading saved reminders:', error);
        }
    };

    const saveReminders = async (reminders) => {
        try {
            const remindersArray = Array.from(reminders);
            await AsyncStorage.setItem('hotLaunchesReminders', JSON.stringify(remindersArray));
        } catch (error) {
            console.log('Error saving reminders:', error);
        }
    };

    const toggleReminder = async (token) => {
        const isReminderActive = activeReminders.has(token);

        if (isReminderActive) {
            // Remove reminder
            const newReminders = new Set(activeReminders);
            newReminders.delete(token);
            setActiveReminders(newReminders);
            await saveReminders(newReminders);
            setReminderMessage('Reminder Removed');
        } else {
            // Set reminder
            const newReminders = new Set(activeReminders);
            newReminders.add(token);
            setActiveReminders(newReminders);
            await saveReminders(newReminders);
            setReminderMessage('Reminder Set');
            addNotification({
                title: 'Reminder Set',
                desc: `Reminder set for ${token}`,
                time: 'Just now',
                icon: 'notifications-outline',
            });
        }

        setReminderVisible(true);
        setTimeout(() => setReminderVisible(false), 1500);
    };

    const pulseAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Sticky Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            {/* Description Box */}
            <View style={styles.descriptionBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Animated.View style={[styles.descriptionIconWrapper, { marginRight: 18, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }] }]}>
                        <FontAwesome5 name="rocket" size={28} color={GREEN} />
                    </Animated.View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.descriptionTitle}>Upcoming Launches</Text>
                        <Text style={styles.descriptionText}>Discover new tokens launching soon on our platform</Text>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Coming This Week</Text>
                {launches.map((item, idx) => {
                    const isReminderActive = activeReminders.has(item.title);
                    return (
                        <View key={item.title} style={styles.launchCard}>
                            <View style={styles.launchRow}>
                                <View style={styles.launchIcon}>{item.icon}</View>
                                <View style={{ flex: 1, minWidth: 0 }}>
                                    <Text style={styles.launchTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                                    <Text style={styles.launchSymbol} numberOfLines={1} ellipsizeMode="tail">{item.symbol}</Text>
                                    <Text style={styles.launchDesc} numberOfLines={2} ellipsizeMode="tail">{item.desc}</Text>
                                    <View style={styles.launchMetaRow}>
                                        <MaterialCommunityIcons name="calendar" size={16} color="#aaa" style={{ marginRight: 4 }} />
                                        <Text style={styles.launchMeta} numberOfLines={1} ellipsizeMode="tail">{item.date}</Text>
                                        <MaterialCommunityIcons name="clock-outline" size={16} color="#aaa" style={{ marginLeft: 12, marginRight: 4 }} />
                                        <Text style={styles.launchMeta} numberOfLines={1} ellipsizeMode="tail">{item.daysLeft} days left</Text>
                                        <MaterialCommunityIcons name="tag-outline" size={16} color="#aaa" style={{ marginLeft: 12, marginRight: 4 }} />
                                        <Text style={styles.launchMeta} numberOfLines={1} ellipsizeMode="tail">{item.tag}</Text>
                                    </View>
                                </View>
                                <View style={styles.comingSoonBadge}><Text style={styles.comingSoonText}>Coming Soon</Text></View>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.reminderButton,
                                    isReminderActive && styles.reminderButtonActive
                                ]}
                                onPress={() => toggleReminder(item.title)}
                                activeOpacity={0.85}
                            >
                                <Ionicons
                                    name={isReminderActive ? "notifications-off-outline" : "notifications-outline"}
                                    size={18}
                                    color={isReminderActive ? RED : GREEN}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[
                                    styles.reminderText,
                                    isReminderActive && styles.reminderTextActive
                                ]}>
                                    {isReminderActive ? 'Remove Reminder' : 'Set Reminder'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
            {/* Reminder Set Popup */}
            {reminderVisible && (
                <TouchableOpacity style={styles.popupOverlay} activeOpacity={1} onPress={() => setReminderVisible(false)}>
                    <View style={styles.popupCard}>
                        <View style={[
                            styles.popupIconCircle,
                            reminderMessage === 'Reminder Removed' && styles.popupIconCircleRemoved
                        ]}>
                            <Ionicons
                                name={reminderMessage === 'Reminder Removed' ? "checkmark-done" : "checkmark-done"}
                                size={32}
                                color={reminderMessage === 'Reminder Removed' ? RED : GREEN}
                            />
                        </View>
                        <Text style={[
                            styles.popupText,
                            reminderMessage === 'Reminder Removed' && styles.popupTextRemoved
                        ]}>
                            {reminderMessage}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

